<template>
  <!-- Header -->
  <header>
    <h1>Supported Studios</h1>
  </header>
  <!-- Main -->
  <main>
    <p>Last updated August 14, 2023</p>
    <nav class="filters">
      <div>Sort by nearest studio: <button @click="handleClickUseLocation">Use my device's location</button></div>
      <!-- <ul>
        <li></li>
        <li>
          <fieldset>
            <label for="postal-code">Postal Code</label>
            <input type="text" name="postal-code"/>
          </fieldset>
          <fieldset>
            <label for="postal-code">Country</label>
            <input type="text" name="country"/>
          </fieldset>
          <button></button>
        </li>
      </ul> -->
    </nav>
    <table>
      <tr>
        <th>Name</th>
        <th>Country</th>
        <th>City / Locality</th>
        <th v-if="distancesAreVisible" class="distance">Distance</th>
        <th>Website</th>
        <th>Phone number</th>
        <th>Status</th>
        <th>Wheelchair Accessible Entrance</th>
      </tr>
      <tr v-for="(placeDetail, placeIndex) in placeDetails" :key="placeIndex">
        <!-- <td><img v-if="placeDetail.photos?.length" :src="`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${placeDetail.photos[0].photo_reference}`"/></td> -->
        <td class="name"><a :href="placeDetail.google_maps_url" target="_blank">{{ placeDetail.name }}</a></td>
        <td class="country">{{ placeDetail.address_components.find(address_component => address_component.types?.includes('country'))?.long_name }}</td>
        <td class="locality">{{ getLocality(placeDetail) }}</td>
        <td class="distance" v-if="distancesAreVisible">{{ formatDistance(placeDetail.calculatedDistance) }}</td>
        <td class="website"><a v-if="placeDetail.website" :href="placeDetail.website" target="_blank">Website</a></td>
        <td class="phone"><a v-if="placeDetail.formatted_phone_number" :href="`tel:${placeDetail.formatted_phone_number}`" target="_blank">{{ placeDetail.formatted_phone_number }}</a></td>
        <td class="status"><span v-html="formatBusinessStatus(placeDetail.business_status)"></span></td>
        <td class="accessibility">{{ placeDetail.wheelchair_accessible_entrance ? 'Yes' : '' }}</td>
      </tr>
    </table>
  </main>
  <!-- Footer -->
  <footer>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
const placeDetails = ref(placeDetailsData)
// const sortedPlaceDetails = ref(placeDetailsData)
const distancesAreVisible = ref(false)
function getLocality(placeDetail) {
  return placeDetail.address_components.find(address_component => address_component.types?.includes('locality') || address_component.types?.includes('postal_town') || address_component.types?.includes('sublocality'))?.long_name
}
function calculateDistances(originCoordinates) {
  placeDetails.value.forEach(placeDetail => {
    if (!placeDetail?.geometry?.location?.lat || !placeDetail?.geometry?.location?.lng) {
      placeDetail.calculatedDistance = null
      return
    }
    placeDetail.calculatedDistance = haversineDistanceBetweenPoints(originCoordinates.latitude, originCoordinates.longitude, placeDetail.geometry.location.lat, placeDetail.geometry.location.lng)
  })
}
function getGeolocationPosition() {
  return new Promise((resolve, reject) => 
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
}
function handleClickUseLocation() {
  getGeolocationPosition()
    .then((position) => {
      console.log(position)
      if (position?.coords?.latitude && position?.coords?.longitude) {
        calculateDistances({latitude: position.coords.latitude, longitude: position.coords.longitude})
        distancesAreVisible.value = true
        placeDetails.value = placeDetails.value.sort((p1, p2) => p1.calculatedDistance - p2.calculatedDistance)
      } else {
        throw new Error("Geolocation was missing latitude and longitude")
      }
    })
    .catch((error) => {
      console.error(error)
    })
}
function haversineDistanceBetweenPoints(lat1, lon1, lat2, lon2) {
  const R = 6371; //km
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const deltaLon = lon2 - lon1;
  const deltaLambda = (deltaLon * Math.PI) / 180;
  const d = Math.acos(
    Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda),
  ) * R;
  return d;
}
function formatDistance(distance) {
  return Math.round(distance) + ' km'
}
function formatBusinessStatus(status) {
  if (status === "OPERATIONAL") {
    return "&#128994;&nbsp;Operating"
  } else if (status === "CLOSED_TEMPORARILY") {
    return "&#9940;&nbsp;Temporarily Closed"
  } else if (status === "CLOSED_PERMANENTLY") {
    return "&#9940;&nbsp;Permanently Closed"
  } else {
    return status
  }
}
</script>