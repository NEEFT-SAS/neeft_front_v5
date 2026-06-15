<template>
  <div class="landing-layout">
    <LandingHeader 
      :nav-items="config.menus.landing.header.nav" 
      :action-items="config.menus.landing.header.actions" 
    />
    <main class="landing-layout__main">
      <slot />
    </main>
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
const config = useConfig()

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
