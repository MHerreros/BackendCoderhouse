const express = require('express')
const { Server: HttpServer } = require('http')      
const { Server: IOServer } = require('socket.io')   
// const {engine} = require('express-handlebars')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const PORT = 8080

const {Router} = express
const apiRouter = Router()

let productArray = []
//     {title: 'Tornillos', price: 23, thumbnail:'https://cdn2.iconfinder.com/data/icons/random-set-1/432/Asset_80-128.png', id: 1},
//     {title: 'Rodillo', price: 550, thumbnail:'https://cdn2.iconfinder.com/data/icons/random-set-1/492/Asset_74-128.png', id: 2}
// ]

let messageArray = []
//     {mail:'matias@email.com', timestamp:'12:04', message:'Hola mundo'},
//     {mail:'matias@email.com', timestamp:'12:04', message:'Hola mundo'}
// ]

let usersArray = []

const Contenedor = require('./simplifiedContainer')
const products = new Contenedor(productArray)
const messages = new Contenedor(messageArray)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/productos', apiRouter)

app.set('views', './views/ejs')
app.set('view engine', 'ejs')

apiRouter.get('', async (req, res) => { 
    const data3 = await products.getAll('BDDproducts.txt')
    const messageCont = await messages.getAll('BDDchat.txt')
    // Logica para verificar que haya contenido y permita modificar el valor de STATUS
    // let length = null
    // if(data3.length > 0){
    //     length = data3.length
    // }
    return res.render('home', {
        status:1, 
        data3,
        messageCont
    })
})

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error',(error) => {console.log(`Se ha detectado un error`)})

io.on('connection', socket => {
    console.log(`Nuevo cliente conectado con id ${socket.id}`)
    usersArray.push(socket.id)

    socket.on('addProduct', async (newProduct) => {
        await products.save(newProduct, 'BDDproducts.txt')
        console.log('PASO 2')
        const data3 = newProduct
        socket.emit('refreshList', data3)
        socket.broadcast.emit('refreshList', data3)
    })

    socket.on('addMessage', newMessage => {
        messages.save(newMessage,'BDDchat.txt')
        const messageCont = newMessage
        socket.emit('refreshMessages', messageCont)
        socket.broadcast.emit('refreshMessages', messageCont)
    })

    socket.on('disconnect', reason => {
        usersArray = usersArray.filter(user => user != socket.id)
        console.log(`Se ha desconectado el cliente con id ${socket.id}`)
    })
})
