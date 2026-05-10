<template>
  <BaseProfileSection
    title="Liste des roles de staff"
    eyebrow="Staff"
    surface="plain"
    :show-btn="canEdit"
    btn-label="Ajouter un role"
    btn-icon="lucide:plus"
    :btn-disabled="!hasAvailableStaffRole"
    @action="openCreateStaffRoleModal"
  >
    <ul class="player-profile-list player-profile-staff-list">
      <li v-for="role in staffRoles" :key="role.id">
        <PlayerProfileStaffCard
          :role="role"
          :can-edit="canEdit"
          @edit="openEditStaffRoleModal"
          @delete="deleteStaffRole"
        />
      </li>
    </ul>
  </BaseProfileSection>
</template>

<script setup lang="ts">
import PlayerProfileStaffCard from './PlayerProfileStaffCard.vue'

const { canEdit, useStaffSection } = useViewedUserProfile()
const { items: staffRoles } = useStaffSection()

const hasAvailableStaffRole = computed(() => true)

const openCreateStaffRoleModal = () => {
  console.log('openCreateStaffRoleModal')
}

const openEditStaffRoleModal = (id: number) => {
  console.log('openEditStaffRoleModal', id)
}

const deleteStaffRole = (id: number) => {
  console.log('deleteStaffRole', id)
}
</script>
