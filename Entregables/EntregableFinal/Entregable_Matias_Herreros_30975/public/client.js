const socket = io()

const submitMessage = document.getElementById('submitMessage')
const messageTable = document.getElementById('messageTableBody')

const avatarSource = "../static/icons/generic_avatar.png"

submitMessage.addEventListener('click', (event) => {
    event.preventDefault()
    const newMessage = {
        message: document.getElementById('messageInput').value,
        user: window.localStorage.getItem('userEmail')
    }   
        document.getElementById('messageInput').value = ''
        socket.emit('addMessage', newMessage) 
})

socket.on('refreshMessages', (messageCont)  => {

    const newItem = 
        `<tr>
            <th scope="row" style="color:blue">
                ${messageCont.user}
            </th>
            <td>
                ${messageCont.message}
            </td>
        </tr>`
    messageTable.innerHTML += newItem
})