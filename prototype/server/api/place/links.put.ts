import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const placeId = body.placeId
  const links = body.links
  if (!placeId) throw new Error('Missing placeId')
  if (!links) throw new Error('Missing links')
  const places = await prisma.place.update({
    where: {
      place_id: placeId
    },
    data: {
      links: JSON.stringify(links)
    }
  })
  return places
})