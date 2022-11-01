// ==== LIBRARIES ====
// Express
const express = require('express')
const app = express()

// Router
const { Router } = express
const userRouter = Router()

const { addUser, userLogin, loginView, userLogout, userInfo, createUser, signupView } = require('../controllers/userController')

// Storage
const getStorage = require('../db/daos')
const { users: storage } = getStorage()

// Flash
const flash = require('connect-flash')

// Logger
const { errorLogger, warningLogger } = require('../utils/log4jsConfig')

// Users Management
const { createHash, isValidPassword } = require('../utils/bycrypt')
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
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
    .catch(error => {
        errorLogger.error(error)
        done(error)
    })
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
                return createUser(req.body)
            })
            .then(user => {
                done(null, user)
            })
            .catch(err => {
                errorLogger.error(err)
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
                
                return done(warningLogger.warn(`No se encontro el usuario "${username}"`))
            }

            if (!isValidPassword(user.password, password)) {
                return done(warningLogger.warn(`Contraseña incorrecta`))
            }

            return done(null, user)
        })
        .catch(err => {
            // console.log("(3)")

            errorLogger.error(err)
            done(err)
        })
    })
)

// RUTAS CRUD USUARIOS

// Crea nuevo usuario
userRouter.post('/create', 
    passport.authenticate('signup', {
        successRedirect: '/users/login',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    addUser
)

// Login usuario
userRouter.post('/login',     
    passport.authenticate('login', {
        // successRedirect: '/chat',
        failureRedirect: '/error',
        failureFlash: true
    }), 
    userLogin
)

// Login view
userRouter.get('/login', loginView)

// Signup view
userRouter.get('/create', signupView)

// Logout usuario
userRouter.post('/logout', userLogout)

// Informacion usuario
userRouter.get('/info', validateSession, userInfo)

module.exports = userRouter