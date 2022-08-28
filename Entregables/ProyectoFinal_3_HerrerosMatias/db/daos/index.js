const dotenv = require('dotenv')
dotenv.config()
const uri = process.env.MONGO_URL
// SCHEMAS
const schemaCarrito = require('../schema/carrito')
const schemaProducto = require('../schema/productos')
const schemaUsuario = require('../schema/usuarios')

// DAOS PRODUCTO
// Instancia de los Contenedores de Productos para distintos archivos
const ProductosDAOArchivo = require('./productos/ProductosDAOArchivo')
const ProductosDAOMemoria = require('./productos/ProductosDAOMemoria')
const ProductosDAOMongoDB = require('./productos/ProductosDAOMongoDB')
const ProductosDAOFirebase = require('./productos/ProductosDAOFirebase')

// DAOS CARRITOS
// Instancia de los Contenedores de Carritos para distintos archivos
const CarritosDAOArchivo = require('./carritos/CarritosDAOArchivo')
const CarritosDAOMemoria = require('./carritos/CarritosDAOMemoria')
const CarritosDAOMongoDB = require('./carritos/CarritosDAOMongoDB')
const CarritosDAOFirebase = require('./carritos/CarritosDAOFirebase')

// DAOS USUARIOS
// Instancia de los Contenedores de Usuarios para distintos archivos
const UsuariosDAOMongoDB = require('./usuarios/UsuariosDAOMongoDB')


const getStorage = () => {
  const storage = process.env.STORAGE || 'archivo'

  switch (storage) {
    case 'archivo':
      return {
        products: new ProductosDAOArchivo(),
        carts: new CarritosDAOArchivo(),
      }
      break

    case 'memoria':
      return {
        products: new ProductosDAOMemoria(),
        carts: new CarritosDAOMemoria()
      }
      break

    case 'mongodb':
      return {
        products: new ProductosDAOMongoDB('producto', schemaProducto, uri),
        carts: new CarritosDAOMongoDB('carrito', schemaCarrito, uri),
        users: new UsuariosDAOMongoDB('usuarios', schemaUsuario, uri)
      }
      break

    case 'firebase':
      return {
        products: new ProductosDAOFirebase('producto'),
        carts: new CarritosDAOFirebase('carrito')
      }
      break
    default:
      return {
        products: new ProductosDAOArchivo(),
        carts: new CarritosDAOArchivo()
      }
      break
  }
}

module.exports = getStorage