const Contenedor = require('../Clase4/HerrerosMatias2')
const moment = require('moment')
const express = require('express')

const products = new Contenedor('productos.txt')
const app = express()

const PORT = 8080

app.get('/productos', (req, res) => {
    const allProducts = products.getAll()
    res.send({allProducts})
})

app.get('/productoRandom', (req, res) => {
    const randomProduct = products.randomProduct()
    res.send({randomProduct})
})


const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error',(error) => {console.log(`Se ha detectado un error`)})
