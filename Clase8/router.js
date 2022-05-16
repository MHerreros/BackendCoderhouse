const express = require('express')
const {Router} = express        // Armo el Router
const app = express()

const PORT = 8080
const petsRouter = Router()     // Armo el Router
const peopleRouter = Router()   // Armo el Router

const peopleArray = [{nombre:'matias', apellido:'herreros', edad: 24},{nombre:'joaquin', apellido:'gomez', edad: 22},{nombre:'graciela', apellido:'tuma', edad: 51}]
const petsArray = [{nombre:'pompona', raza:'mezcla', edad:6}, {nombre:'satch', raza:'labrador', edad:10}, {nombre:'alex', raza:'mezcla', edad:3}]

app.use(express.json())                         // Permite recibir JSON
app.use(express.urlencoded({extended: true}))   // Permite recibir JSON

app.use('/api/mascotas', petsRouter)            // Armo el Router
app.use('/api/personas', peopleRouter)          // Armo el Router

app.use(express.static(__dirname + '/public'))  // Toma info de una carpeta estatica

app.use((req, res, next) => {                   // Armo un middleware general que se va a usar
    console.log(`Time:`, Date.now())          // en cada vez que se requiera app.
    return next()
})

app.get('/', () => {
    return res.json({status: 'ok'})
})

// PEOPLE
peopleRouter.get('', (req, res) => {
    return res.send({peopleArray})
})

// Se debe postear un objeto con atributos 'nombre', 'apellido', 'edad'
peopleRouter.post('', (req, res) => {
    const body = req.body
    peopleArray.push(body)
    return res.send({peopleArray})
})

// PETS
petsRouter.get('', (req, res) => {
    return res.send({petsArray})
})

// Se debe postear un objeto con atributos 'nombre', 'apellido', 'edad'
petsRouter.post('', (req, res) => {
    const body = req.body
    petsArray.push(body)
    return res.send({petsArray})
})

const server = app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`))

server.on('error', error => console.log(`Ocurrio un error: ${error}`))