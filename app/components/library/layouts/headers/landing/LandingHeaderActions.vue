<template>
  <div class="landing-header-actions">
    <CustomLink
      v-for="item in items"
      :key="item.to"
      :label="t(item.labelKey)"
      :to="item.to"
      :variant="item.variant || 'outlined'"
      :color="item.color || 'primary'"
      theme="landing"
      shape="rectangular"
      size="lg"
      @click="$emit('closeMobileMenu')"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

defineProps({
  items: { type: Array as () => Array<{ to: string; labelKey: string; variant?: 'filled' | 'outlined'; color?: 'primary' | 'secondary' }>, required: true }
})

defineEmits(['closeMobileMenu'])
</script>

<style scoped lang="scss">
@use '~/assets/scss/mixins/breakpoints' as *;

.landing-header-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
  align-self: end;
  padding-top: var(--space-4);
}

@include breakpoint-lg {
  .landing-header-actions {
    padding-top: 0;
    width: auto;
    flex-direction: row;
    align-items: center;
    justify-content: end;
  }
}
</style>
