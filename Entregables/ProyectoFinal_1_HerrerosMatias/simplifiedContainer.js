const fs = require(`fs`)
const { parse } = require("path")

class simplifiedContainer {

    constructor(productArray){
        this.data = productArray
    }

    save(nuevoObjeto, path){
        return(fs.promises.readFile(`./public/${path}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                if(path == 'BDDproducts.txt'){
                    nuevoObjeto.id = parsedData.length + 1
                    nuevoObjeto.timestamp = Date.now()
                }
                parsedData.push(nuevoObjeto)
                const writeData = JSON.stringify(parsedData)
                return fs.promises.writeFile(`./public/${path}`,writeData)
            })
            .then(() => {
                return {message:`Se ha guardado el objeto en la BDD`}
            })
            .catch(error => {
                throw Error(`Error en lectura / escritura de archivo en funcion save. ${error.message}`)
            })
        )
    }

    getById(id, path){
        return(fs.promises.readFile(`./public/${path}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                const selectedElement = parsedData.find(element => element.id === id)
                if(selectedElement){
                    return selectedElement
                }
                throw Error(`No existe el ID ${id}`)
            })
            .catch(error => {
                throw Error(`Error en lectura de arvhivo en funcion getById. ${error.message}`)
            })
        )
    }

    getAll(path){
        return(fs.promises.readFile(`./public/${path}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                return parsedData
            })
            .catch(error => {
                throw Error(`Error en lectura de archivo en funcion getAll ${error.message}`)
            })
        )
    }

    modifyById(path, id, newData){
        return(fs.promises.readFile(`./public/${path}`,'utf-8')
        .then((data) => {
            const parsedData = JSON.parse(data)
            const objectToModify = parsedData.find(element => element.id == id)
            if(objectToModify){
                const index = parsedData.indexOf(objectToModify)
                if(path == 'BDDproducts.txt'){
                    parsedData[index].nombre = newData.nombre
                    parsedData[index].descripcion = newData.descripcion
                    parsedData[index].codigo = newData.codigo
                    parsedData[index].foto = newData.foto
                    parsedData[index].precio = newData.precio
                    parsedData[index].stock = newData.stock
                    parsedData[index].timestamp = Date.now()
                }
            } else {
                throw Error('No existe el ID')
            }
            const writeData = JSON.stringify(parsedData)
            return fs.promises.writeFile(`./public/${path}`,writeData)
        })
        .then(() => {
            return {message:`Se ha modificado el objeto con id ${id}`}
        })
        .catch(error => {
            throw Error(`Error en lectura/escritura de archivo en funcion modifyById. ${error}`)
        })
        )
    }

    deleteById(path, id){
        return(fs.promises.readFile(`./public/${path}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                const selectedElement = parsedData.find(element => element.id === id)
                if(selectedElement){
                    const index = parsedData.indexOf(selectedElement)
                    parsedData.splice(index, 1)
                    const writeData = JSON.stringify(parsedData)
                    return fs.promises.writeFile(`./public/${path}`, writeData)
                } else {
                    throw Error(`No existe el ID ${id}`)
                }
            })
            .then(() => {
                return {message: `Se ha eliminado el objeto con id ${id}`}
            })
            .catch(error => {
                throw Error(`Error en lectura/escritura de arvhivo en funcion deleteById. ${error.message}`)
            })
        )    
    }
}
module.exports = simplifiedContainer
