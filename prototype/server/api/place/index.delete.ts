import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log(body)
  const deletePlace = await prisma.place.delete({
    where: {
      place_id: body.placeId
    }
  })
  return deletePlace
})