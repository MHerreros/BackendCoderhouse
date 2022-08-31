const ContenedorMongoDB = require('../../containers/containerMongoDb')

class CarritosDAOMongoDB extends ContenedorMongoDB {
  constructor(collectionName, schema, uri) {
    super(collectionName, schema, uri)
  }

  async getCartByUserId(id){
    try{
        const items = await this.collection.find({user: id})

        if(items){
            return items
        }
        throw new Error(`No existe el ID ${id}`)

    } catch(error) {
        throw new Error(`Error en lectura de arvhivo en funcion getById. ${error.message}`)
    }
  }
}

module.exports = CarritosDAOMongoDB