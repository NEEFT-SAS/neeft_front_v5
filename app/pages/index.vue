<template>
  <div class="landing-home" aria-labelledby="landing-home-title">
    <HomeHeroSection />
    <HomeProcessSection />
    <HomeFeaturesSection />
    <HomeLaunchSection />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'landing'
})
</script>