<template>
  <article class="search-players-player">
    <div class="search-players-player__visual">
      <img
        class="search-players-player__banner"
        :src="playerBanner"
        :alt="`Banniere de ${playerName}`"
        width="320"
        height="160"
        loading="lazy"
        decoding="async"
      >

      <span
        v-if="countryFlag"
        class="search-players-player__country"
        :aria-label="`Pays ${countryCodeLabel}`"
      >
        {{ countryFlag }}
      </span>

      <span
        v-if="playerAgeLabel"
        class="search-players-player__age"
        :aria-label="`Age ${playerAgeLabel}`"
      >
        {{ playerAgeLabel }}
      </span>

      <div class="search-players-player__identity">
        <img
          class="search-players-player__photo"
          :src="playerAvatar"
          :alt="`Photo de ${playerName}`"
          width="96"
          height="96"
          loading="lazy"
          decoding="async"
        >
        <div>
          <h2>{{ playerName }}</h2>
          <p>{{ playerHandle }}</p>
        </div>
      </div>
    </div>

    <div class="search-players-player__content">
      <dl class="search-players-player__footer">
        <div class="search-players-player__rank" :aria-label="`Rang ${playerRankMetaItem.label}`">
          <dd>
            <span class="search-players-player__icon-item" :aria-label="playerRankMetaItem.label">
              <NuxtImg
                v-if="playerRankMetaItem.imageSrc"
                class="search-players-player__icon-asset"
                :src="playerRankMetaItem.imageSrc"
                :alt="playerRankMetaItem.label"
                fit="contain"
                loading="lazy"
                decoding="async"
              />
              <IconifyIcon
                v-else-if="playerRankMetaItem.iconRenderer === 'iconify'"
                :icon="playerRankMetaItem.icon"
                aria-hidden="true"
              />
              <Icon v-else :name="playerRankMetaItem.icon" aria-hidden="true" />
            </span>
          </dd>
        </div>

        <div>
          <dd aria-label="Positions">
            <span
              v-for="position in withPlaceholder(playerPositions)"
              :key="`position-${props.player.id}-${position.label}`"
              class="search-players-player__icon-item"
              :aria-label="position.label"
            >
              <NuxtImg
                v-if="position.imageSrc"
                class="search-players-player__icon-asset"
                :src="position.imageSrc"
                :alt="position.label"
                fit="contain"
                loading="lazy"
                decoding="async"
              />
              <IconifyIcon
                v-else-if="position.iconRenderer === 'iconify'"
                :icon="position.icon"
                aria-hidden="true"
              />
              <Icon v-else :name="position.icon" aria-hidden="true" />
            </span>
          </dd>
        </div>

        <div>
          <dd aria-label="Plateformes">
            <span
              v-for="platform in withPlaceholder(playerPlatforms)"
              :key="`platform-${props.player.id}-${platform.label}`"
              class="search-players-player__icon-item"
              :aria-label="platform.label"
            >
              <NuxtImg
                v-if="platform.imageSrc"
                class="search-players-player__icon-asset"
                :src="platform.imageSrc"
                :alt="platform.label"
                fit="contain"
                loading="lazy"
                decoding="async"
              />
              <IconifyIcon
                v-else-if="platform.iconRenderer === 'iconify'"
                :icon="platform.icon"
                aria-hidden="true"
              />
              <Icon v-else :name="platform.icon" aria-hidden="true" />
            </span>
          </dd>
        </div>
      </dl>

      <NuxtLinkLocale class="search-players-player__profile-link" :to="props.profilePath">
        {{ profileLabel }}
      </NuxtLinkLocale>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue'
import type {
  RscGameCharacterPresenter,
  RscGamePlatformPresenter,
  RscGamePositionPresenter,
  RscGamePresenter,
  RscGameRankPresenter,
  SearchPlayerGameModeRankPresenter,
  SearchPlayerGamePresenter,
  SearchPlayerPresenter
} from '@neeft-sas/shared'
import type { PropType } from 'vue'
import { getSearchAvatarFallback, getSearchBannerFallback } from '~/utils/searchFallbackMedia'

type SearchPlayerCardIconRenderer = 'nuxt' | 'iconify'

type SearchPlayerCardPlaceholderItem = {
  label: string
  icon: string
}

type SearchPlayerCardMetaItem = {
  label: string
  icon: string
  iconRenderer: SearchPlayerCardIconRenderer
  imageSrc: string
}

type SearchPlayerDisplayExtras = {
  age?: number | null
  countryCode?: string | null
  nationalityId?: string | null
}

type SearchPlayerResourceItem =
  | RscGamePresenter
  | RscGameRankPresenter
  | RscGamePlatformPresenter
  | RscGamePositionPresenter
  | RscGameCharacterPresenter

