const express = require('express')
const { Server: HttpServer } = require('http')     

const productsRouter = require('./router/productosRouter')
const carritoRouter = require('./router/carritosRouter')
const userRouter = require('./router/userRouter.js')

const app = express()
const httpServer = new HttpServer(app)

const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 8080
const uri = process.env.MONGO_URL

const MongoStore = require('connect-mongo')
const session = require('express-session')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/static', express.static(__dirname + '/public'))

app.use(session({
    store: MongoStore.create({
        mongoUrl: uri,
        ttl: 3600
    }),
    secret: 'qwerty',
    resave: true,
    saveUninitialized: true
}))

// Routers
app.use('/api/productos', productsRouter)
app.use('/api/carrito', carritoRouter)
app.use('/users', userRouter)


// Respuesta por default cuando no encuentra la ruta especificada
app.all('*', (req, res) => {
    return res.status(404).json(`Ruta '${req.path}' no encontrada.`)
})

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error',(error) => {console.error(`Se ha detectado un error: ${error.message}`)})
