<template>
  <CustomModal
    :model-value="true"
    :title="isEditMode ? 'Modifier l\'expérience professionnelle' : 'Ajouter une expérience professionnelle'"
    icon="lucide:briefcase"
    theme="app"
    size="lg"
    @close="closeModal"
  >
    <form :id="formId" class="professional-experience-modal" novalidate @submit.prevent="onSubmit">
      <section class="professional-experience-modal__section">
        <h3 class="professional-experience-modal__section-title">Informations générales</h3>

        <div class="professional-experience-modal__grid">
          <CustomInputText
            v-model="companyName"
            name="companyName"
            label="Nom de l'entreprise"
            placeholder="Ex: Google"
            :errorMessage="companyNameError"
            required
          />

          <CustomInputText
            v-model="positionTitle"
            name="positionTitle"
            label="Intitulé du poste"
            placeholder="Ex: Développeur Frontend"
            :errorMessage="positionTitleError"
            required
          />
        </div>

        <div class="professional-experience-modal__grid">
          <CustomInputText
            v-model="contractType"
            name="contractType"
            label="Type de contrat"
            placeholder="Ex: CDI"
            :errorMessage="contractTypeError"
            required
          />

          <CustomInputText
            v-model="location"
            name="location"
            label="Lieu"
            placeholder="Ex: Paris"
          />
        </div>
      </section>

      <section class="professional-experience-modal__section">
        <h3 class="professional-experience-modal__section-title">Période</h3>

        <div class="professional-experience-modal__grid">
          <CustomInputText
            v-model="startDate"
            name="startDate"
            label="Date de début"
            placeholder="JJ/MM/AAAA"
            :errorMessage="startDateError"
            required
          />

          <CustomInputText
            v-model="endDate"
            name="endDate"
            label="Date de fin"
            placeholder="JJ/MM/AAAA"
            :errorMessage="endDateError"
          />
        </div>
      </section>

      <section class="professional-experience-modal__section">
        <h3 class="professional-experience-modal__section-title">Description</h3>

        <CustomInputTextarea
          v-model="description"
          name="description"
          label="Description"
          placeholder="Décrivez votre parcours, vos projets, vos réussites..."
          :rows="4"
        />
      </section>

      <section class="professional-experience-modal__section">
        <h3 class="professional-experience-modal__section-title">Missions</h3>

        <div class="professional-experience-modal__missions">
          <div v-for="(field, index) in missionFields" :key="field.key" class="professional-experience-modal__mission-row">
            <Field
              :name="`missions[${index}]`"
              v-slot="{ field: missionField, errorMessage: missionError }"
            >
              <CustomInputText
                v-model="missionField.value"
                :label="`Mission ${index + 1}`"
                placeholder="Décrivez une mission ou une responsabilité"
                :errorMessage="missionError"
                @update:model-value="(value) => missionField.onChange(value)"
              />
            </Field>

            <CustomButton
              v-if="missionFields.length > 1"
              label=""
              theme="app"
              variant="ghost"
              color="error"
              left-icon="lucide:x"
              @click="removeMission(index)"
            />
          </div>

          <CustomButton
            label="Ajouter une mission"
            theme="app"
            variant="outlined"
            color="primary"
            left-icon="lucide:plus"
            @click="addMission('')"
          />
        </div>
      </section>
    </form>

    <template #footer>
      <CustomButton
        label="Annuler"
        theme="app"
        variant="outlined"
        color="secondary"
        size="sm"
        @click="closeModal"
      />
      <CustomButton
        label="Enregistrer"
        theme="app"
        variant="filled"
        color="primary"
        type="submit"
        size="sm"
        :form="formId"
      />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import type { PlayerProfessionalExperiencePresenter } from '@neeft-sas/shared'
import type { PropType } from 'vue'
import { Field, useField, useFieldArray, useForm } from 'vee-validate'

