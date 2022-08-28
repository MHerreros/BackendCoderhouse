const validateSession = (req, res, next) => {
    if(req.session.passport){
        // console.log(`Sesion valida`)
        return next()
    }
    res.redirect('/users/login')
}
module.exports = validateSession