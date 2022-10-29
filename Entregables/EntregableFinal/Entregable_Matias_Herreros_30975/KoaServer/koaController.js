const authorizationLevel = 0
const { errorLogger } = require('../utils/log4jsConfig')

const { getItemById, getAllItems, addItem, editItem, deleteItem } = require('../services/productServices')

const getProductById = async (ctx) => {
    if(authorizationLevel == 0 || authorizationLevel == 1){

        const productId = ctx.params.id

        if(productId){
            try{
                const data3 = await getItemById(productId)
                ctx.response.status = 200
                ctx.body = data3
                return
            } catch (error) {
                errorLogger.error(error)
                ctx.response.status = 500
                ctx.body = error.message
                return
            }
        }
        try{

            const data3 = await getAllItems()
            ctx.response.status = 200
            ctx.body = data3
            return
        } catch (error) {
            errorLogger.error(error)
            ctx.response.status = 500
            ctx.body = error.message
            return
        }
    } else {
        ctx.response.status = 401
        ctx.body = {error:'Unauthorized', message:`Ruta no autorizada para el usuario.`}
        return
    }
}

const addProduct = async (ctx) => {
    if(authorizationLevel == 0){

        const newProduct = ctx.request.body

        try{
            const answer = await addItem(newProduct)
            ctx.response.status = 201
            ctx.body = answer
            return
        } catch (error) {
            errorLogger.error(error)
            ctx.response.status = 500
            ctx.body = error.message
            return
        }
    } else {
        ctx.response.status = 401
        ctx.body = {error:'Unauthorized', message:`Ruta no autorizada para el usuario.`}
        return
    }
}

const editProduct = async (ctx) => {
    if(authorizationLevel == 0){

        const productId = ctx.params.id
        const newProduct = ctx.request.body

        try {
            // NOTA: data debe ser un objeto JSON con los atributos: nombre, descripcion, codigo, precio, stock, imagen.
            const answer = await editItem(productId, newProduct)
            ctx.response.status = 201
            ctx.body = answer
            return
        } catch(error) {
            errorLogger.error(error)
            ctx.response.status = 500
            ctx.body = error.message
            return
        } 
    } else {
        ctx.response.status = 401
        ctx.body = {error:'Unauthorized', message:`Ruta no autorizada para el usuario.`}
        return
    }
}

const deleteProduct = async (ctx) => {
    if(authorizationLevel == 0){

        const productId = ctx.params.id

        try {
            const answer = await deleteItem(productId, null)
            ctx.response.status = 201
            ctx.body = answer
            return
        } catch(error) {
            errorLogger.error(error)
            ctx.response.status = 500
            ctx.body = error.message
            return
        } 
    } else {
        ctx.response.status = 401
        ctx.body = {error:'Unauthorized', message:`Ruta no autorizada para el usuario.`}
        return    
    }
}

module.exports = { getProductById, addProduct, editProduct, deleteProduct }