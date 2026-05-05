<template>
  <section class="player-profile-hero">
    <div class="player-profile-shell">
      <div class="player-profile-hero__banner">
        <NuxtImg
          v-if="profile?.bannerPicture"
          :src="profile.bannerPicture"
          :alt="`Banniere du profil ${profile?.username || ''}`"
          width="1440"
          height="360"
          loading="eager"
          decoding="async"
        />
        <div v-if="canEdit" class="player-profile-hero__edit-action">
          <CustomButton
            label=""
            left-icon="lucide:pen-line"
            theme="app"
            variant="ghost"
            color="secondary"
            size="sm"
            shape="circle"
            aria-label="Modifier la banniere"
          />
        </div>

        <div class="player-profile-hero__identity">
          <div class="player-profile-hero__logo-stack">
            <CustomAvatar
              :src="profile?.logoPicture"
              :alt="`Logo du profil ${profile?.username || ''}`"
              :name="profile?.username"
              size="3xl"
              shape="square"
              theme="app"
              color="neutral"
            />
            <CustomButton
              v-if="canEdit"
              class="player-profile-hero__logo-action"
              label=""
              left-icon="lucide:pen-line"
              theme="app"
              variant="outlined"
              color="secondary"
              size="sm"
              shape="circle"
              aria-label="Modifier le logo"
            />
          </div>

          <div class="player-profile-hero__copy">
            <h1 id="player-profile-title">
              {{ profile?.username }}
            </h1>
            <p>@{{ profile?.slug }}</p>

            <ul class="player-profile-hero__meta" aria-label="Etat du profil">
              <li>
                <span class="player-profile-status-dot" aria-hidden="true" />
                Hors ligne
              </li>
              <li>Inscrit il y a plus de 3 ans</li>
            </ul>
          </div>

          <div class="player-profile-hero__actions" aria-label="Actions principales">
            <CustomButton
              label=""
              left-icon="lucide:message-circle"
              theme="app"
              variant="filled"
              color="primary"
              size="sm"
              shape="circle"
              aria-label="Envoyer un message"
            />
            <CustomButton
              label=""
              left-icon="lucide:share-2"
              theme="app"
              variant="outlined"
              color="secondary"
              size="sm"
              shape="circle"
              aria-label="Partager le profil"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { PlayerProfilePresenter } from '@neeft-sas/shared'
import { isNativeImageSource } from '~/utils/imageSources'

const props = defineProps({
  profile: { type: Object as PropType<PlayerProfilePresenter>, required: true },
  canEdit: { type: Boolean, default: false }
})
</script>

<style>
.player-profile-hero {
  padding: var(--profile-space-8) 0 var(--profile-space-4);
  background-color: var(--profile-color-bg-soft);
}

.player-profile-shell {
  width: min(calc(100% - (var(--profile-space-fluid) * 2)), var(--profile-content-max));
  margin: 0 auto;
}

.player-profile-hero__banner {
  position: relative;
  overflow: hidden;
  height: var(--profile-banner-height);
  border: var(--profile-border) solid var(--profile-color-border);
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel);
}

.player-profile-hero__banner::after {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, oklch(0% 0 0 / 0.05), oklch(0% 0 0 / 0.62));
  content: "";
}

.player-profile-hero__banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-profile-hero__edit-action {
  position: absolute;
  right: var(--profile-space-3);
  top: var(--profile-space-3);
  z-index: 3;
}

.player-profile-hero__identity {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--profile-space-4);
  align-items: end;
  max-height: 100%;
  padding: var(--profile-space-4);
  overflow: hidden;
  background: linear-gradient(180deg, oklch(0% 0 0 / 0), oklch(0% 0 0 / 0.42));
}

.player-profile-hero__logo-stack {
  position: relative;
  width: var(--profile-logo-size);
  height: var(--profile-logo-size);
}

.player-profile-hero__logo-action {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(var(--profile-space-1), calc(var(--profile-space-1) * -1));
  z-index: 3;
}

.player-profile-hero__copy {
  display: grid;
  gap: var(--profile-space-1);
}

.player-profile-eyebrow,
.player-profile-hero__copy h1,
.player-profile-hero__copy p {
  margin: 0;
}

.player-profile-eyebrow {
  color: var(--profile-color-subtle);
  font-size: var(--profile-font-label);
  font-weight: 800;
  line-height: var(--profile-line-body);
  text-transform: uppercase;
}

.player-profile-hero__copy h1 {
  font-size: var(--profile-font-title);
  font-weight: 900;
  line-height: var(--profile-line-tight);
  overflow-wrap: anywhere;
}

.player-profile-hero__copy p,
.player-profile-hero__meta {
  color: var(--profile-color-muted);
  font-size: var(--profile-font-small);
  line-height: var(--profile-line-body);
}

.player-profile-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.player-profile-status-dot {
  display: inline-block;
  width: var(--profile-space-2);
  height: var(--profile-space-2);
  margin-right: var(--profile-space-1);
  border-radius: var(--profile-radius-round);
  background-color: var(--profile-color-danger);
}

.player-profile-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-space-2);
  justify-content: end;
}

@media (max-width: 62rem) {
  .player-profile-hero__identity {
    grid-template-columns: 1fr;
  }

  .player-profile-hero__actions {
    justify-content: start;
  }
}

@media (max-width: 40rem) {
  .player-profile-hero__identity {
    padding: var(--profile-space-3);
  }
}
</style>
