const express = require('express')
const app = express()
const { Router } = express
const yargs = require('yargs/yargs')
const numCPUs = require('os').cpus().length
const cluster = require('cluster')

// ==== SET MIDDLEWARES ====
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static(__dirname + '/public'))

const infoRouter = Router()
const randomRouter = Router()
app.use('/info', infoRouter)
app.use('/api/random', randomRouter)

// ==== SET VIEWS CONFIG ====
app.set('views', './public/views/ejs')
app.set('view engine', 'ejs')

// ==== SET SERVER PORT ====
const args = yargs(process.argv.slice(2))
    .alias({
        port: 'p',
        balancer: 'b'
    })
    .default({
        port: 8080,
        balancer: 'FORK'
    })
    .argv

let PORT = 8080
if (typeof args.port === 'number'){
    PORT = args.port
}
let loadBalancer = args.balancer

infoRouter.get('', async (req, res) => {
    const processInfo = [
        {name: "consoleArg", value: process.argv.slice(2)},
        {name: "platformName", value: process.platform},
        {name: "nodeVersion", value: process.version},
        {name: "memoryUsage", value: process.memoryUsage().rss},
        {name: "path", value: process.path},
        {name: "processId", value: process.pid},
        {name: "folder", value: process.cwd()},
        {name: "systemCores", value: numCPUs}
    ]
    return res.render('info', { processInfo })
})

randomRouter.get('/:number?', async (req, res) => {
    if (loadBalancer === 'FORK'){
        if(req.user){
           const computo = fork('./computo.js', [req.params.number])
           computo.on('message', numberArray => {
               return res.send(numberArray)
           } )
        } 
    }
    
})

app.all('*', (req, res) => {
    return res.status(404).json(`Ruta '${req.path}' no encontrada.`)
})

if (loadBalancer === 'FORK'){
    if (cluster.isMaster) {
        console.log(`Nodo primario ${process.pid} corriendo`)
      
        for( let i = 0; i < numCPUs; i++) {
          cluster.fork()
        }
      
        cluster.on('exit', (worker, code, signal) => {
          console.log(`Worker ${worker.process.pid} finalizado`)
        })
      } else {
        console.log(`Nodo worker corriendo en el proceso ${process.pid}`)
              
        const server = app.listen(PORT, () => {
            console.log(`Servidor ejecutando en la direccion ${server.address().port} y utilizando el balanceador de carga ${loadBalancer}. Id de proceso: ${process.pid}`)
        })
        
        server.on('error', (error) => { console.log(`Se ha detectado un error. ${error}`) }) 
      }
}

  
