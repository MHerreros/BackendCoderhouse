const getStorage = require('../db/daos')
const { users: storage } = getStorage()

const getItemById = async(itemId) => {
    return await storage.getById((itemId))
}

const createItem = async(req, res) => {
    req.timestamp = new Date()
    return storage.save(req)
}

module.exports = { getItemById, createItem }