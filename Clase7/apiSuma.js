const express = require('express')
const app = express()
const PORT = 8080
const frase = 'Hola mundo como estan'

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/api/frase', (req, res) => {
    return res.send({frase})
})

app.get('/api/suma/:num1/:num2', (req, res) => {
    const sum1 = Number(req.params.num1)
    const sum2 = Number(req.params.num2)
    if(isNaN(sum1 || sum2)){
        return res.status(400).json(`El ID ingresado es incorrecto`)
    }
    const sumar = sum1 + sum2
    return res.send({sumar})
})

app.get('/api/suma/', (req, res) => {
    if(req.query.num1 && req.query.num2){
        const sum1 = Number(req.query.num1)
        const sum2 = Number(req.query.num2)
        if(isNaN(sum1 || sum2)){
            return res.status(400).json(`El ID ingresado es incorrecto`)
        }
        const sumar = sum1 + sum2
        return res.send({sumar})
    }
    res.status(400)
})

const server = app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`))

server.on('error', error => console.log(`Ocurrio un error: ${error}`))