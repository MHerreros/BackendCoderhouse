const { createTransport } = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const TEST_MAIL = 'matiasherreros97@gmail.com'
const TEST_PASSWORD = process.env.GMAIL_PASSWORD

const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: TEST_MAIL,
        pass: TEST_PASSWORD
    }
})

const notifyPurchase = async (data, customer, admin) => {
    const customerMail = {
        from: `E-Commerce Herreros | [NUEVO PEDIDO]`,
        to: customer.username,
        subject: `E-Commerce | Gracias por su compra :D`,
        html: `<h1> Hola ${customer.nombre}! </h1> </br> <p>Gracias por comprar los siguientes articulos: </p> </br> ${data.producto}`
    }
    const adminMail = {
        from: `E-Commerce | [NUEVO PEDIDO]`,
        to: admin.username,
        subject: `E-Commerce | Nueva Venta`,
        html: `<h1> Hola ${admin.nombre}! </h1> </br> <p>${customer.nombre} ha realizado la siguiente compra: </p> </br> ${data.producto}`
    }

    try{
        await transporter.sendMail(customerMail)
        await transporter.sendMail(adminMail)
    } catch (error) {
        console.log(error)
    }
}

notifyPurchase({producto: 'yerba'}, {username: 'matias.herreros@ing.austral.edu.ar', nombre: 'Matias'}, {nombre:'Ximena', username: 'matias.herreros@ing.austral.edu.ar'})