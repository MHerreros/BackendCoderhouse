const authorizationLevel = 0
const getStorage = require('../db/daos')
const { products: storage } = getStorage()
const { errorLogger } = require('../utils/log4jsConfig')

const getProductById = async (req, res) => {
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
}

const addProduct = async (req, res) => {
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
}

const editProduct = async (req, res) => {
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
}

const deleteProduct = async (req, res) => {
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
}

module.exports = { getProductById, addProduct, editProduct, deleteProduct }