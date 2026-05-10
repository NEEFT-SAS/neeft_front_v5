<template>
  <article class="player-profile-staff-card" :data-variant="role.variant || 'operations'">
    <header class="player-profile-staff-card__header">
      <div class="player-profile-staff-card__identity">
        <span class="player-profile-staff-card__logo" :aria-label="role.roleLabel">
          <Icon :name="role.roleIcon || 'lucide:user-cog'" aria-hidden="true" />
        </span>
        <div>
          <h3>{{ role.roleLabel }}</h3>
          <p>{{ role.payload?.level || 'À définir' }}</p>
        </div>
      </div>

      <div v-if="canEdit" class="player-profile-staff-card__actions" aria-label="Actions du role staff">
        <CustomButton
          label=""
          left-icon="lucide:pencil"
          theme="app"
          variant="ghost"
          color="secondary"
          size="sm"
          shape="circle"
          :aria-label="`Modifier ${role.roleLabel}`"
          @click="emit('edit', role.id)"
        />
        <CustomButton
          label=""
          left-icon="lucide:trash-2"
          theme="app"
          variant="ghost"
          color="secondary"
          size="sm"
          shape="circle"
          :aria-label="`Supprimer ${role.roleLabel}`"
          @click="emit('delete', role.id)"
        />
      </div>
    </header>

    <div class="player-profile-staff-card__content">
      <div class="player-profile-staff-card__details">
        <div class="player-profile-staff-card__icon-row" aria-label="Jeux et outils">
          <ul v-if="role.payload?.games?.length" class="player-profile-staff-card__icon-list" aria-label="Jeux">
            <li v-for="item in role.payload.games" :key="`game-${item.label}`">
              <span class="player-profile-staff-card__icon-chip" :aria-label="item.label" :title="item.label">
                <Icon :name="item.icon" aria-hidden="true" />
              </span>
            </li>
          </ul>

          <ul v-if="role.payload?.tools?.length" class="player-profile-staff-card__icon-list player-profile-staff-card__icon-list--tools" aria-label="Outils">
            <li v-for="item in role.payload.tools" :key="`tool-${item.label}`">
              <span class="player-profile-staff-card__icon-chip" :aria-label="item.label" :title="item.label">
                <Icon :name="item.icon" aria-hidden="true" />
              </span>
            </li>
          </ul>
        </div>

        <ul v-if="role.payload?.tags?.length" class="player-profile-staff-card__tags" aria-label="Tags staff">
          <li v-for="tag in role.payload.tags" :key="tag">
            <span>{{ tag }}</span>
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PlayerStaffRolePresenter } from '@neeft-sas/shared'

const props = defineProps({
  role: {
    type: Object as PropType<PlayerStaffRolePresenter>,
    required: true
  },
  canEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete'])
</script>

<style scoped>
.player-profile-staff-card {
  display: grid;
  gap: var(--profile-space-3);
  align-items: start;
  height: 100%;
  overflow: hidden;
  padding: var(--profile-space-3);
  border: var(--profile-border) solid color-mix(in oklch, var(--profile-color-border) 78%, var(--profile-color-transparent));
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel-strong);
  box-shadow: 0 var(--profile-space-3) var(--profile-space-8) color-mix(in oklch, var(--profile-color-shadow) 82%, var(--profile-color-transparent));
}

.player-profile-staff-card__header {
  display: flex;
  gap: var(--profile-space-2);
  align-items: start;
  justify-content: space-between;
}

.player-profile-staff-card__identity {
  display: flex;
  align-items: center;
  gap: var(--profile-space-2);
  color: var(--profile-color-text);
}

.player-profile-staff-card__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--profile-staff-logo-size);
  height: var(--profile-staff-logo-size);
  border: var(--profile-border) solid color-mix(in oklch, var(--profile-color-border) 78%, var(--profile-color-transparent));
  border-radius: var(--profile-radius);
  background-color: color-mix(in oklch, var(--profile-color-panel) 90%, var(--profile-color-transparent));
  color: var(--profile-color-accent);
}

.player-profile-staff-card__logo svg {
  width: var(--profile-rank-icon-size);
  height: var(--profile-rank-icon-size);
}

.player-profile-staff-card__identity h3 {
  margin: 0;
  color: var(--profile-color-text);
  font-size: var(--profile-font-body);
  font-weight: 900;
  line-height: var(--profile-line-title);
  overflow-wrap: anywhere;
}

.player-profile-staff-card__identity p {
  margin: 0;
  color: var(--profile-color-muted);
  font-size: calc(var(--profile-font-small) * 0.92);
  line-height: var(--profile-line-tight);
}

.player-profile-staff-card__actions {
  display: inline-flex;
  flex: 0 0 auto;
  gap: var(--profile-space-1);
  align-items: center;
  justify-content: end;
}

.player-profile-staff-card__content {
  display: grid;
  gap: var(--profile-space-3);
  align-content: start;
}

.player-profile-staff-card__details {
  display: grid;
  gap: var(--profile-space-2);
  align-content: center;
}

.player-profile-staff-card__icon-row {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--profile-space-6);
  align-items: center;
  justify-content: space-between;
  overflow-x: auto;
  scrollbar-width: none;
}

.player-profile-staff-card__icon-row::-webkit-scrollbar {
  display: none;
}

.player-profile-staff-card__icon-list {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: nowrap;
  gap: var(--profile-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.player-profile-staff-card__icon-list--tools {
  justify-content: end;
  margin-inline-start: auto;
}

.player-profile-staff-card__icon-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--profile-staff-icon-size);
  height: var(--profile-staff-icon-size);
  border: var(--profile-border) solid color-mix(in oklch, var(--profile-color-border) 72%, var(--profile-color-transparent));
  border-radius: var(--profile-radius);
  background-color: color-mix(in oklch, var(--profile-color-panel) 80%, var(--profile-color-transparent));
  color: var(--profile-color-muted);
}

.player-profile-staff-card__icon-chip svg {
  width: var(--profile-fact-icon-size);
  height: var(--profile-fact-icon-size);
  color: var(--profile-color-accent);
}

.player-profile-staff-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-space-1);
  margin: 0;
  padding: var(--profile-space-2) 0 0;
  border-top: var(--profile-border) solid color-mix(in oklch, var(--profile-color-border) 72%, var(--profile-color-transparent));
  list-style: none;
}

.player-profile-staff-card__tags span {
  display: inline-flex;
  align-items: center;
  min-height: var(--profile-space-4);
  padding: 0 var(--profile-space-2);
  border: var(--profile-border) solid color-mix(in oklch, var(--profile-color-border) 72%, var(--profile-color-transparent));
  border-radius: var(--profile-radius);
  background-color: color-mix(in oklch, var(--profile-color-panel) 80%, var(--profile-color-transparent));
  color: var(--profile-color-muted);
  font-size: var(--profile-font-label);
  font-weight: 800;
  line-height: var(--profile-line-tight);
}
</style>
