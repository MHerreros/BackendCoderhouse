const express = require('express')
const app = express()
const PORT = 8081
const frase = 'Hola mundo como estan'

app.get('/api/frase', (req, res) => {
    return res.send({frase})
})

app.get('/api/letras/:num', (req, res) => {
    const caracterId = Number(req.params)
    console.log(caracter)
    const caracter = frase[caracterId-1]
    return res.send({caracter})
})

const server = app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`))

server.on('error', error => console.log(`Ocurrio un error: ${error}`))