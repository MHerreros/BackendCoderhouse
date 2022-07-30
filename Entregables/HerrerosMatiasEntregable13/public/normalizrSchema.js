const normalizr = require('normalizr')
// const db = require('./testNormalizr/testChat.json')
// const fs = require('fs')

const authorSchema = new normalizr.schema.Entity('authors')

const messageSchema = new normalizr.schema.Entity('message')

const chatSchema = new normalizr.schema.Entity('chat', {
    author: authorSchema,
    message: [messageSchema]
}, {idAttribute: '_id'})

const chatArray = new normalizr.schema.Array(chatSchema)

exports.module = chatArray

// const normalizedChat = normalizr.normalize(db, chatArray)

// const denormalizedChat = normalizr.denormalize(normalizedChat.result, chatArray, normalizedChat.entities)

// console.log('ORIGINAL: ', JSON.stringify(db).length)
// console.log('NORMALIZADO: ', JSON.stringify(normalizedChat).length)
// console.log('DENORMALIZADO: ', JSON.stringify(denormalizedChat).length)

// fs.promises
//     .writeFile('./testNormalizr/normalizedTest.json', JSON.stringify(normalizedChat, null, 2))
//     .then ( console.log('DONE OK'))
// // console.log(normalizedChat)
// fs.promises
//     .writeFile('./testNormalizr/denormalizedTest.json', JSON.stringify(denormalizedChat, null, 2))    
//     .then ( console.log('DONE OK'))
