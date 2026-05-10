<template>
  <article class="user-profile-professional-experience-card">
    <header class="user-profile-professional-experience-card__header">
      <span class="user-profile-professional-experience-card__avatar" aria-hidden="true">
        <NuxtImg
          v-if="companyLogoUrl"
          :src="companyLogoUrl"
          :alt="companyName"
          width="56"
          height="56"
          loading="lazy"
          decoding="async"
        />
        <span v-else>{{ initials }}</span>
      </span>

      <div class="user-profile-professional-experience-card__identity">
        <h3>{{ positionTitle }}</h3>
        <p>{{ companyName }}</p>
      </div>
    </header>

    <div class="user-profile-professional-experience-card__timeline">
      <span>{{ periodLabel }}</span>
      <strong>{{ durationLabel }}</strong>
    </div>

    <div v-if="metaItems.length" class="user-profile-professional-experience-card__meta">
      <span v-for="item in metaItems" :key="item">
        {{ item }}
      </span>
    </div>

    <p v-if="description" class="user-profile-professional-experience-card__description">
      {{ description }}
    </p>

    <ul v-if="missions.length" class="user-profile-professional-experience-card__missions">
      <li v-for="mission in missions" :key="mission">
        {{ mission }}
      </li>
    </ul>
  </article>
</template>

<script setup>
import {
  formatProfileExperienceDurationLabel,
  formatProfileExperiencePeriodLabel,
  getProfileExperienceText
} from '~/utils/profileExperience'

const props = defineProps({
  experience: { type: Object, required: true }
})

const companyName = computed(() => getProfileExperienceText(props.experience.companyName) || 'Entreprise')
const positionTitle = computed(() => getProfileExperienceText(props.experience.positionTitle) || 'Poste')
const companyLogoUrl = computed(() => getProfileExperienceText(props.experience.companyLogoUrl))
const description = computed(() => getProfileExperienceText(props.experience.description))
const contractType = computed(() => getProfileExperienceText(props.experience.contractType))
const location = computed(() => getProfileExperienceText(props.experience.location))
const periodLabel = computed(() => formatProfileExperiencePeriodLabel(props.experience.startDate, props.experience.endDate))
const durationLabel = computed(() => formatProfileExperienceDurationLabel(props.experience.startDate, props.experience.endDate))
const missions = computed(() => Array.isArray(props.experience.missions)
  ? props.experience.missions.map(getProfileExperienceText).filter(Boolean)
  : []
)
const metaItems = computed(() => [location.value, contractType.value].filter(Boolean))
const initials = computed(() => {
  const parts = companyName.value.split(/\s+/).filter(Boolean).slice(0, 2)
  return parts.length ? parts.map(part => part[0]?.toUpperCase() || '').join('') : 'NE'
})
</script>

<style scoped>
.user-profile-professional-experience-card {
  --experience-unit: var(--profile-unit);
  --experience-space-1: var(--profile-space-1);
  --experience-space-2: var(--profile-space-2);
  --experience-space-3: var(--profile-space-3);
  --experience-radius: var(--profile-radius);
  --experience-border: var(--profile-border);
  --experience-color-border: var(--profile-color-border);
  --experience-color-panel: var(--profile-color-panel);
  --experience-color-panel-strong: var(--profile-color-panel-strong);
  --experience-color-text: var(--profile-color-text);
  --experience-color-muted: var(--profile-color-muted);
  --experience-font-weight: var(--font-weight-semibold);
  --experience-avatar-size: calc(var(--experience-unit) * 7);
  display: grid;
  gap: var(--experience-space-3);
  align-content: start;
  height: 100%;
  padding: var(--experience-space-3);
  border: var(--experience-border) solid var(--experience-color-border);
  border-radius: var(--experience-radius);
  background-color: var(--experience-color-panel-strong);
}

.user-profile-professional-experience-card__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--experience-space-2);
  align-items: center;
}

.user-profile-professional-experience-card__avatar {
  display: inline-flex;
  width: var(--experience-avatar-size);
  height: var(--experience-avatar-size);
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: var(--experience-border) solid var(--experience-color-border);
  border-radius: var(--experience-radius);
  background-color: var(--experience-color-panel);
  color: var(--experience-color-muted);
  font-size: var(--profile-font-body);
  font-weight: var(--experience-font-weight);
  line-height: var(--profile-line-title);
  text-transform: uppercase;
}

.user-profile-professional-experience-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.user-profile-professional-experience-card__identity {
  display: grid;
  gap: var(--experience-space-1);
}

.user-profile-professional-experience-card h3,
.user-profile-professional-experience-card p,
.user-profile-professional-experience-card ul {
  margin: 0;
}

.user-profile-professional-experience-card h3 {
  color: var(--experience-color-text);
  font-size: var(--profile-font-body);
  font-weight: var(--experience-font-weight);
  line-height: var(--profile-line-title);
  overflow-wrap: anywhere;
}

.user-profile-professional-experience-card p,
.user-profile-professional-experience-card__timeline,
.user-profile-professional-experience-card__meta,
.user-profile-professional-experience-card__missions {
  color: var(--experience-color-muted);
  font-size: var(--profile-font-label);
  line-height: var(--profile-line-body);
}

.user-profile-professional-experience-card__timeline,
.user-profile-professional-experience-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--experience-space-1);
  align-items: center;
}

.user-profile-professional-experience-card__timeline strong {
  color: var(--experience-color-text);
  font-weight: var(--experience-font-weight);
}

.user-profile-professional-experience-card__meta span,
.user-profile-professional-experience-card__missions li {
  padding: var(--experience-space-1) var(--experience-space-2);
  border: var(--experience-border) solid var(--experience-color-border);
  border-radius: var(--experience-radius);
  background-color: var(--experience-color-panel);
}

.user-profile-professional-experience-card__description {
  color: var(--experience-color-muted);
  font-size: var(--profile-font-label);
  line-height: var(--profile-line-body);
}

.user-profile-professional-experience-card__missions {
  display: grid;
  gap: var(--experience-space-1);
  padding: 0;
  list-style: none;
}
</style>
