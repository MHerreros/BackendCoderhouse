const getStorage = require('../db/daos')

const { chat: storage } = getStorage()
const { users } = getStorage()

const getItemByUserId = async (userId) => {
    return await storage.getChatByUserId(userId)
}

const addItem = async(newItem) => {
    try{
        newItem.timestamp = Date.now()
        const email = {username:newItem.user}
        const user = await users.findUser(email)
        newItem.userId = user._id
        return await storage.save(newItem)
    } catch (e){
        throw new Error(e)
    }
}

const getUserById = async (id) => {
    return await users.getById(id)
}

module.exports = { getItemByUserId, addItem, getUserById }
