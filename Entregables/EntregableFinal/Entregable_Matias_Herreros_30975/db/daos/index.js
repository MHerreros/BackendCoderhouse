const dotenv = require('dotenv')
dotenv.config()
const uri = process.env.MONGO_URL

// SCHEMAS
const schemaCarrito = require('../schema/carrito')
const schemaProducto = require('../schema/productos')
const schemaUsuario = require('../schema/usuarios')
const schemaChat = require('../schema/chat')

// DAOs
const ProductosDAOMongoDB = require('./productos/ProductosDAOMongoDB')
const CarritosDAOMongoDB = require('./carritos/CarritosDAOMongoDB')
const UsuariosDAOMongoDB = require('./usuarios/UsuariosDAOMongoDB')
const ChatDAOMongoDB = require('./chat/ChatDAOMongoDB')

// ==== FACTORY DAOS ====
// ** Se crea la factory para que, en caso de ser necesario, se puedan implementar nuevos metodos de persistencia.

const getStorage = () => {
  const storage = process.env.STORAGE || 'mongodb'

  switch (storage) {
    case 'mongodb':
      return {
        products: ProductosDAOMongoDB.getInstance('producto', schemaProducto, uri),
        carts: CarritosDAOMongoDB.getInstance('carrito', schemaCarrito, uri),
        users: UsuariosDAOMongoDB.getInstance('usuarios', schemaUsuario, uri),
        chat: ChatDAOMongoDB.getInstance('chat', schemaChat, uri)
      }
      break
  }
}

module.exports = getStorage