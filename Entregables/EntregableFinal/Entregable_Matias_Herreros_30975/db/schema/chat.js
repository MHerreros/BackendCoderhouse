const { Schema, model } = require('mongoose')

const chatSchema = new Schema({
  message: { type: Object, required: true },
  timestamp: { type: Number, required: true },
  user: { type: String, required: true },
  userId: { type: String, required: true },
})

module.exports = chatSchema