const props = defineProps({
  player: {
    type: Object as PropType<SearchPlayerPresenter>,
    required: true
  },
  profilePath: {
    type: String,
    required: true
  },
  selectedGameId: {
    type: Number,
    default: 0
  },
  selectedModeId: {
    type: Number,
    default: 0
  },
  profileLabel: {
    type: String,
    default: ''
  },
  placeholderItem: {
    type: Object as PropType<SearchPlayerCardPlaceholderItem>,
    default: () => ({
      label: 'Non renseigne',
      icon: 'lucide:circle-question-mark'
    })
  }
})

const { t } = useI18n()

const profileLabel = computed(() => props.profileLabel || t('app.search.cards.viewProfile'))

const nuxtIconPrefixes = new Set(['lucide', 'logos', 'simple-icons'])
const customIconProvidersByPrefix = new Map([
  ['apex-legends', 'games'],
  ['experience', 'user'],
  ['league-of-legends', 'games'],
  ['rocket-league', 'games'],
  ['valorant', 'games']
])

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

const normalizeIconSource = (value: string) => {
  const icon = value
  if (!icon || icon.startsWith('@')) return icon

  const [prefix] = icon.split(':')
  const provider = customIconProvidersByPrefix.get(prefix || '')

  return provider ? `@${provider}:${icon}` : icon
}

const getIconRenderer = (icon: string): SearchPlayerCardIconRenderer => {
  const normalizedIcon = normalizeIconSource(icon)
  const iconName = normalizedIcon.startsWith('@')
    ? normalizedIcon.split(':')[1]
    : normalizedIcon
  const [prefix] = (iconName || '').split(':')

  return prefix && nuxtIconPrefixes.has(prefix) ? 'nuxt' : 'iconify'
}

const toMetaItem = (label: string, icon: string, fallbackIcon: string): SearchPlayerCardMetaItem => {
  const source = icon || fallbackIcon
  const imageSrc = isImageSource(source) ? normalizeImageSource(source) : ''
  const normalizedIcon = imageSrc ? normalizeIconSource(fallbackIcon) : normalizeIconSource(source)

  return {
    label,
    icon: normalizedIcon,
    iconRenderer: getIconRenderer(normalizedIcon),
    imageSrc
  }
}

const mapSearchResourceItem = (
  item: SearchPlayerResourceItem | null | undefined,
  fallbackIcon: string
) => {
  const label = item?.name || ''
  if (!label) return null

  return toMetaItem(label, item?.icon || '', fallbackIcon)
}

const playerWithExtras = computed(() => props.player as SearchPlayerPresenter & SearchPlayerDisplayExtras)

const playerSeed = computed(() => {
  return props.player.slug || props.player.id
})

const playerName = computed(() => {
  return props.player.username || props.player.slug || props.placeholderItem.label
})

const playerHandle = computed(() => {
  const slug = props.player.slug
  return slug ? `@${slug}` : props.player.id
})

const playerAvatar = computed(() => {
  return props.player.profilePicture || getSearchAvatarFallback(playerSeed.value)
})

const playerBanner = computed(() => {
  return props.player.bannerPicture || getSearchBannerFallback(`${playerSeed.value}-banner`)
})

const preferredGame = computed<SearchPlayerGamePresenter | null>(() => {
  const games = props.player.games
  if (!games.length) return null

  return games.find(item => item.game?.id === props.selectedGameId)
    || games.find(item => item.isFavoriteGame)
    || games[0]
    || null
})

const preferredModeRank = computed<SearchPlayerGameModeRankPresenter | null>(() => {
  const modeRanks = preferredGame.value?.modeRanks || []
  if (!modeRanks.length) return null

  return modeRanks.find(item => item.rscGameMode?.id === props.selectedModeId)
    || modeRanks[0]
    || null
})

const playerRank = computed(() => {
  return mapSearchResourceItem(preferredModeRank.value?.rscGameRank, 'lucide:trophy')
})

const playerPositions = computed(() => {
  return (preferredGame.value?.rscGamePositions || [])
    .map(position => mapSearchResourceItem(position, 'lucide:crosshair'))
    .filter((item): item is SearchPlayerCardMetaItem => Boolean(item))
})

const playerPlatforms = computed(() => {
  return (preferredGame.value?.rscGamePlatforms || [])
    .map(platform => mapSearchResourceItem(platform, 'lucide:monitor'))
    .filter((item): item is SearchPlayerCardMetaItem => Boolean(item))
})

const placeholderMetaItem = computed(() => {
  return toMetaItem(props.placeholderItem.label, props.placeholderItem.icon, 'lucide:circle-question-mark')
})

