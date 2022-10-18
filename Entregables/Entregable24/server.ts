import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { router } from './router.ts'

const app = new Application()
app.use(router.routes())

const PORT:number = Number(Deno.env.get("PORT")) || 8080

await app.listen({port: PORT})
console.log(`Servidor Deno escuchando en el puerto ${PORT}`)
