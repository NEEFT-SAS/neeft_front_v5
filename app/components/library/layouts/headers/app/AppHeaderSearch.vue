<template>
  <form class="app-header-search" role="search" @submit.prevent>
    <label :for="inputId">Rechercher</label>
    <input
      :id="inputId"
      v-model="model"
      type="search"
      :placeholder="placeholder"
    >
  </form>
</template>

<script setup lang="ts">
const model = defineModel<string>({ default: '' })

defineProps({
  placeholder: { type: String, default: 'Rechercher...' }
})

const inputId = `app-header-search-${useId()}`
</script>

<style lang="scss">
.app-header-search {
  width: min(100%, var(--app-header-search-width));
  justify-self: center;
}

.app-header-search label {
  position: absolute;
  width: var(--app-header-border);
  height: var(--app-header-border);
  overflow: hidden;
  clip-path: inset(50%);
}

.app-header-search input {
  width: 100%;
  min-height: 2rem;
  padding: 0 0.5rem;
  border: 0;
  border-radius: var(--app-header-radius);
  background-color: var(--app-header-color-panel);
  color: var(--app-header-color-text);
  font: inherit;
  font-size: 0.875rem;
  outline: none;
}

.app-header-search input::placeholder {
  color: var(--app-header-color-subtle);
  opacity: 1;
}

.app-header-search input:hover {
  background-color: var(--app-header-color-panel-hover);
}
</style>
