const socket = io()
console.log('SOY UN CLIENTE')

const submitProduct = document.getElementById('submitProduct')
const productsTable = document.getElementById('productsTableBody')

submitProduct.addEventListener('click', () => {
    const newProduct = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    }
    if((newProduct.title == '') || (newProduct.price == '') || (newProduct.thumbnail == '')){
        console.log('faltan datos')
    } else {
        socket.emit('addProduct', newProduct)
    }
})

socket.on('refreshList', data3 => {
    const newItem = 
        `<tr>
            <th scope="row">
                ${data3.id}
            </th>
            <td>
                ${data3.title}
            </td>
            <td>
                ${data3.price}
            </td>
            <td><img src=${data3.thumbnail} alt="product image" width="50" height="50"></td>
        </tr>`
    productsTable.innerHTML += newItem
})