const socket = io()
// Libreria Query String que disponibilizamos desde CHAT.EJS
// **Le indico que parsee lo que esta en la URL accediendo a 'window' que esta en el DOM
const {username} = Qs.parse(window.location.search, {
    ignoreQueryPrefix: true     // Ignora el prefigo '?' presente en la URL
})

const spanServerMessage = document.getElementById('serverNotification') // Agarro elemento del HTML para editarlo

socket.emit('joinChat', {username})

// Handler para cuando se recibe una notificacion
socket.on('notification', data => {
    console.log(data)
    spanServerMessage.innerHTML =data
})