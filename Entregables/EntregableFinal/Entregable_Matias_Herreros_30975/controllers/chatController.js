const { errorLogger } = require('../utils/log4jsConfig')

const authorizationLevel = 0

const { getItemByUserId, getUserById } = require('../services/chatServices')

const getUserMessages = async (req, res) => { 
    if(authorizationLevel == 0 || authorizationLevel == 1){
        try{
            const userId = req.session.passport.user
            const messageCont = await getItemByUserId(userId)
            const userInfo = await getUserById(userId)
            return res.status(200).render('chat', {messageCont, user: userInfo.nombre})
        } catch (error) {
            errorLogger.error(error)
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({url: req.originalUrl, method: req.method, status: 401, error: 'Unauthorized', message:`Ruta '${req.originalUrl}', metodo '${req.method}' no autorizada para el usuario.`})
    }
}

module.exports = { getUserMessages }
