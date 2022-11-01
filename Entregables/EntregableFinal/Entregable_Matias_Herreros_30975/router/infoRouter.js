const express = require('express')
const { Router } = express
const infoRouter = Router()
const { getServerInfo } = require('../controllers/infoController')

infoRouter.get('/', getServerInfo)

module.exports = infoRouter