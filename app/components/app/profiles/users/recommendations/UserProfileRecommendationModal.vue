<template>
  <CustomModal
    :model-value="true"
    title="Recommander"
    icon="lucide:star"
    theme="app"
    size="lg"
    @close="closeModal"
  >
    <form :id="formId" class="recommendation-modal" novalidate @submit.prevent="onSubmit">
      <section class="recommendation-modal__section">
        <h3 class="recommendation-modal__section-title">Contexte</h3>

        <div class="recommendation-modal__grid">
          <CustomInputText
            v-model="relationship"
            name="relationship"
            label="Relation"
            placeholder="Ex: Coach"
            :errorMessage="relationshipError"
            required
          />

          <CustomInputText
            v-model="gameId"
            name="gameId"
            label="Jeu"
            placeholder="Ex: League of Legends"
            :errorMessage="gameIdError"
            required
          />
        </div>
      </section>

      <section class="recommendation-modal__section">
        <h3 class="recommendation-modal__section-title">Note</h3>

        <CustomInputRating
          v-model="rating"
          name="rating"
          label="Note"
          :max="10"
          :errorMessage="ratingError"
          required
        />
      </section>

      <section class="recommendation-modal__section">
        <h3 class="recommendation-modal__section-title">Recommandation</h3>

        <CustomInputTextarea
          v-model="content"
          name="content"
          label="Recommandation"
          placeholder="Décrivez la collaboration, les points forts, les moments clés..."
          :rows="6"
          :errorMessage="contentError"
          required
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
        label="Publier"
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
import { useField, useForm } from 'vee-validate'

const props = defineProps({
  modalId: { type: Number, required: true },
  slug: { type: String, required: true },
  createRecommendation: { type: Function as PropType<(input: any) => Promise<void>>, required: true }
})

const modalStore = useModalStore()
const generatedId = useId()
const formId = computed(() => `recommendation-form-${generatedId}`)

const { handleSubmit } = useForm()

const { value: relationship, errorMessage: relationshipError } = useField<string>('relationship', 'required', { label: 'Relation' })
const { value: gameId, errorMessage: gameIdError } = useField<string>('gameId', 'required', { label: 'Jeu' })
const { value: rating, errorMessage: ratingError } = useField<number>('rating', 'required', { label: 'Note' })
const { value: content, errorMessage: contentError } = useField<string>('content', 'required|min:50|max:600', { label: 'Recommandation' })

rating.value = 10

const closeModal = () => {
  modalStore.close(props.modalId)
}

const toast = useToast()

const onSubmit = handleSubmit(async () => {
  const input = {
    relationship: relationship.value,
    rating: rating.value,
    gameId: gameId.value,
    content: content.value
  }

  try {
    await props.createRecommendation(input)
    toast.add({
      variant: 'success',
      title: 'Recommandation envoyée',
      desc: 'Merci pour votre feedback'
    })
    closeModal()
  } catch (error: any) {
    toast.add({
      variant: 'error',
      title: 'Erreur',
      desc: error.message || 'Impossible d\'envoyer la recommandation'
    })
  }
})
</script>

<style scoped>
.recommendation-modal {
  display: grid;
  gap: var(--space-2);
}

.recommendation-modal__section {
  display: grid;
  gap: calc(var(--space-1) * 0.75);
}

.recommendation-modal__section-title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
  text-transform: uppercase;
  letter-spacing: calc(var(--unit) * 0.0125);
}

.recommendation-modal__grid {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 640px) {
  .recommendation-modal__grid {
    grid-template-columns: 1fr;
  }
}
</style>
