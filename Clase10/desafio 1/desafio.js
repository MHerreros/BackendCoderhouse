const Express = require('express')
const app = Express()

const PORT = 8080

app.set('views', './views')     // Indico a Express que VIEWS sera el directorio donde estaran las plantillas
app.set('view engine', 'pug')   // Indico a Express que PUG sera el motor de plantillas

app.get('/datos', (req, res) => {
    const parametros = req.query
    res.render('barraProgreso', parametros)   // Como ya se definio la carpeta donde van a estar las plantillas y el motor de plantillas
})                              // lo unico que tengo que hacer es decirle el nombre de la plantilla a utilizar

const server = app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`))

server.on('error', (error) => console.log(`Error en servidor. ${error}`))