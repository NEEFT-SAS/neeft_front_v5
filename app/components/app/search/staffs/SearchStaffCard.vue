<template>
  <article class="search-staff-card">
    <div class="search-staff-card__visual">
      <img
        class="search-staff-card__banner"
        :src="props.staff.banner"
        :alt="`Banniere de ${props.staff.name}`"
        width="320"
        height="160"
        loading="lazy"
        decoding="async"
      >

      <span
        v-if="countryFlag"
        class="search-staff-card__country"
        :aria-label="`Pays ${countryCodeLabel}`"
      >
        {{ countryFlag }}
      </span>

      <span
        class="search-staff-card__status"
        :class="`search-staff-card__status--${props.staff.statusTone}`"
      >
        {{ props.staff.status }}
      </span>

      <div class="search-staff-card__identity">
        <img
          class="search-staff-card__photo"
          :src="props.staff.avatar"
          :alt="`Photo de ${props.staff.name}`"
          width="96"
          height="96"
          loading="lazy"
          decoding="async"
        >
        <div>
          <h2>{{ props.staff.name }}</h2>
          <p>{{ props.staff.handle }}</p>
        </div>
      </div>
    </div>

    <div class="search-staff-card__content">
      <dl class="search-staff-card__footer">
        <div class="search-staff-card__role" :aria-label="`Role ${staffRole.label}`">
          <dd>
            <span
              class="search-staff-card__icon-item"
              role="img"
              :aria-label="staffRole.label"
            >
              <Icon :name="staffRole.icon" aria-hidden="true" />
            </span>
          </dd>
        </div>

        <div>
          <dd aria-label="Jeux">
            <span
              v-for="game in staffGames"
              :key="`staff-game-${props.staff.id}-${game.label}`"
              class="search-staff-card__icon-item"
              role="img"
              :aria-label="game.label"
            >
              <Icon :name="game.icon" aria-hidden="true" />
            </span>
          </dd>
        </div>
      </dl>

      <NuxtLinkLocale class="search-staff-card__profile-link" :to="props.profilePath">
        {{ profileLabel }}
      </NuxtLinkLocale>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

type SearchStaffCardMetaItem = {
  label: string
  icon: string
}

type SearchStaffCardStaff = {
  id: number
  name: string
  handle: string
  avatar: string
  banner: string
  game: SearchStaffCardMetaItem | null
  games?: SearchStaffCardMetaItem[]
  role?: SearchStaffCardMetaItem | null
  rank: SearchStaffCardMetaItem | null
  countryCode?: string
  status: string
  statusTone: 'open' | 'watch' | 'busy'
  filters?: Record<string, string[]>
}

const props = defineProps({
  staff: {
    type: Object as PropType<SearchStaffCardStaff>,
    required: true
  },
  profilePath: {
    type: String,
    required: true
  },
  profileLabel: {
    type: String,
    default: ''
  },
  placeholderItem: {
    type: Object as PropType<SearchStaffCardMetaItem>,
    default: () => ({
      label: 'Non renseigne',
      icon: 'lucide:circle-question-mark'
    })
  }
})

const { t } = useI18n()

const profileLabel = computed(() => props.profileLabel || t('app.search.cards.viewProfile'))

const staffRole = computed(() => {
  return props.staff.role || props.staff.rank || props.placeholderItem
})

const staffGames = computed(() => {
  if (Array.isArray(props.staff.games) && props.staff.games.length) return props.staff.games
  if (props.staff.game) return [props.staff.game]
  return [props.placeholderItem]
})

const countryCodeLabel = computed(() => {
  const fallbackCountryCode = Array.isArray(props.staff.filters?.countries)
    ? props.staff.filters.countries[0] || ''
    : ''

  return String(props.staff.countryCode || fallbackCountryCode || '').toUpperCase()
})

const countryFlag = computed(() => {
  if (!/^[A-Z]{2}$/.test(countryCodeLabel.value)) return ''

  return Array.from(countryCodeLabel.value)
    .map(letter => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join('')
})
</script>

<style scoped>
.search-staff-card {
  border-radius: var(--search-radius);
  background-color: var(--search-color-section);
  box-shadow: 0 var(--search-space-3) var(--search-space-8) var(--search-color-shadow);

  @apply grid h-full overflow-hidden;
}

.search-staff-card__visual {
  height: var(--search-staff-visual-height);
  background-color: var(--search-color-panel-soft);

  @apply relative overflow-hidden;
}

.search-staff-card__banner {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-staff-card__visual::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--search-color-transparent), var(--search-color-overlay-mid), var(--search-color-panel));
  content: "";
}

