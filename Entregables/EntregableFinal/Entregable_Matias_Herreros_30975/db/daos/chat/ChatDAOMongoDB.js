const ContenedorMongoDB = require('../../containers/containerMongoDb')

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
          return items
        }
        throw new Error(`No existe el ID ${id}`)

    } catch(error) {
        throw new Error(`Error en lectura de arvhivo en funcion getById. ${error.message}`)
    }
  }
  
}

module.exports = ChatDAOMongoDB