// import admin from 'firebase-admin'
// import serviceAccount from './config.json'

const admin = require('firebase-admin')
const serviceAccount = require('./config')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://entrega2-proyectofinal.firebaseio.com'
});


// export default query

module.exports = class ContenedorFirebase {
  constructor(collection) {
    console.log("Conectado a DB: Firebase")
    this.db = admin.firestore()
    this.query = this.db.collection(collection)
  }

  async save(item) {
    try {
      const guardado = await this.query.add(item)
      return { ...item, id: guardado.id }
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`)
    }
  }

  async getAll() {
    try {
      const result = []
      const snapshot = await this.query.get()
      snapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() })
      })
      return result
    } catch (error) {
      throw new Error(`Error al listar todo: ${error}`)
    }
  }

  async getById(id) {
    try {
      const doc = await this.query.doc(id).get()
      if (!doc.exists) {
        throw new Error(`Error al listar por id: no se encontró`)
      } else {
        const data = doc.data()
        return { ...data, id }
      }
    } catch (error) {
      throw new Error(`Error al listar por id: ${error}`)
    }
  }

  async deleteById(id) {
    try {
      const doc = this.query.doc(id);
      const item = await doc.delete()
      console.log("el usuario a sido borrado exitosamente", item)
    } catch (e) {
      console.log(e)
    }
  }
}