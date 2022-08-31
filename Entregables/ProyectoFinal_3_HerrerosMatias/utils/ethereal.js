const { createTransport } = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const MAIL = process.env.GMAIL_ACCOUNT
const PASSWORD = process.env.GMAIL_PASSWORD

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: MAIL,
        pass: PASSWORD
    }
})

const notifyPurchase = async (products, customer, admin) => {
    const customerMail = {
        from: `E-Commerce Herreros | [NUEVO PEDIDO]`,
        to: customer.username,
        subject: `E-Commerce | Gracias por su compra :D`,
        html: 
            `<h1> Hola ${customer.nombre}! </h1> </br> <p>Gracias por comprar los siguientes articulos: </p> 
            </br> 
            <ol>
                ${products}
            </ol>
            `
    }
    const adminMail = {
        from: `E-Commerce | [NUEVO PEDIDO]`,
        to: admin.username,
        subject: `E-Commerce | Nueva Venta`,
        html: `<h1> Hola ${admin.nombre}! </h1> </br> <p>${customer.nombre} ha realizado la siguiente compra: </p> </br> ${products}`
    }

    try{
        await transporter.sendMail(customerMail)
        await transporter.sendMail(adminMail)
    } catch (error) {
        console.log(error)
    }
}

// notifyPurchase( [ { }, { } ] , {username: 'matias.herreros@ing.austral.edu.ar', nombre: 'Matias'}, {nombre:'Ximena', username: 'matias.herreros@ing.austral.edu.ar'})
module.exports = notifyPurchase