const { ClientSession } = require('mongodb')
const mongoose = require('mongoose')

class containerMongoDB {

    constructor(collectionName, schema, uri) {
        this.collection = mongoose.model(collectionName, schema)
        this.uri = uri
        this.mongoConnect()
    }

    async mongoConnect() {
        try {
            await mongoose.connect(this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            console.log("Conectado a MongoDB")
        }
        catch (error) {
            throw new Error(`Error en conexion a mongoDB ${console.log(error)}`)
        }
    }

    async save(nuevoObjeto){
        try{
            nuevoObjeto.timestamp = Date.now()
            const item = await this.collection.create(nuevoObjeto)
            return item
        } catch (error){
            throw new Error(`Error en la creacion de la coleccion. ${error}`)
        }
    }

    async getAll() {
        try{
            const items = await this.collection.find()
            return items
        }catch(error){
            throw new Error(error)
        }
    }
    
}
module.exports = containerMongoDB