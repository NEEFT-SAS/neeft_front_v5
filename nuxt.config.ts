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
      apiBaseUrl,
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '',
      stripePublishableKey: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY || ''
    }
  },

  auth: nuxtAuthConfig,
  icon: nuxtIconConfig,
  i18n: nuxtI18nConfig
})
