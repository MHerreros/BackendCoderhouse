const express = require('express')
const app = express()

app.use('/static', express.static(__dirname + '/public'))

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutando en puerto ${PORT}`)
})

app.get('/home',(req,res) => {

})

server.on('error', error => console.log('Error en Servidor', error))