<template>
  <nav class="landing-footer-legal">
    <span>{{ currentYear }} NEEFT</span>
    <NuxtLink v-for="item in items" :key="item.to" :to="item.to">
      {{ t(item.labelKey) }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const { t } = useI18n()

defineProps({
  items: { type: Array as () => Array<{ to: string; labelKey: string }>, required: true }
})

const currentYear = new Date().getFullYear()
</script>

<style scoped>
.landing-footer-legal {
  gap: var(--space-2);
  color: var(--landing-color-footer-muted);
  font-size: var(--font-eyebrow);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.landing-footer-legal a {
  color: var(--landing-color-footer-muted);
  text-decoration: none;
}

.landing-footer-legal a:not(:first-of-type)::before {
  content: "/";
  margin-right: var(--space-2);
  color: var(--landing-color-footer-muted);
}

.landing-footer-legal a:hover {
  color: var(--landing-color-footer-text);
}
</style>
