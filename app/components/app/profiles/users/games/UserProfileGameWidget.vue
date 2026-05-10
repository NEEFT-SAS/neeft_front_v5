<template>
  <BaseProfileSection
    title="Jeux"
    eyebrow="Gaming"
    surface="plain"
    :show-btn="canEdit"
    btn-label=""
    btn-icon="lucide:pen-line"
    btn-variant="ghost"
    btn-shape="circle"
    btn-aria-label="Modifier les jeux"
  >
    <ul class="player-profile-list">
      <li v-for="game in games" :key="game.id">
        <PlayerProfileGameCard
          :game="game"
          :can-edit="canEdit"
        />
      </li>
    </ul>
  </BaseProfileSection>
</template>

<script setup lang="ts">
const { canEdit, useGameSection } = useViewedUserProfile()
const { items: games } = useGameSection()
</script>
