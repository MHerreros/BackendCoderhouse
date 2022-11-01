const submitLogin = document.getElementById('submitLogin')
window.localStorage.setItem('userEmail', '')

submitLogin.addEventListener('click', (event) => {
    // event.preventDefault()
    const userEmail = document.getElementById('userInput').value
    window.localStorage.setItem('userEmail', userEmail)
})
