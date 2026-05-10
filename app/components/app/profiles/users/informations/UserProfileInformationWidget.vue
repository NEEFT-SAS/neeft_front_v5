<template>
  <BaseProfileSection
    title="Informations"
    eyebrow="Profil"
    surface="plain"
    :show-btn="canEdit || true"
    btn-label=""
    btn-icon="lucide:pen-line"
    btn-variant="ghost"
    btn-shape="circle"
    btn-aria-label="Modifier les informations"
    @action="openModal"
  >
    <div class="profile-information-widget">

      <div class="profile-information-widget__facts">
        <article>
          <span>Age</span>
          <strong>{{ profile?.age }} ans</strong>
        </article>
        <article>
          <span>Genre</span>
          <strong>{{ profile?.gender }}</strong>
        </article>
        <article>
          <span>Secteur d'activité</span>
          <strong>{{ profile?.workSector }}</strong>
        </article>
        <article>
          <span>Type de contrat</span>
          <strong>{{ profile?.contractType }}</strong>
        </article>
      </div>

      <article class="profile-information-widget__description">
        <p>{{ profile?.description || 'Aucune description' }}</p>
      </article>

    </div>
  </BaseProfileSection>
</template>

<script setup lang="ts">
import UserProfileInformationModal from './UserProfileInformationModal.vue'

const { profile, canEdit, updatePlayerProfile } = useViewedUserProfile()
const modalStore = useModalStore()

const openModal = () => {
  modalStore.add({
    presentation: 'component',
    component: UserProfileInformationModal,
    componentProps: {
      profile: profile.value,
      updatePlayerProfile
    }
  })
}
</script>

<style scoped>
.profile-information-widget {
  display: grid;
  gap: calc(var(--space-3) + var(--space-2));
}

.profile-information-widget__facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(calc(var(--unit) * 14), max-content));
  gap: calc(var(--space-3) + var(--space-1)) calc(var(--space-4) * 2);
  align-items: start;
  justify-content: start;
}

.profile-information-widget__facts article,
.profile-information-widget__description {
  display: grid;
  gap: var(--space-1);
}

.profile-information-widget__facts span,
.profile-information-widget__description span {
  color: var(--app-color-subtle);
  font-size: calc(var(--unit) * 1.75);
  line-height: var(--line-base);
}

.profile-information-widget__facts article {
  min-width: 0;
}

.profile-information-widget__facts strong {
  color: var(--color-text);
  font-size: calc(var(--font-body) * 0.98);
  font-weight: 600;
  line-height: var(--line-title);
}

.profile-information-widget__description p {
  margin: 0;
  max-width: min(100%, calc(var(--unit) * 88));
  color: var(--color-text);
  font-size: var(--font-body);
  line-height: var(--line-base);
  text-wrap: pretty;
}

@media (max-width: 640px) {
  .profile-information-widget__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
  }
}
</style>
