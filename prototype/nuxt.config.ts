// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Supported Studios',
      // script: [{src: "/placeDetails.js"}],
      link: [{rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,200,1,0'}],
    }
  },
  css: ['~/assets/css/main.css']
})