const props = defineProps({
  modalId: { type: Number, required: true },
  slug: { type: String, required: true },
  experience: { type: Object as PropType<PlayerProfessionalExperiencePresenter | null>, default: null },
  createProfessionalExperience: { type: Function as PropType<(input: any) => Promise<void>>, required: true },
  updateProfessionalExperience: { type: Function as PropType<(experienceId: string, input: any) => Promise<void>>, required: true }
})

const modalStore = useModalStore()
const generatedId = useId()
const formId = computed(() => `professional-experience-form-${generatedId}`)

const isEditMode = computed(() => !!props.experience)

const { handleSubmit } = useForm()

const { value: companyName, errorMessage: companyNameError } = useField<string>('companyName', 'required', { label: 'Nom de l\'entreprise' })
const { value: positionTitle, errorMessage: positionTitleError } = useField<string>('positionTitle', 'required', { label: 'Intitulé du poste' })
const { value: contractType, errorMessage: contractTypeError } = useField<string>('contractType', 'required', { label: 'Type de contrat' })
const { value: location } = useField<string>('location', undefined, { label: 'Lieu' })
const { value: description } = useField<string>('description', undefined, { label: 'Description' })
const { value: startDate, errorMessage: startDateError } = useField<string>('startDate', 'required', { label: 'Date de début' })
const { value: endDate, errorMessage: endDateError } = useField<string>('endDate', undefined, { label: 'Date de fin' })

const { fields: missionFields, push: addMission, remove: removeMission } = useFieldArray('missions')

// Initialize with one empty mission if no missions
if (missionFields.value.length === 0) {
  addMission('')
}

// Initialize form values if editing
if (props.experience) {
  companyName.value = props.experience.companyName || ''
  positionTitle.value = props.experience.positionTitle || ''
  contractType.value = props.experience.contractType || ''
  location.value = props.experience.location || ''
  description.value = props.experience.description || ''
  startDate.value = props.experience.startDate || ''
  endDate.value = props.experience.endDate || ''
  // TODO: Map experience missions to form missions when structure is known
}

const closeModal = () => {
  modalStore.close(props.modalId)
}

const toast = useToast()

const onSubmit = handleSubmit(async () => {
  const validMissions = missionFields.value
    .map(field => field.value)
    .filter(mission => mission)

  const input = {
    companyName: companyName.value,
    positionTitle: positionTitle.value,
    contractType: contractType.value,
    location: location.value,
    description: description.value,
    startDate: startDate.value,
    endDate: endDate.value,
    missions: validMissions
  }

  try {
    if (isEditMode.value) {
      await props.updateProfessionalExperience(String(props.experience?.id), input)
      toast.add({
        variant: 'success',
        title: 'Expérience modifiée',
        desc: 'Votre expérience professionnelle a été modifiée avec succès'
      })
    } else {
      await props.createProfessionalExperience(input)
      toast.add({
        variant: 'success',
        title: 'Expérience ajoutée',
        desc: 'Votre expérience professionnelle a été ajoutée avec succès'
      })
    }
    closeModal()
  } catch (error: any) {
    toast.add({
      variant: 'error',
      title: 'Erreur',
      desc: error.message || 'Une erreur est survenue lors de l\'opération'
    })
  }
})
</script>

<style scoped>
.professional-experience-modal {
  display: grid;
  gap: var(--space-2);
}

.professional-experience-modal__section {
  display: grid;
  gap: calc(var(--space-1) * 0.75);
}

.professional-experience-modal__section-title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
  text-transform: uppercase;
  letter-spacing: calc(var(--unit) * 0.0125);
}

.professional-experience-modal__grid {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.professional-experience-modal__missions {
  display: grid;
  gap: var(--space-3);
}

.professional-experience-modal__mission-row {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: 1fr auto;
  align-items: end;
}

@media (max-width: 640px) {
  .professional-experience-modal__grid {
    grid-template-columns: 1fr;
  }
}
</style>
