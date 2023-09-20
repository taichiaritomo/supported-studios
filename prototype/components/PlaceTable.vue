<template>
  <div>
    <table>
      <thead>
        <tr class="table-header-row">
          <th>Name</th>
          <th>Location</th>
          <th>Links</th>
          <th>Phone number</th>
          <th>Status</th>
          <th class="accessibility">Wheelchair Accessible Entrance</th>
          <th v-if="isKitchenMode"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(placeDetail, placeIndex) in data" :key="placeDetail.place_id">
          <td class="name">{{ placeDetail.name }}</td>
          <td class="location">{{ placeDetail.location }}</td>
          <td class="website">
            <ul>
              <li>
                <a v-if="placeDetail.website_url" :href="placeDetail.website_url" target="_blank">Website</a>
              </li>
              <li>
                <a v-if="placeDetail.google_maps_url" :href="placeDetail.google_maps_url" target="_blank">Google Maps</a>
              </li>
              <li v-for="link in getLinks(placeDetail)">
                <a :href="link.url" target="_blank">{{ link.text }}</a>
                <button v-if="isKitchenMode" class="link-delete-button" @click.prevent="handleDeleteLink(placeDetail, link.text, link.url)">✕</button>
              </li>
            </ul>
            <div v-if="isKitchenMode">
              <button v-if="placeIndexWithAddLinkFormOpen !== placeIndex" @click="placeIndexWithAddLinkFormOpen = placeIndex; linkText = ''; linkUrl = '';">Add a link</button>
              <div v-else class="kitchen-add-link-form">
                <input type="text" placeholder="Link Text" v-model="linkText" required/>
                <input type="url" placeholder="Link URL" v-model="linkUrl" required/>
                <button @click="handleAddLink(placeDetail)">Add</button>
              </div>
            </div>
          </td>
          <td class="phone">{{ placeDetail.phone_number }}</td>
          <td class="status"><span v-html="formatBusinessStatus(placeDetail.status)"></span></td>
          <td class="accessibility">{{ placeDetail.wheelchair_access ? 'Yes' : '' }}</td>
          <td v-if="isKitchenMode"><button @click="$emit('deleteStudio', placeDetail.place_id )">Delete</button></td>
        </tr>
      </tbody>
    </table>
  </div>
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
    return "&#128994;&nbsp;Operating"
  } else if (status === "CLOSED_TEMPORARILY") {
    return "&#9940;&nbsp;Temporarily Closed"
  } else if (status === "CLOSED_PERMANENTLY") {
    return "&#9940;&nbsp;Permanently Closed"
  } else {
    return status
  }
}

const placeIndexWithAddLinkFormOpen = ref(-1)
const linkText = ref('')
const linkUrl = ref('')

const emit = defineEmits(['updateData'])

const getLinks = (placeDetail) => {
  const links = []
  placeDetail.links.forEach((text, index) => {
    if (index % 2 === 0) {
      links.push({text, url: placeDetail.links[index + 1]})
    }
  })
  return links
}

const handleAddLink = async(placeDetail) => {
  const { data } = await useFetch('/api/place/links', {
    method: 'PUT',
    body: {
      placeId: placeDetail.place_id,
      links: [...placeDetail.links, linkText.value, linkUrl.value]
    }
  })
  placeIndexWithAddLinkFormOpen.value = -1
  emit('updateData')
}

const handleDeleteLink = async(placeDetail, linkText, linkUrl) => {
  console.log('hi')
  // find consecutive occurrence of linkText and linkUrl in placeDetail.links array of strings
  const linkIndex = placeDetail.links.findIndex((link, index) => {
    return index % 2 === 0 && link === linkText && placeDetail.links[index + 1] === linkUrl
  })
  // remove the consecutive occurrence of linkText and linkUrl from placeDetail.links array of strings
  const links = [...placeDetail.links]
  links.splice(linkIndex, 2)
  console.log(links)
  const { data } = await useFetch('/api/place/links', {
    method: 'PUT',
    body: {
      placeId: placeDetail.place_id,
      links
    }
  })
  console.log(data)
}
</script>