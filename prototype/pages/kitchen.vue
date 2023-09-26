<template>
  <div class="kitchen-room">
    <nav class="kitchen-nav">
      <button @click="isAddingSupportedStudio = !isAddingSupportedStudio">
        {{ isAddingSupportedStudio ? "I'm done" : "Add a studio" }}
      </button>
    </nav>

    <div v-if="isAddingSupportedStudio" class="kitchen-add">
      <div class="kitchen-add-header">
        <h2>Add a studio</h2>
      </div>
      <div>
        <label for="query">Search for a place with its name and/or address</label>
      </div>
      <form class="kitchen-add-form" onsubmit="return false">
        <input type="text" v-model="mapsSearchQuery" placeholder="" name="query"/>
        <button type="submit" @click="handleSearchMaps">Search Google Maps</button>
      </form>

      <div v-if="mapsSearchCandidates.length">
        <h3>Results</h3>
        <ol>
          <li v-for="candidate in mapsSearchCandidates" :key="candidate.place_id">
            <p>{{ candidate.name }}</p>
            <p>{{ candidate.formatted_address }}</p>
            <button v-if="isAdded(candidate.place_id)" disabled>Added</button>
            <button v-else @click="handleAddStudio(candidate.place_id)">Add this studio</button>
          </li>
        </ol>
      </div>
    </div>

    <div class="kitchen-table">
      <div class="kitchen-table-header">
        <p>Hi. Welcome to the Supported Studios kitchen. Here, you can add or delete new places, and links for them.</p>
        <p>Just so you know, if you add places to the Google Maps list, it won't show up here. But if you add a place here, the kitchen
          will check Google Maps every day to make sure the name, location, contact info, and status is up to date.</p>
      </div>
      <PlaceTable :data="places" :is-kitchen-mode="true" @deleteStudio="handleDeleteStudio" @update-place="handleUpdatePlace"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const isAddingSupportedStudio = ref(false)
const mapsSearchQuery = ref('')
const mapsSearchCandidates = ref([])
const handleSearchMaps = async () => {
  const { data } = await useFetch('/api/place/search?query=' + mapsSearchQuery.value)
  console.log(data)
  if (data.value.candidates.length === 0) {
    alert('No results found.')
    return
  }
  mapsSearchCandidates.value = data.value.candidates
}

const handleAddStudio = async (placeId) => {
  const { data } = await useFetch('/api/place', {
    method: 'POST',
    body: { placeId }
  })
  console.log(data)
  places.value.push(data.value)
}

const handleDeleteStudio = async(placeId) => {
  console.log(placeId)
  if (!confirm("Just making sure you didn't click this by mistake. Are you sure you want to delete this studio?")) {
    return
  }
  const { data } = await useFetch('/api/place', {
    method: 'DELETE',
    body: { placeId }
  })
  console.log(data)
}

const handleUpdatePlace = async(placeData) => {
  console.log(placeData)
  console.log(places.value)
  placeData.links = JSON.parse(placeData.links || '[]')
  const placeIndex = places.value.findIndex(place => place.place_id === placeData.place_id)
  places.value.splice(placeIndex, 1, placeData)
}

const isAdded = (placeId) => {
  return places.value.findIndex(place => place.place_id === placeId) > -1
}

const { data } = await useFetch('/api/place/all')
const places = ref(data.value)
</script>