import fs from 'fs'
import { parse } from 'csv-parse';
import dotenv from 'dotenv'
dotenv.config()
const MAPS_API_KEY = process.env.MAPS_API_KEY;
const PATH_TO_DATA = './data/input/place_IDs_0809.csv'

// Parse CSV
// https://csv.js.org/parse/api/stream/
const parser = parse({
  columns: true,
  delimiter: ',',
}, parserCallback);
fs.createReadStream(PATH_TO_DATA).pipe(parser);
async function parserCallback(error, data) {
  if (error) {
    console.error(error)
    return
  }
  const placeDetails = []
  const placeIds = data.map(row => row.place_id)
  for (let i = 0; i < placeIds.length; i++) {
    const placeId = placeIds[i]
    const placeDetail = await getPlaceDetail(placeId)
    placeDetails.push({...placeDetail, placeId})
    console.log(`Retrieved data for ${placeDetail.name}`)
  }
  const jsonOutput = JSON.stringify(placeDetails, null, 2)
  const jsonPath = './data/output/placeDetails.json'
  fs.writeFile(jsonPath, jsonOutput, 'utf8', (err) => {
    if (err) throw err;
    console.log(`Place details have been saved to ${jsonPath}!`);
  });

  const jsOutput = 'const placeDetailsData = ' + jsonOutput
  const jsPath = './../prototype/public/placeDetails.js'
  fs.writeFile(jsPath, jsOutput, 'utf8', (err) => {
    if (err) throw err;
    console.log(`Place details have been saved to ${jsPath}!`);
  });
}

// Google Maps Places API
// https://developers.google.com/maps/documentation/places/web-service/overview
async function getPlaceDetail(placeId) {
  const fields = "name,rating,formatted_phone_number,formatted_address,website,opening_hours,geometry,address_components,business_status,photo,wheelchair_accessible_entrance";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${MAPS_API_KEY}`
  const response = await fetch(url);
  const placeDetail = await response.json();
  return { ...placeDetail.result, google_maps_url: getGoogleMapsUrl(placeId),date_retrieved: new Date() }
}

function getGoogleMapsUrl(placeId) {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`
}
