const fs = require(`fs`)
const { parse } = require("path")

class Contenedor {
    constructor(nombreArchivo){
        this.name = nombreArchivo
    }
    save(objeto){
        fs.promises.readFile(`./${this.name}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                parsedData.push(objeto)
                let id = 1
                parsedData.forEach(obj => {
                    obj.id = id
                    id++
                });
                const writeData = JSON.stringify(parsedData)
                return fs.promises.writeFile(`./${this.name}`,writeData)
            })
            .then(console.log(`objeto agregado con exito`))
            .catch(error => {
                console.log(error)
            })
    }
    getById(id){
        fs.promises.readFile(`./${this.name}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                const found = parsedData.find(obj => obj.id == id)
                if(found){
                    console.log(found)
                } else {
                    console.log(`No se encuentra el ID ${id}`)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
    getAll(){
        fs.promises.readFile(`./${this.name}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                console.log({parsedData})
                return parsedData
            })
            .catch(error => {
                console.log(`Error al buscar el array`)
            })
    }

    deleteById(deleteId){
        fs.promises.readFile(`./${this.name}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                for(let index = 0; index < parsedData.length; index++){
                    if(parsedData[index].id == deleteId){
                        parsedData.splice(index,1)
                    }
                }
                const writeData = JSON.stringify(parsedData)
                console.log(writeData)
               return fs.promises.writeFile(`./${this.name}`,writeData)
            })
            .then(console.log(`Objeto con id ${deleteId} eliminado`))
            .catch(error => {
                console.log(`Error al leer el archivo`)
            })
    }

    deleteAll(){
        fs.promises.writeFile(`./${this.name}`,'[]')
            .then(console.log(`Todos los objetos fueron borrados exitosamente`))
            .catch(error => {
                console.log(`Hubo un error borrando los objetos`)
            })
    }

    randomProduct(){
        fs.promises.readFile(`./${this.name}`,'utf-8')
        .then((data) => {
            const parsedData = JSON.parse(data)
            // console.log(parsedData)
            const length = parsedData.length
            const index = Math.round(Math.random()*(length-1))
            console.log(parsedData[index])
            return parsedData[index]
        })
    }

}
module.exports = Contenedor
//const canastaProductos =  new Contenedor (`productos.txt`)

//canastaProductos.save({title:'producto2', price:674, thumbnail: 'www.coderhouse.com/prueba'})
// canastaProductos.getById(2)
// canastaProductos.getAll()
// canastaProductos.deleteById(3)
// canastaProductos.deleteAll()