<template>
  <CustomModal
    :model-value="true"
    title="Modifier les informations"
    icon="lucide:user"
    theme="app"
    size="lg"
    @close="closeModal"
  >
    <form :id="formId" class="profile-information-modal" @submit.prevent="onSubmit">
      <section class="profile-information-modal__section">
        <h3 class="profile-information-modal__section-title">Informations personnelles</h3>

        <div class="profile-information-modal__grid">
          <CustomInputText
            v-model="firstName"
            name="firstName"
            label="Nom"
            placeholder="Nom"
            required
            disabled
          />

          <CustomInputText
            v-model="lastName"
            name="lastName"
            label="Prenom"
            placeholder="Prenom"
            required
            disabled
          />

          <CustomInputSelection
            v-model="gender"
            name="gender"
            label="Genre"
            placeholder="Selectionner un genre"
            :options="resources.rscGenders"
            required
            option-value="value"
            option-label="label"
          />

          <CustomInputText
            v-model="birthDate"
            name="birthDate"
            label="Date de naissance"
            placeholder="JJ/MM/AAAA"
            disabled
          />

          <CustomInputSelection
            v-model="nationality"
            name="nationality"
            label="Nationalite"
            placeholder="Selectionner une nationalite"
            :options="resources.rscCountries"
            option-value="code"
            option-label="name"
          />

          <CustomInputMultiselect
            v-model="languages"
            name="languages"
            label="Langues parlees"
            placeholder="Selectionner des langues"
            :options="resources.rscLanguages"
            option-value="value"
            option-label="label"
          />
        </div>
      </section>

      <section class="profile-information-modal__section">
        <h3 class="profile-information-modal__section-title">Details professionnels</h3>

        <div class="profile-information-modal__grid">
          <CustomInputSelection
            v-model="workSector"
            name="workSector"
            label="Secteur d'activite"
            placeholder="Selectionner un secteur"
            :options="resources.rscWorkSectors"
            option-value="value"
            option-label="label"
          />

          <CustomInputSwitch
            v-model="isDisabledPlayer"
            name="isDisabledPlayer"
            label="Joueur handicape"
          />
        </div>
      </section>

      <section class="profile-information-modal__section">
        <h3 class="profile-information-modal__section-title">Description</h3>

        <CustomInputTextarea
          v-model="description"
          name="description"
          label="Description"
          placeholder="Decrivez-vous..."
          :rows="4"
        />
      </section>
    </form>

    <template #footer>
      <CustomButton
        label="Annuler"
        theme="app"
        variant="outlined"
        color="secondary"
        @click="closeModal"
      />
      <CustomButton
        label="Enregistrer"
        theme="app"
        variant="filled"
        color="primary"
        type="submit"
        :form="formId"
      />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import type { PlayerProfilePresenter, UpdatePlayerProfileDTO } from '@neeft-sas/shared'
import type { PropType } from 'vue'
import { useField, useForm } from 'vee-validate'

const props = defineProps({
  modalId: { type: Number, required: true },
  profile: { type: Object as PropType<PlayerProfilePresenter>, required: true },
  updatePlayerProfile: { type: Function as PropType<(updates: Partial<PlayerProfilePresenter>) => Promise<void>>, required: true }
})

const modalStore = useModalStore()
const resourcesStore = useResourcesStore()
const { resources } = storeToRefs(resourcesStore)
const generatedId = useId()
const formId = computed(() => `profile-information-form-${generatedId}`)

const { handleSubmit, resetForm } = useForm<UpdatePlayerProfileDTO>({
  initialValues: {
    ...props.profile
  }
})

const { value: firstName } = useField<string>('firstName', undefined, { label: 'Nom' })
const { value: lastName } = useField<string>('lastName', undefined, { label: 'Prenom' })
const { value: gender } = useField<string>('gender', 'required', { label: 'Genre' })
const { value: birthDate } = useField<string>('birthDate', undefined, { label: 'Date de naissance' })
const { value: nationality } = useField<string>('nationality', 'required', { label: 'Nationalite' })
const { value: languages } = useField<string[]>('languages', undefined, { label: 'Langues parlees' })
const { value: workSector } = useField<string>('workSector', undefined, { label: 'Secteur d\'activite' })
const { value: isDisabledPlayer } = useField<boolean>('isDisabledPlayer', undefined, { label: 'Joueur handicape' })
const { value: description } = useField<string>('description', undefined, { label: 'Description' })

const closeModal = () => {
  modalStore.close(props.modalId)
}

const toast = useToast()

const onSubmit = handleSubmit(async (values) => {
  try {
    await props.updatePlayerProfile({
      gender: values.gender,
      workSector: values.workSector,
      isDisabledPlayer: values.isDisabledPlayer,
      description: values.description
    })

    toast.add({
      variant: 'success',
      title: 'Profil mis à jour',
      desc: 'Vos informations ont été enregistrées avec succès'
    })
    closeModal()
  } catch (error: any) {
    toast.add({
      variant: 'error',
      title: 'Erreur',
      desc: error.message || 'Une erreur est survenue lors de la mise à jour du profil'
    })
  }
})
</script>

<style scoped>
.profile-information-modal {
  display: grid;
  gap: var(--space-2);
}

.profile-information-modal__section {
  display: grid;
  gap: calc(var(--space-1) * 0.75);
}

.profile-information-modal__section-title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
  text-transform: uppercase;
  letter-spacing: calc(var(--unit) * 0.0125);
}

.profile-information-modal__grid {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 640px) {
  .profile-information-modal__grid {
    grid-template-columns: 1fr;
  }
}
</style>
