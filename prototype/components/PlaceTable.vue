<template>
  <table>
    <thead>
      <tr class="table-header-row">
        <th class="name">Studio</th>
        <th class="location">Location</th>
        <th class="website">Contact</th>
        <th class="accessibility">Entrance</th>
        <th class="status">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(placeDetail, placeIndex) in data" :key="placeDetail.place_id">
        <td class="name">
          <a v-if="placeDetail.google_maps_url" :href="placeDetail.google_maps_url" target="_blank">{{ placeDetail.name }}</a>
          <span v-else>{{ placeDetail.name }}</span>
        </td>
        <td class="location">{{ placeDetail.location }}</td>
        <td class="website">
          <ul>
            <li>
              <a v-if="placeDetail.website_url" :href="placeDetail.website_url" target="_blank">Website</a>
            </li>
            <li v-for="(link, linkIndex) in placeDetail.links" :key="linkIndex">
              <a :href="link.url" target="_blank">{{ link.text }}</a>
              <button v-if="isKitchenMode" class="link-delete-button" @click.prevent="handleDeleteLink(placeDetail, linkIndex)">✕</button>
            </li>
            <li v-if="placeDetail.phone_number">
              {{ placeDetail.phone_number }}
            </li>
          </ul>
          <div v-if="isKitchenMode">
            <button v-if="placeIndexWithAddLinkFormOpen !== placeIndex" @click="placeIndexWithAddLinkFormOpen = placeIndex; linkText = ''; linkUrl = '';">Add a link</button>
            <div v-else class="kitchen-add-link-form">
              <input type="text" placeholder="Link Text" v-model="linkText" required/>
              <input type="url" placeholder="Link URL" v-model="linkUrl" required/>
              <button @click="handleAddLink(placeDetail)">Add</button>
              <button @click="placeIndexWithAddLinkFormOpen = -1" class="kitchen-add-link-nevermind">Nevermind</button>
            </div>
          </div>
        </td>
        <td class="accessibility">
          {{ placeDetail.wheelchair_access ? 'Wheelchair Accessible' : '' }}
        </td>
        <td class="status">
          <span :class="placeDetail.status === 'OPERATIONAL' ? 'text-green' : 'text-red'">{{ formatBusinessStatus(placeDetail.status) }}</span>
          <button v-if="isKitchenMode" @click="$emit('deleteStudio', placeDetail.place_id )" class="kitchen-delete-button">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  isKitchenMode: {
    type: Boolean,
    default: false,
  }
})

function formatBusinessStatus(status) {
  if (status === "OPERATIONAL") {
    return "Operating"
  } else if (status === "CLOSED_TEMPORARILY") {
    return "Temporarily Closed"
  } else if (status === "CLOSED_PERMANENTLY") {
    return "Permanently Closed"
  } else {
    return status
  }
}

const placeIndexWithAddLinkFormOpen = ref(-1)
const linkText = ref('')
const linkUrl = ref('')

const emit = defineEmits(['updatePlace', 'deleteStudio'])

const handleAddLink = async(placeDetail) => {
  const { data } = await useFetch('/api/place/links', {
    method: 'PUT',
    body: {
      placeId: placeDetail.place_id,
      links: [...(placeDetail.links || []), {text: linkText.value.trim(), url: linkUrl.value.trim()}]
    }
  })
  placeIndexWithAddLinkFormOpen.value = -1
  emit('updatePlace', data.value)
}

const handleDeleteLink = async(placeDetail, linkIndex) => {
  const links = [...placeDetail.links]
  links.splice(linkIndex, 1)
  const { data } = await useFetch('/api/place/links', {
    method: 'PUT',
    body: {
      placeId: placeDetail.place_id,
      links
    }
  })
  emit('updatePlace', data.value)
}
</script>