<template>
  <section class="base-profile-section" :class="{ 'base-profile-section--compact': props.compact }" :data-surface="props.surface" :aria-labelledby="titleId">
    <header class="base-profile-section__header">
      <div class="base-profile-section__heading">
        <p v-if="props.eyebrow" class="base-profile-section__eyebrow">
          {{ props.eyebrow }}
        </p>
        <h2 :id="titleId">
          {{ props.title }}
        </h2>
      </div>

      <div v-if="hasAction" class="base-profile-section__action">
        <slot name="action">
          <CustomButton
            v-if="props.showBtn"
            :label="props.btnLabel"
            :left-icon="props.btnIcon"
            :theme="props.btnTheme"
            :variant="props.btnVariant"
            :color="props.btnColor"
            :size="props.btnSize"
            :shape="props.btnShape"
            :disabled="props.btnDisabled"
            :aria-label="buttonAriaLabel"
            :aria-pressed="buttonAriaPressed"
            @click="emit('action')"
          />
        </slot>
      </div>
    </header>

    <slot name="content-header" />

    <div v-if="isLoadingState" class="base-profile-section__state" data-state="loading" aria-live="polite">
      <slot name="loading">
        <p v-if="props.loadingMessage" class="base-profile-section__state-message">
          {{ props.loadingMessage }}
        </p>
      </slot>
    </div>

    <div v-else-if="isErrorState" class="base-profile-section__state" data-state="error" aria-live="polite">
      <slot name="error">
        <p v-if="props.errorMessage" class="base-profile-section__state-message">
          {{ props.errorMessage }}
        </p>
      </slot>
    </div>

    <slot v-else-if="hasData" />

    <div v-else class="base-profile-section__state" data-state="empty">
      <slot name="empty">
        <p v-if="emptyMessage" class="base-profile-section__state-message">
          {{ emptyMessage }}
        </p>
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
const slots = useSlots()
const generatedId = useId()

