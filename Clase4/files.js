const fs = require(`fs`)
// fs.readFileSync
// fs.writeFileSync
// fs.appendFileSync
// fs.unlinkSync
// fs.mkdirSync

try {
    const fecha = Date ()
    // console.log(fecha)
    fs.writeFileSync(`./fyh.txt`,fecha)
} catch (err){
    console.error(err.message)
}

try {
    const data = fs.readFileSync(`./fyh.txt`, `utf-8`)
    console.log(data)
} catch (err){
    console.error(err.message)
}