const Router = require('koa-router')

const productRouter = new Router({
    prefix: '/productos'
})

const { getProductById, addProduct, editProduct, deleteProduct } = require('./koaController')

// RUTAS PRODUCTO

// Trae listado de productos o un producto especifico del listado segun su ID
productRouter.get('/:id?', getProductById)

// Agrega un producto al listado de productos
productRouter.post('/', addProduct)

// Modifica un procucto del listado de productos segun su ID
productRouter.put('/:id', editProduct)

// Elimina un producto del listado de productos segun su ID
productRouter.delete('/:id', deleteProduct)

module.exports = { productRouter }