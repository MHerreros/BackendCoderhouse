const express = require('express')
const { Server: HttpServer } = require('http')      
const { Server: IOServer } = require('socket.io')   
const {Router} = express
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
let usersArray = []
const PORT = 8080
const normalizr = require('normalizr')
const normalizrChatSchema = require('./public/normalizrSchema.js')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname + '/public'))

// ==== SET DATABASE ====
const uri = "mongodb+srv://matias:xsBZtP6jv0Bifco3@cluster0.ry76x.mongodb.net/desafios?retryWrites=true&w=majority"

// ==== SCHEMAS ====
const schemaMensajes = require('./db/schema/mensajes')
const schemaProducto = require('./db/schema/productos')

// ==== DAOS ====
const ProductosDAOMongoDB = require('./db/daos/ProductosDAOMongoDB')
const MensajesDAOMongoDB = require('./db/daos/MensajesDAOMongoDB')

// ==== CONTENEDORES (CHILD) ====
const products = new ProductosDAOMongoDB('producto', schemaProducto, uri)
const messages = new MensajesDAOMongoDB('mensaje', schemaMensajes, uri)

// ==== SET ROUTES ====
// const apiRouter = require('./routers/apiRouter.js')
const apiRouter = Router()
app.use('/api/productos', apiRouter)

apiRouter.get('', async (req, res) => { 
    const data3 = await products.getAll()
    const messageCont = await messages.getAll()
    const normalizedChat = normalizr.normalize(messageCont, normalizrChatSchema)
    
    const origLength = JSON.stringify(messageCont).length
    const normLength = JSON.stringify(normalizedChat).length

    console.log(messageCont)
    // console.log(normalizedChat)
    console.log('ORIGINAL: ', origLength)
    console.log('NORMALIZADO: ', normLength)

    return res.render('home', {
        status:1, 
        data3,
        messageCont,
        origLength,
        normLength
    })
})

 // ==== SET VIEWS CONFIG ====
app.set('views', './public/views/ejs')
app.set('view engine', 'ejs')

// ==== SET HTTP SERVER ====
app.all('*', (req, res) => {
    return res.status(404).json(`Ruta '${req.path}' no encontrada.`)
})

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error',(error) => {console.log(`Se ha detectado un error. ${error}`)})

// ==== SET SOCKET SERVER ====
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