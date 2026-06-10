import { initializeApp, getApp, getApps } from 'firebase/app'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const publicConfig = runtimeConfig.public as Record<string, string | undefined>

  const firebaseConfig = {
    apiKey: publicConfig.firebaseApiKey,
    authDomain: publicConfig.firebaseAuthDomain,
    projectId: publicConfig.firebaseProjectId,
    storageBucket: publicConfig.firebaseStorageBucket,
    messagingSenderId: publicConfig.firebaseMessagingSenderId,
    appId: publicConfig.firebaseAppId
  }

  const hasMissingConfig = Object.values(firebaseConfig).some(value => !String(value ?? ''))

  if (hasMissingConfig) {
    console.warn('[firebase] Missing NUXT_PUBLIC_FIREBASE_* env vars. Firebase storage is disabled.')
    nuxtApp.provide('fireStorage', null as FirebaseStorage | null)
    return
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  const storage = getStorage(app)
  nuxtApp.provide('fireStorage', storage)
})
