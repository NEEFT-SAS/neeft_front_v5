<template>
  <BaseProfileSection
    title="Formations"
    eyebrow="Scolaire"
    surface="plain"
    :data="experiences.length > 0"
    :pending="pending"
    :error="error"
    loading-message="Chargement des formations."
    error-message="Impossible de charger les formations."
    empty-message="Aucune formation renseignee."
  >
    <ul class="player-profile-experience-grid">
      <li v-for="experience in experiences" :key="String(experience.id)">
        <UserProfileEducationExperienceCard :experience="experience" />
      </li>
    </ul>
  </BaseProfileSection>
</template>

<script setup>
const { useEducationExperienceSection } = useViewedUserProfile()
const { items: experiences, pending, error } = useEducationExperienceSection()
</script>