const playerRankMetaItem = computed(() => {
  return playerRank.value || placeholderMetaItem.value
})

const withPlaceholder = (items: SearchPlayerCardMetaItem[]) => {
  return items.length ? items : [placeholderMetaItem.value]
}

const countryCodeLabel = computed(() => {
  return String(playerWithExtras.value.countryCode || playerWithExtras.value.nationalityId || '').toUpperCase()
})

const countryFlag = computed(() => {
  if (!/^[A-Z]{2}$/.test(countryCodeLabel.value)) return ''

  return Array.from(countryCodeLabel.value)
    .map(letter => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join('')
})

const playerAgeLabel = computed(() => {
  const ageValue = Number(playerWithExtras.value.age)

  if (typeof ageValue !== 'number' || !Number.isFinite(ageValue)) return ''

  return `${Math.round(ageValue)} ans`
})
</script>

<style scoped>
.search-players-player {
  border-radius: var(--search-radius);
  background-color: var(--search-color-section);
  box-shadow: 0 var(--search-space-3) var(--search-space-8) var(--search-color-shadow);

  @apply grid h-full overflow-hidden;
}

.search-players-player__visual {
  height: var(--search-player-visual-height);
  background-color: var(--search-color-panel-soft);

  @apply relative overflow-hidden;
}

.search-players-player__banner {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-players-player__visual::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--search-color-transparent), var(--search-color-overlay-mid), var(--search-color-panel));
  content: "";
}

.search-players-player__photo {
  width: var(--search-player-photo-size);
  height: var(--search-player-photo-size);
  border: var(--search-border) solid var(--search-color-panel-line);
  border-radius: var(--search-radius);
  background-color: var(--search-color-panel);
  object-fit: cover;

  @apply shrink-0;
}

.search-players-player__identity {
  position: absolute;
  bottom: var(--search-space-3);
  left: var(--search-space-3);
  z-index: 1;
  gap: var(--search-space-1);
  color: var(--search-color-text);

  @apply flex items-center;
}

.search-players-player__identity h2,
.search-players-player__identity p {
  margin: 0;
}

.search-players-player__identity h2 {
  font-size: var(--search-font-card-title);
  line-height: var(--search-line-title);
  overflow-wrap: anywhere;

  @apply font-semibold;
}

.search-players-player__identity p {
  color: var(--search-color-muted);
  font-size: calc(var(--search-font-small) * 0.92);
  line-height: var(--search-line-tight);
}

.search-players-player__content {
  padding: var(--search-space-3);

  @apply grid;
}

.search-players-player__country,
.search-players-player__age {
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

.search-players-player__country {
  left: var(--search-space-2);
  font-size: calc(var(--search-font-card-title) * 0.92);
  line-height: 1;
}

.search-players-player__age {
  right: var(--search-space-2);
  color: var(--search-color-text);
}

.search-players-player__footer {
  --search-player-footer-icon-size: calc(var(--search-fact-icon-size) * 0.75);
  --search-player-rank-icon-size: calc(var(--search-player-footer-icon-size) * 1.35);
  --search-player-footer-row-size: var(--search-player-rank-icon-size);
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--search-space-2);
  margin: 0;

  @apply grid items-center;
}

.search-players-player__footer div {
  min-height: var(--search-player-footer-row-size);
  gap: var(--search-space-1);
  align-content: center;
  text-align: center;

  @apply grid;
}

.search-players-player__footer dd {
  min-height: var(--search-player-footer-row-size);
  gap: var(--search-space-1);
  margin: 0;
  color: var(--search-color-muted);
  font-size: var(--search-font-small);
  line-height: 1;

  @apply flex flex-wrap items-center justify-center;
}

.search-players-player__rank {
  color: var(--search-color-accent);
}

.search-players-player__icon-item {
  gap: var(--search-space-1);
  min-width: var(--search-player-footer-icon-size);
  min-height: var(--search-player-footer-icon-size);
  color: var(--search-color-subtle);
  line-height: 0;

  @apply inline-flex items-center justify-center;
}

.search-players-player__icon-asset,
.search-players-player__icon-item :deep(svg) {
  display: block;
  width: var(--search-player-footer-icon-size);
  height: var(--search-player-footer-icon-size);
}

.search-players-player__icon-asset {
  object-fit: contain;
}

.search-players-player__rank .search-players-player__icon-asset {
  width: var(--search-player-rank-icon-size);
  height: var(--search-player-rank-icon-size);
}

.search-players-player__icon-item :deep(svg) {
  color: var(--search-color-accent);
}

.search-players-player__profile-link {
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

.search-players-player__profile-link:hover {
  color: var(--search-color-text);
}
</style>
