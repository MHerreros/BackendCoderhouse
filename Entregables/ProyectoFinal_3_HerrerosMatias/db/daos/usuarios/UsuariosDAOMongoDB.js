const ContenedorMongoDB = require('../../containers/containerMongoDb')

class UsuariosDAOMongoDB extends ContenedorMongoDB {
  constructor(collectionName, schema, uri) {
    super(collectionName, schema, uri)
  }

  async findUser(username){
    try{
        return await this.collection.findOne({ username: username.username })
    } catch(error) {
        throw new Error(`Error en la busqueda del Usuario (findUser()). ${error.message}`)
    }
  }
}

module.exports = UsuariosDAOMongoDB