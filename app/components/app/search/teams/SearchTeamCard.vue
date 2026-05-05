<template>
  <article class="search-team-card">
    <div class="search-team-card__visual">
      <img
        class="search-team-card__banner"
        :src="teamBanner"
        :alt="`Banniere equipe ${teamName}`"
        width="320"
        height="160"
        loading="lazy"
        decoding="async"
      >

      <span
        v-if="countryFlag"
        class="search-team-card__country"
        :aria-label="`Pays ${countryCodeLabel}`"
      >
        {{ countryFlag }}
      </span>

      <span
        class="search-team-card__status"
        :class="`search-team-card__status--${teamStatusTone}`"
      >
        {{ teamStatusLabel }}
      </span>

      <div class="search-team-card__identity">
        <img
          class="search-team-card__photo"
          :src="teamLogo"
          :alt="`Logo equipe ${teamName}`"
          width="96"
          height="96"
          loading="lazy"
          decoding="async"
        >
        <div>
          <h2>{{ teamName }}</h2>
          <p>{{ teamHandle }}</p>
        </div>
      </div>
    </div>

    <div class="search-team-card__content">
      <dl class="search-team-card__footer">
        <div>
          <dd aria-label="Jeux">
            <span
              v-for="game in teamGames"
              :key="`team-game-${props.team.slug}-${game.label}`"
              class="search-team-card__icon-item"
              role="img"
              :aria-label="game.label"
            >
              <NuxtImg
                v-if="game.imageSrc"
                class="search-team-card__icon-asset"
                :src="game.imageSrc"
                :alt="game.label"
                fit="contain"
                loading="lazy"
                decoding="async"
              />
              <Icon v-else :name="game.icon" aria-hidden="true" />
            </span>
          </dd>
        </div>

        <div>
          <dd :aria-label="membersCountLabel">
            <span class="search-team-card__members-count" role="img" :aria-label="membersCountLabel">
              <Icon name="lucide:users" aria-hidden="true" />
              <span aria-hidden="true">{{ membersCountValue }}</span>
            </span>
          </dd>
        </div>
      </dl>

      <NuxtLinkLocale class="search-team-card__profile-link" :to="props.profilePath">
        {{ props.profileLabel }}
      </NuxtLinkLocale>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { SearchTeamPresenter } from '@neeft-sas/shared'
import type { PropType } from 'vue'
import { getSearchAvatarFallback, getSearchBannerFallback } from '~/utils/searchFallbackMedia'

type SearchTeamCardMetaItem = {
  label: string
  icon: string
  imageSrc: string
}

type SearchTeamCardPlaceholderItem = {
  label: string
  icon: string
}

const props = defineProps({
  team: {
    type: Object as PropType<SearchTeamPresenter>,
    required: true
  },
  profilePath: {
    type: String,
    required: true
  },
  profileLabel: {
    type: String,
    default: 'Voir l\'equipe'
  },
  placeholderItem: {
    type: Object as PropType<SearchTeamCardPlaceholderItem>,
    default: () => ({
      label: 'Non renseigne',
      icon: 'lucide:circle-question-mark'
    })
  }
})

