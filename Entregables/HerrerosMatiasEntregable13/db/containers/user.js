const mongoose = require('mongoose')

class User {

    constructor(collectionName, schema, uri) {
        this.collection = mongoose.model(collectionName, schema )
        this.uri = uri
        this.mongoConnect()
    }

    async mongoConnect() {
        try {
            await mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            console.log(`[USER] Conectado a MongoDB`)
        }
        catch (error) {
            throw new Error(`Error en conexion a mongoDB ${console.log(error)}`)
        }
    }
}

module.exports = User