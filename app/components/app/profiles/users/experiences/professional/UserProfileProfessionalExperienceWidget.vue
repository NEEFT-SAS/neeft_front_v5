<template>
  <BaseProfileSection
    title="Experiences professionnelles"
    eyebrow="Professionnel"
    surface="plain"
    :data="experiences.length > 0"
    :pending="pending"
    :error="error"
    loading-message="Chargement des experiences professionnelles."
    error-message="Impossible de charger les experiences professionnelles."
    empty-message="Aucune experience professionnelle renseignee."
  >
    <ul class="player-profile-experience-grid">
      <li v-for="experience in experiences" :key="String(experience.id)">
        <UserProfileProfessionalExperienceCard :experience="experience" />
      </li>
    </ul>
  </BaseProfileSection>
</template>

<script setup>
const { useProfessionalExperienceSection } = useViewedUserProfile()
const { items: experiences, pending, error } = useProfessionalExperienceSection()
</script>