const isImageSource = (value: string) => {
  return /^(https?:\/\/|\/\/|\/|data:image\/|blob:)/.test(value)
    || /\.(avif|bmp|gif|jpe?g|png|svg|webp)([?#].*)?$/i.test(value)
}

const normalizeImageSource = (value: string) => {
  const source = value
  if (!source) return ''

  return /^(https?:\/\/|\/\/|\/|data:image\/|blob:)/.test(source)
    ? source
    : `/${source.replace(/^\/+/, '')}`
}

const toMetaItem = (label: string, icon: string): SearchTeamCardMetaItem => {
  const source = icon || props.placeholderItem.icon

  return {
    label: label || props.placeholderItem.label,
    icon: isImageSource(source) ? props.placeholderItem.icon : source,
    imageSrc: isImageSource(source) ? normalizeImageSource(source) : ''
  }
}

const teamGameItems = computed(() => {
  return props.team.games
})

const teamGames = computed(() => {
  if (teamGameItems.value.length) {
    return teamGameItems.value.map(game => toMetaItem(game.shortLabel || game.name, game.icon || props.placeholderItem.icon))
  }

  return [toMetaItem(props.placeholderItem.label, props.placeholderItem.icon)]
})

const teamSeed = computed(() => props.team.slug || props.team.name)
const teamName = computed(() => props.team.name || props.placeholderItem.label)
const teamHandle = computed(() => props.team.handle || `@${teamSeed.value}`)
const teamLogo = computed(() => props.team.logoUrl || getSearchAvatarFallback(teamSeed.value))
const teamBanner = computed(() => props.team.bannerUrl || getSearchBannerFallback(`${teamSeed.value}-banner`))
const teamStatusLabel = computed(() => props.team.recruitLabel || (props.team.openings > 0 ? 'Recrute' : 'Complet'))
const teamStatusTone = computed(() => props.team.openings > 0 ? 'open' : 'busy')

const activeTeamGame = computed(() => {
  return teamGameItems.value.find(game => game.key === props.team.activeGameKey)
    || teamGameItems.value[0]
    || null
})

const countryCodeLabel = computed(() => {
  const fallbackCountryCode = props.team.flags[0] || ''

  return String(props.team.countryCode || fallbackCountryCode || '').toUpperCase()
})

const countryFlag = computed(() => {
  if (!/^[A-Z]{2}$/.test(countryCodeLabel.value)) return ''

  return Array.from(countryCodeLabel.value)
    .map(letter => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join('')
})

const membersCountLabel = computed(() => {
  if (!membersCountValue.value) return 'Effectif non renseigne'

  const roundedMembersCount = Number(membersCountValue.value)
  return `${roundedMembersCount} membre${roundedMembersCount > 1 ? 's' : ''}`
})

const membersCountValue = computed(() => {
  const composition = activeTeamGame.value?.composition
  const membersCount = Number(composition?.players || 0) + Number(composition?.staff || 0)
  if (!Number.isFinite(membersCount) || membersCount <= 0) return ''

  return String(Math.round(membersCount))
})
</script>

<style scoped>
.search-team-card {
  border-radius: var(--search-radius);
  background-color: var(--search-color-section);
  box-shadow: 0 var(--search-space-3) var(--search-space-8) var(--search-color-shadow);

  @apply grid h-full overflow-hidden;
}

.search-team-card__visual {
  height: var(--search-team-visual-height);
  background-color: var(--search-color-panel-soft);

  @apply relative overflow-hidden;
}

.search-team-card__banner {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-team-card__visual::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--search-color-transparent), var(--search-color-overlay-mid), var(--search-color-panel));
  content: "";
}

.search-team-card__photo {
  width: var(--search-player-photo-size);
  height: var(--search-player-photo-size);
  border: var(--search-border) solid var(--search-color-panel-line);
  border-radius: var(--search-radius);
  background-color: var(--search-color-panel);
  object-fit: cover;

  @apply shrink-0;
}

.search-team-card__identity {
  position: absolute;
  bottom: var(--search-space-3);
  left: var(--search-space-3);
  z-index: 1;
  gap: var(--search-space-1);
  color: var(--search-color-text);

  @apply flex items-center;
}

.search-team-card__identity h2,
.search-team-card__identity p {
  margin: 0;
}

.search-team-card__identity h2 {
  font-size: var(--search-font-card-title);
  line-height: var(--search-line-title);
  overflow-wrap: anywhere;

  @apply font-semibold;
}

.search-team-card__identity p {
  color: var(--search-color-muted);
  font-size: calc(var(--search-font-small) * 0.92);
  line-height: var(--search-line-tight);
}

.search-team-card__content {
  padding: var(--search-space-3);
  gap: var(--search-space-2);

  @apply grid;
}

.search-team-card__country,
.search-team-card__status {
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

.search-team-card__country {
  left: var(--search-space-2);
  font-size: calc(var(--search-font-card-title) * 0.92);
  line-height: 1;
}

.search-team-card__status {
  right: var(--search-space-2);
  border: var(--search-border) solid currentcolor;
}

.search-team-card__status--open {
  border-color: var(--search-color-open);
  color: var(--search-color-open);
}

.search-team-card__status--busy {
  border-color: var(--search-color-busy);
  color: var(--search-color-busy);
}

.search-team-card__footer {
  --search-team-footer-icon-size: calc(var(--search-fact-icon-size) * 0.75);
  --search-team-footer-row-size: calc(var(--search-team-footer-icon-size) * 1.35);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--search-space-2);
  margin: 0;

  @apply grid items-center;
}

.search-team-card__footer div {
  min-height: var(--search-team-footer-row-size);
  gap: var(--search-space-1);
  align-content: center;
  text-align: center;

  @apply grid;
}

.search-team-card__footer dd {
  min-height: var(--search-team-footer-row-size);
  gap: var(--search-space-1);
  margin: 0;
  color: var(--search-color-muted);
  font-size: var(--search-font-small);
  line-height: 1;

  @apply flex flex-wrap items-center justify-center;
}

.search-team-card__icon-item,
.search-team-card__members-count {
  gap: var(--search-space-1);
  min-width: var(--search-team-footer-icon-size);
  min-height: var(--search-team-footer-icon-size);
  color: var(--search-color-subtle);
  line-height: 1;

  @apply inline-flex items-center justify-center;
}

.search-team-card__icon-asset,
.search-team-card__icon-item svg,
.search-team-card__members-count svg {
  display: block;
  width: var(--search-team-footer-icon-size);
  height: var(--search-team-footer-icon-size);
}

.search-team-card__icon-asset {
  object-fit: contain;
}

.search-team-card__icon-item svg,
.search-team-card__members-count svg {
  color: var(--search-color-accent);
}

.search-team-card__members-count {
  font-size: var(--search-font-small);
  line-height: var(--search-line-tight);

  @apply font-semibold;
}

.search-team-card__profile-link {
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

.search-team-card__profile-link:hover {
  color: var(--search-color-text);
}
</style>
