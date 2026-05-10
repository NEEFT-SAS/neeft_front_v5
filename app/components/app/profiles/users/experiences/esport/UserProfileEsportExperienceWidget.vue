<template>
  <BaseProfileSection
    title="Anciennes équipes"
    eyebrow="Esport"
    surface="plain"
    :show-btn="canEdit || true"
    btn-label=""
    btn-icon="lucide:pen-line"
    btn-variant="ghost"
    btn-shape="circle"
    btn-aria-label="Modifier les équipes"
    @action="openModal"
  >

    <ul class="player-profile-experience-grid">
      <li v-for="experience in experiences" :key="String(experience.id)">
        <UserProfileEsportExperienceCard :experience="experience" />
      </li>
    </ul>
  </BaseProfileSection>
</template>

<script setup>
import UserProfileEsportExperienceModal from './UserProfileEsportExperienceModal.vue'

const { useEsportExperienceSection, canEdit, slug } = useViewedUserProfile()
const { items: experiences, pending, error, refresh, createEsportExperience, updateEsportExperience } = useEsportExperienceSection()
const modalStore = useModalStore()

const openModal = (experience = null) => {
  modalStore.add({
    presentation: 'component',
    component: UserProfileEsportExperienceModal,
    componentProps: {
      slug: slug.value,
      experience,
      createEsportExperience,
      updateEsportExperience
    }
  })
}
</script>
