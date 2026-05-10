<template>
  <BaseProfileSection
    title="Recommandations"
    eyebrow="Recommandations"
    surface="plain"
    :show-btn="!isOwner"
    btn-label="Recommander"
    btn-icon="lucide:star"
    btn-variant="ghost"
    btn-shape="circle"
    btn-aria-label="Ajouter une recommandation"
    @action="openModal"
    :loading="false"
    :error="null"
    :data="true"
    :is-owner="false"
  >
    <template #content-header>
      <CustomRouteTabs
        v-model="activeTab"
        :items="tabItems"
        theme="app"
        aria-label="Onglets de recommandations"
      />
    </template>

    <ul class="player-profile-card-grid">
      <li v-for="i in 3" :key="i">
        <UserProfileRecommendationCard
          :recommendation="{
            id: i,
            authorName: 'Jean Dupont',
            authorAvatarUrl: '/images/logos/neeft/Logo_NEEFT_FOX.png',
            authorAvatarAlt: 'Avatar de Jean Dupont',
            content: 'Excellent collaborateur, très professionnel et compétent.',
            rating: 5,
            relationship: 'Coach',
            direction: 'received'
          }"
        />
      </li>
    </ul>
  </BaseProfileSection>
</template>

<script setup lang="ts">
import UserProfileRecommendationModal from './UserProfileRecommendationModal.vue'

const { useRecommendationsSection, isOwner, slug } = useViewedUserProfile()
const { createRecommendation } = useRecommendationsSection()
const modalStore = useModalStore()

const activeTab = ref('received')

const tabItems = [
  {
    label: 'Reçues',
    value: 'received',
    badge: 3
  },
  {
    label: 'Données',
    value: 'given',
    badge: 2
  }
]

const openModal = () => {
  modalStore.add({
    presentation: 'component',
    component: UserProfileRecommendationModal,
    componentProps: {
      slug: slug.value,
      createRecommendation
    }
  })
}
</script>
