<template>
  <CustomModal :model-value="modelValue" title="Demander une correction" desc="Explique précisément ce qui doit être repris." icon="lucide:rotate-ccw" theme="app" size="sm" @update:model-value="emit('update:modelValue', $event)" @close="emit('update:modelValue', false)">
    <CustomInputTextarea v-model="reason" label="Corrections demandées" label-position="outside" :rows="5" />
    <template #footer>
      <CustomButton label="Annuler" theme="app" variant="ghost" color="secondary" :disabled="processing" @click="emit('update:modelValue', false)" />
      <CustomButton :label="processing ? 'Envoi...' : 'Demander la correction'" theme="app" variant="filled" color="primary" :disabled="processing || reason.trim().length < 3" @click="emit('confirm', reason.trim())" />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; processing?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; confirm: [reason: string] }>()
const reason = ref('')
watch(() => props.modelValue, open => { if (open) reason.value = '' })
</script>
