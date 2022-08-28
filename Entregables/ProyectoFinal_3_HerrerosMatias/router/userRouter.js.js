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
const mongoose = require('mongoose')
const validateSession = require('../utils/sessionValidator')

// ==== EXPRESS MIDLEWARES ====

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Flash
app.use(flash())

// ==== PASSPORT MIDLEWARES ====

// Serialize
passport.serializeUser((user, done) => {
    done(null, user._id)
})

// Deserialize
passport.deserializeUser((id, done) => {
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
                throw new Error(`No se encontro el usuario "${username}"`)
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
        res.status(100).redirect('/users/login')
    })
})

// Informacion usuario
userRouter.get('/info', validateSession, async (req, res) => {
    // if(req.session.passport){
        console.log(req.session)
        const user = await storage.getById(mongoose.Types.ObjectId(req.session.passport.user))
        return res.status(200).json({url: req.originalUrl, method: req.method, status: 200, error: null, message: {user}})
    // }
    // return res.status(404).json({url: req.originalUrl, method: req.method, status: 404, error: 'not found', message: `Sesion NO iniciada`})
})

module.exports = userRouter