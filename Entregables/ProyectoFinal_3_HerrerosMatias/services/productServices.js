const getStorage = require('../db/daos')
const { products: storage } = getStorage()

const getItemById = async(itemId) => {
    return await storage.getById((itemId))
}

const getAllItems = async() => {
    return await storage.getAll(null)
}

const addItem = async(newItem) => {
    return await storage.save(newItem)
}

const editItem = async(itemId, newItem) => {
    return await storage.modifyById(itemId, newItem)
}

const deleteItem = async (generalItemId, itemId) => {
    return await storage.deleteById(generalItemId, itemId)
}

module.exports = { getItemById, getAllItems, addItem, editItem, deleteItem }