<template>
  <article class="player-profile-game-card">
    <div class="player-profile-game-card__visual">
      <NuxtImg
        class="player-profile-game-card__banner"
        :src="rscGame?.banner || '/placeholder-game.jpg'"
        :alt="`Bannière de ${rscGame?.name}`"
        width="320"
        height="160"
        loading="lazy"
        decoding="async"
      />

      <div class="player-profile-game-card__actions player-profile-game-card__actions--left">
        <a
          v-if="game.trackerUrl"
          class="player-profile-game-card__action"
          :href="game.trackerUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="`Ouvrir le tracker ${rscGame?.name}`"
        >
          <Icon name="lucide:radar" aria-hidden="true" />
        </a>

        <button
          v-if="game.rscGameCharacters?.length"
          type="button"
          class="player-profile-game-card__action"
          :class="{ 'player-profile-game-card__action--active': showCharacters }"
          :aria-pressed="showCharacters"
          :aria-label="showCharacters ? `Masquer les personnages ${rscGame?.name}` : `Afficher les personnages ${rscGame?.name}`"
          @click="toggleCharacters"
        >
          <Icon :name="showCharacters ? 'lucide:x' : 'lucide:users'" aria-hidden="true" />
        </button>
      </div>

      <div class="player-profile-game-card__identity">
        <div>
          <h3>{{ rscGame?.name }}</h3>
        </div>
      </div>
    </div>

    <div class="player-profile-game-card__content">
      <div v-if="showCharacters" class="player-profile-game-card__characters" :aria-label="`Personnages ${rscGame?.name}`">
        <ul class="player-profile-game-card__character-list" role="list">
          <li
            v-for="character in game.rscGameCharacters"
            :key="`character-full-${game.id}-${character.id}`"
            class="player-profile-game-card__character"
            :aria-label="character.name"
          >
            <span class="player-profile-game-card__character-icon" aria-hidden="true">
              <NuxtImg
                v-if="character.icon?.startsWith('http')"
                :src="character.icon"
                :alt="character.name"
                width="40"
                height="40"
                loading="lazy"
                decoding="async"
              />
              <Icon v-else :name="character.icon || 'lucide:circle'" />
            </span>
          </li>
        </ul>
      </div>

      <template v-else>
        <div v-if="game.modeRanks?.length > 1" class="player-profile-game-card__modes" role="tablist" aria-label="Modes de jeu">
          <CustomRouteTabs
            :key="`tab-modes-${rscGame?.name || game.id}`"
            :items="game.modeRanks.map(modeRank => ({
              label: modeRank.rscGameMode.name,
              value: String(modeRank.rscGameMode.id)
            }))"
            :model-value="String(game.modeRanks[0]?.rscGameMode.id || '')"
            :aria-label="`Modes de jeu ${rscGame?.name || ''}`"
            theme="app"
            size="sm"
            full-width
          />
        </div>

        <dl class="player-profile-game-card__footer" aria-label="Informations du jeu">
          <div v-if="game.modeRanks?.length" class="player-profile-game-card__footer-group player-profile-game-card__rank" :aria-label="`Rangs`">
            <dt class="sr-only">Rangs</dt>
            <dd>
              <span
                v-for="modeRank in game.modeRanks"
                :key="`rank-${game.id}-${modeRank.rscGameMode.id}`"
                class="player-profile-game-card__icon-item"
                :aria-label="`${modeRank.rscGameMode.name}: ${modeRank.rscGameRank.name}`"
              >
                <NuxtImg
                  v-if="modeRank.rscGameRank.icon?.startsWith('http')"
                  :src="modeRank.rscGameRank.icon"
                  :alt="modeRank.rscGameRank.name"
                  width="32"
                  height="32"
                  loading="lazy"
                  decoding="async"
                />
                <Icon v-else :name="modeRank.rscGameRank.icon || 'lucide:award'" aria-hidden="true" />
              </span>
            </dd>
          </div>

          <div v-if="game.rscGamePositions?.length" class="player-profile-game-card__footer-group">
            <dt class="sr-only">Positions</dt>
            <dd aria-label="Positions">
              <span
                v-for="position in game.rscGamePositions"
                :key="`position-${game.id}-${position.id}`"
                class="player-profile-game-card__icon-item"
                :aria-label="position.name"
              >
                <Icon :name="position.icon || 'lucide:circle'" aria-hidden="true" />
              </span>
            </dd>
          </div>

          <div v-if="game.rscGamePlatforms?.length" class="player-profile-game-card__footer-group">
            <dt class="sr-only">Plateformes</dt>
            <dd aria-label="Plateformes">
              <span
                v-for="platform in game.rscGamePlatforms"
                :key="`platform-${game.id}-${platform.id}`"
                class="player-profile-game-card__icon-item"
                :aria-label="platform.name"
              >
                <Icon :name="platform.icon || 'lucide:monitor'" aria-hidden="true" />
              </span>
            </dd>
          </div>
        </dl>
      </template>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { UserGamePresenter } from '@neeft-sas/shared'

