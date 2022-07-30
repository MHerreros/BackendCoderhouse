const calculo = () => {
    let suma = [0,2,5,54,5,11]
    // for (i=0; i<6e9;i++){
    //     suma += i
    // }
    
    return suma
}
const sum = setTimeout( () => {
    let suma = [0,2,5,54,5,11]
    process.send(suma)
    return}
, 10000)
