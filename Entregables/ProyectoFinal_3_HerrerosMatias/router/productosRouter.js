const express = require('express')
const {Router} = express
const getStorage = require('../db/daos')
const productsRouter = Router()

const { errorLogger } = require('../utils/log4jsConfig')

const validateSession = require('../utils/sessionValidator')

const authorizationLevel = 0

const { products: storage } = getStorage()

// RUTAS PRODUCTO

// Trae listado de productos o un producto especifico del listado segun su ID
productsRouter.get('/:id?', validateSession, async (req, res) => { 
    if(authorizationLevel == 0 || authorizationLevel == 1){
        if(req.params.id){
            try{
                const data3 = await storage.getById((req.params.id))
                return res.status(200).json(data3)
            } catch (error) {
                errorLogger.error(error)
                return res.status(500).json(error.message)
            }
        }
        try{
            const data3 = await storage.getAll(null)
            return res.status(200).json(data3)
        } catch (error) {
            errorLogger.error(error)
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:{url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`}})
    }
})

// Agrega un producto al listado de productos
productsRouter.post('', validateSession, async (req, res) => {
    if(authorizationLevel == 0){
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

// Modifica un procucto del listado de productos segun su ID
productsRouter.put('/:id', validateSession, async (req, res) => {
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

// Elimina un producto del listado de productos segun su ID
productsRouter.delete('/:id', validateSession, async (req, res) => {
    if(authorizationLevel == 0){
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

module.exports = productsRouter