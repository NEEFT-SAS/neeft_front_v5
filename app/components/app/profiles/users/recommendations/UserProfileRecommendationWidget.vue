<template>
  <BaseProfileSection
    title="Recommandations"
    eyebrow="Recommandations"
    surface="plain"
    :show-btn="false"
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
</script>
