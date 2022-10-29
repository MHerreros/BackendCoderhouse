const Koa = require('koa')
const koaBody = require('koa-body')
const { productRouter } = require('./koaRouter')
const app = new Koa()

const PORT = 8082

app.use(koaBody())
app.use(productRouter.routes())

const server = app.listen(PORT, () => console.log(`App listening in the port ${PORT}`))

server.on('error', (error) => console.log(`Server Error: ${error}`))