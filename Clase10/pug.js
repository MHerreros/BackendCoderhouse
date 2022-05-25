const Express = require('express')
const app = Express()

const PORT = 8080

app.set('views', './views')     // Indico a Express que VIEWS sera el directorio donde estaran las plantillas
// app.set('view engine', 'pug')   // Indico a Express que PUG sera el motor de plantillas
app.set('view engine', 'ejs')   // Indico a Express que EJS sera el motor de plantillas

app.get('/hello', (req, res) => {
    const data = {
        message: 'Aprendiendo PUG'
    }
    res.render('hello', data)   // Como ya se definio la carpeta donde van a estar las plantillas y el motor de plantillas
})                              // lo unico que tengo que hacer es decirle el nombre de la plantilla a utilizar

app.get('/message', (req, res) => {
    const data = {
        message:{
            name:'aprendiendo EJS'
        }
    }
    res.render('message', data)
})
const server = app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`))

server.on('error', (error) => console.log(`Error en servidor. ${error}`))