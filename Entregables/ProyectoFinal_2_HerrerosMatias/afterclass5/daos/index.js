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

const getStorage = () => {
  const storage = process.env.STORAGE || 'archivo'
  
  switch (storage) {
    case 'archivo':
      return {
        products: new ProductosDAOArchivo(),
        users: new CarritosDAOArchivo()
      }
      break

    case 'memoria':
      return {
        products: new ProductosDAOMemoria(),
        users: new CarritosDAOMemoria()
      }
      break

    case 'mongodb':
      return {
        products: new ProductosDAOMongoDB(),
        users: new CarritosDAOMongoDB()
      }
      break

    case 'firebase':
      return {
        products: new ProductosDAOFirebase(),
        users: new CarritosDAOFirebase()
      }
      break
    default:
      return {
        products: new ProductosDAOArchivo(),
        users: new CarritosDAOArchivo()
      }
      break
  }
}

module.exports = getStorage