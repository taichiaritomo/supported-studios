import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const places = await prisma.place.findMany({
    orderBy: {
      created_at: 'asc'
    }
  })
  places.forEach(place => {
    if (place.links?.length) {
      place.links = JSON.parse(place.links || '')
    }
  })
  return places
})