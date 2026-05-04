<template>
  <CustomInputSelectionBase
    v-bind="props"
    :multiple="false"
    @update:model-value="emit('update:modelValue', $event)"
    @change="forwardChange"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @open="emit('open')"
    @close="emit('close')"
    @search="emit('search', $event)"
  />
</template>

<script setup lang="ts">
import CustomInputSelectionBase from './CustomInputSelectionBase.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  label: { type: String, default: '' },
  labelPosition: {
    type: String,
    default: 'outside',
    validator: (value: string) => ['inside', 'outside'].includes(value)
  },
  placeholder: { type: String, default: 'Selectionner' },
  options: { type: Array, default: () => [] },
  optionValue: { type: String, default: 'value' },
  optionLabel: { type: String, default: 'label' },
  i18nPrefix: { type: String, default: '' },
  i18nLabel: { type: [Boolean, String], default: false },
  leftIcon: { type: String, default: '' },
  rightIcon: { type: String, default: 'lucide:chevron-down' },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
  searchable: { type: Boolean, default: false },
  searchPlaceholder: { type: String, default: 'Rechercher' },
  emptyLabel: { type: String, default: 'Aucun resultat' },
  errorMessage: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'open', 'close', 'search'])

const forwardChange = (...payload: unknown[]) => {
  emit('change', ...payload)
}
</script>
