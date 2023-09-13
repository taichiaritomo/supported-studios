import { PrismaClient } from "@prisma/client"
import { getPlaceDetail, getFormattedPlaceData } from "@/script/getPlaceDetail.js";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const placeId = body.placeId
  if (!placeId) throw new Error('Missing placeId')
  const apiKey = process.env.MAPS_API_KEY
  const placeData = await getPlaceDetail(placeId, apiKey)
  const data = getFormattedPlaceData(placeData)
  const places = await prisma.place.create({ data })
  return places
})