.search-staff-card__photo {
  width: var(--search-player-photo-size);
  height: var(--search-player-photo-size);
  border: var(--search-border) solid var(--search-color-panel-line);
  border-radius: var(--search-radius);
  background-color: var(--search-color-panel);
  object-fit: cover;

  @apply shrink-0;
}

.search-staff-card__identity {
  position: absolute;
  bottom: var(--search-space-3);
  left: var(--search-space-3);
  z-index: 1;
  gap: var(--search-space-1);
  color: var(--search-color-text);

  @apply flex items-center;
}

.search-staff-card__identity h2,
.search-staff-card__identity p {
  margin: 0;
}

.search-staff-card__identity h2 {
  font-size: var(--search-font-card-title);
  line-height: var(--search-line-title);
  overflow-wrap: anywhere;

  @apply font-semibold;
}

.search-staff-card__identity p {
  color: var(--search-color-muted);
  font-size: calc(var(--search-font-small) * 0.92);
  line-height: var(--search-line-tight);
}

.search-staff-card__content {
  padding: var(--search-space-3);
  gap: var(--search-space-2);

  @apply grid;
}

.search-staff-card__country,
.search-staff-card__status {
  position: absolute;
  top: var(--search-space-2);
  z-index: 1;
  min-height: var(--search-space-4);
  padding: 0 var(--search-space-2);
  border-radius: var(--search-radius-round);
  background-color: var(--search-color-panel);
  font-size: var(--search-font-small);
  line-height: var(--search-line-tight);

  @apply inline-flex items-center font-semibold;
}

.search-staff-card__country {
  left: var(--search-space-2);
  font-size: calc(var(--search-font-card-title) * 0.92);
  line-height: 1;
}

.search-staff-card__status {
  right: var(--search-space-2);
  border: var(--search-border) solid currentcolor;
}

.search-staff-card__status--open {
  border-color: var(--search-color-open);
  color: var(--search-color-open);
}

.search-staff-card__status--watch {
  border-color: var(--search-color-watch);
  color: var(--search-color-watch);
}

.search-staff-card__status--busy {
  border-color: var(--search-color-busy);
  color: var(--search-color-busy);
}

.search-staff-card__footer {
  --search-staff-footer-icon-size: calc(var(--search-fact-icon-size) * 0.75);
  --search-staff-footer-row-size: calc(var(--search-staff-footer-icon-size) * 1.35);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--search-space-2);
  margin: 0;

  @apply grid items-center;
}

.search-staff-card__footer div {
  min-height: var(--search-staff-footer-row-size);
  gap: var(--search-space-1);
  align-content: center;
  text-align: center;

  @apply grid;
}

.search-staff-card__footer dd {
  min-height: var(--search-staff-footer-row-size);
  gap: var(--search-space-1);
  margin: 0;
  color: var(--search-color-muted);
  font-size: var(--search-font-small);
  line-height: 1;

  @apply flex flex-wrap items-center justify-center;
}

.search-staff-card__role {
  color: var(--search-color-accent);
}

.search-staff-card__icon-item {
  gap: var(--search-space-1);
  min-width: var(--search-staff-footer-icon-size);
  min-height: var(--search-staff-footer-icon-size);
  color: var(--search-color-subtle);
  line-height: 0;

  @apply inline-flex items-center justify-center;
}

.search-staff-card__icon-item svg {
  display: block;
  width: var(--search-staff-footer-icon-size);
  height: var(--search-staff-footer-icon-size);
  color: var(--search-color-accent);
}

.search-staff-card__profile-link {
  margin-top: var(--search-space-2);
  min-height: var(--search-hit-size);
  padding: 0 var(--search-space-2);
  border: var(--search-border) solid var(--search-color-panel-line);
  border-radius: var(--search-radius);
  background-color: var(--search-color-bg-soft);
  color: var(--search-color-muted);
  font-size: var(--search-font-small);
  line-height: var(--search-line-tight);

  @apply inline-flex w-full items-center justify-center font-semibold no-underline transition-colors duration-200;
}

.search-staff-card__profile-link:hover {
  color: var(--search-color-text);
}
</style>
