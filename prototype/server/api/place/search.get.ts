import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const textQuery = query.query
  if (!textQuery) throw new Error('Missing query')
  const apiKey = process.env.MAPS_API_KEY
  const response = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=place_id%2Cformatted_address%2Cname&input=${textQuery}&inputtype=textquery&key=${apiKey}`)
  const data = await response.json()
  return data
})