const express = require('express')
const { Server: HttpServer } = require('http')     

const productsRouter = require('./router/productosRouter')
const carritoRouter = require('./router/carritosRouter')

const app = express()
const httpServer = new HttpServer(app)

const PORT = process.env.PORT || 8080

// const db = require('../mongoDb')
// const productoModel = require('../schema/productos')
// const carritoModel = require('../schema/carrito')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/static', express.static(__dirname + '/public'))

// app.set('views', './views/ejs')
// app.set('view engine', 'ejs')

app.use('/api/productos', productsRouter)
app.use('/api/carrito', carritoRouter)

// Respuesta por default cuando no encuentra la ruta especificada
app.all('*', (req, res) => {
    return res.status(404).json(`Ruta '${req.path}' no encontrada.`)
})

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error',(error) => {console.error(`Se ha detectado un error: ${error.message}`)})

// io.on('connection', socket => {
//     console.log(`Nuevo cliente conectado con id ${socket.id}`)
//     usersArray.push(socket.id)

//     socket.on('addProduct', async (newProduct) => {
//         await products.save(newProduct, 'BDDproducts.txt')
//         console.log('PASO 2')
//         const data3 = newProduct
//         socket.emit('refreshList', data3)
//         socket.broadcast.emit('refreshList', data3)
//     })

//     socket.on('addMessage', newMessage => {
//         messages.save(newMessage,'BDDchat.txt')
//         const messageCont = newMessage
//         socket.emit('refreshMessages', messageCont)
//         socket.broadcast.emit('refreshMessages', messageCont)
//     })

//     socket.on('disconnect', reason => {
//         usersArray = usersArray.filter(user => user != socket.id)
//         console.log(`Se ha desconectado el cliente con id ${socket.id}`)
//     })
// })
