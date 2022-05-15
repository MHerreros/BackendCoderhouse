const moment = require('moment')
const express = require('express')
const app = express()
const PORT = 8080

let visits = 0

app.get('/', (req, res) => {
    res.send('<h1 style="color:blue;">Bienvenidos al Servidor Express</h1>')
})

app.get('/visitas', (req, res) => {
    visits++
    res.send(`La cantidad de visitas es ${visits}`)
})

app.get('/fyh', (req, res) => {
    const fyh = moment().format('MMMM Do YYYY, h:mm:ss a')
    res.send(`Hoy es ${fyh}`)
})

const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutando en la direccion ${server.address().port}`)
})

server.on('error',(error) => {console.log(`Se ha detectado un error`)})
