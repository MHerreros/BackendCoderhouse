const getStorage = require('../db/daos')
const mongoose = require('mongoose')

const { carts: storage } = getStorage()
const { users } = getStorage()

const getItemByUserId = async () => {
    return await storage.getCartByUserId(userId)
}

const addItem = async(newItem) => {
    return await storage.save(newItem)
}

const deleteItem = async (generalItemId, itemId) => {
    return await storage.deleteById(generalItemId, itemId)
}

const getAllItems = async() => {
    return await storage.getAll(null)
}

const editItem = async(itemId, newItem) => {
    return await storage.modifyById(itemId, newItem)
}

const getItemById = async(itemId) => {
    const cart = await storage.getById(itemId)

    // MODIFICAR CARRITO UNA VEZ REALIZADA LA COMPRA (STATUS CARRITO OPEN, DELETED, BOUGHT). ARMAR NUEVA FUNCION EN DAO CARRITO QUE MODIFIQUE EL STATUS.
    let cartProducts = ''
    cart.productos.forEach(element => {
        cartProducts = cartProducts + (`<li>Producto: ${element.nombre}, a un precio de $${element.precio}.</li>`)
    })

    return await users.getById(mongoose.Types.ObjectId(cart.user))
}



module.exports = { getItemByUserId, addItem, deleteItem, getAllItems, editItem, getItemById }