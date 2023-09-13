// Google Maps Places API
// https://developers.google.com/maps/documentation/places/web-service/overview
export async function getPlaceDetail(placeId, apiKey = process.env.MAPS_API_KEY) {
  const fields = "name,rating,international_phone_number,formatted_address,website,opening_hours,geometry,address_components,business_status,photo,wheelchair_accessible_entrance";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`
  const response = await fetch(url);
  const placeDetail = await response.json();
  return { ...placeDetail.result, placeId, google_maps_url: getGoogleMapsUrl(placeId),date_retrieved: new Date() }
}

function getGoogleMapsUrl(placeId) {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`
}

const getCountry = (addressComponents) => {
  return addressComponents.find(addressComponent => addressComponent.types?.includes('country'))?.long_name || null
}

const getFormattedLocation = (addressComponents) => {
  const locality = addressComponents.find(addressComponent => addressComponent.types?.includes('locality') || addressComponent.types?.includes('postal_town') || addressComponent.types?.includes('sublocality'))?.long_name
  const administrativeArea = addressComponents.find(addressComponent => addressComponent.types?.includes('administrative_area_level_1'))?.long_name
  const country = getCountry(addressComponents)

  const locationElements = []
  if (locality) locationElements.push(locality)
  if (administrativeArea && administrativeArea !== locality) locationElements.push(administrativeArea)
  if (country) locationElements.push(country)
  return locationElements.join(', ')
}

export function getFormattedPlaceData(placeData) {
  return {
    place_id: placeData.placeId,
    name: placeData.name,
    location: getFormattedLocation(placeData.address_components),
    country: getCountry(placeData.address_components),
    google_maps_url: placeData.google_maps_url,
    website_url: placeData.website,
    phone_number: placeData.international_phone_number,
    status: placeData.business_status,
    wheelchair_access: placeData.wheelchair_accessible_entrance,
    latitude: placeData.geometry?.location?.lat,
    longitude: placeData.geometry?.location?.lng
  }
}