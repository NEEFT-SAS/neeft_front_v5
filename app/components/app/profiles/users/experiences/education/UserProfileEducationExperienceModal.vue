<template>
  <CustomModal
    :model-value="true"
    :title="isEditMode ? 'Modifier l\'expérience scolaire' : 'Ajouter une expérience scolaire'"
    icon="lucide:graduation-cap"
    theme="app"
    size="lg"
    @close="closeModal"
  >
    <form :id="formId" class="education-experience-modal" novalidate @submit.prevent="onSubmit">
      <section class="education-experience-modal__section">
        <h3 class="education-experience-modal__section-title">Informations principales</h3>

        <div class="education-experience-modal__grid">
          <CustomInputText
            v-model="schoolName"
            name="schoolName"
            label="Nom de l'école"
            placeholder="Ex: Université Paris-Saclay"
            :errorMessage="schoolNameError"
            required
          />

          <CustomInputText
            v-model="diplomaName"
            name="diplomaName"
            label="Nom du diplôme"
            placeholder="Ex: Master Informatique"
            :errorMessage="diplomaNameError"
            required
          />
        </div>

        <div class="education-experience-modal__grid">
          <CustomInputText
            v-model="mention"
            name="mention"
            label="Mention"
            placeholder="Ex: Très bien"
          />

          <CustomInputText
            v-model="location"
            name="location"
            label="Lieu"
            placeholder="Ex: Paris"
          />
        </div>
      </section>

      <section class="education-experience-modal__section">
        <h3 class="education-experience-modal__section-title">Détails de la formation</h3>

        <div class="education-experience-modal__grid">
          <CustomInputText
            v-model="educationStatus"
            name="educationStatus"
            label="Statut de l'éducation"
            placeholder="Ex: Temps plein"
            :errorMessage="educationStatusError"
            required
          />

          <CustomInputText
            v-model="attendanceMode"
            name="attendanceMode"
            label="Mode de présence"
            placeholder="Ex: Sur site"
            :errorMessage="attendanceModeError"
            required
          />
        </div>

        <div class="education-experience-modal__grid">
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

      <section class="education-experience-modal__section">
        <h3 class="education-experience-modal__section-title">Description</h3>

        <CustomInputTextarea
          v-model="description"
          name="description"
          label="Description"
          placeholder="Décrivez votre parcours, vos projets, vos réussites..."
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
import type { PlayerEducationExperiencePresenter } from '@neeft-sas/shared'
import type { PropType } from 'vue'
import { useField, useForm } from 'vee-validate'

const props = defineProps({
  modalId: { type: Number, required: true },
  slug: { type: String, required: true },
  experience: { type: Object as PropType<PlayerEducationExperiencePresenter | null>, default: null },
  createEducationExperience: { type: Function as PropType<(input: any) => Promise<void>>, required: true },
  updateEducationExperience: { type: Function as PropType<(experienceId: string, input: any) => Promise<void>>, required: true }
})

const modalStore = useModalStore()
const generatedId = useId()
const formId = computed(() => `education-experience-form-${generatedId}`)

const isEditMode = computed(() => !!props.experience)

const { handleSubmit } = useForm()

const { value: schoolName, errorMessage: schoolNameError } = useField<string>('schoolName', 'required', { label: 'Nom de l\'école' })
const { value: diplomaName, errorMessage: diplomaNameError } = useField<string>('diplomaName', 'required', { label: 'Nom du diplôme' })
const { value: mention } = useField<string>('mention', undefined, { label: 'Mention' })
const { value: location } = useField<string>('location', undefined, { label: 'Lieu' })
const { value: educationStatus, errorMessage: educationStatusError } = useField<string>('educationStatus', 'required', { label: 'Statut de l\'éducation' })
const { value: attendanceMode, errorMessage: attendanceModeError } = useField<string>('attendanceMode', 'required', { label: 'Mode de présence' })
const { value: description } = useField<string>('description', undefined, { label: 'Description' })
const { value: startDate, errorMessage: startDateError } = useField<string>('startDate', 'required', { label: 'Date de début' })
const { value: endDate, errorMessage: endDateError } = useField<string>('endDate', undefined, { label: 'Date de fin' })

// Initialize form values if editing
if (props.experience) {
  schoolName.value = props.experience.schoolName || ''
  diplomaName.value = props.experience.diplomaName || ''
  mention.value = props.experience.mention || ''
  location.value = props.experience.location || ''
  educationStatus.value = props.experience.educationStatus || ''
  attendanceMode.value = props.experience.attendanceMode || ''
  description.value = props.experience.description || ''
  startDate.value = props.experience.startDate || ''
  endDate.value = props.experience.endDate || ''
}

const closeModal = () => {
  modalStore.close(props.modalId)
}

const toast = useToast()

const onSubmit = handleSubmit(async () => {
  const input = {
    schoolName: schoolName.value,
    diplomaName: diplomaName.value,
    mention: mention.value,
    location: location.value,
    educationStatus: educationStatus.value,
    attendanceMode: attendanceMode.value,
    description: description.value,
    startDate: startDate.value,
    endDate: endDate.value
  }

  try {
    if (isEditMode.value) {
      await props.updateEducationExperience(String(props.experience?.id), input)
      toast.add({
        variant: 'success',
        title: 'Expérience modifiée',
        desc: 'Votre expérience scolaire a été modifiée avec succès'
      })
    } else {
      await props.createEducationExperience(input)
      toast.add({
        variant: 'success',
        title: 'Expérience ajoutée',
        desc: 'Votre expérience scolaire a été ajoutée avec succès'
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
.education-experience-modal {
  display: grid;
  gap: var(--space-2);
}

.education-experience-modal__section {
  display: grid;
  gap: calc(var(--space-1) * 0.75);
}

.education-experience-modal__section-title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
  text-transform: uppercase;
  letter-spacing: calc(var(--unit) * 0.0125);
}

.education-experience-modal__grid {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 640px) {
  .education-experience-modal__grid {
    grid-template-columns: 1fr;
  }
}
</style>
