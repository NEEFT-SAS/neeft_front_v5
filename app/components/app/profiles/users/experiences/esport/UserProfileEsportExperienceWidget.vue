<template>
  <BaseProfileSection
    title="Anciennes equipes"
    eyebrow="Equipes"
    surface="plain"
    :data="experiences.length > 0"
    :pending="pending"
    :error="error"
    loading-message="Chargement des anciennes equipes."
    error-message="Impossible de charger les anciennes equipes."
    empty-message="Aucune ancienne equipe ajoutee."
  >
    <ul class="player-profile-experience-grid">
      <li v-for="experience in experiences" :key="String(experience.id)">
        <UserProfileEsportExperienceCard :experience="experience" />
      </li>
    </ul>
  </BaseProfileSection>
</template>

<script setup>
const { useEsportExperienceSection } = useViewedUserProfile()
const { items: experiences, pending, error } = useEsportExperienceSection()
</script>