const props = defineProps({
  game: {
    type: Object as PropType<UserGamePresenter>,
    required: true
  },
  canEdit: {
    type: Boolean,
    default: false
  }
})

const { game: rscGame } = useGameResources(() => props.game?.gameId)

const showCharacters = ref(false)

const toggleCharacters = () => {
  showCharacters.value = !showCharacters.value
}
</script>

<style scoped>
.player-profile-game-card {
  display: grid;
  grid-template-rows: var(--profile-game-visual-height) minmax(var(--profile-game-content-min-height), 1fr);
  height: 100%;
  overflow: hidden;
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel-strong);
  box-shadow: 0 var(--profile-space-3) var(--profile-space-8) var(--profile-color-shadow);
}

.player-profile-game-card__visual {
  position: relative;
  height: var(--profile-game-visual-height);
  overflow: hidden;
  background-color: var(--profile-color-panel);
}

.player-profile-game-card__banner {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-profile-game-card__visual::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--profile-color-transparent), var(--profile-color-overlay-mid), var(--profile-color-panel-strong));
  content: "";
}

.player-profile-game-card__actions {
  position: absolute;
  top: var(--profile-space-2);
  z-index: 1;
  display: inline-flex;
  gap: var(--profile-space-1);
  align-items: center;
}

.player-profile-game-card__actions--left {
  left: var(--profile-space-2);
}

.player-profile-game-card__actions--right {
  right: var(--profile-space-2);
}

.player-profile-game-card__action {
  display: inline-flex;
  width: var(--profile-hit-size);
  height: var(--profile-hit-size);
  align-items: center;
  justify-content: center;
  padding: 0;
  border: var(--profile-border) solid color-mix(in oklch, var(--profile-color-border) 78%, var(--profile-color-transparent));
  border-radius: var(--profile-radius);
  background-color: color-mix(in oklch, var(--profile-color-panel) 88%, var(--profile-color-transparent));
  color: var(--profile-color-text);
  cursor: pointer;
  text-decoration: none;
  transition-duration: var(--motion-fast);
}

.player-profile-game-card__action:focus-visible {
  outline: calc(var(--profile-border) * 2) solid color-mix(in oklch, var(--profile-color-focus) 72%, var(--profile-color-transparent));
  outline-offset: calc(var(--profile-border) * 2);
}

.player-profile-game-card__action:hover {
  border-color: color-mix(in oklch, var(--profile-color-border) 54%, var(--profile-color-accent));
  background-color: color-mix(in oklch, var(--profile-color-panel) 78%, var(--profile-color-accent));
  color: var(--profile-color-accent);
}

.player-profile-game-card__action--active {
  border-color: color-mix(in oklch, var(--profile-color-accent) 72%, var(--profile-color-border));
  background-color: color-mix(in oklch, var(--profile-color-accent) 18%, var(--profile-color-panel));
  color: var(--profile-color-accent);
}

