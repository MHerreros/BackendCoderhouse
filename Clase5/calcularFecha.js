const moment = require('moment')

const today = moment()
const birthday = moment([1997,11,15])

const diffYears = Math.round(today.diff(birthday,'years',true))
const diffDays = Math.round(today.diff(birthday,'days',true))

console.log(`Pasaron ${diffYears} anos desde tu nacimiento`)
console.log(`Pasaron ${diffDays} dias desde tu nacimiento`)
