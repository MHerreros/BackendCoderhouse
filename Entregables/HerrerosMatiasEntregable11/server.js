const express = require('express')
const { Server: HttpServer } = require('http')      
const { Server: IOServer } = require('socket.io')   
const {Router} = express
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const session = require('express-session')
// const sharedSession = require("express-socket.io-session")

let usersArray = []

const PORT = 8080

// ==== IMPLEMENTACION NORMALIZR
// const normalizr = require('normalizr')
// const normalizrChatSchema = require('./public/normalizrSchema.js')

// ==== SET CACHE STORE ====

const MongoStore = require('connect-mongo')

// ==== SESSION MIDDLEWARE ====
const validateSession = (req, res, next) => {
    
    if (req.session.user && req.session.password){
        console.log(`Usuario validado. Sesion inicida por ${req.session.user}`)
        return next()
    }

    if (req.body.user && req.body.password){
        req.session.user = req.body.user
        req.session.password = req.body.password
        // console.log(req.session)
        console.log(`Se ha registrado el usuario ${req.session.user}`)
        return next()
    }
    console.log(`No existe el usuario. Inicie sesion.`)
    return res.status(401).redirect('http://localhost:8080/login')
}

// ==== SET MIDDLEWARES ====
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname + '/public'))

app.use(session({
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://matias:xsBZtP6jv0Bifco3@cluster0.ry76x.mongodb.net/desafios?retryWrites=true&w=majority`,
        ttl: 60
    }),
    secret: 'qwerty',
    resave: true,
    saveUninitialized: true
}))

// ==== SET DATABASE ====
const uri = "mongodb+srv://matias:xsBZtP6jv0Bifco3@cluster0.ry76x.mongodb.net/desafios?retryWrites=true&w=majority"

// ==== SCHEMAS ====
const schemaMensajes = require('./db/schema/mensajes')
const schemaProducto = require('./db/schema/productos')

// ==== DAOS ====
const ProductosDAOMongoDB = require('./db/daos/ProductosDAOMongoDB')
const MensajesDAOMongoDB = require('./db/daos/MensajesDAOMongoDB')
const { clearScreenDown } = require('readline')

// ==== CONTENEDORES (CHILD) ====
const products = new ProductosDAOMongoDB('producto', schemaProducto, uri)
const messages = new MensajesDAOMongoDB('mensaje', schemaMensajes, uri)

// ==== SET ROUTES ====
// const apiRouter = require('./routers/apiRouter.js')
const apiRouter = Router()
const loginRouter = Router()
const logoutRouter = Router()
app.use('/api/productos', apiRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)

apiRouter.get('', validateSession, async (req, res) => { 
    const data3 = await products.getAll()
    const messageCont = await messages.getAll()

    // ==== IMPLEMENTACION NORMALIZR
    // ** Para ver los valores en pantalla hay que modificar el embededChat.ejs

    // const normalizedChat = normalizr.normalize(messageCont, normalizrChatSchema)
    // const origLength = JSON.stringify(messageCont).length
    // const normLength = JSON.stringify(normalizedChat).length
    // console.log(messageCont)
    // console.log(normalizedChat)
    // console.log('ORIGINAL: ', origLength)
    // console.log('NORMALIZADO: ', normLength)
    // **

    return res.render('home', {
        status:1, 
        data3,
        messageCont
    })
})

loginRouter.get('', (req, res) => {
    // if (req.session.contador) {
    //   req.session.contador++
    //   return res.send(`Has visitado ${req.session.contador} veces el sitio`)
    // }
  
    // req.session.contador = 1
    // return res.send('Bienvenido')
    return res.render('login')
})

logoutRouter.get('', (req, res) => {
    if (req.session.user && req.session.password){
        return req.session.destroy(err => {
            if (!err) {
                return res.send({ logout: true })
            }
            return res.send({ error: err })
          })
    }
    return res.status(404).redirect('http://localhost:8080/login')
})

loginRouter.post('/auth', validateSession, (req, res) => {
    return res.status(202).redirect('http://localhost:8080/api/productos')
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
// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
// io.use(wrap(validateSession()))

// const wrap = validateSession => (socket, next) => validateSession(socket.request, {}, next);
// io.use(sharedSession(session, {
//     autoSave:true
// }))

// io.use((socket, next) => {
//     console.log('socket.data')
//     console.log(socket)
// })

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