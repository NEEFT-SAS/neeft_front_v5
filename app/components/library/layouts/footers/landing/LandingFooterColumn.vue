<template>
  <nav class="landing-footer-column" :aria-labelledby="titleId">
    <h2 :id="titleId">
      <slot name="title" />
    </h2>
    <ul>
      <li v-for="item in items" :key="item.to">
        <NuxtLink :to="item.to">
          {{ t(item.labelKey) }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const { t } = useI18n()

defineProps({
  titleId: { type: String, required: true },
  items: { type: Array as () => Array<{ to: string; labelKey: string }>, required: true }
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/mixins/breakpoints' as *;

.landing-footer-column {
  gap: var(--space-3);
  display: grid;
  text-align: center;
}

.landing-footer-column h2 {
  color: var(--landing-color-footer-text);
  font-size: var(--font-card);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  margin: 0;
}

.landing-footer-column ul {
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  display: grid;
  list-style: none;
}

.landing-footer-column a {
  color: var(--landing-color-footer-muted);
  font-size: var(--font-card);
  line-height: var(--line-tight);
  text-decoration: none;
}

.landing-footer-column a:hover {
  color: var(--landing-color-footer-text);
}

@include breakpoint-lg {
  .landing-footer-column {
    text-align: left;
  }
}
</style>
