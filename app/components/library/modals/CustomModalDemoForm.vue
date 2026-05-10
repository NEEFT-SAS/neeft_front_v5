<template>
  <form :id="props.formId" class="cus-modal-demo-form" @submit.prevent="submitForm">
    <CustomInputText
      v-model="nameValue"
      name="name"
      label="Nom public"
      placeholder="Anebris"
      type="text"
      left-icon="lucide:user"
      required
      :error-message="nameError"
    />
    <CustomInputText
      v-model="emailValue"
      name="email"
      label="Email"
      placeholder="name@domain.com"
      type="email"
      left-icon="lucide:mail"
      required
      :error-message="emailError"
    />
  </form>
</template>

<script setup lang="ts">
const props = defineProps({
  modalId: { type: Number, default: 0 },
  formId: { type: String, default: '' }
})

const modalStore = useModalStore()
const toast = useToast()
const nameValue = ref('')
const emailValue = ref('')
const nameError = ref('')
const emailError = ref('')

const validateForm = () => {
  nameError.value = nameValue.value ? '' : 'Nom requis.'
  emailError.value = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue.value) ? '' : 'Email invalide.'

  return !nameError.value && !emailError.value
}

const submitForm = () => {
  if (!validateForm()) {
    return
  }

  toast.add({
    variant: 'success',
    title: 'Formulaire valide',
    desc: 'Les informations ont ete enregistrees.',
    icon: 'lucide:circle-check',
    position: 'top-right'
  })
  modalStore.close(props.modalId)
}
</script>

<style scoped>
.cus-modal-demo-form {
  gap: var(--space-2);

  @apply grid;
}
</style>
