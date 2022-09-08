const getStorage = require('../db/daos')
const { users: storage } = getStorage()

const getItemById = async(itemId) => {
    return await storage.getById((itemId))
}

module.exports = { getItemById }