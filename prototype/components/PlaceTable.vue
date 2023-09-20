<template>
  <table>
    <thead>
      <tr class="table-header-row">
        <th class="name"><span aria-label="dot symbol">●</span> Studio</th>
        <th class="location"><span class="material-symbols-outlined" aria-label="pin symbol">location_on</span> Location</th>
        <th class="website"><span class="material-symbols-outlined" aria-label="portrait card symbol">perm_contact_calendar</span> Contact</th>
        <th class="accessibility"><span class="material-symbols-outlined" aria-label="wheelchair symbol">accessible_forward</span> Accessible Entrance</th>
        <th class="status"><span class="material-symbols-outlined" aria-label="door symbol">door_open</span> Status</th>
        <th v-if="isKitchenMode"></th>
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
            <li v-for="link in getLinks(placeDetail)">
              <a :href="link.url" target="_blank">{{ link.text }}</a>
              <button v-if="isKitchenMode" class="link-delete-button" @click.prevent="handleDeleteLink(placeDetail, link.text, link.url)">✕</button>
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
            </div>
          </div>
        </td>
        <td class="accessibility">
          <span v-if="placeDetail.wheelchair_access" class="material-symbols-outlined" aria-label="wheelchair symbol">accessible_forward</span>
          {{ placeDetail.wheelchair_access ? 'Yes' : '' }}
        </td>
        <td class="status"><span v-html="formatBusinessStatus(placeDetail.status)"></span></td>
        <td v-if="isKitchenMode"><button @click="$emit('deleteStudio', placeDetail.place_id )">Delete</button></td>
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
    return "<span style='color: #00ff00'>●</span>&nbsp;Operating"
  } else if (status === "CLOSED_TEMPORARILY") {
    return "<span style='color: #ff0000'>●</span>&nbsp;Closed"
  } else if (status === "CLOSED_PERMANENTLY") {
    return "<span style='color: #ff0000'>●</span>&nbsp;Closed"
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