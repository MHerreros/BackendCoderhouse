// ==== LIBRARIES ====
// Express
const express = require('express')
const app = express()

// Router
const { Router } = express
const userRouter = Router()

// Storage
const getStorage = require('../db/daos')
const { users: storage } = getStorage()

// Auhtorization
const authorizationLevel = 0

// Flash
const flash = require('connect-flash')

// Users Management
const { createHash, isValidPassword } = require('../utils/bycrypt')
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')

// ==== EXPRESS MIDLEWARES ====

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Flash
app.use(flash())

// ==== PASSPORT MIDLEWARES ====

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    // console.log('deserializeUser')
    return storage.getById(id)
    .then(user => done(null, user))
    .catch(error => done(error))
})

// Signup Strategy
passport.use(
    'signup', 
    new LocalStrategy({
        passReqToCallback: true
    }, 
    (req, username, password, done) => {
        return storage.findUser({ username })
            .then(user => {
                if (user) {
                    throw new Error(`El usuario ${user.username} ya existe`)
                }
                req.body.password = createHash(password)
                return storage.save(req.body)
            })
            .then(user => {
                done(null, user)
            })
            .catch(err => {
                done(err)
            })
        }
    )
)

// Login Strategy
passport.use(
    'login', 
    new LocalStrategy(
        (username, password, done) => {
        return storage.findUser({ username })
        .then(user => {
            if (!user) {
                throw new Error({ message: `No se encontro el usuario "${username}"` })
            }

            if (!isValidPassword(user.password, password)) {
                throw new Error('Contraseña incorrecta')
            }

            return done(null, user)
        })
        .catch(err => done(err))
    })
)

// RUTAS CRUD USUARIOS

// Crea nuevo usuario
userRouter.post('/create', 
    passport.authenticate('signup', {
        successRedirect: '/users/login',
        failureRedirect: '/users/create',
        failureFlash: true
  }),
    (req, res) => { res.status(201).json({ message: 'Usuario agregado con exito' })
})

// Login usuario
userRouter.post('/login',     
    passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }), (req, res) => { res.status(202).json({ message: 'Sesion iniciada con exito' }) }
)

// Logout usuario
userRouter.post('/logout', (req, res) => {
    req.session.destroy(err =>  {
        if(err){ return next(err) }
        res.redirect('/users/login')
    })
})

// // Borra carrito especifico
// carritoRouter.delete('/:id', async (req, res) => {
//     if(authorizationLevel == 0 || authorizationLevel == 1){
//         try {
//             const answer = await storage.deleteById((req.params.id), null)
//             return res.status(201).json(answer)
//         } catch(error) {
//             return res.status(500).json(error.message)
//         } 
//     } else {
//         return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
//     }
// })

// // Trae productos de un carrito especifico
// userRouter.get('/login', async (req, res) => { 
//     if(authorizationLevel == 0 || authorizationLevel == 1){
        
//         if(!req.params.id ){
//             return res.status(500).json(`No existe el id ${req.params.id}`)
//         }
//         try{
//             const data3 = await storage.getAll((req.params.id))
//             // console.log(data3)
//             return res.status(200).json(data3)
//         } catch (error) {
//             return res.status(500).json(error.message)
//         }
//     } else {
//         return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
//     }
// })

// // Agrega producto a carrito especifico
// carritoRouter.post('/:id/productos', async (req, res) => {
//     if(authorizationLevel == 0){
//         try {
//             // NOTA: data debe ser un objeto JSON con los atributos: nombre, descripcion, codigo, precio, stock, imagen.
//             const answer = await storage.modifyById((req.params.id), req.body)
//             return res.status(201).json(answer)
//         } catch(error) {
//             return res.status(500).json(error.message)
//         } 
//     } else {
//         return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
//     }
// })

// // Borro producto de carrito especifico
// carritoRouter.delete('/:id/productos/:id_prod', async (req, res) => {
//     if(authorizationLevel == 0 || authorizationLevel == 1){
//         try {
//             const answer = await storage.deleteById((req.params.id), (req.params.id_prod))
//             return res.status(201).json(answer)
//         } catch(error) {
//             return res.status(500).json(error.message)
//         } 
//     } else {
//         return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
//     }
// })

module.exports = userRouter