const props = defineProps({
  title: { type: String, required: true },
  eyebrow: { type: String, default: '' },
  id: { type: String, default: '' },
  compact: { type: Boolean, default: false },
  surface: {
    type: String,
    default: 'card',
    validator: (value: string) => ['card', 'plain'].includes(value)
  },
  showBtn: { type: Boolean, default: false },
  btnLabel: { type: String, default: 'Modifier' },
  btnIcon: { type: String, default: '' },
  btnAriaLabel: { type: String, default: '' },
  btnAriaPressed: {
    type: [Boolean, String],
    default: undefined,
    validator: (value: boolean | string | undefined) => value === undefined || [true, false, 'true', 'false', 'mixed'].includes(value)
  },
  btnTheme: {
    type: String,
    default: 'app',
    validator: (value: string) => ['landing', 'app'].includes(value)
  },
  btnVariant: {
    type: String,
    default: 'outlined',
    validator: (value: string) => ['filled', 'outlined', 'ghost'].includes(value)
  },
  btnColor: {
    type: String,
    default: 'secondary',
    validator: (value: string) => ['primary', 'secondary'].includes(value)
  },
  btnSize: {
    type: String,
    default: 'sm',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  btnShape: {
    type: String,
    default: 'rectangular',
    validator: (value: string) => ['circle', 'rectangular'].includes(value)
  },
  btnDisabled: { type: Boolean, default: false },
  data: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  pending: { type: Boolean, default: false },
  error: { type: [Boolean, Object, String], default: false },
  isOwner: { type: Boolean, default: false },
  loadingMessage: { type: String, default: '' },
  errorMessage: { type: String, default: '' },
  emptyMessage: { type: String, default: '' },
  ownerEmptyMessage: { type: String, default: '' },
  visitorEmptyMessage: { type: String, default: '' }
})

const emit = defineEmits(['action'])

const titleId = computed(() => props.id || `base-profile-section-${generatedId}`)
const hasAction = computed(() => props.showBtn || Boolean(slots.action))
const buttonAriaLabel = computed(() => {
  if (props.btnAriaLabel) return props.btnAriaLabel
  if (!props.btnLabel && props.btnIcon) return props.title

  return undefined
})
const buttonAriaPressed = computed(() => {
  if (props.btnAriaPressed === undefined) return undefined

  return String(props.btnAriaPressed)
})
const isLoadingState = computed(() => props.loading || props.pending)
const isErrorState = computed(() => Boolean(props.error))
const hasData = computed(() => props.data)
const emptyMessage = computed(() => {
  if (props.isOwner) return props.ownerEmptyMessage || props.emptyMessage

  return props.visitorEmptyMessage || props.emptyMessage
})
</script>

<style scoped>
.base-profile-section {
  --profile-section-space-1: var(--profile-space-1, var(--landing-space-1));
  --profile-section-space-2: var(--profile-space-2, var(--landing-space-2));
  --profile-section-space-3: var(--profile-space-3, var(--landing-space-3));
  --profile-section-space-4: var(--profile-space-4, var(--landing-space-4));
  --profile-section-space-6: var(--profile-space-6, var(--landing-space-6));
  --profile-section-radius: var(--profile-radius, var(--app-radius));
  --profile-section-border: var(--profile-border, var(--app-border));
  --profile-section-font-title: var(--profile-font-section, var(--landing-font-section));
  --profile-section-font-label: var(--profile-font-label, var(--landing-font-eyebrow));
  --profile-section-font-body: var(--profile-font-body, var(--landing-font-body));
  --profile-section-font-weight: var(--landing-font-weight-semibold);
  --profile-section-line-title: var(--profile-line-title, var(--landing-line-title));
  --profile-section-line-body: var(--profile-line-body, var(--landing-line-base));
  --profile-section-panel: var(--profile-color-panel, var(--app-color-panel));
  --profile-section-border-color: var(--profile-color-border, var(--app-color-line));
  --profile-section-panel-strong: var(--profile-color-panel-strong, var(--app-color-panel));
  --profile-section-text: var(--profile-color-text, var(--app-color-text));
  --profile-section-muted: var(--profile-color-muted, var(--app-color-muted));
  --profile-section-subtle: var(--profile-color-subtle, var(--app-color-subtle));
  --profile-section-danger: var(--profile-color-danger, var(--app-color-danger));
  --profile-section-shadow: var(--profile-color-shadow, var(--landing-color-shadow));
  --profile-section-transparent: var(--profile-color-transparent, var(--app-color-transparent));
  display: grid;
  gap: var(--profile-section-space-4);
  padding: var(--profile-section-space-4);
  border: var(--profile-section-border) solid var(--profile-section-border-color);
  border-radius: var(--profile-section-radius);
  background-color: var(--profile-section-panel);
  box-shadow: 0 var(--profile-section-space-2) var(--profile-section-space-6) var(--profile-section-shadow);
}

.base-profile-section[data-surface='plain'] {
  padding: 0;
  border: 0;
  background-color: var(--profile-section-transparent);
  box-shadow: none;
}

.base-profile-section--compact {
  gap: var(--profile-section-space-3);
}

.base-profile-section__header {
  display: flex;
  gap: var(--profile-section-space-3);
  align-items: start;
  justify-content: space-between;
}

.base-profile-section__heading {
  display: grid;
  gap: var(--profile-section-space-1);
}

.base-profile-section__eyebrow {
  margin: 0;
  color: var(--profile-section-subtle);
  font-size: var(--profile-section-font-label);
  font-weight: var(--profile-section-font-weight);
  line-height: var(--profile-section-line-body);
  text-transform: uppercase;
}

.base-profile-section h2 {
  margin: 0;
  color: var(--profile-section-text);
  font-size: var(--profile-section-font-title);
  font-weight: var(--profile-section-font-weight);
  line-height: var(--profile-section-line-title);
}

.base-profile-section__action {
  flex: 0 0 auto;
}

.base-profile-section__state {
  padding: var(--profile-section-space-3);
  border: var(--profile-section-border) solid var(--profile-section-border-color);
  border-radius: var(--profile-section-radius);
  background-color: var(--profile-section-panel-strong);
}

.base-profile-section__state-message {
  margin: 0;
  color: var(--profile-section-muted);
  font-size: var(--profile-section-font-body);
  line-height: var(--profile-section-line-body);
}

.base-profile-section__state[data-state='error'] {
  border-color: color-mix(in oklch, var(--profile-section-danger) 48%, var(--profile-section-border-color));
}

.base-profile-section__state[data-state='error'] .base-profile-section__state-message {
  color: var(--profile-section-danger);
}
</style>
