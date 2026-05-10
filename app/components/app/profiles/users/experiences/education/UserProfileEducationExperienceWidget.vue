<template>
  <BaseProfileSection
    title="Formations"
    eyebrow="Scolaire"
    surface="plain"
    :show-btn="canEdit || true"
    btn-label=""
    btn-icon="lucide:pen-line"
    btn-variant="ghost"
    btn-shape="circle"
    btn-aria-label="Modifier les formations"
    @action="openModal"
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
import UserProfileEducationExperienceModal from './UserProfileEducationExperienceModal.vue'

const { useEducationExperienceSection, canEdit, slug } = useViewedUserProfile()
const { items: experiences, pending, error, refresh, createEducationExperience, updateEducationExperience } = useEducationExperienceSection()
const modalStore = useModalStore()

const openModal = (experience = null) => {
  modalStore.add({
    presentation: 'component',
    component: UserProfileEducationExperienceModal,
    componentProps: {
      slug: slug.value,
      experience,
      createEducationExperience,
      updateEducationExperience
    }
  })
}
</script>
