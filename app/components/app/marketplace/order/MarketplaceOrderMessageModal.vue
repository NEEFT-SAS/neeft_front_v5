<template>
  <CustomModal
    :model-value="modelValue"
    :title="mode === 'update' ? 'Ajouter une mise a jour' : 'Contacter le participant'"
    :desc="mode === 'update' ? 'Cette mise a jour sera envoyee dans la conversation avec le client.' : `Ecris un message a ${counterpartName}.`"
    icon="lucide:message-circle"
    theme="app"
    size="sm"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('update:modelValue', false)"
  >
    <CustomInputTextarea
      v-model="content"
      label="Message"
      label-position="outside"
      :rows="6"
      :placeholder="mode === 'update' ? 'Exemple: le premier livrable sera disponible demain.' : 'Ecris ton message...'"
    />
    <template #footer>
      <CustomButton label="Annuler" theme="app" variant="ghost" color="secondary" :disabled="processing" @click="emit('update:modelValue', false)" />
      <CustomButton :label="processing ? 'Envoi...' : 'Envoyer'" left-icon="lucide:send" theme="app" variant="filled" color="primary" :disabled="processing || content.trim().length < 2" @click="emit('confirm', content.trim())" />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  mode: 'contact' | 'update'
  counterpartName: string
  processing?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [content: string]
}>()

const content = ref('')

watch(() => props.modelValue, (open) => {
  if (open) content.value = ''
})
</script>
