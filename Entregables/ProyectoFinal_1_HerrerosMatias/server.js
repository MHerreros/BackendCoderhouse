const express = require('express')
const { Server: HttpServer } = require('http')      
// const { Server: IOServer } = require('socket.io')   
// const {engine} = require('express-handlebars')
const app = express()
const httpServer = new HttpServer(app)
// const io = new IOServer(httpServer)
const PORT = process.env.PORT || 8080

const {Router} = express
const productsRouter = Router()
const carritoRouter = Router()

let productArray = []
let cartArray = []
// let usersArray = []

const authorizationLevel = 2

const Contenedor = require('./simplifiedContainer')
const products = new Contenedor(productArray)
const carts = new Contenedor(cartArray)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/static', express.static(__dirname + '/public'))

// app.set('views', './views/ejs')
// app.set('view engine', 'ejs')

app.use('/api/productos', productsRouter)
app.use('/api/carrito', carritoRouter)

// RUTAS PRODUCTO

// Trae listado de productos o un producto especifico del listado segun su ID
productsRouter.get('/:id?', async (req, res) => { 
    if(authorizationLevel == 0 || authorizationLevel == 1){
        if(req.params.id){
            try{
                const data3 = await products.getById(Number(req.params.id),'BDDproducts.txt')
                return res.status(200).json(data3)
            } catch (error) {
                return res.status(500).json(error.message)
            }
        }
        try{
            const data3 = await products.getAll('BDDproducts.txt', null)
            return res.status(200).json(data3)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:{url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`}})
    }
})

// Agrega un producto al listado de productos
productsRouter.post('', async (req, res) => {
    if(authorizationLevel == 0){
        try{
            const answer = await products.save(req.body, 'BDDproducts.txt', null)
            return res.status(201).json(answer)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Modifica un procucto del listado de productos segun su ID
productsRouter.put('/:id', async (req, res) => {
    if(authorizationLevel == 0){
        try {
            // NOTA: data debe ser un objeto JSON con los atributos: nombre, descripcion, codigo, precio, stock, imagen.
            const answer = await products.modifyById('BDDproducts.txt', Number(req.params.id), req.body)
            return res.status(201).json(answer)
        } catch(error) {
            return res.status(500).json(error.message)
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Elimina un producto del listado de productos segun su ID
productsRouter.delete('/:id', async (req, res) => {
    if(authorizationLevel == 0){
        try {
            const answer = await products.deleteById('BDDproducts.txt', Number(req.params.id), null)
            return res.status(201).json(answer)
        } catch(error) {
            return res.status(500).json(error.message)
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// RUTAS CARRITO

// Crea nuevo carrito
carritoRouter.post('', async (req, res) => {
    if(authorizationLevel == 0 || authorizationLevel == 1){
        try{
            const answer = await carts.save(req.body, 'BDDcart.txt', null)
            return res.status(201).json(answer)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Borra carrito especifico
carritoRouter.delete('/:id', async (req, res) => {
    if(authorizationLevel == 0 || authorizationLevel == 1){
        try {
            const answer = await carts.deleteById('BDDcart.txt', Number(req.params.id), null)
            return res.status(201).json(answer)
        } catch(error) {
            return res.status(500).json(error.message)
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Trae productos de un carrito especifico
carritoRouter.get('/:id/productos', async (req, res) => { 
    if(authorizationLevel == 0 || authorizationLevel == 1){
        if(!req.params.id){
            return res.status(500).json(`No existe el id ${req.params.id}`)
        }
        try{
            const data3 = await carts.getAll('BDDcart.txt', Number(req.params.id))
            return res.status(200).json(data3)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Agrega producto a carrito especifico
carritoRouter.post('/:id/productos', async (req, res) => {
    if(authorizationLevel == 0){
        try {
            // NOTA: data debe ser un objeto JSON con los atributos: nombre, descripcion, codigo, precio, stock, imagen.
            const answer = await products.modifyById('BDDcart.txt', Number(req.params.id), req.body)
            return res.status(201).json(answer)
        } catch(error) {
            return res.status(500).json(error.message)
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Borro producto de carrito especifico
carritoRouter.delete('/:id/productos/:id_prod', async (req, res) => {
    if(authorizationLevel == 0 || authorizationLevel == 1){
        try {
            const answer = await carts.deleteById('BDDcart.txt', Number(req.params.id), Number(req.params.id_prod))
            return res.status(201).json(answer)
        } catch(error) {
            return res.status(500).json(error.message)
        } 
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
})

// Respuesta por default cuando no encuentra la ruta especificada
app.all('*', (req, res) => {
    return res.status(404).json(`Ruta '${req.path}' no encontrada.`)
})

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error',(error) => {console.error(`Se ha detectado un error: ${error.message}`)})

// io.on('connection', socket => {
//     console.log(`Nuevo cliente conectado con id ${socket.id}`)
//     usersArray.push(socket.id)

//     socket.on('addProduct', async (newProduct) => {
//         await products.save(newProduct, 'BDDproducts.txt')
//         console.log('PASO 2')
//         const data3 = newProduct
//         socket.emit('refreshList', data3)
//         socket.broadcast.emit('refreshList', data3)
//     })

//     socket.on('addMessage', newMessage => {
//         messages.save(newMessage,'BDDchat.txt')
//         const messageCont = newMessage
//         socket.emit('refreshMessages', messageCont)
//         socket.broadcast.emit('refreshMessages', messageCont)
//     })

//     socket.on('disconnect', reason => {
//         usersArray = usersArray.filter(user => user != socket.id)
//         console.log(`Se ha desconectado el cliente con id ${socket.id}`)
//     })
// })
