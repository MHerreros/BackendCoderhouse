const ContenedorMongoDB = require('../../containers/containerMongoDb')
const { normalizeUserData } = require('../../DTOs/userDTO')
let usuariosDAOMongoDBInstance = null

class UsuariosDAOMongoDB extends ContenedorMongoDB {
  constructor(collectionName, schema, uri) {
    super(collectionName, schema, uri)
  }

  static getInstance(collectionName, schema, uri) {
    if(!usuariosDAOMongoDBInstance) {
      usuariosDAOMongoDBInstance = new UsuariosDAOMongoDB(collectionName, schema, uri)
    }
    return usuariosDAOMongoDBInstance
  }

  async findUser(username){
    try{
        const user = await this.collection.findOne({ username: username.username })
        // console.log(user)
        return normalizeUserData(user)
    } catch(error) {
        throw new Error(`Error en la busqueda del Usuario (findUser()). ${error.message}`)
    }
  }
}

module.exports = UsuariosDAOMongoDB