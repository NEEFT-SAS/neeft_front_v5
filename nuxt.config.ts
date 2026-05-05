import { apiBaseUrl } from './config/env'
import { nuxtAuthConfig } from './config/nuxtAuth'
import { nuxtIconConfig } from './config/nuxtIcon'
import { nuxtI18nConfig } from './config/nuxtI18n'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  features: {
    inlineStyles: false
  },

  modules: [
    '@nuxt/icon', '@nuxt/image', '@nuxtjs/i18n', '@pinia/nuxt',
    '@sidebase/nuxt-auth'
  ],

  components: [
    { path: '~/components', pathPrefix: false }
  ],

  css: ['~/assets/scss/main.scss'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl
    }
  },

  auth: nuxtAuthConfig,
  icon: nuxtIconConfig,
  i18n: nuxtI18nConfig
})
