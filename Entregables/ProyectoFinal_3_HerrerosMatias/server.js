const express = require('express')
const { Server: HttpServer } = require('http')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

const productsRouter = require('./router/productosRouter')
const carritoRouter = require('./router/carritosRouter')
const userRouter = require('./router/userRouter.js')

const app = express()
const httpServer = new HttpServer(app)

const dotenv = require('dotenv')
dotenv.config()

const { consoleLogger, errorLogger } = require('./utils/log4jsConfig')

const PORT = process.env.PORT || 8080
const uri = process.env.MONGO_URL

const MongoStore = require('connect-mongo')
const session = require('express-session')
const validateSession = require('./utils/sessionValidator')

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
app.all('*', validateSession, (req, res) => {
    return res.status(404).json(`Ruta '${req.path}' no encontrada.`)
})

if ((process.env.CLUSTERING === 'true') && cluster.isMaster){
        
    for( let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
    
    cluster.on('exit', (worker, code, signal) => {
        consoleLogger.info(`WORKER ${worker.process.pid} finalizado`)
    })

    cluster.on('listening', (worker, address) => {
        consoleLogger.info(`WORKER ${worker.process.pid} is listening in port ${address.port}`)
    })

} else {

    const server = httpServer.listen(PORT, () => {     
        consoleLogger.info(`MASTER ${process.pid} is listening in port ${PORT}`)
    })

    server.on('error',(error) => {errorLogger.error(`Se ha detectado un error: ${error.message}`)})
}