// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Supported Studios',
      // script: [{src: "/placeDetails.js"}],
    }
  },
  css: ['~/assets/css/main.css']
})
