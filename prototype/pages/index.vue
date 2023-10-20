<template>
  <!-- Header -->
  <div class="limited-width-wrapper">
    <header>
      <div class="grid grid-cols-2 gap-2 mt-4 items-center">
        <div class="col-span-2 md:col-span-1">
          <div class="bg-light-blue p-4 rounded-md relative">
            <div class="bg-light-blue w-8 h-8 absolute -z-10 left-1/2 top-full md:top-1/2 md:left-full -translate-x-1/2 -translate-y-1/2 rotate-[45deg]"></div>
            <h1 class="font-bold">Supported Studios</h1>
            <p class="my-4">
              Supported studios is a list of studios that foster and support the artistic practices of artists with disabilities.
            </p>
            <p class="my-4">
              To see the list on google maps go to: <a href="https://goo.gl/maps/xUqZaGZJ1xcjhPo76?coh=178572&entry=tt" target="_blank">Google Maps Link</a>
            </p>
            <p>
              To add a studio to the list, send your suggestion to <a href="mailto:severinbunse@gmail.com">severinbunse@gmail.com</a>
            </p>
          </div>
        </div>
        <div class="h-[90vw] max-h-[420px] col-span-2 md:col-span-1 overflow-hidden">
          <Globe :coordinates="coordinates" />
        </div>
      </div>
      <div class="home-header__location-options grid grid-cols-2 gap-2 my-6">
        <button @click="handleClickUseLocation" class="col-span-2 md:col-span-1 h-8">Use my location</button>
        <select v-model="selectedCountryFilter" class="col-span-2 md:col-span-1 h-8 text-center">
          <option value="select-country">Select country ▼</option>
          <option v-for="country in countries" :key="country" :value="country">{{country}}</option>
          <option disabled>(more soon!)</option>
        </select>
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
      <div class="grid grid-cols-2 gap-4">
        <!-- <div class="footer__part">
          <address>Contact: severinbunse@gmail.com</address>
          <div>Last Updated: August 18th 2023</div>
        </div> -->
        <div class="col-span-2 md:col-span-1">
          <div>Programming: Taichi Aritomo</div>
          <div>Accessibility Advisor: Kelli Blacketer</div>
          <div>Design: Severin Bunse</div>
          <div>Special Thanks: Live Yes Studios</div>
        </div>
        <div class="col-span-2 md:col-span-1">
          Funding:
          <img class="logo" alt="Creative Industries Fund NL" src="/creative-industries-fund_NL.jpg"/>
          <br>
          <div>
            Contact: <a href="mailto:severinbunse@gmail.com">severinbunse@gmail.com</a>
          </div>
          <div>
            Last Updated: {{ lastUpdatedDate.toLocaleDateString() }}
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>


<script setup>
import { ref, computed } from 'vue';

useHead({
  script: [
    { src: '/js/three.min.js', body: true },
    { src: '/js/Detector.js', body: true },
    { src: '/js/TrackballControls.js', body: true },
    // { src: '/js/earth.js', body: true },
  ]
})

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
      console.error(error);
      alert("Sorry, geolocation is not available on your device.")
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

const coordinates = computed(() => {
  return data.value.map(placeDetail => {
    return {
      latitude: placeDetail.latitude,
      longitude: placeDetail.longitude,
      status: placeDetail.business_status,
    }
  })
})

const selectedCountryFilter = ref('select-country')

const filteredData = computed(() => {
  if (!selectedCountryFilter.value || selectedCountryFilter.value === 'select-country') {
    return data.value
  }
  return data.value.filter(placeDetail => placeDetail.country === selectedCountryFilter.value)
})

const lastUpdatedDate = computed(() => {
  return data.value.reduce((latestDate, placeDetail) => {
    const date = new Date(placeDetail.created_at)
    if (date > latestDate) {
      return date
    }
    return latestDate
  }, new Date(0))
})

</script>