class simplifiedContainer {

    constructor(productArray){
        this.data = productArray
    }

    save(nuevoProducto){
        nuevoProducto.id = this.data.length + 1
        this.data.push(nuevoProducto)
        return nuevoProducto
    }

    getById(id){
        const data = this.data
        const found = data.find(obj => obj.id == id)
        if(found){
            return found
        } else {
            return {error: `No se encuentra el ID ${id}`}
        }
    }
    getAll(){
        return this.data
    }

    modifyById(id, newData){
        const data = this.data
        const found = data.find(obj => obj.id == id)
        if(found){
            const index = data.indexOf(found)
            data[index].title = newData.title
            data[index].price = newData.price
            data[index].thumbnail = newData.thumbnail
            return {message: `Producto con ID ${id} fue modificado exitosamente`}
        } else {
            return {error: `No se encuentra el ID ${id}`}
        }
    }

    deleteById(id){
        const data = this.data
        const found = data.find(obj => obj.id == id)
        if(found){
            const index = data.indexOf(found)
            data.splice(index,1)
            return {message: `Producto con ID ${id} fue eliminado exitosamente`}
        } else {
            return {error: `No se encuentra el ID ${id}`}
        }      
    }
}
module.exports = simplifiedContainer
