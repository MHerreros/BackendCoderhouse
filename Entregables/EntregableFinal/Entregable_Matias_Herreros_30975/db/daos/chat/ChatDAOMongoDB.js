const ContenedorMongoDB = require('../../containers/containerMongoDb')
// const mongoose = require('mongoose')
// const { dbLogger } = require('../../../utils/log4jsConfig')
// const { normalizeCartData } = require('../../DTOs/cartDTO')

let chatDAOMongoDBInstance = null

class ChatDAOMongoDB extends ContenedorMongoDB {
  constructor(collectionName, schema, uri) {
    super(collectionName, schema, uri)
  }

  static getInstance(collectionName, schema, uri) {
    if(!chatDAOMongoDBInstance) {
        chatDAOMongoDBInstance = new ChatDAOMongoDB(collectionName, schema, uri)
    }

    return chatDAOMongoDBInstance
  }

  async getChatByUserId(id){
    try{
        const items = await this.collection.find({userId: id})

        if(items){
          // return normalizeCartData(items)
          return items
        }
        throw new Error(`No existe el ID ${id}`)

    } catch(error) {
        throw new Error(`Error en lectura de arvhivo en funcion getById. ${error.message}`)
    }
  }
  
}

module.exports = ChatDAOMongoDB