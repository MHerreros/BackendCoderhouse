const express = require('express')
const {Router} = express

const apiRouter = Router()

apiRouter.get('', async (req, res) => { 
    const data3 = await products.getAll()
    const messageCont = await messages.getAll()

    return res.render('home', {
        status:1, 
        data3,
        messageCont
    })
})

module.exports = apiRouter