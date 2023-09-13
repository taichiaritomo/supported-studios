<template>
  <!-- Header -->
  <header>
    <h1>Supported Studios</h1>
    <nav>
      <ul>
        <li><a href="/suggest">Suggest a studio</a></li>
        <li><a href="https://goo.gl/maps/xUqZaGZJ1xcjhPo76?coh=178572&entry=tt" target="_blank">View the list on Google Maps</a></li>
      </ul>
    </nav>

    <p>Last updated August 14, 2023</p>
    <nav class="filters">
      <div>
        Show studios in
        <select v-model="selectedCountryFilter">
          <option v-for="country in countries" :key="country" :value="country">{{country}}</option>
          <option disabled>(more soon!)</option>
        </select>
      </div>
      <div><button @click="handleClickUseLocation">Sort by nearest studio, using my device's location</button></div>
    </nav>
  </header>
  <!-- Main -->
  <main>
    <PlaceTable :data="filteredData" />
  </main>
  <!-- Footer -->
  <footer>
  </footer>
</template>


<script setup>
import { ref, computed } from 'vue';

const { data, error } = await useFetch('/api/place/all')

const distancesAreVisible = ref(false)

function calculateDistances(originCoordinates) {
  data.value.forEach(placeDetail => {
    if (!placeDetail.latitude || !placeDetail.longitude) {
      placeDetail.calculatedDistance = null
      return
    }
    placeDetail.calculatedDistance = haversineDistanceBetweenPoints(originCoordinates.latitude, originCoordinates.longitude, placeDetail.latitude, placeDetail.longitude)
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
        data.value = data.value.sort((p1, p2) => p1.calculatedDistance - p2.calculatedDistance)
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

const countries = computed(() => {
  const countrySet = Array.from(new Set(data.value?.map(placeDetail => placeDetail.country))).sort()
  // find and remove null from countrySEt
  const nullIndex = countrySet.indexOf(null)
  if (nullIndex > -1) {
    countrySet.splice(nullIndex, 1)
  }
  return ['all countries', ...countrySet]
})

const selectedCountryFilter = ref('all countries')

const filteredData = computed(() => {
  if (!selectedCountryFilter.value || selectedCountryFilter.value === 'all countries') {
    return data.value
  }
  return data.value.filter(placeDetail => placeDetail.country === selectedCountryFilter.value)
})

</script>