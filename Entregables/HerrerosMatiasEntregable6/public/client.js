const socket = io()
console.log('SOY UN CLIENTE')

const submitProduct = document.getElementById('submitProduct')
const productsTable = document.getElementById('productsTableBody')

const submitMessage = document.getElementById('submitMessage')
const messageTable = document.getElementById('messageTableBody')


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

submitMessage.addEventListener('click', () => {
    const newMessage = {
        mail: document.getElementById('emailInput').value,
        timestamp: new Date(),
        message: document.getElementById('messageInput').value
    }
    if((newMessage.mail == '') || (newMessage.message == '')){
        console.log('faltan datos')
    } else {
        document.getElementById('messageInput').value = ''
        socket.emit('addMessage', newMessage)
    }
})

socket.on('refreshMessages', messageCont => {
    const newItem = 
        `<tr>
            <th scope="row" style="color:blue">
                ${messageCont.mail}
            </th>
            <td>
                ${messageCont.timestamp}
            </td>
            <td>
                ${messageCont.message}
            </td>
        </tr>`
    messageTable.innerHTML += newItem
})