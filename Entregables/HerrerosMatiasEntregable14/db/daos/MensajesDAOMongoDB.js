const ContenedorMongoDB = require('../containers/containerMongoDb')

class CarritosDAOMongoDB extends ContenedorMongoDB {
  constructor(collectionName, schema, uri) {
    super(collectionName, schema, uri)
  }
}

module.exports = CarritosDAOMongoDB