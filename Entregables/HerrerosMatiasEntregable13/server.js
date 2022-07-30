const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const { Router } = express
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const session = require('express-session')

const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const { createHash, isValidPassword } = require('./utils/bycrypt')
const flash = require('connect-flash')

const yargs = require('yargs/yargs')
const dotenv = require('dotenv')
const { fork } = require('child_process')

// ==== SET EVIRONMENT VARIABLES ====
dotenv.config()

// ==== SET SERVER PORT ====
const args = yargs(process.argv.slice(2))
    .alias({
        port: 'p'
    })
    .default({
        port: 8080
    })
    .argv

let PORT = 8080
if (typeof args.port === 'number'){
    PORT = args.port
}
// ==== SET DATABASE ====
const uri = process.env.MONGO_URL

// ==== SET CACHE STORE ====
const MongoStore = require('connect-mongo')

// ==== SESSION MIDDLEWARE ====
const validateSession = (req, res, next) => {

    if (req.session.user && req.session.password) {
        console.log(`Usuario validado. Sesion inicida por ${req.session.user}`)
        return next()
    }

    if (req.body.user && req.body.password) {
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
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static(__dirname + '/public'))

app.use(session({
    store: MongoStore.create({
        mongoUrl: uri,
        ttl: 60
    }),
    secret: 'qwerty',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())


// ==== SCHEMAS ====
const schemaMensajes = require('./db/schema/mensajes')
const schemaProducto = require('./db/schema/productos')
// const schemaUsuario = require('./db/schema/users')

// ==== DAOS ====
const ProductosDAOMongoDB = require('./db/daos/ProductosDAOMongoDB')
const MensajesDAOMongoDB = require('./db/daos/MensajesDAOMongoDB')
// const UserContainerMongoDB = require('./db/containers/user')

// ==== CONTENEDORES (CHILD) ====
const products = new ProductosDAOMongoDB('producto', schemaProducto, uri)
const messages = new MensajesDAOMongoDB('mensaje', schemaMensajes, uri)

const User = require('./db/models/user')

// ==== PASSPORT CONFIGURATION ====
app.use(passport.initialize())
app.use(passport.session())

// ==== LOGIN STRATEGY ====
passport.use('login', new LocalStrategy((username, password, done) => {
    return User.findOne({ username })
        .then(user => {
            if (!user) {
                return done(null, false, { message: `No se encontro el usuario "${username}"` })
            }

            if (!isValidPassword(user.password, password)) {
                return done(null, false, { message: 'Contraseña incorrecta' })
            }

            return done(null, user)
        })
        .catch(err => done(err))
}))

// ==== SIGNUP STRATEGY ====
passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, (req, username, password, done) => {
    return User.findOne({ username })
        .then(user => {
            if (user) {
                return done(null, false, { message: `El usuario ${user.username} ya existe` })
            }

            // const newUser = new UserContainerMongoDB('user', schemaUsuario, uri)
            const newUser = new User()
            newUser.username = username
            newUser.password = createHash(password)
            newUser.email = req.body.email

            return newUser.save()
        })
        .then(user => done(null, user))
        .catch(err => done(err))
}))

passport.serializeUser((user, done) => {
    // console.log('serializeUser')
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    // console.log('deserializeUser')
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

// ==== SET ROUTES ====
// const apiRouter = require('./routers/apiRouter.js')
const apiRouter = Router()
const loginRouter = Router()
const logoutRouter = Router()
const signupRouter = Router()
const infoRouter = Router()
const randomRouter = Router()
app.use('/api/productos', apiRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/signup', signupRouter)
app.use('/info', infoRouter)
app.use('/api/random', randomRouter)

apiRouter.get('', async (req, res) => {
    const data3 = await products.getAll()
    const messageCont = await messages.getAll()
    
    if(req.user){
        const user = req.user.email
        return res.render('home', {
            status: 1,
            data3,
            messageCont,
            user
        })
    } 
    res.redirect('/login')
    })

loginRouter.get('', (req, res) => {
    return res.render('login', { message: req.flash('error') })
})

loginRouter.post('', passport.authenticate('login', {
    successRedirect: '/api/productos',
    failureRedirect: '/login',
    failureFlash: true
  }))

signupRouter.get('', (req, res) => {
    return res.render('signup', { message: req.flash('error') })
})

signupRouter.post('', passport.authenticate('signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true
  }))

logoutRouter.get('', (req, res) => {
    const user = req.session.user
    if (req.session.user && req.session.password) {
        return req.session.destroy(err => {
            if (!err) {
                return res.status(200).render('redirect', { user })
            }
            return res.send({ error: err })
        })
    }
    return res.status(404).redirect('http://localhost:8080/login')
})

infoRouter.get('', async (req, res) => {
    
    if(req.user){
        const processInfo = [
            {name: "consoleArg", value: process.argv.slice(2)},
            {name: "platformName", value: process.platform},
            {name: "nodeVersion", value: process.version},
            {name: "memoryUsage", value: process.memoryUsage().rss},
            {name: "path", value: process.path},
            {name: "processId", value: process.pid},
            {name: "folder", value: process.cwd()}
        ]
        console.log(processInfo)
        return res.render('info', { processInfo })
    } 
    res.redirect('/login')
})

randomRouter.get('/:number?', async (req, res) => {
    if (!req.params.number || isNan(req.params.number)){
        const counter = 100000000
    }
    if(req.user){
       const computo = fork('./computo.js')
       computo.on('message', numberArray => {
           return res.send(numberArray)
       } )
    } 
    
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

server.on('error', (error) => { console.log(`Se ha detectado un error. ${error}`) })

// ==== SET SOCKET SERVER ====
io.on('connection', socket => {
    console.log(`Nuevo cliente conectado con id ${socket.id}`)
    // usersArray.push(socket.id)

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
        // usersArray = usersArray.filter(user => user != socket.id)
        console.log(`Se ha desconectado el cliente con id ${socket.id}`)
    })
})