<template>
  <div class="kitchen-room">
    <nav class="kitchen-nav">
      <button @click="handleAdd">Add a studio</button>
    </nav>

    <div v-if="isAddingSupportedStudio" class="kitchen-add">
      <div class="kitchen-add-header">
        <h2>Add a studio</h2>
        <button @click="isAddingSupportedStudio = false">Done</button>
      </div>
      <div>
        <label for="query">Search for a place with its name and/or address</label>
      </div>
      <div class="kitchen-add-form">
        <input type="text" v-model="mapsSearchQuery" placeholder="" name="query"/>
        <button @click="handleSearchMaps">Search Google Maps</button>
      </div>

      <div v-if="mapsSearchCandidates.length">
        <h3>Results</h3>
        <ol>
          <li v-for="candidate in mapsSearchCandidates" :key="candidate.place_id">
            <p>{{ candidate.name }}</p>
            <p>{{ candidate.formatted_address }}</p>
            <button @click="handleAddStudio(candidate.place_id)">Add this studio</button>
          </li>
        </ol>
      </div>
    </div>

    <div class="kitchen-table">
      <div class="kitchen-table-header">
        <p>The database will update from Google Maps data every day.</p>
      </div>
      <PlaceTable :data="data" :is-kitchen-mode="true" @deleteStudio="handleDeleteStudio"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const isAddingSupportedStudio = ref(false)
const handleAdd = () => {
  isAddingSupportedStudio.value = true
}
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
}

const handleDeleteStudio = async(placeId) => {
  console.log(placeId)
  const { data } = await useFetch('/api/place', {
    method: 'DELETE',
    body: { placeId }
  })
  console.log(data)
}

const { data } = await useFetch('/api/place/all')
</script>