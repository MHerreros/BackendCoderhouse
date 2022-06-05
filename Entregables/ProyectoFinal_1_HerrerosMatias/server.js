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
let messageArray = []
let usersArray = []

const authorizationLevel = 0

const Contenedor = require('./simplifiedContainer')
const products = new Contenedor(productArray)
const messages = new Contenedor(messageArray)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/static', express.static(__dirname + '/public'))

app.use('/api/productos', productsRouter)
app.use('/api/carrito', carritoRouter)

// app.set('views', './views/ejs')
// app.set('view engine', 'ejs')

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
            const data3 = await products.getAll('BDDproducts.txt')
            return res.status(200).json(data3)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({error: 'Usuario no autorizado'})
    }
    // const messageCont = await messages.getAll('BDDchat.txt')
    // Logica para verificar que haya contenido y permita modificar el valor de STATUS
    // let length = null
    // if(data3.length > 0){
    //     length = data3.length
    // }
})

productsRouter.post('', async (req, res) => {
    if(authorizationLevel == 0){
        try{
            const answer = await products.save(req.body, 'BDDproducts.txt')
            return res.status(201).json(answer)
        } catch (error) {
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({error: 'Usuario no autorizado'})
    }
})

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
        return res.status(401).json({error: 'Usuario no autorizado'})
    }
})

productsRouter.delete('/:id', async (req, res) => {
    if(authorizationLevel == 0){
        try {
            const answer = await products.deleteById('BDDproducts.txt', Number(req.params.id))
            return res.status(201).json(answer)
        } catch(error) {
            return res.status(500).json(error.message)
        } 
    } else {
        return res.status(401).json({error: 'Usuario no autorizado'})
    }
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
