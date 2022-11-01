const express = require('express')
const { Router } = express
const chatRouter = Router()
const { getUserMessages } = require('../controllers/chatController')

chatRouter.get('/', getUserMessages)

module.exports = chatRouter