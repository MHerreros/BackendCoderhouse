// Emailing
const { notifyNewUser } = require('../utils/ethereal')
const adminUser = {nombre:process.env.ADMIN_NOMBRE, username: process.env.ADMIN_EMAIL, telefono:process.env.ADMIN_TELEFONO}

// Storage
const mongoose = require('mongoose')
const { getItemById, createItem } = require('../services/userServices')
const { getItemByUserId } = require('../services/cartServices')

// Logger
const { errorLogger, warningLogger } = require('../utils/log4jsConfig')

const addUser = async(req, res) => { 
    const newUser = req.body
    notifyNewUser(newUser, adminUser)
    res.redirect('/users/login')
}

const signupView = async (req, res) => {
    return res.status(200).render('signup')
}

const createUser = async(req, res) => {
    return await createItem(req)
}

const userLogin = async(req, res) => { 
    res.status(202).redirect('/chat')
}

const loginView = async(req, res) => {
    return res.status(200).render('login', { message: req.flash('error') })
}

const userLogout = async(req, res) => {
    req.session.destroy(err =>  {
        if(err){ return next(err) }
        res.status(100).redirect('/users/login')
    })
}

const userInfo = async(req, res) => {
    try{
        const user = await getItemById(mongoose.Types.ObjectId(req.session.passport.user))
        return res.status(200).json({url: req.originalUrl, method: req.method, status: 200, error: null, message: {user}})
    } catch (error) {
        errorLogger.error(error)
        return res.status(500).json(error.message)
    }
}
module.exports = { addUser, userLogin, loginView, userLogout, userInfo, createUser, signupView }