.player-profile-game-card__action svg {
  width: var(--profile-icon-size);
  height: var(--profile-icon-size);
}

.player-profile-game-card__identity {
  position: absolute;
  bottom: var(--profile-space-3);
  left: var(--profile-space-3);
  z-index: 1;
  display: flex;
  align-items: center;
  gap: var(--profile-space-1);
  color: var(--profile-color-text);
}

.player-profile-game-card__identity h3 {
  margin: 0;
  color: var(--profile-color-text);
  font-size: var(--profile-font-body);
  font-weight: 900;
  line-height: var(--profile-line-title);
  overflow-wrap: anywhere;
}

.player-profile-game-card__content {
  display: grid;
  min-height: var(--profile-game-content-min-height);
  padding: var(--profile-space-1) var(--profile-space-3) var(--profile-space-3) var(--profile-space-3);
  background-color: inherit;
}

.player-profile-game-card__modes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-space-1);
  margin-bottom: var(--profile-space-2);
}

.player-profile-game-card__characters {
  display: grid;
  gap: var(--profile-space-2);
}

.player-profile-game-card__character-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--profile-game-icon-shell-size), 1fr));
  gap: var(--profile-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.player-profile-game-card__character {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.player-profile-game-card__character-icon {
  display: inline-flex;
  flex: 0 0 auto;
  width: var(--profile-game-icon-shell-size);
  height: var(--profile-game-icon-shell-size);
  align-items: center;
  justify-content: center;
  border-radius: var(--profile-radius);
  background-color: color-mix(in oklch, var(--profile-color-panel) 78%, var(--profile-color-transparent));
  color: var(--profile-color-accent);
}

.player-profile-game-card__character-icon svg {
  width: var(--profile-fact-icon-size);
  height: var(--profile-fact-icon-size);
}

.player-profile-game-card__character-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--profile-radius);
}

.player-profile-game-card__footer {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--profile-space-2);
  align-items: center;
  justify-content: center;
  margin: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.player-profile-game-card__footer::-webkit-scrollbar {
  display: none;
}

.player-profile-game-card__footer-group {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: var(--profile-space-1);
}

.player-profile-game-card__footer-group + .player-profile-game-card__footer-group {
  padding-inline-start: var(--profile-space-2);
  border-inline-start: var(--profile-border) solid color-mix(in oklch, var(--profile-color-border) 72%, var(--profile-color-transparent));
}

.player-profile-game-card__footer dd {
  display: inline-flex;
  flex-wrap: nowrap;
  gap: var(--profile-space-1);
  align-items: center;
  margin: 0;
  color: var(--profile-color-muted);
  font-size: var(--profile-font-small);
  line-height: var(--profile-line-tight);
}

.player-profile-game-card__rank {
  color: var(--profile-color-accent);
}

.player-profile-game-card__icon-item {
  display: inline-flex;
  width: var(--profile-game-icon-shell-size);
  height: var(--profile-game-icon-shell-size);
  align-items: center;
  justify-content: center;
  border: var(--profile-border) solid color-mix(in oklch, var(--profile-color-border) 78%, var(--profile-color-transparent));
  border-radius: var(--profile-radius);
  background-color: color-mix(in oklch, var(--profile-color-panel) 90%, var(--profile-color-transparent));
  color: var(--profile-color-subtle);
}

.player-profile-game-card__icon-item svg {
  width: var(--profile-game-fact-icon-size);
  height: var(--profile-game-fact-icon-size);
  color: var(--profile-color-accent);
}

.player-profile-game-card__rank .player-profile-game-card__icon-item svg,
.player-profile-game-card__rank .player-profile-game-card__icon-item img {
  width: var(--profile-game-rank-icon-size);
  height: var(--profile-game-rank-icon-size);
}

.player-profile-game-card__icon-item img {
  width: var(--profile-game-fact-icon-size);
  height: var(--profile-game-fact-icon-size);
  object-fit: contain;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
