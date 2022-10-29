const assert = require('assert').strict
const { testLogin } = require('./axiosUserRouter')

describe('Test User Router', () => {
    it('Login Test', async () => {
        const userOk = 
            {
                username: 'matiasherreros97@gmail.com',
                password: 'Matias1234'
            }
        let resp = await testLogin(userOk)
        // console.log(resp)
        
        assert.equal(resp.message, 'Sesion iniciada con exito')
    })
})