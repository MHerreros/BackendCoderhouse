
class User {
    constructor(name, surname){
        this.name = name
        this.surname = surname
        this.books = []
        this.pets = []
    }

    getFullName(){
        return `${this.name} ${this.surname}`
    }

    addPet(pet){
        this.pets.push(pet)
    }

    countPets(){
        return this.pets.length
    }

    addBook(bookName,bookAuthor){
        this.books.push({bookName:bookName, bookAuthor:bookAuthor})
    }

    getBookNames(){
        let bookNamesArray = []
        for(let i = 0; i < this.books.length; i++){
            bookNamesArray[i] = this.books[i].bookName
        }
        return bookNamesArray
    }
}

const user1 = new User (`Matias`, `Herreros`)

user1.addPet('dog')
user1.addPet('cat')
user1.addBook('Tom Sawyer', `Mark Twain`)
user1.addBook('El Nombre de la Rosa', `Umberto Eco`)

console.log(user1.countPets())
console.log(user1.getFullName())
console.log(user1.getBookNames())

console.log(user1)
