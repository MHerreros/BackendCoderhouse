const express = require('express')
const app = express()
const PORT = 8080
const frase = 'Hola mundo como estan'

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/api/frase', (req, res) => {
    return res.send({frase})
})

app.get('/api/letras/:num', (req, res) => {
    const caracterId = Number(req.params.num)
    if(isNaN(caracterId)){
        return res.status(400).json(`El ID ingresado es incorrecto`)
    }
    if(caracterId > frase.length){
        return res.status(400).json(`El ID ingresado es demasiado alto`)
    }
    const caracter = frase[caracterId-1]
    return res.send({caracter})
})

app.get('/api/palabras/:num', (req, res) => {
    const palabraId = Number(req.params.num)
    if(isNaN(palabraId)){
        return res.status(400).json(`El ID ingresado es incorrecto`)
    }
    
    const wordsArray = frase.split(' ')

    if(palabraId > wordsArray.length){
        return res.status(400).json(`El ID ingresado es demasiado alto`)
    }
    const palabra = wordsArray[palabraId-1]
    return res.send({palabra})
})

const server = app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`))

server.on('error', error => console.log(`Ocurrio un error: ${error}`))