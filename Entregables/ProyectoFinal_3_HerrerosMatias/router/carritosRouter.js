const express = require('express')
const {Router} = express
const getStorage = require('../db/daos')
const carritoRouter = Router()

const { errorLogger } = require('../utils/log4jsConfig')


const authorizationLevel = 0

const { carts: storage } = getStorage()

const validateSession = require('../utils/sessionValidator')

// RUTAS CARRITO

// Busca los carritos asociados al usuario
carritoRouter.get('', validateSession, async (req, res) => { 
    if(authorizationLevel == 0 || authorizationLevel == 1){
        try{
            const data3 = await storage.getCartByUserId((req.session.passport.user))
            return res.status(200).json(data3)
        } catch (error) {
            errorLogger.error(error)
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Crea nuevo carrito
carritoRouter.post('', validateSession, async (req, res) => {
    if((authorizationLevel == 0 || authorizationLevel == 1) && req.session.passport.user){
        req.body.user = req.session.passport.user
        try{
            const answer = await storage.save(req.body)
            return res.status(201).json(answer)
        } catch (error) {
            errorLogger.error(error)
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Borra carrito especifico
carritoRouter.delete('/:id', validateSession, async (req, res) => {
    if(authorizationLevel == 0 || authorizationLevel == 1){
        try {
            const answer = await storage.deleteById((req.params.id), null)
            return res.status(201).json(answer)
        } catch(error) {
            errorLogger.error(error)
            return res.status(500).json(error.message)
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Trae productos de un carrito especifico
carritoRouter.get('/:id/productos', validateSession, async (req, res) => { 
    if(authorizationLevel == 0 || authorizationLevel == 1){
        
        if(!req.params.id ){
            return res.status(500).json(`No existe el id ${req.params.id}`)
        }
        try{
            const data3 = await storage.getAll((req.params.id))
            // console.log(data3)
            return res.status(200).json(data3)
        } catch (error) {
            errorLogger.error(error)
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Agrega producto a carrito especifico
carritoRouter.post('/:id/productos', validateSession, async (req, res) => {
    if(authorizationLevel == 0){
        try {
            // NOTA: data debe ser un objeto JSON con los atributos: nombre, descripcion, codigo, precio, stock, imagen.
            const answer = await storage.modifyById((req.params.id), req.body)
            return res.status(201).json(answer)
        } catch(error) {
            errorLogger.error(error)
            return res.status(500).json(error.message)
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Borro producto de carrito especifico
carritoRouter.delete('/:id/productos/:id_prod', validateSession, async (req, res) => {
    if(authorizationLevel == 0 || authorizationLevel == 1){
        try {
            const answer = await storage.deleteById((req.params.id), (req.params.id_prod))
            return res.status(201).json(answer)
        } catch(error) {
            errorLogger.error(error)
            return res.status(500).json(error.message)
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

module.exports = carritoRouter