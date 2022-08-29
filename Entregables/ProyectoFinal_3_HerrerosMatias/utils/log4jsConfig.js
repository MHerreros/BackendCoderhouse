const log4js = require('log4js')

log4js.configure({
    appenders: {
      consoleLogger: { type: "console" },
      warningsFile: { type: 'file', filename: './logs/warn.log' },
      errorsFile: { type: 'file', filename: './logs/error.log' }
    },
    categories: {
      default: { appenders: ["consoleLogger"], level: "info" },
      database: { appenders: ["consoleLogger"], level: "info" },
      warning: { appenders: ["consoleLogger", "warningsFile"], level: "warn" },
      error: { appenders: ["consoleLogger", "errorsFile"], level: "error" }
    }
   })

const consoleLogger = log4js.getLogger('default')
const dbLogger = log4js.getLogger('database')
const warningLogger = log4js.getLogger('warning')
const errorLogger = log4js.getLogger('error')

module.exports = {
    consoleLogger,
    warningLogger,
    errorLogger,
    dbLogger
}