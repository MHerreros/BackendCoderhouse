import { Router } from './dependencies.ts'
import { getColorsArray, setNewColor } from './controllers.ts'

export const router = new Router()
    .get('/colors', getColorsArray)
    .post('/colors', setNewColor)