<template>
  <nav class="landing-footer-social">
    <a v-for="item in items" :key="item.href" :href="item.href" :aria-label="item.label" target="_blank" rel="noopener noreferrer">
      <Icon :name="item.icon" aria-hidden="true" />
    </a>
  </nav>
</template>

<script setup lang="ts">
defineProps({
  items: { type: Array as () => Array<{ href: string; label: string; icon: string }>, required: true }
})
</script>

<style scoped>
.landing-footer-social {
  gap: var(--space-2);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.landing-footer-social a {
  width: var(--landing-footer-social-size);
  height: var(--landing-footer-social-size);
  border-radius: var(--radius-round);
  color: var(--landing-color-footer-text);
  background-color: var(--landing-color-social-bg);
  transition-duration: var(--motion-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.landing-footer-social svg {
  width: var(--landing-footer-icon-size);
  height: var(--landing-footer-icon-size);
}

.landing-footer-social a:hover {
  background-color: var(--landing-color-social-hover);
}
</style>
