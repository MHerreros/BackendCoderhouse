const axios = require('axios')

const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 8080
// console.log(PORT)

const userOk = 
    {
        username: 'matiasherreros97@gmail.com',
        password: 'Matias1234'
    }

const userNok = 
{
    username: 'matiasherreros97@gmail.com',
    password: 'Matias123'
}

const newUser = {
    nombre: "Carlos",
    apellido: "Herreros",
    username: "carlos2@email.com",
    password: "Graciela1234",
    edad: 50,
    direccion: "Avenida Siempre Viva 444",
    telefono: 541165948792,
    foto: "static/user-profiles/avatar1.png"
}

const testLogin = async (user) => {
    let ans = null
    await Promise.resolve(axios.post(`http://localhost:${PORT}/users/login`, user))
        .then((res) => {
            ans = res.data
        })
        .catch((e) => {return e.message})
    // console.log(ans)
    return ans
}

const testUserInfo = (user) => {
    axios.post(`http://localhost:${PORT}/users/login`, user)
        .then((res) => {    
            return axios.get(`http://localhost:${PORT}/users/info`, 
                {
                    headers: {
                        "cookie": res.headers['set-cookie']
                    }
                }
            )
        })
        .then((res) => {        
            console.log('SUCCESS')
        })
        .catch((e) => {
            console.error("FAILED: ", e.message)
        })
}

const testLogout = (user) => {
    axios.post(`http://localhost:${PORT}/users/login`, user)
        .then((res) => {    
            return axios.post(`http://localhost:${PORT}/users/logout`, 
                {
                    headers: {
                        "cookie": res.headers['set-cookie']
                    }
                }
            )
        })
        .then((res) => {        
            console.log("SUCCESS: ", res.data.message)
        })
        .catch((e) => {
            console.error("FAILED: ", e.message)
        })
}

const testCreate = (user) => {
    axios.post(`http://localhost:${PORT}/users/create`, user)
        .then((res) => {        
            console.log("SUCCESS: ", res.data.message)
        })
        .catch((e) => {
            console.error("FAILED: ", e.message)
        })
}

// (async () => {
//     let asd = await testLogin(userOk)
//     console.log(asd)

// })()

module.exports = { testLogin }
// (async () => {


    


    // hola.then((e) => console.log('hola', e))
    // await testUserInfo(userOk)
    // await testUserInfo(userNok)

    // await testLogout(userOk)
    // await testLogout(userNok)

    // await testCreate(newUser)


// })()
