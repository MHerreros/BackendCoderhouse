const express = require('express')
const { Server: HttpServer } = require('http')      
const { Server: IOServer } = require('socket.io')   
// const {engine} = require('express-handlebars')
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const PORT = 8080

const {optionsMariaDB} = require('./db/mariaDB')
const {optionsSQLite3} = require('./db/SQLite3')

// const {getAll} = require('./getAllProducts.test.js')

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
const products = new Contenedor(productArray, optionsMariaDB, 'productos')
const messages = new Contenedor(messageArray, optionsSQLite3, 'chat')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/productos', apiRouter)

app.set('views', './public/views/ejs')
app.set('view engine', 'ejs')

apiRouter.get('', async (req, res) => { 
    const data3 = await products.getAll()
    const messageCont = await messages.getAll()

    return res.render('home', {
        status:1, 
        data3,
        messageCont
    })
})

// ==== TESTING ROUTE ====
apiRouter.get('/test', async (req, res) => { 
    const data3 = getAll(5)
    console.log(data3)
    const messageCont = await messages.getAll()

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
        const newProductID = await products.save(newProduct)
        const data3 = newProduct
        data3.id = newProductID
        socket.emit('refreshList', data3)
        socket.broadcast.emit('refreshList', data3)
    })

    socket.on('addMessage', newMessage => {
        messages.save(newMessage)
        const messageCont = newMessage
        socket.emit('refreshMessages', messageCont)
        socket.broadcast.emit('refreshMessages', messageCont)
    })

    socket.on('disconnect', reason => {
        usersArray = usersArray.filter(user => user != socket.id)
        console.log(`Se ha desconectado el cliente con id ${socket.id}`)
    })
})

const faker = require('faker')
faker.locale = 'es'

const getAll = (arrayLength) => {
    console.log('test requested')
    const arrayProductos = []
    for (i = 0; i<arrayLength; i++){
        const newProduct = {
            title:faker.commerce.productName(),
            price:faker.commerce.price(),
            thumbnail: faker.random.image(),
            id: faker.datatype.number()
        }
        arrayProductos.push(newProduct)
    }
    return arrayProductos
}