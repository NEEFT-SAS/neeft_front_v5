<template>
  <div class="landing-layout">
    <LandingHeader 
      :nav-items="landingHeaderNav" 
      :action-items="landingHeaderActions" 
    />
    <main class="landing-layout__main">
      <slot />
    </main>
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import { landingHeaderNav, landingHeaderActions } from '~/datas/navigations/headers/landing'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  htmlAttrs: {
    lang: 'fr',
    class: 'font-ui',
    'data-theme': 'landing'
  }
})
</script>
