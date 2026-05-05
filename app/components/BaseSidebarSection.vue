<template>
  <section
    class="base-app-sidebar-section"
    :class="{ 'base-app-sidebar-section--compact': compact }"
    :data-surface="surface"
    :data-border-side="borderSide"
    :aria-labelledby="titleId"
  >
    <header class="base-app-sidebar-section__header">
      <div class="base-app-sidebar-section__heading">
        <span v-if="icon" class="base-app-sidebar-section__icon" aria-hidden="true">
          <Icon :name="icon" />
        </span>

        <div class="base-app-sidebar-section__heading-copy">
          <p v-if="eyebrow" class="base-app-sidebar-section__eyebrow">
            {{ eyebrow }}
          </p>

          <h2 :id="titleId">
            {{ title }}
          </h2>

          <p v-if="subtitle" class="base-app-sidebar-section__subtitle">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <div v-if="hasAction" class="base-app-sidebar-section__action">
        <slot name="action">
          <CustomButton
            v-if="showBtn"
            :label="btnLabel"
            :left-icon="btnIcon"
            :theme="btnTheme"
            :variant="btnVariant"
            :color="btnColor"
            :size="btnSize"
            :shape="btnShape"
            :disabled="btnDisabled"
            :aria-label="buttonAriaLabel"
            :aria-pressed="buttonAriaPressed"
            @click="emit('action')"
          />
        </slot>
      </div>
    </header>

    <slot name="content-header" />

    <div v-if="isLoadingState" class="base-app-sidebar-section__state" data-state="loading" aria-live="polite">
      <slot name="loading">
        <p v-if="loadingMessage" class="base-app-sidebar-section__state-message">
          {{ loadingMessage }}
        </p>
      </slot>
    </div>

    <div v-else-if="isErrorState" class="base-app-sidebar-section__state" data-state="error" aria-live="polite">
      <slot name="error">
        <p v-if="errorMessage" class="base-app-sidebar-section__state-message">
          {{ errorMessage }}
        </p>
      </slot>
    </div>

    <div v-else-if="hasData" class="base-app-sidebar-section__body">
      <slot />
    </div>

    <div v-else class="base-app-sidebar-section__state" data-state="empty">
      <slot name="empty">
        <p v-if="emptyMessage" class="base-app-sidebar-section__state-message">
          {{ emptyMessage }}
        </p>
      </slot>
    </div>

    <footer v-if="hasFooter" class="base-app-sidebar-section__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
const slots = useSlots()
const generatedId = useId()

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  icon: { type: String, default: '' },
  id: { type: String, default: '' },
  compact: { type: Boolean, default: false },
  surface: {
    type: String,
    default: 'plain',
    validator: (value: string) => ['card', 'plain'].includes(value)
  },
  borderSide: {
    type: String,
    default: 'none',
    validator: (value: string) => ['none', 'left', 'right'].includes(value)
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

const titleId = computed(() => id || `base-app-sidebar-section-${generatedId}`)
const hasAction = computed(() => showBtn || Boolean(slots.action))
const hasFooter = computed(() => Boolean(slots.footer))
const hasData = computed(() => data)
const isLoadingState = computed(() => loading || pending)
const isErrorState = computed(() => Boolean(error))
const buttonAriaLabel = computed(() => {
  if (btnAriaLabel) return btnAriaLabel
  if (!btnLabel && btnIcon) return title

  return undefined
})
const buttonAriaPressed = computed(() => {
  if (btnAriaPressed === undefined) return undefined

  return String(btnAriaPressed)
})
const emptyMessage = computed(() => {
  if (isOwner) return ownerEmptyMessage || emptyMessage

  return visitorEmptyMessage || emptyMessage
})
</script>

<style scoped>
.base-app-sidebar-section {
  --app-sidebar-section-unit: var(--unit);
  --app-sidebar-section-space-1: var(--space-1);
  --app-sidebar-section-space-2: var(--space-2);
  --app-sidebar-section-space-3: var(--space-3);
  --app-sidebar-section-space-4: var(--space-4);
  --app-sidebar-section-space-6: var(--space-6);
  --app-sidebar-section-radius: var(--radius);
  --app-sidebar-section-border: var(--border);
  --app-sidebar-section-font-title: var(--font-body);
  --app-sidebar-section-font-label: calc(var(--unit) * 1.75);
  --app-sidebar-section-font-body: var(--font-body);
  --app-sidebar-section-font-weight: 600;
  --app-sidebar-section-line-title: var(--line-title);
  --app-sidebar-section-line-body: var(--line-base);
  --app-sidebar-section-panel: var(--app-color-panel);
  --app-sidebar-section-border-color: var(--app-color-line);
  --app-sidebar-section-panel-strong: color-mix(in oklch, var(--app-color-panel) 82%, var(--color-bg));
  --app-sidebar-section-text: var(--color-text);
  --app-sidebar-section-muted: var(--app-color-muted);
  --app-sidebar-section-subtle: var(--app-color-subtle);
  --app-sidebar-section-accent: var(--color-accent);
  --app-sidebar-section-danger: var(--color-danger);
  --app-sidebar-section-shadow: var(--color-shadow);
  --app-sidebar-section-transparent: var(--color-transparent);
  --app-sidebar-section-icon-size: calc(var(--app-sidebar-section-unit) * 4.5);
  --app-sidebar-section-icon-inner: calc(var(--app-sidebar-section-unit) * 2.25);
  display: grid;
  gap: var(--app-sidebar-section-space-3);
  padding: var(--app-sidebar-section-space-4);
}

.base-app-sidebar-section[data-surface='card'] {
  border: var(--app-sidebar-section-border) solid var(--app-sidebar-section-border-color);
  border-radius: var(--app-sidebar-section-radius);
  background-color: var(--app-sidebar-section-panel);
  box-shadow: 0 var(--app-sidebar-section-space-2) var(--app-sidebar-section-space-6) var(--app-sidebar-section-shadow);
}

.base-app-sidebar-section[data-border-side='left'] {
  border-inline-start: var(--app-sidebar-section-border) solid var(--app-sidebar-section-border-color);
}

.base-app-sidebar-section[data-border-side='right'] {
  border-inline-end: var(--app-sidebar-section-border) solid var(--app-sidebar-section-border-color);
}

.base-app-sidebar-section--compact {
  padding: 0 0 var(--app-sidebar-section-space-4) var(--app-sidebar-section-space-4);
}

.base-app-sidebar-section--compact[data-border-side='right'] {
  padding-inline: 0 var(--app-sidebar-section-space-4);
}

.base-app-sidebar-section__header,
.base-app-sidebar-section__heading {
  display: flex;
  gap: var(--app-sidebar-section-space-2);
  align-items: center;
}

.base-app-sidebar-section__header {
  justify-content: space-between;
}

.base-app-sidebar-section__heading {
  min-width: 0;
}

.base-app-sidebar-section__heading-copy {
  display: grid;
  gap: calc(var(--app-sidebar-section-unit) * 0.25);
  min-width: 0;
}

.base-app-sidebar-section__icon {
  width: var(--app-sidebar-section-icon-size);
  height: var(--app-sidebar-section-icon-size);
  border: var(--app-sidebar-section-border) solid color-mix(in oklch, var(--app-sidebar-section-border-color) 74%, var(--app-sidebar-section-accent));
  border-radius: var(--app-sidebar-section-radius);
  background-color: color-mix(in oklch, var(--app-sidebar-section-accent) 12%, var(--app-sidebar-section-panel));
  color: var(--app-sidebar-section-text);

  @apply inline-flex shrink-0 items-center justify-center;
}

.base-app-sidebar-section__icon svg {
  width: var(--app-sidebar-section-icon-inner);
  height: var(--app-sidebar-section-icon-inner);
}

.base-app-sidebar-section h2,
.base-app-sidebar-section p {
  margin: 0;
}

.base-app-sidebar-section__eyebrow {
  color: var(--app-sidebar-section-subtle);
  font-size: var(--app-sidebar-section-font-label);
  font-weight: var(--app-sidebar-section-font-weight);
  line-height: var(--app-sidebar-section-line-body);
  text-transform: uppercase;
}

.base-app-sidebar-section h2 {
  color: var(--app-sidebar-section-text);
  font-size: var(--app-sidebar-section-font-title);
  font-weight: var(--app-sidebar-section-font-weight);
  line-height: var(--app-sidebar-section-line-title);
  overflow-wrap: anywhere;
}

.base-app-sidebar-section__subtitle {
  color: var(--app-sidebar-section-subtle);
  font-size: var(--app-sidebar-section-font-label);
  line-height: var(--app-sidebar-section-line-body);
}

.base-app-sidebar-section__action {
  flex: 0 0 auto;
}

.base-app-sidebar-section__body {
  display: grid;
  gap: var(--app-sidebar-section-space-2);
}

.base-app-sidebar-section__state {
  padding: var(--app-sidebar-section-space-3);
  border: var(--app-sidebar-section-border) solid var(--app-sidebar-section-border-color);
  border-radius: var(--app-sidebar-section-radius);
  background-color: var(--app-sidebar-section-panel-strong);
}

.base-app-sidebar-section__state-message {
  margin: 0;
  color: var(--app-sidebar-section-muted);
  font-size: var(--app-sidebar-section-font-body);
  line-height: var(--app-sidebar-section-line-body);
}

.base-app-sidebar-section__state[data-state='error'] {
  border-color: color-mix(in oklch, var(--app-sidebar-section-danger) 48%, var(--app-sidebar-section-border-color));
}

.base-app-sidebar-section__state[data-state='error'] .base-app-sidebar-section__state-message {
  color: var(--app-sidebar-section-danger);
}

.base-app-sidebar-section__footer {
  padding-top: var(--app-sidebar-section-space-3);
  border-top: var(--app-sidebar-section-border) solid var(--app-sidebar-section-border-color);
}
</style>
