import { Context } from './dependencies.ts'
const colors: Array<string> = []

export const setNewColor = async (ctx: Context) => {
  colors.push(await ctx.request.body().value)
  ctx.response.body = colors
}

export const getColorsArray = (ctx: Context) => {
    ctx.response.body = colors
    ctx.response.status = 200
}