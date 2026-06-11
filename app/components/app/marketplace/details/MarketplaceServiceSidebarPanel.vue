<template>
  <section class="marketplace-service-profile-panel">
    <header v-if="$slots.header" class="marketplace-service-profile-panel__header">
      <slot name="header" />
    </header>

    <slot />
  </section>
</template>

<style>
.marketplace-service-profile-panel {
  display: grid;
  gap: var(--profile-space-3);
  padding: var(--profile-space-4);
  border: var(--profile-border) solid var(--profile-color-border);
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel);
  box-shadow: 0 var(--profile-space-2) var(--profile-space-6) var(--profile-color-shadow);
}

.marketplace-service-profile-panel__header {
  display: flex;
  gap: var(--profile-space-3);
  align-items: start;
  justify-content: space-between;
}

.marketplace-service-profile-panel__header > div {
  display: grid;
  gap: var(--profile-space-1);
}

.marketplace-service-profile-panel h2,
.marketplace-service-profile-panel p,
.marketplace-service-profile-panel dl,
.marketplace-service-profile-panel dt,
.marketplace-service-profile-panel dd {
  margin: 0;
}

.marketplace-service-profile-panel h2 {
  color: var(--profile-color-text);
  font-size: var(--profile-font-section);
  font-weight: 800;
  line-height: var(--profile-line-title);
}

.marketplace-service-profile-panel__header > strong {
  color: var(--profile-color-text);
  font-size: calc(var(--profile-unit) * 2.5);
  font-weight: 900;
  line-height: var(--profile-line-tight);
  text-align: right;
  white-space: nowrap;
}

@media (max-width: 40rem) {
  .marketplace-service-profile-panel {
    padding: var(--profile-space-3);
  }
}
</style>
