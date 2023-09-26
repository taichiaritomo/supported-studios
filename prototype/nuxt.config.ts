// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Supported Studios',
      // script: [{src: "/placeDetails.js"}],
      link: [
        {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,200,1,0'},
        {rel: 'apple-touch-icon', sizes: "180x180", href: '/apple-touch-icon.png'},
        {rel: 'icon', type: 'image/png', href: '/favicon.ico'},
        {rel: 'icon', type: 'image/png', sizes: "32x32", href: '/favicon-32x32.png'},
        {rel: 'icon', type: 'image/png', sizes: "16x16", href: '/favicon-16x16.png'},
        {rel: 'manifest', href: '/site.webmanifest'},
      ],
    }
  },
  css: ['~/assets/css/main.css']
})
