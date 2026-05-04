<template>
  <article
    class="cus-toast"
    :data-variant="normalizedVariant"
    :role="ariaRole"
    :aria-live="ariaLive"
    aria-atomic="true"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
    @focusin="pauseTimer"
    @focusout="resumeTimer"
  >
    <span class="cus-toast__icon-wrap" aria-hidden="true">
      <Icon class="cus-toast__icon" :name="resolvedIcon" />
    </span>

    <div class="cus-toast__content">
      <p v-if="props.title" class="cus-toast__title">
        {{ props.title }}
      </p>
      <p v-if="props.desc" class="cus-toast__desc">
        {{ props.desc }}
      </p>
    </div>

    <button
      v-if="props.closable"
      class="cus-toast__close"
      type="button"
      :aria-label="props.closeLabel"
      @click="closeToast"
    >
      <Icon class="cus-toast__close-icon" name="lucide:x" aria-hidden="true" />
    </button>

    <span
      v-if="hasTimer"
      :key="timerKey"
      class="cus-toast__timer"
      :data-paused="isTimerPaused ? 'true' : 'false'"
      :style="timerStyle"
      aria-hidden="true"
    />
  </article>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])

const props = defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: (value: string) => ['info', 'success', 'warn', 'warning', 'error', 'neutral'].includes(value)
  },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  icon: { type: String, default: '' },
  duration: {
    type: Number,
    default: 5000,
    validator: (value: number) => Number.isFinite(value) && value >= 0
  },
  timer: { type: Boolean, default: true },
  closable: { type: Boolean, default: true },
  closeLabel: { type: String, default: 'Fermer la notification' }
})

const variantIcons: Record<string, string> = {
  info: 'lucide:info',
  success: 'lucide:circle-check',
  warn: 'lucide:triangle-alert',
  error: 'lucide:circle-x',
  neutral: 'lucide:bell'
}

const normalizedVariant = computed(() => (props.variant === 'warning' ? 'warn' : props.variant))
const resolvedIcon = computed(() => props.icon || variantIcons[normalizedVariant.value])
const ariaRole = computed(() => (['error', 'warn'].includes(normalizedVariant.value) ? 'alert' : 'status'))
const ariaLive = computed(() => (['error', 'warn'].includes(normalizedVariant.value) ? 'assertive' : 'polite'))
const hasTimer = computed(() => props.timer && props.duration > 0)
const remainingMs = ref(props.duration)
const timerStart = ref(0)
const timerKey = ref(0)
const isTimerPaused = ref(false)
const timeoutId = ref<ReturnType<typeof setTimeout> | null>(null)
const timerStyle = computed(() => ({ '--toast-timer-duration': `${remainingMs.value}ms` }))

const clearTimer = () => {
  if (!timeoutId.value) {
    return
  }

  clearTimeout(timeoutId.value)
  timeoutId.value = null
}

const closeToast = () => {
  clearTimer()
  emit('close')
}

const startTimer = () => {
  if (!hasTimer.value) {
    clearTimer()
    return
  }

  clearTimer()
  timerStart.value = performance.now()
  timeoutId.value = setTimeout(closeToast, remainingMs.value)
}

const pauseTimer = () => {
  if (!hasTimer.value || isTimerPaused.value) {
    return
  }

  remainingMs.value = Math.max(0, remainingMs.value - (performance.now() - timerStart.value))
  isTimerPaused.value = true
  clearTimer()
}

const resumeTimer = () => {
  if (!hasTimer.value || !isTimerPaused.value) {
    return
  }

  isTimerPaused.value = false
  startTimer()
}

const resetTimer = () => {
  clearTimer()
  remainingMs.value = props.duration
  isTimerPaused.value = false
  timerKey.value += 1
  startTimer()
}

onMounted(resetTimer)
onBeforeUnmount(clearTimer)
watch(() => [props.duration, props.timer], resetTimer)
</script>

