// Funcion Mostrar Letras. Recibe String y muestra 1 caracter cada 1 seg. 
// Al finalizar invocar a const fin = () => cnosole.log(`termine`). 
// Realizar 3 llamasdas a mostrar letras con demoras de 700, 1500 y 2000 ms)

// const word = `palabra`
// console.log(word)
// console.log(word.length)
// console.log(word[1])


// const mostrarLetras = (palabra) => {
//     for(let i = 0; i < palabra.length;i++){
//         console.log(palabra[i])
//     }
// }
// mostrarLetras(`hola`)
// setTimeout(mostrarLetras(`hola`),700)

const fin = () => console.log(`termine`)
const mostrarLetras = (palabra, fin) => {
    let i = 0
    const delay = setInterval(() => {
        if(i == palabra.length){
            fin()
            clearInterval(delay)
        } else {
            console.log(palabra[i])
            i++
        }
    }, 1000)
}

setTimeout(() => mostrarLetras(`HOLA`, fin),700)
setTimeout(() => mostrarLetras(`hola`, fin),1500)
setTimeout(() => mostrarLetras(`chau`, fin),2000)