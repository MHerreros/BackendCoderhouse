const ContenedorMongoDB = require('../../containers/containerMongoDb')
const mongoose = require('mongoose')
const { dbLogger } = require('../../../utils/log4jsConfig')
let productosDAOMongoDBInstance = null
class ProductosDAOMongoDB extends ContenedorMongoDB {
  constructor(collectionName, schema, uri) {
    super(collectionName, schema, uri)
  }

  static getInstance(collectionName, schema, uri) {
    if(!productosDAOMongoDBInstance) {
      productosDAOMongoDBInstance = new ProductosDAOMongoDB(collectionName, schema, uri)
    }
    return productosDAOMongoDBInstance
  }

  async modifyById(id, newData){
    try{
        const answer = await this.collection.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, newData)
        // {message:`Se ha modificado el objeto con id ${id}`}
        return answer 
    } catch (error){
        throw new Error('No existe el ID de producto')
    }
  }
}

module.exports = ProductosDAOMongoDB