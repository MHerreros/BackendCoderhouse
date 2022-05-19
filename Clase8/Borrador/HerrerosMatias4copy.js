const Contenedor = require('./Contenedor')
// const moment = require('moment')
const express = require('express')
// const {Router} = express

const products = new Contenedor('productos.txt')
// const apiRouter = Router()

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/static', express.static(__dirname + '/public'))
// app.use('/api/productos', apiRouter)


app.get('/api/productos', async (req, res) => {
    
    const data = await products.getAll()
    
    console.log(`Paso 2: ${data}`)

    // Promise(products.getAll())
    // .then((data)=>{
    //     console.log(data)
    //     return res.json({error: 'OK'})
    // })
    // .catch((error) => {
    //     onsole.log(`Error al buscar el array`)
    // })
    return res.send({funciona: `Si ${data}`})
})

// app.get('/:id', (req, res) => {
    
// })

app.post('/api/productos', (req, res) => {
    console.log(req.body.title)
    return res.send({name: `El producto es: ${req.body.title}`})
})

// apiRouter.put('/:id', () => {
    
// })

// apiRouter.delete('/:id', () => {
    
// })



const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error',(error) => {console.log(`Se ha detectado un error`)})
