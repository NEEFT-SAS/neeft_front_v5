<template>
  <article class="user-profile-education-experience-card">
    <header class="user-profile-education-experience-card__header">
      <span class="user-profile-education-experience-card__avatar" aria-hidden="true">
        <NuxtImg
          v-if="schoolLogoUrl"
          :src="schoolLogoUrl"
          :alt="schoolName"
          width="56"
          height="56"
          loading="lazy"
          decoding="async"
        />
        <Icon v-else name="lucide:graduation-cap" />
      </span>

      <div class="user-profile-education-experience-card__identity">
        <h3>{{ diplomaName }}</h3>
        <p>{{ schoolName }}</p>
      </div>
    </header>

    <div class="user-profile-education-experience-card__timeline">
      <span>{{ periodLabel }}</span>
      <strong>{{ durationLabel }}</strong>
    </div>

    <div v-if="metaItems.length" class="user-profile-education-experience-card__meta">
      <span v-for="item in metaItems" :key="item">
        {{ item }}
      </span>
    </div>

    <p v-if="description" class="user-profile-education-experience-card__description">
      {{ description }}
    </p>
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

const educationStatusLabels = {
  part_time: 'Temps partiel',
  full_time: 'Temps plein'
}
const attendanceModeLabels = {
  on_site: 'Sur site',
  remote: 'A distance',
  hybrid: 'Hybride'
}

const schoolName = computed(() => getProfileExperienceText(props.experience.schoolName) || 'Ecole')
const diplomaName = computed(() => getProfileExperienceText(props.experience.diplomaName) || 'Formation')
const schoolLogoUrl = computed(() => getProfileExperienceText(props.experience.schoolLogoUrl))
const description = computed(() => getProfileExperienceText(props.experience.description))
const location = computed(() => getProfileExperienceText(props.experience.location))
const mention = computed(() => getProfileExperienceText(props.experience.mention))
const educationStatus = computed(() => {
  const value = getProfileExperienceText(props.experience.educationStatus)
  return value ? educationStatusLabels[value] || value : ''
})
const attendanceMode = computed(() => {
  const value = getProfileExperienceText(props.experience.attendanceMode)
  return value ? attendanceModeLabels[value] || value : ''
})
const periodLabel = computed(() => formatProfileExperiencePeriodLabel(props.experience.startDate, props.experience.endDate))
const durationLabel = computed(() => formatProfileExperienceDurationLabel(props.experience.startDate, props.experience.endDate))
const metaItems = computed(() => [educationStatus.value, attendanceMode.value, mention.value, location.value].filter(Boolean))
</script>

<style scoped>
.user-profile-education-experience-card {
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
  --experience-icon-size: calc(var(--experience-unit) * 2.5);
  display: grid;
  gap: var(--experience-space-3);
  align-content: start;
  height: 100%;
  padding: var(--experience-space-3);
  border: var(--experience-border) solid var(--experience-color-border);
  border-radius: var(--experience-radius);
  background-color: var(--experience-color-panel-strong);
}

.user-profile-education-experience-card__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--experience-space-2);
  align-items: center;
}

.user-profile-education-experience-card__avatar {
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
}

.user-profile-education-experience-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.user-profile-education-experience-card__avatar svg {
  width: var(--experience-icon-size);
  height: var(--experience-icon-size);
}

.user-profile-education-experience-card__identity {
  display: grid;
  gap: var(--experience-space-1);
}

.user-profile-education-experience-card h3,
.user-profile-education-experience-card p {
  margin: 0;
}

.user-profile-education-experience-card h3 {
  color: var(--experience-color-text);
  font-size: var(--profile-font-body);
  font-weight: var(--experience-font-weight);
  line-height: var(--profile-line-title);
  overflow-wrap: anywhere;
}

.user-profile-education-experience-card p,
.user-profile-education-experience-card__timeline,
.user-profile-education-experience-card__meta {
  color: var(--experience-color-muted);
  font-size: var(--profile-font-label);
  line-height: var(--profile-line-body);
}

.user-profile-education-experience-card__timeline,
.user-profile-education-experience-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--experience-space-1);
  align-items: center;
}

.user-profile-education-experience-card__timeline strong {
  color: var(--experience-color-text);
  font-weight: var(--experience-font-weight);
}

.user-profile-education-experience-card__meta span {
  padding: var(--experience-space-1) var(--experience-space-2);
  border: var(--experience-border) solid var(--experience-color-border);
  border-radius: var(--experience-radius);
  background-color: var(--experience-color-panel);
}

.user-profile-education-experience-card__description {
  color: var(--experience-color-muted);
  font-size: var(--profile-font-label);
  line-height: var(--profile-line-body);
}
</style>
