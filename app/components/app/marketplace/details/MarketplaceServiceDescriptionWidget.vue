<template>
  <BaseProfileSection
    title="Description"
    eyebrow="Service"
    surface="plain"
    id="marketplace-service-description"
  >
    <div class="marketplace-service-profile-copy">
      <p v-for="paragraph in getDescriptionParagraphs(description)" :key="paragraph">
        {{ paragraph }}
      </p>
    </div>
  </BaseProfileSection>
</template>

<script setup lang="ts">
defineProps<{
  description: string
}>()

const getDescriptionParagraphs = (description: string) => {
  return description.split(/\n{2,}/).map(paragraph => paragraph.trim()).filter(Boolean)
}
</script>

<style>
.marketplace-service-profile-copy {
  display: grid;
  gap: var(--profile-space-2);
  max-width: calc(var(--profile-unit) * 92);
}

.marketplace-service-profile-copy p {
  margin: 0;
  color: var(--profile-color-text);
  font-size: var(--profile-font-body);
  line-height: var(--profile-line-body);
  text-wrap: pretty;
}
</style>
