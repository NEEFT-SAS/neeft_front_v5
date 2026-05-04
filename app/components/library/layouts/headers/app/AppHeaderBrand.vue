<template>
  <NuxtLink class="app-header-brand" to="/" aria-label="Accueil NEEFT">
    <img src="/images/logos/neeft/Logo_NEEFT_FOX.png" alt="" decoding="async">
  </NuxtLink>
</template>

<style scoped lang="scss">
.app-header-brand {
  width: var(--app-header-hit-size);
  min-height: var(--app-header-hit-size);
  color: var(--app-color-accent);
  font: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.app-header-brand img {
  width: var(--app-header-logo-size);
  height: var(--app-header-logo-size);
  object-fit: contain;
}
</style>
