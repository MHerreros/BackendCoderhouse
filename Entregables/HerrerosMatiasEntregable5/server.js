const Contenedor = require('./simplifiedContainer')
const express = require('express')
const {Router} = express

const productArray = [
    {title: 'Tornillos', price: 23, thumbnail:'https://cdn2.iconfinder.com/data/icons/random-set-1/432/Asset_80-128.png', id: 1},
    {title: 'Rodillo', price: 550, thumbnail:'https://cdn2.iconfinder.com/data/icons/random-set-1/492/Asset_74-128.png', id: 2}
]
const products = new Contenedor(productArray)

const apiRouter = Router()
const app = express()
const PORT = 8080

// app.set('views', './views/pug')
// app.set('view engine', 'pug')

app.set('views', './views/ejs')
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname + '/public'))

apiRouter.get('', (req, res) => { 
    return res.render('home', {status:1})
})

apiRouter.get('/all', (req, res) => {
    const data3 = products.data
    return res.render('productList', {data3})
})
apiRouter.post('', (req, res) => {
    if(req.body.title && req.body.price && req.body.thumbnail != ''){
        products.save(req.body)
        return res.render('home',{status:1})
    } else {
        return res.render('home',{status:0})
    }
})

// apiRouter.get('/:id', (req, res) => {
//     const selectedProduct = products.getById(req.params.id)
//     return res.json({selectedProduct})
// })


// apiRouter.put('/:id', (req, res) => {
//     const id = Number(req.params.id)
//     const data = req.body // NOTA: data debe ser un objeto JSON con 3 atributos (title, price, thumnail)
//     const answer = products.modifyById(id, data)
    
//     return res.json({answer})
// })

// apiRouter.delete('/:id', (req, res) => {
//     const id = req.params.id
//     const answer = products.deleteById(id)
//     return res.json({answer})
// })

const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error',(error) => {console.log(`Se ha detectado un error`)})

app.use('/api/productos', apiRouter)