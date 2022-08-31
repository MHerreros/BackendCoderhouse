const mongoose = require('mongoose')
const uri = "mongodb+srv://matias:xsBZtP6jv0Bifco3@cluster0.ry76x.mongodb.net/ecommerce?retryWrites=true&w=majority"

const connection = mongoose.connect(uri, {
    useNewUrlParser: true
})
.then(_ => console.log("Conexion a DB Atlas exitosa"))

module.exports = connection