<style scoped>
.cus-toast {
  --toast-max-width: calc(var(--unit) * 56);
  --toast-min-height: calc(var(--unit) * 9);
  --toast-padding-y: var(--space-2);
  --toast-padding-x: var(--space-2);
  --toast-icon-box: calc(var(--unit) * 5);
  --toast-icon-size: calc(var(--unit) * 2.5);
  --toast-gap: var(--space-2);
  --toast-title: var(--color-text);
  --toast-desc: color-mix(in oklch, var(--color-text) 82%, var(--color-transparent));
  --toast-tone: oklch(70.201% 0.11926 212.03);
  --toast-bg: var(--toast-tone);
  --toast-border: color-mix(in oklch, var(--toast-bg) 76%, var(--color-bg) 24%);
  --toast-icon-bg: color-mix(in oklch, var(--color-bg) 22%, var(--color-transparent));
  --toast-icon: var(--color-text);
  --toast-shadow: color-mix(in oklch, var(--color-shadow) 62%, var(--toast-bg) 38%);
  --toast-close-size: calc(var(--unit) * 4);
  --toast-close-icon: calc(var(--unit) * 2);
  --toast-close-bg: color-mix(in oklch, var(--color-bg) 16%, var(--color-transparent));
  --toast-close-hover-bg: color-mix(in oklch, var(--color-bg) 28%, var(--color-transparent));
  --toast-timer-height: calc(var(--border) * 2);
  --toast-timer-bg: color-mix(in oklch, var(--color-text) 62%, var(--color-transparent));
  position: relative;
  overflow: hidden;
  width: min(100%, var(--toast-max-width));
  min-height: var(--toast-min-height);
  grid-template-columns: var(--toast-icon-box) minmax(0, 1fr) auto;
  gap: var(--toast-gap);
  padding: var(--toast-padding-y) var(--toast-padding-x);
  border: var(--border) solid var(--toast-border);
  border-radius: var(--radius);
  background-color: var(--toast-bg);
  color: var(--toast-title);
  box-shadow: 0 calc(var(--unit) * 1.25) calc(var(--unit) * 3) var(--toast-shadow);

  @apply grid items-start;
}

.cus-toast__icon-wrap {
  width: var(--toast-icon-box);
  height: var(--toast-icon-box);
  border-radius: var(--radius);
  color: var(--toast-icon);

  @apply inline-flex items-center justify-center;
}

.cus-toast__icon {
  width: var(--toast-icon-size);
  height: var(--toast-icon-size);

  @apply shrink-0;
}

.cus-toast__content {
  gap: calc(var(--unit) * 0.5);
  padding-block: calc(var(--unit) * 0.25);

  @apply grid;
}

.cus-toast__title,
.cus-toast__desc {
  margin: 0;
  overflow-wrap: anywhere;
}

.cus-toast__title {
  color: var(--toast-title);
  font-size: var(--font-card);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-card);
}

.cus-toast__desc {
  color: var(--toast-desc);
  font-size: var(--font-eyebrow);
  line-height: var(--line-base);
}

.cus-toast__close {
  width: var(--toast-close-size);
  height: var(--toast-close-size);
  border: var(--border) solid var(--color-transparent);
  border-radius: var(--radius);
  background-color: var(--toast-close-bg);
  color: var(--color-text);
  font-family: inherit;
  transition-duration: var(--motion-fast);

  @apply inline-flex cursor-pointer items-center justify-center transition-colors;
}

.cus-toast__close:hover {
  background-color: var(--toast-close-hover-bg);
}

.cus-toast__close:focus-visible {
  outline: calc(var(--border) * 2) solid color-mix(in oklch, var(--color-text) 58%, var(--color-transparent));
  outline-offset: calc(var(--border) * 2);
}

.cus-toast__close-icon {
  width: var(--toast-close-icon);
  height: var(--toast-close-icon);
}

.cus-toast__timer {
  position: absolute;
  inset-block-end: 0;
  inset-inline-start: 0;
  width: 100%;
  height: var(--toast-timer-height);
  background-color: var(--toast-timer-bg);
  transform-origin: left center;
  animation: cus-toast-timer var(--toast-timer-duration) linear forwards;
}

.cus-toast__timer[data-paused='true'] {
  animation-play-state: paused;
}

.cus-toast[data-variant='info'] {
  --toast-tone: oklch(70.201% 0.11926 212.03);
}

.cus-toast[data-variant='success'] {
  --toast-tone: oklch(68.321% 0.16798 147.12);
}

.cus-toast[data-variant='warn'] {
  --toast-tone: oklch(69.098% 0.18199 45.81);
}

.cus-toast[data-variant='error'] {
  --toast-tone: oklch(60.025% 0.22394 17.46);
}

.cus-toast[data-variant='neutral'] {
  --toast-tone: oklch(34.131% 0.03737 265.68);
  --toast-border: color-mix(in oklch, var(--toast-bg) 68%, var(--color-bg) 32%);
}

@keyframes cus-toast-timer {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}
</style>
