<template>
  <nav class="cus-route-tabs" :data-theme="props.theme" :data-size="props.size" :data-full-width="props.fullWidth ? 'true' : undefined" :aria-label="props.ariaLabel">
    <ul class="cus-route-tabs__list" role="list">
      <li v-for="item in props.items" :key="resolveItemKey(item)" class="cus-route-tabs__entry">
        <span
          v-if="item.disabled"
          class="cus-route-tabs__link cus-route-tabs__link--disabled"
          :class="resolveItemClasses(item)"
          role="link"
          aria-disabled="true"
          :aria-current="isItemActive(item) ? 'page' : undefined"
          :aria-label="resolveItemAriaLabel(item)"
        >
          <Icon v-if="item.icon" class="cus-route-tabs__icon" :name="item.icon" aria-hidden="true" />
          <span v-if="item.label" class="cus-route-tabs__label">{{ item.label }}</span>
          <span v-if="item.badge" class="cus-route-tabs__badge">{{ item.badge }}</span>
          <Icon v-if="item.invalid" class="cus-route-tabs__status-icon" name="lucide:circle-alert" aria-hidden="true" />
        </span>

        <NuxtLink
          v-else-if="item.to"
          class="cus-route-tabs__link"
          :class="resolveItemClasses(item)"
          :to="item.to"
          :aria-current="isItemActive(item) ? 'page' : undefined"
          :aria-label="resolveItemAriaLabel(item)"
          @click="onItemClick(item)"
        >
          <Icon v-if="item.icon" class="cus-route-tabs__icon" :name="item.icon" aria-hidden="true" />
          <span v-if="item.label" class="cus-route-tabs__label">{{ item.label }}</span>
          <span v-if="item.badge" class="cus-route-tabs__badge">{{ item.badge }}</span>
          <Icon v-if="item.invalid" class="cus-route-tabs__status-icon" name="lucide:circle-alert" aria-hidden="true" />
        </NuxtLink>

        <button
          v-else
          class="cus-route-tabs__link"
          :class="resolveItemClasses(item)"
          type="button"
          :aria-current="isItemActive(item) ? 'page' : undefined"
          :aria-label="resolveItemAriaLabel(item)"
          @click="onItemClick(item)"
        >
          <Icon v-if="item.icon" class="cus-route-tabs__icon" :name="item.icon" aria-hidden="true" />
          <span v-if="item.label" class="cus-route-tabs__label">{{ item.label }}</span>
          <span v-if="item.badge" class="cus-route-tabs__badge">{{ item.badge }}</span>
          <Icon v-if="item.invalid" class="cus-route-tabs__status-icon" name="lucide:circle-alert" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
type RouteTabItem = {
  label: string
  to: string
  icon?: string
  disabled?: boolean
}

