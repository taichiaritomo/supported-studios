import { PrismaClient } from "@prisma/client";
import { placeDetailsData } from "../../prototype/public/placeDetails.js"
import { getFormattedPlaceData } from "./getPlaceDetail.js";

console.log(placeDetailsData.length, ' places')

const prisma = new PrismaClient();
console.log('Prisma Client loaded')

async function main() {
  await prisma.place.deleteMany()
  for (let i = 0; i < placeDetailsData.length; i++) {
    const placeData = placeDetailsData[i]
    const data = getFormattedPlaceData(placeData)
    const place = await prisma.place.create({ data })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })