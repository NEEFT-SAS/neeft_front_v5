<template>
  <CustomModal
    :model-value="true"
    :title="isEditMode ? 'Modifier l\'expérience esport' : 'Ajouter une expérience esport'"
    icon="lucide:gamepad-2"
    theme="app"
    size="lg"
    @close="closeModal"
  >
    <form :id="formId" class="esport-experience-modal" novalidate @submit.prevent="onSubmit">
      <section class="esport-experience-modal__section">
        <h3 class="esport-experience-modal__section-title">Équipe</h3>

        <div class="esport-experience-modal__grid">
          <CustomInputText
            v-model="teamName"
            name="teamName"
            label="Nom de l'équipe"
            :errorMessage="teamNameError"
            placeholder="Ex: Team Vitality"
            required
          />

          <CustomInputText
            v-model="teamLogo"
            :errorMessage="teamLogoError"
            name="teamLogo"
            label="Logo de l'équipe (URL)"
            placeholder="https://..."
            required
          />
        </div>
      </section>

      <section class="esport-experience-modal__section">
        <h3 class="esport-experience-modal__section-title">Rôles</h3>

        <div class="esport-experience-modal__roles">
          <div v-for="(field, index) in roles" :key="field.key" class="esport-experience-modal__role">
            <div class="esport-experience-modal__role-header">
              <span>Rôle {{ index + 1 }}</span>
              <CustomButton
                v-if="roles.length > 1"
                label=""
                theme="app"
                variant="ghost"
                color="error"
                left-icon="lucide:x"
                @click="removeRole(index)"
              />
            </div>

            <div class="esport-experience-modal__grid">
              <Field
                :name="`roles[${index}].name`"
                rules="required"
                label="Nom du rôle"
                v-slot="{ field: nameField, errorMessage: nameError }"
              >
                <CustomInputText
                  v-model="nameField.value"
                  label="Nom du rôle"
                  placeholder="Ex: Top Laner"
                  :errorMessage="nameError"
                  required
                  @update:model-value="(value) => nameField.onChange(value)"
                />
              </Field>

              <div></div>
            </div>

            <div class="esport-experience-modal__grid">
              <Field
                :name="`roles[${index}].startDate`"
                rules="required"
                label="Date de début"
                v-slot="{ field: startDateField, errorMessage: startDateError }"
              >
                <CustomInputText
                  v-model="startDateField.value"
                  label="Date de début"
                  placeholder="JJ/MM/AAAA"
                  :errorMessage="startDateError"
                  required
                  @update:model-value="(value) => startDateField.onChange(value)"
                />
              </Field>

              <Field
                :name="`roles[${index}].endDate`"
                v-slot="{ field: endDateField, errorMessage: endDateError }"
              >
                <CustomInputText
                  v-model="endDateField.value"
                  label="Date de fin"
                  placeholder="JJ/MM/AAAA"
                  :errorMessage="endDateError"
                  @update:model-value="(value) => endDateField.onChange(value)"
                />
              </Field>
            </div>

            <Field
              :name="`roles[${index}].description`"
              v-slot="{ field: descriptionField, errorMessage: descriptionError }"
            >
              <CustomInputTextarea
                v-model="descriptionField.value"
                label="Description"
                placeholder="Décrivez votre rôle..."
                :errorMessage="descriptionError"
                :rows="3"
                @update:model-value="(value) => descriptionField.onChange(value)"
              />
            </Field>
          </div>

          <CustomButton
            label="Ajouter un rôle"
            theme="app"
            variant="outlined"
            color="primary"
            left-icon="lucide:plus"
            @click="addRole(baseRole)"
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
import type { PlayerExperiencePresenter } from '@neeft-sas/shared'
import type { PropType } from 'vue'
import { Field, useField, useFieldArray, useForm } from 'vee-validate'

const props = defineProps({
  modalId: { type: Number, required: true },
  slug: { type: String, required: true },
  experience: { type: Object as PropType<PlayerExperiencePresenter | null>, default: null },
  createEsportExperience: { type: Function as PropType<(input: any) => Promise<void>>, required: true },
  updateEsportExperience: { type: Function as PropType<(experienceId: string, input: any) => Promise<void>>, required: true }
})

const modalStore = useModalStore()
const generatedId = useId()
const formId = computed(() => `esport-experience-form-${generatedId}`)

const isEditMode = computed(() => !!props.experience)

const { handleSubmit } = useForm()

const { value: teamName, errorMessage: teamNameError } = useField<string>('teamName', 'required', { label: 'Nom de l\'équipe' })
const { value: teamLogo, errorMessage: teamLogoError } = useField<string>('teamLogo', 'required', { label: 'Logo de l\'équipe' })
const { fields: roles, push: addRole, remove: removeRole } = useFieldArray('roles')
const baseRole = { name: '', startDate: '', endDate: '', description: '' }

// Initialize with one empty role if no roles
if (roles.value.length === 0) {
  addRole(baseRole)
}

// Initialize form values if editing
if (props.experience) {
  teamName.value = props.experience.teamName || ''
  teamLogo.value = props.experience.teamLogo || ''
  // TODO: Map experience roles to form roles when structure is known
}

const closeModal = () => {
  modalStore.close(props.modalId)
}

const toast = useToast()
const { $playerAPI } = useNuxtApp()

const onSubmit = handleSubmit(async () => {
  const validRoles = roles.value.filter(role => role.name && role.startDate)

  if (validRoles.length === 0) {
    toast.add({
      variant: 'error',
      title: 'Erreur',
      desc: 'Au moins un rôle avec un nom et une date de début est requis'
    })
    return
  }

  const input = {
    teamName: teamName.value,
    teamLogo: teamLogo.value,
    roles: validRoles
  }

  try {
    if (isEditMode.value) {
      await props.updateEsportExperience(String(props.experience?.id), input)
      toast.add({
        variant: 'success',
        title: 'Expérience modifiée',
        desc: 'Votre expérience esport a été modifiée avec succès'
      })
    } else {
      await props.createEsportExperience(input)
      toast.add({
        variant: 'success',
        title: 'Expérience ajoutée',
        desc: 'Votre expérience esport a été ajoutée avec succès'
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
.esport-experience-modal {
  display: grid;
  gap: var(--space-2);
}

.esport-experience-modal__section {
  display: grid;
  gap: calc(var(--space-1) * 0.75);
}

.esport-experience-modal__section-title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
  text-transform: uppercase;
  letter-spacing: calc(var(--unit) * 0.0125);
}

.esport-experience-modal__grid {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.esport-experience-modal__roles {
  display: grid;
  gap: var(--space-3);
}

.esport-experience-modal__role {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-2);
  border: var(--border) solid var(--color-border);
  border-radius: var(--radius);
}

.esport-experience-modal__role-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: var(--font-weight-semibold);
}

@media (max-width: 640px) {
  .esport-experience-modal__grid {
    grid-template-columns: 1fr;
  }
}
</style>
