<template>
  <!-- Header -->
  <div class="limited-width-wrapper">
    <header class="home-header">
      <div class="home-header__left">
        <h1>Supported Studios</h1>
        <p>
          Supported studios is a list of studios that foster and support the artistic practices of artists with disabilities.
        </p>
        <p>
          To see the list on google maps go to: <a href="https://goo.gl/maps/xUqZaGZJ1xcjhPo76?coh=178572&entry=tt" target="_blank">Google Maps Link</a>
        </p>
        <p>
          To add a studio to the list, send your suggestion to <a href="mailto:severinbunse@gmail.com">severinbunse@gmail.com</a>
        </p>
        <div class="home-header__location-options">
          <button @click="handleClickUseLocation">Use my location</button>
          <select v-model="selectedCountryFilter">
            <option value="select-country">Select Country</option>
            <option v-for="country in countries" :key="country" :value="country">{{country}}</option>
            <option disabled>(more soon!)</option>
          </select>
        </div>
      </div>
      <div class="home-header__right">
        <img
          alt="Painting. There's a white sock. A detached pale human foot? A bone is sticking out the detached end. A mint green limb. There are four smiling cat heads floating around the body stuff."
          src="/SupportedStudios_Image.jpg"
        />
      </div>
    </header>
  </div>
  <!-- Main -->
  <main>
    <PlaceTable :data="filteredData" />
  </main>
  <!-- Footer -->
  <footer>
    <div class="limited-width-wrapper">
      <div class="footer__grid">
        <div class="footer__part">
          <address>Contact: severinbunse@gmail.com</address>
          <div>Last Updated: August 18th 2023</div>
        </div>
        <div class="footer__part">
          <div>Programming: Taichi Aritomo</div>
          <div>Accessibility Advisor: Kelli Blacketer</div>
          <div>Design: Severin Bunse</div>
          <div>Special Thanks: Live Yes Studios</div>
        </div>
        <div class="footer__part">
          Funding by:
          <img class="logo" alt="Creative Industries Fund NL" src="/creative-industries-fund_NL.jpg"/>
        </div>
      </div>
    </div>
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
  return countrySet
})

const selectedCountryFilter = ref('select-country')

const filteredData = computed(() => {
  if (!selectedCountryFilter.value || selectedCountryFilter.value === 'select-country') {
    return data.value
  }
  return data.value.filter(placeDetail => placeDetail.country === selectedCountryFilter.value)
})

</script>