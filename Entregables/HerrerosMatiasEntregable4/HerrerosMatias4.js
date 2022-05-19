const Contenedor = require('./simplifiedContainer')
const express = require('express')
const {Router} = express

const productArray = [
    {title: 'producto 1', price: 23, thumbnail:'asdasd', id: 1},
    {title: 'producto 2', price: 6456, thumbnail:'rrrrrrr', id: 2}
]
const products = new Contenedor(productArray)

const apiRouter = Router()
const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname + '/public'))


apiRouter.get('', (req, res) => {
    const data =  products.getAll()   
    return res.json({data})
})

apiRouter.get('/:id', (req, res) => {
    const selectedProduct = products.getById(req.params.id)
    return res.json({selectedProduct})
})

apiRouter.post('', (req, res) => {
    products.save(req.body)
    return res.send({newProduct: req.body})
})

apiRouter.put('/:id', (req, res) => {
    const id = Number(req.params.id)
    const data = req.body // NOTA: data debe ser un objeto JSON con 3 atributos (title, price, thumnail)
    const answer = products.modifyById(id, data)
    
    return res.json({answer})
})

apiRouter.delete('/:id', (req, res) => {
    const id = req.params.id
    const answer = products.deleteById(id)
    return res.json({answer})
})



const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error',(error) => {console.log(`Se ha detectado un error`)})

app.use('/api/productos', apiRouter)