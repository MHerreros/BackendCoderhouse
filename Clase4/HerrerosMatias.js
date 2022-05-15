const fs = require(`fs`)

class Contenedor {
    constructor(nombreArchivo){
        fs.promises.readFile(`./${nombreArchivo}`)
            .then(() => {
                console.log(`
                    Ya existe un archivo con el nombre "${nombreArchivo}". 
                    Para correr el programa cambie el nombre del archivo que desea crear o borre el archivo actual`)
            })
            .catch((error) => {
                this.name = nombreArchivo
               
                fs.promises.writeFile(nombreArchivo,'[]')
                .then(() => {
                    console.log(`Se ha generado un archivo con el nombre ${nombreArchivo}`)
                    canastaProductos.save({nombreProducto:'producto1', precio:124, stock: 35})
                    canastaProductos.save({nombreProducto:'producto2', precio:334, stock: 89})
                    canastaProductos.save({nombreProducto:'producto3', precio:897, stock: 21})
                    })
                    .catch(error => {
                        console.log(`\nNo se ha podidio generar el archivo.\nVerifique que el nombre sea valido.\n`)
                        console.log(error)
                    })
            })
    }
    save(objeto){

        fs.promises.readFile(`./${this.name}`)
            .then((data) => {
                let fileData = JSON.parse(data)
                fileData.push(objeto)
                console.log(fileData)
                const parsedObject = JSON.stringify(objeto)
            })
            .catch(error => {
                console.log(`estoy leyendo esto ${error}`)
            })
        
        // fs.promises.appendFile(this.name,parsedObject)
        //     .then( () => {
        //         console.log(`Se añadió el siguiente objeto a ${this.name}: ${parsedObject}`)
        //     })
        //     .catch(error => {
        //         console.log(error)
        //     })
        // Ver como hacer el tema de las promesas
    }
}

// new Promise((res, err) => {
    
// })
// const guardarProductos = (canastaProductos) => {
    
// }
// ;(async () => {
//     try{


// const cargar = (guardarProductos) => {
//     console.log(`Creando la canasta`)
    const canastaProductos =  new Contenedor (`productos.txt`)
//     console.log(`Canasta creada`)
//     guardarProductos(canastaProductos)
// }
// cargar (guardarProductos)
//     } catch (error) {
//         reutrn
//     }
    
    
// })()



// const nombreProducto = 'producto 1'
// product1.save(`{title: ${nombreProducto},}`)


// const data = fs.promises.readFile('./productos.txt','utf-8')
// setTimeout(()=>console.log(data),1000)