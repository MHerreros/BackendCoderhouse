const ContenedorMongoDB = require('../../containers/containerMongoDb')
const mongoose = require('mongoose')
const { dbLogger } = require('../../../utils/log4jsConfig')

class ProductosDAOMongoDB extends ContenedorMongoDB {
  constructor(collectionName, schema, uri) {
    super(collectionName, schema, uri)
  }

  async modifyById(id, newData){
    try{
        await this.collection.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, newData)
        return {message:`Se ha modificado el objeto con id ${id}`}
    } catch (error){
        throw new Error('No existe el ID de producto')
    }
  }
}

module.exports = ProductosDAOMongoDB