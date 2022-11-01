const { Schema, model } = require('mongoose')

const chatSchema = new Schema({
  message: { type: Object, required: false },
  timestamp: { type: Number, required: false },
  user: { type: String, required: false },
  userId: { type: String, required: false },
})

module.exports = chatSchema