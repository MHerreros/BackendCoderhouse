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

const productArray = [
    {title: 'Tornillos', price: 23, thumbnail:'https://cdn2.iconfinder.com/data/icons/random-set-1/432/Asset_80-128.png', id: 1},
    {title: 'Rodillo', price: 550, thumbnail:'https://cdn2.iconfinder.com/data/icons/random-set-1/492/Asset_74-128.png', id: 2}
]

const messageArray = [
    {mail:'matias@email.com', timestamp:'12:04', message:'Hola mundo'},
    {mail:'matias@email.com', timestamp:'12:04', message:'Hola mundo'}
]

const Contenedor = require('./simplifiedContainer')
const products = new Contenedor(productArray)
const messages = new Contenedor(messageArray)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/productos', apiRouter)

app.set('views', './views/ejs')
app.set('view engine', 'ejs')

apiRouter.get('', (req, res) => { 
    const data3 = products.data
    const messageCont = messages.data
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

apiRouter.get('/all', (req, res) => {
    const data3 = products.data
    let length = null
    if(data3.length > 0){
        length = data3.length
    }
    return res.render('productList', {data3, length})
})

// apiRouter.post('', (req, res) => {
//     if(req.body.title && req.body.price && req.body.thumbnail != ''){
//         products.save(req.body)
//         return res.render('home',{status:1, hbsStatus: null})
//     } else {
//         return res.render('home',{status:0, hbsStatus: 'missing data'})
//     }
// })

// apiRouter.get('/:id', (req, res) => {
//     const selectedProduct = products.getById(req.params.id)
//     return res.json({selectedProduct})
// })


// apiRouter.put('/:id', (req, res) => {
//     const id = Number(req.params.id)
//     const data = req.body // NOTA: data debe ser un objeto JSON con 3 atributos (title, price, thumnail)
//     const answer = products.modifyById(id, data)
    
//     return res.json({answer})
// })

// apiRouter.delete('/:id', (req, res) => {
//     const id = req.params.id
//     const answer = products.deleteById(id)
//     return res.json({answer})
// })

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error',(error) => {console.log(`Se ha detectado un error`)})

io.on('connection', socket => {
    console.log(`Nuevo cliente conectado con id ${socket.id}`)

    socket.on('addProduct', (newProduct) => {
        products.save(newProduct)
        const data3 = newProduct
        socket.emit('refreshList', data3)
        socket.broadcast.emit('refreshList', data3)
    })

    socket.on('addMessage', newMessage => {
        messages.save(newMessage)
        const messageCont = newMessage
        socket.emit('refreshMessages', messageCont)
        socket.broadcast.emit('refreshMessages', messageCont)
    })
})
