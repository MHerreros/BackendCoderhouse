const {optionsMariaDB} = require('./db/mariaDB')
const {optionsSQLite3} = require('./db/SQLite3')
const knexMaria = require('knex')(optionsMariaDB)
const knexSQLite3 = require('knex')(optionsSQLite3)

knexMaria.schema
    .createTable('productos', table => {
        table.string('title')
        table.float('price')
        table.string('thumbnail')
        table.increments('id')
    })
    .then(() => {
        console.log('Tabla PRODUCTOS Creada')
        return knexSQLite3.schema.createTable('chat', table => {
            table.string('mail')
            table.string('timestamp')
            table.string('message')
            table.increments('id')
        })
    })
    .then(() => {
        console.log('Tabla CHAT Creada')
    })
    .catch(error => {
        console.log(error.message)
    })
    .finally(() => {
        knexSQLite3.destroy()
        knexMaria.destroy()
    })