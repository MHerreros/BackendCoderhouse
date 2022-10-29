const getStorage = require('../db/daos')
const { products: storage } = getStorage()

const getItemById = async(itemId) => {
    return await storage.getById((itemId))
}

const getAllItems = async() => {
    return await storage.getAll(null)
}

const addItem = async(newItem) => {
    newItem.timestamp = Date.now()
    return await storage.save(newItem)
}

const editItem = async(itemId, newItem) => {
    const item = {
        nombre: newItem.nombre,
        descripcion: newItem.descripcion,
        codigo: newItem.codigo,
        foto: newItem.foto,
        precio: newItem.precio,
        stock: newItem.stock,
        timestamp: Date.now()
    }
    return await storage.modifyById(itemId, item)
}

const deleteItem = async (generalItemId, itemId) => {
    return await storage.deleteById(generalItemId, itemId)
}

module.exports = { getItemById, getAllItems, addItem, editItem, deleteItem }