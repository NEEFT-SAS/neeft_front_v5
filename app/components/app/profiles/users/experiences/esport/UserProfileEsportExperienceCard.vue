<template>
  <article class="user-profile-esport-experience-card">
    <header class="user-profile-esport-experience-card__header">
      <span class="user-profile-esport-experience-card__logo" aria-hidden="true">
        {{ initials }}
      </span>

      <div class="user-profile-esport-experience-card__team">
        <h3>{{ teamName }}</h3>
        <p>{{ periodLabel }}</p>
      </div>

      <div class="user-profile-esport-experience-card__meta">
        <strong class="user-profile-esport-experience-card__duration">
          {{ durationLabel }}
        </strong>
      </div>
    </header>

    <div class="user-profile-esport-experience-card__roles">
      <article class="user-profile-esport-experience-card__role">
        <header class="user-profile-esport-experience-card__role-header">
          <span>Joueur</span>
          <strong>{{ roleTitle }}</strong>
          <em>{{ durationLabel }}</em>
        </header>

        <p v-if="description">
          {{ description }}
        </p>

        <p class="user-profile-esport-experience-card__period">
          {{ periodLabel }}
        </p>
      </article>
    </div>
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

const teamName = computed(() => getProfileExperienceText(props.experience.teamName) || 'Equipe non renseignee')
const jobTitle = computed(() => getProfileExperienceText(props.experience.jobTitle) || 'Role non renseigne')
const description = computed(() => getProfileExperienceText(props.experience.description))
const periodLabel = computed(() => formatProfileExperiencePeriodLabel(props.experience.startDate, props.experience.endDate))
const durationLabel = computed(() => formatProfileExperienceDurationLabel(props.experience.startDate, props.experience.endDate))
const roleTitle = computed(() => `Joueur - ${jobTitle.value}`)
const initials = computed(() => {
  const parts = teamName.value.split(/\s+/).filter(Boolean).slice(0, 2)
  return parts.length ? parts.map(part => part[0]?.toUpperCase() || '').join('') : 'NE'
})
</script>

<style scoped>
.user-profile-esport-experience-card {
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
  --experience-color-subtle: var(--profile-color-subtle);
  --experience-font-weight: var(--font-weight-semibold);
  --experience-logo-size: calc(var(--experience-unit) * 7);
  display: grid;
  gap: var(--experience-space-3);
  align-content: start;
  height: 100%;
  padding: var(--experience-space-3);
  border: var(--experience-border) solid var(--experience-color-border);
  border-radius: var(--experience-radius);
  background-color: var(--experience-color-panel-strong);
}

.user-profile-esport-experience-card__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--experience-space-2);
  align-items: center;
}

.user-profile-esport-experience-card__logo {
  display: inline-flex;
  width: var(--experience-logo-size);
  height: var(--experience-logo-size);
  align-items: center;
  justify-content: center;
  border: var(--experience-border) solid var(--experience-color-border);
  border-radius: var(--experience-radius);
  background-color: var(--experience-color-panel);
  color: var(--experience-color-text);
  font-size: var(--profile-font-body);
  font-weight: var(--experience-font-weight);
  line-height: var(--profile-line-title);
}

.user-profile-esport-experience-card__team {
  display: grid;
  gap: var(--experience-space-1);
}

.user-profile-esport-experience-card h3,
.user-profile-esport-experience-card p {
  margin: 0;
}

.user-profile-esport-experience-card h3 {
  color: var(--experience-color-text);
  font-size: var(--profile-font-body);
  font-weight: var(--experience-font-weight);
  line-height: var(--profile-line-title);
  overflow-wrap: anywhere;
}

.user-profile-esport-experience-card p,
.user-profile-esport-experience-card__role-header {
  color: var(--experience-color-muted);
  font-size: var(--profile-font-label);
  line-height: var(--profile-line-body);
}

.user-profile-esport-experience-card__meta {
  grid-column: 1 / -1;
}

.user-profile-esport-experience-card__duration {
  color: var(--experience-color-text);
  font-size: var(--profile-font-label);
  font-weight: var(--experience-font-weight);
  line-height: var(--profile-line-body);
}

.user-profile-esport-experience-card__roles {
  display: grid;
  gap: var(--experience-space-2);
}

.user-profile-esport-experience-card__role {
  display: grid;
  gap: var(--experience-space-2);
  padding: var(--experience-space-2);
  border: var(--experience-border) solid var(--experience-color-border);
  border-radius: var(--experience-radius);
  background-color: var(--experience-color-panel);
}

.user-profile-esport-experience-card__role-header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--experience-space-2);
  align-items: center;
}

.user-profile-esport-experience-card__role-header span,
.user-profile-esport-experience-card__role-header em,
.user-profile-esport-experience-card__period {
  color: var(--experience-color-subtle);
  font-style: normal;
}

.user-profile-esport-experience-card__role-header strong {
  color: var(--experience-color-text);
  font-weight: var(--experience-font-weight);
  overflow-wrap: anywhere;
}
</style>
