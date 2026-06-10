import type { FirebaseStorage } from 'firebase/storage'

declare module '#app' {
  interface NuxtApp {
    $fireStorage: FirebaseStorage | null
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $fireStorage: FirebaseStorage | null
  }
}

export {}