const props = defineProps({
  items: {
    type: Array as PropType<RouteTabItem[]>,
    default: () => []
  },
  modelValue: { type: String, default: '' },
  ariaLabel: { type: String, default: 'Navigation tabs' },
  theme: {
    type: String,
    default: 'landing',
    validator: (value: string) => ['landing', 'app'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  fullWidth: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'select'])
const route = useRoute()
const localePath = useLocalePath()

const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/'

const resolveItemValue = (item: RouteTabItem) => item.value || item.to || item.label

const resolveItemKey = (item: RouteTabItem) => resolveItemValue(item)

const resolveLocalizedPath = (item: RouteTabItem) => {
  if (!item.to) return ''

  return normalizePath(localePath(item.to))
}

const isItemActive = (item: RouteTabItem) => {
  const itemValue = resolveItemValue(item)

  if (props.modelValue && props.modelValue === itemValue) {
    return true
  }

  if (!item.to) {
    return false
  }

  const currentPath = normalizePath(route.path)
  const targetPath = resolveLocalizedPath(item)

  if (item.exact) {
    return currentPath === targetPath
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
}

const resolveItemClasses = (item: RouteTabItem) => ({
  'cus-route-tabs__link--active': isItemActive(item),
  'cus-route-tabs__link--invalid': item.invalid
})

const resolveItemAriaLabel = (item: RouteTabItem) => {
  const label = item.ariaLabel || item.label
  if (!item.invalid) return label

  return `${label} - ${item.invalidLabel || 'Invalid'}`
}

const onItemClick = (item: RouteTabItem) => {
  const itemValue = resolveItemValue(item)

  emit('update:modelValue', itemValue)
  emit('select', item)
}
</script>

<style scoped>
.cus-route-tabs {
  --route-tabs-height-sm: calc(var(--unit) * 4);
  --route-tabs-height-md: calc(var(--unit) * 5);
  --route-tabs-height-lg: calc(var(--unit) * 6);
  --route-tabs-border-width: var(--border);
  --route-tabs-radius: var(--radius);
  --route-tabs-padding: var(--space-1);
  --route-tabs-gap: var(--space-1);
  --route-tabs-link-padding-x-sm: calc(var(--unit) * 1.5);
  --route-tabs-link-padding-x-md: calc(var(--unit) * 2);
  --route-tabs-link-padding-x-lg: calc(var(--unit) * 2.5);
  --route-tabs-link-font-sm: calc(var(--unit) * 1.5);
  --route-tabs-link-font-md: calc(var(--unit) * 1.625);
  --route-tabs-link-font-lg: calc(var(--unit) * 1.75);
  --route-tabs-icon-sm: calc(var(--unit) * 1.75);
  --route-tabs-icon-md: calc(var(--unit) * 2);
  --route-tabs-icon-lg: calc(var(--unit) * 2.25);
  --route-tabs-badge-height-sm: calc(var(--unit) * 2.5);
  --route-tabs-badge-height-md: calc(var(--unit) * 2.75);
  --route-tabs-badge-height-lg: calc(var(--unit) * 3);
  --route-tabs-badge-padding-sm: calc(var(--unit) * 0.75);
  --route-tabs-badge-padding-md: calc(var(--unit) * 0.875);
  --route-tabs-badge-padding-lg: calc(var(--unit) * 1);
  --route-tabs-badge-font-sm: calc(var(--unit) * 1.125);
  --route-tabs-badge-font-md: calc(var(--unit) * 1.25);
  --route-tabs-badge-font-lg: calc(var(--unit) * 1.375);
  --route-tabs-link-height: var(--route-tabs-height-md);
  --route-tabs-link-padding-x: var(--route-tabs-link-padding-x-md);
  --route-tabs-link-font: var(--route-tabs-link-font-md);
  --route-tabs-icon-size: var(--route-tabs-icon-md);
  --route-tabs-badge-height: var(--route-tabs-badge-height-md);
  --route-tabs-badge-padding: var(--route-tabs-badge-padding-md);
  --route-tabs-badge-font: var(--route-tabs-badge-font-md);
  --route-tabs-border: var(--color-line);
  --route-tabs-link-bg: var(--color-transparent);
  --route-tabs-link-text: var(--color-muted);
  --route-tabs-link-border: var(--color-transparent);
  --route-tabs-link-hover-bg: color-mix(in oklch, var(--color-bg-soft-hover) 86%, var(--color-accent));
  --route-tabs-link-hover-text: var(--color-text);
  --route-tabs-link-hover-border: color-mix(in oklch, var(--color-line) 70%, var(--color-accent));
  --route-tabs-link-active-bg: color-mix(in oklch, var(--color-accent) 18%, var(--color-bg-soft));
  --route-tabs-link-active-text: var(--color-text);
  --route-tabs-link-active-border: color-mix(in oklch, var(--color-accent) 78%, var(--color-line));
  --route-tabs-link-disabled-bg: var(--color-transparent);
  --route-tabs-link-disabled-text: color-mix(in oklch, var(--color-muted) 46%, var(--color-transparent));
  --route-tabs-link-disabled-border: var(--color-transparent);
  --route-tabs-badge-bg: var(--color-accent);
  --route-tabs-badge-text: var(--color-inverse);
  --route-tabs-link-invalid: var(--color-danger);
  --route-tabs-link-invalid-bg: color-mix(in oklch, var(--route-tabs-link-invalid) 12%, var(--route-tabs-link-bg));
  --route-tabs-link-invalid-border: color-mix(in oklch, var(--route-tabs-link-invalid) 72%, var(--route-tabs-link-border));
  --route-tabs-link-invalid-text: color-mix(in oklch, var(--route-tabs-link-invalid) 84%, var(--landing-color-header-strong));
  width: fit-content;
  max-width: 100%;
  padding: var(--route-tabs-padding);
  border: var(--route-tabs-border-width) solid var(--route-tabs-border);
  border-radius: var(--route-tabs-radius);
  background-color: var(--route-tabs-bg);
}

.cus-route-tabs[data-full-width='true'] {
  width: 100%;
}

.cus-route-tabs__list {
  gap: var(--route-tabs-gap);

  @apply flex flex-wrap items-center p-0 m-0 list-none;
}

.cus-route-tabs[data-full-width='true'] .cus-route-tabs__list,
.cus-route-tabs[data-full-width='true'] .cus-route-tabs__entry,
.cus-route-tabs[data-full-width='true'] .cus-route-tabs__link {
  @apply flex-1;
}

.cus-route-tabs__link {
  position: relative;
  min-height: var(--route-tabs-link-height);
  padding: 0 var(--route-tabs-link-padding-x);
  border: var(--route-tabs-border-width) solid var(--route-tabs-link-border);
  border-radius: var(--route-tabs-radius);
  background-color: var(--route-tabs-link-bg);
  color: var(--route-tabs-link-text);
  font-family: inherit;
  font-size: var(--route-tabs-link-font);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  transition-duration: var(--motion-fast);

  @apply inline-flex items-center justify-center gap-1 whitespace-nowrap no-underline transition-colors cursor-pointer appearance-none;
}

.cus-route-tabs__link::after {
  position: absolute;
  right: var(--route-tabs-link-padding-x);
  bottom: calc(var(--route-tabs-border-width) * -1);
  left: var(--route-tabs-link-padding-x);
  height: 0;
  border-radius: var(--radius-round);
  background-color: var(--color-transparent);
  content: '';
}

.cus-route-tabs__link:not(.cus-route-tabs__link--disabled):hover {
  border-color: var(--route-tabs-link-hover-border);
  background-color: var(--route-tabs-link-hover-bg);
  color: var(--route-tabs-link-hover-text);
}

.cus-route-tabs__link--active {
  border-color: var(--route-tabs-link-active-border);
  background-color: var(--route-tabs-link-active-bg);
  color: var(--route-tabs-link-active-text);
}

.cus-route-tabs__link--invalid {
  border-color: var(--route-tabs-link-invalid-border);
  background-color: var(--route-tabs-link-invalid-bg);
  color: var(--route-tabs-link-invalid-text);
}

.cus-route-tabs__link--disabled {
  border-color: var(--route-tabs-link-disabled-border);
  background-color: var(--route-tabs-link-disabled-bg);
  color: var(--route-tabs-link-disabled-text);

  @apply cursor-not-allowed select-none;
}

.cus-route-tabs__icon {
  width: var(--route-tabs-icon-size);
  height: var(--route-tabs-icon-size);

  @apply shrink-0;
}

.cus-route-tabs__status-icon {
  width: var(--route-tabs-icon-size);
  height: var(--route-tabs-icon-size);
  color: var(--route-tabs-link-invalid-text);

  @apply shrink-0;
}

.cus-route-tabs__label {
  @apply overflow-hidden text-ellipsis;
}

.cus-route-tabs__badge {
  min-width: var(--route-tabs-badge-height);
  height: var(--route-tabs-badge-height);
  padding: 0 var(--route-tabs-badge-padding);
  border-radius: var(--radius-round);
  background-color: var(--route-tabs-badge-bg);
  color: var(--route-tabs-badge-text);
  font-size: var(--route-tabs-badge-font);
  font-weight: var(--font-weight-semibold);
  line-height: var(--route-tabs-badge-height);

  @apply inline-flex shrink-0 items-center justify-center;
}

.cus-route-tabs[data-theme='app'] {
  --route-tabs-height-sm: calc(var(--unit) * 5);
  --route-tabs-height-md: calc(var(--unit) * 6);
  --route-tabs-height-lg: calc(var(--unit) * 7);
  --route-tabs-padding: 0;
  --route-tabs-gap: var(--space-4);
  --route-tabs-radius: 0;
  --route-tabs-border: color-mix(in oklch, var(--color-line) 72%, var(--color-transparent));
  --route-tabs-link-bg: var(--color-transparent);
  --route-tabs-link-text: color-mix(in oklch, var(--color-muted) 72%, var(--color-bg));
  --route-tabs-link-border: var(--color-transparent);
  --route-tabs-link-hover-bg: var(--color-transparent);
  --route-tabs-link-hover-text: var(--color-text);
  --route-tabs-link-hover-border: var(--color-transparent);
  --route-tabs-link-active-bg: var(--color-transparent);
  --route-tabs-link-active-text: var(--color-text);
  --route-tabs-link-active-border: var(--color-transparent);
  --route-tabs-link-disabled-bg: var(--color-transparent);
  --route-tabs-link-disabled-text: color-mix(in oklch, var(--color-muted) 44%, var(--color-transparent));
  --route-tabs-link-disabled-border: var(--color-transparent);
  --route-tabs-badge-bg: var(--color-accent);
  --route-tabs-badge-text: var(--color-inverse);
  --route-tabs-link-invalid: var(--app-color-danger);
  width: 100%;
  border-width: 0 0 var(--route-tabs-border-width);
}

.cus-route-tabs[data-theme='app'] .cus-route-tabs__link {
  padding: 0;
  border-width: 0;
  white-space: normal;
  text-align: center;
  flex-wrap: wrap;
}

.cus-route-tabs[data-theme='app'] .cus-route-tabs__link:not(.cus-route-tabs__link--disabled):hover {
  border-color: var(--color-transparent);
}

.cus-route-tabs[data-theme='app'] .cus-route-tabs__label {
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
}

.cus-route-tabs[data-theme='app'] .cus-route-tabs__link--active::after {
  right: 0;
  left: 0;
  height: calc(var(--route-tabs-border-width) * 2);
  background-color: var(--color-accent);
}

.cus-route-tabs[data-theme='app'] .cus-route-tabs__link--invalid {
  background-color: var(--color-transparent);
}

.cus-route-tabs[data-theme='app'] .cus-route-tabs__link--invalid::after {
  right: 0;
  left: 0;
  height: calc(var(--route-tabs-border-width) * 2);
  background-color: var(--route-tabs-link-invalid);
}

.cus-route-tabs[data-size='sm'] {
  --route-tabs-link-height: var(--route-tabs-height-sm);
  --route-tabs-link-padding-x: var(--route-tabs-link-padding-x-sm);
  --route-tabs-link-font: var(--route-tabs-link-font-sm);
  --route-tabs-icon-size: var(--route-tabs-icon-sm);
  --route-tabs-badge-height: var(--route-tabs-badge-height-sm);
  --route-tabs-badge-padding: var(--route-tabs-badge-padding-sm);
  --route-tabs-badge-font: var(--route-tabs-badge-font-sm);
}

.cus-route-tabs[data-size='lg'] {
  --route-tabs-link-height: var(--route-tabs-height-lg);
  --route-tabs-link-padding-x: var(--route-tabs-link-padding-x-lg);
  --route-tabs-link-font: var(--route-tabs-link-font-lg);
  --route-tabs-icon-size: var(--route-tabs-icon-lg);
  --route-tabs-badge-height: var(--route-tabs-badge-height-lg);
  --route-tabs-badge-padding: var(--route-tabs-badge-padding-lg);
  --route-tabs-badge-font: var(--route-tabs-badge-font-lg);
}
</style>
