<template>
  <BaseProfileSection
    title="Experiences professionnelles"
    eyebrow="Professionnel"
    surface="plain"
    :show-btn="canEdit || true"
    btn-label=""
    btn-icon="lucide:pen-line"
    btn-variant="ghost"
    btn-shape="circle"
    btn-aria-label="Modifier les expériences professionnelles"
    @action="openModal"
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
import UserProfileProfessionalExperienceModal from './UserProfileProfessionalExperienceModal.vue'

const { useProfessionalExperienceSection, canEdit, slug } = useViewedUserProfile()
const { items: experiences, pending, error, refresh, createProfessionalExperience, updateProfessionalExperience } = useProfessionalExperienceSection()
const modalStore = useModalStore()

const openModal = (experience = null) => {
  modalStore.add({
    presentation: 'component',
    component: UserProfileProfessionalExperienceModal,
    componentProps: {
      slug: slug.value,
      experience,
      createProfessionalExperience,
      updateProfessionalExperience
    }
  })
}
</script>
