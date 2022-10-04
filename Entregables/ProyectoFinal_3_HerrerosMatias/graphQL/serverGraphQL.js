const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')
const axios = require('axios')

const user = {
    username: 'matiasherreros97@gmail.com',
    password: 'Matias1234'
}

// ==== SCHEMA GRAPHQL ==== //
const schema = buildSchema(`
    type Producto {
        _id:ID,
        nombre: String,
        descripcion: String,
        codigo: Int,
        foto: String,
        precio: Int,
        stock: Int,
        timestamp: String,
    }

    type Response {
        message: String
    }
    
    input ProductInput {
        _id:ID,
        nombre: String,
        descripcion: String,
        codigo: Int,
        foto: String,
        precio: Int,
        stock: Int,
        timestamp: String,
    }

    type Query {
        getAllProducts: [Producto]
        getProductById(id: ID!): Producto
    }

    type Mutation {
        addProduct(data: ProductInput): Producto
        modifyProduct(id: ID, data: ProductInput): Producto
        deleteProduct(id: ID): Response
    }
`)

// ==== RESOLVERS ==== //
const getAllProducts = async () => {
    return axios.post(`http://localhost:8080/users/login`, user)
        .then((res) => {    
            return axios.get(`http://localhost:8080/api/productos`, 
                {
                    headers: {
                        "cookie": res.headers['set-cookie']
                    }
                }
            )
        })
        .then((res) => {        
            // console.log('SUCCESS: ', res.data)
            return res.data
        })
        .catch((e) => {
            console.error("FAILED: ", e.message)
        })
}

const getProductById = async () => {

}

const addProduct = async () => {

}

const modifyProduct = async () => {
    
}

const deleteProduct = async () => {
    
}
const app = express()
app.use(express.static('public'));

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue:{
        getAllProducts,
        getProductById,
        addProduct,
        modifyProduct,
        deleteProduct,
    },
    graphiql: true,
}))

const PORT = 8081

app.listen(PORT, () => console.log(`GraphQL Server listening in the port ${PORT}`))