<template>
  <CustomModal
    :model-value="modelValue"
    title="Creer une equipe"
    desc="Prepare une fiche equipe exploitable dans la recherche."
    icon="lucide:users-round"
    theme="app"
    size="lg"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('update:modelValue', false)"
  >
    <form :id="formId" class="header-action-form" novalidate @submit.prevent="submitForm">
      <section class="header-action-form__section" aria-labelledby="header-team-form-main">
        <h3 id="header-team-form-main" class="header-action-form__title">Equipe</h3>
        <div class="header-action-form__grid">
          <CustomInputText
            v-model="form.name"
            name="teamName"
            label="Nom de l'equipe"
            placeholder="Nova Five"
            required
            :error-message="errors.name"
          />
          <CustomInputText
            v-model="form.tag"
            name="teamTag"
            label="Tag"
            placeholder="NVF"
            required
            :error-message="errors.tag"
          />
          <CustomInputSelection
            v-model="form.game"
            name="teamGame"
            label="Jeu principal"
            placeholder="Selectionner"
            :options="gameOptions"
            required
            :error-message="errors.game"
          />
          <CustomInputSelection
            v-model="form.recruitment"
            name="teamRecruitment"
            label="Recrutement"
            placeholder="Selectionner"
            :options="recruitmentOptions"
            required
            :error-message="errors.recruitment"
          />
        </div>
      </section>

      <section class="header-action-form__section" aria-labelledby="header-team-form-description">
        <h3 id="header-team-form-description" class="header-action-form__title">Presentation</h3>
        <CustomInputTextarea
          v-model="form.description"
          name="teamDescription"
          label="Objectif de l'equipe"
          placeholder="Decris le niveau, les ambitions, les disponibilites et les profils recherches."
          :rows="5"
          :max-length="600"
          show-count
          required
          :error-message="errors.description"
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
        @click="emit('update:modelValue', false)"
      />
      <CustomButton
        label="Creer"
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
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const toast = useToast()
const generatedId = useId()
const formId = computed(() => `header-team-creation-form-${generatedId}`)
const initialForm = () => ({
  name: '',
  tag: '',
  game: '',
  recruitment: '',
  description: ''
})

const form = reactive(initialForm())
const errors = reactive(initialForm())
const gameOptions = [
  { label: 'Valorant', value: 'valorant' },
  { label: 'League of Legends', value: 'league-of-legends' },
  { label: 'Counter-Strike 2', value: 'counter-strike-2' },
  { label: 'Rocket League', value: 'rocket-league' },
  { label: 'Fortnite', value: 'fortnite' }
]
const recruitmentOptions = [
  { label: 'Recrutement ouvert', value: 'open' },
  { label: 'Sur invitation', value: 'invite' },
  { label: 'Ferme pour le moment', value: 'closed' }
]

const resetForm = () => {
  Object.assign(form, initialForm())
  Object.assign(errors, initialForm())
}

const validateForm = () => {
  errors.name = form.name.trim() ? '' : 'Nom requis.'
  errors.tag = form.tag.trim() ? '' : 'Tag requis.'
  errors.game = form.game ? '' : 'Jeu requis.'
  errors.recruitment = form.recruitment ? '' : 'Statut requis.'
  errors.description = form.description.trim() ? '' : 'Presentation requise.'

  return Object.values(errors).every(error => !error)
}

const submitForm = () => {
  if (!validateForm()) return

  toast.add({
    variant: 'success',
    title: 'Equipe creee',
    desc: 'La fiche equipe est prete a etre traitee.',
    icon: 'lucide:circle-check',
    position: 'top-right'
  })
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) resetForm()
})
</script>

<style scoped lang="scss">
.header-action-form {
  display: grid;
  gap: var(--space-3);
}

.header-action-form__section {
  display: grid;
  gap: var(--space-2);
}

.header-action-form__title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
}

.header-action-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2);
}

@media (max-width: 720px) {
  .header-action-form__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
