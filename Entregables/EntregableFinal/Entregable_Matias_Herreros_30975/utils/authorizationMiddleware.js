const authorizationLevel = 0

const auhtCheck = (authRequired) => {
    if ( authorizationLevel <= authRequired ) {
        return { authorized: true }
    } 
    return { authorized: false }
}

module.exports = { auhtCheck }