<template>
  <main
    class="search-players-page"
    :class="{
      'search-players-page--app-layout': isAppLayout,
      'search-players-page--modal-filters': hasFilterModal,
      'search-players-page--compact': !props.fillViewport
    }"
    :aria-labelledby="props.titleId"
  >
    <NuxtImg
      class="search-players-page__image"
      :src="props.imageSrc"
      :alt="props.imageAlt"
      :width="props.imageWidth"
      :height="props.imageHeight"
      format="webp"
      preload
      decoding="async"
    />

    <div class="search-players-section-inner search-players-page__inner">
      <div class="search-players-page__layout">
        <slot v-if="hasFilterSlot" name="filters" :has-filter-modal="hasFilterModal" />

        <section class="search-players-results" :aria-labelledby="props.titleId">
          <header class="search-players-results__head">
            <div class="search-players-results__copy">
              <p class="search-players-eyebrow">
                {{ props.eyebrow }}
              </p>
              <h1 :id="props.titleId">
                {{ props.title }}
              </h1>
              <p>
                {{ props.description }}
              </p>
            </div>

            <div
              v-if="props.showHeaderSummary"
              class="search-players-results__summary"
              :aria-label="summaryLabel"
            >
              <span>{{ props.resultsLabel }}</span>
              <span>{{ props.topLabel }}</span>
            </div>
          </header>

          <nav v-if="hasActionsSlot" class="search-players-games" :aria-label="actionsLabel">
            <ul>
              <slot name="actions" />
            </ul>
          </nav>

          <div class="search-players-results__toolbar">
            <CustomButton
              v-if="props.showFilterButton"
              :label="filterButtonLabel"
              left-icon="lucide:list-checks"
              :theme="props.layoutTheme"
              variant="filled"
              color="primary"
              size="lg"
              :aria-haspopup="hasFilterModal ? 'dialog' : undefined"
              :aria-expanded="props.isFilterModalOpen"
              :aria-controls="props.filterControlsId"
              @click="emit('open-filters')"
            />

            <p v-if="props.showToolbarCount" :id="props.resultsCountId" aria-live="polite">
              {{ displayResultsLabel }}
            </p>

            <label v-if="props.showSortControl" class="search-players-sort" :for="props.sortSelectId">
              <span>{{ sortLabel }}</span>
              <select :id="props.sortSelectId" :value="props.sortMode" @change="onSortChange">
                <option v-for="option in props.sortOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>

            <div
              v-if="props.showToolbarSummary"
              class="search-players-results__summary search-players-results__summary--toolbar"
              :aria-label="summaryLabel"
            >
              <span>{{ props.resultsLabel }}</span>
              <span>{{ props.topLabel }}</span>
            </div>
          </div>

          <ul
            v-if="props.hasResults"
            class="search-players-player-list"
            :aria-describedby="props.resultListDescribedby || undefined"
          >
            <slot name="results" />
          </ul>

          <div v-else class="search-players-results__empty" role="status">
            <slot name="empty">
              {{ props.emptyMessage }}
            </slot>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

type SearchSortOption = {
  label: string
  value: string
}

const slots = useSlots()

const { t } = useI18n()

const props = defineProps({
  layoutTheme: {
    type: String,
    default: 'landing',
    validator: (value: string) => ['landing', 'app'].includes(value)
  },
  fillViewport: { type: Boolean, default: true },
  filterPresentation: {
    type: String,
    default: 'sidebar',
    validator: (value: string) => ['sidebar', 'modal'].includes(value)
  },
  imageSrc: { type: String, default: '/images/landing/competition-arena.jpg' },
  imageAlt: { type: String, default: '' },
  imageWidth: { type: [String, Number], default: 1400 },
  imageHeight: { type: [String, Number], default: 933 },
  titleId: { type: String, default: 'search-page-title' },
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  summaryLabel: { type: String, default: '' },
  actionsLabel: { type: String, default: '' },
  resultsLabel: { type: [String, Number], default: '' },
  topLabel: { type: [String, Number], default: '' },
  showHeaderSummary: { type: Boolean, default: true },
  showToolbarSummary: { type: Boolean, default: false },
  showToolbarCount: { type: Boolean, default: true },
  showFilterButton: { type: Boolean, default: false },
  filterButtonLabel: { type: String, default: '' },
  filterControlsId: { type: String, default: '' },
  isFilterModalOpen: { type: Boolean, default: false },
  showSortControl: { type: Boolean, default: true },
  sortLabel: { type: String, default: '' },
  sortSelectId: { type: String, default: 'search-sort' },
  sortMode: { type: String, default: '' },
  sortOptions: {
    type: Array as PropType<SearchSortOption[]>,
    default: () => []
  },
  hasResults: { type: Boolean, default: false },
  resultsCountId: { type: String, default: 'search-results-count' },
  resultListDescribedby: { type: String, default: '' },
  emptyMessage: { type: String, default: '' }
})

const summaryLabel = computed(() => props.summaryLabel || t('app.search.layout.summaryLabel'))
const actionsLabel = computed(() => props.actionsLabel || t('app.search.layout.actionsLabel'))
const filterButtonLabel = computed(() => props.filterButtonLabel || t('app.search.layout.filterButtonLabel'))
const sortLabel = computed(() => props.sortLabel || t('app.search.layout.sortLabel'))

const emit = defineEmits(['update:sortMode', 'open-filters'])

const isAppLayout = computed(() => props.layoutTheme === 'app')
const hasFilterModal = computed(() => props.filterPresentation === 'modal')
const hasFilterSlot = computed(() => Boolean(slots.filters))
const hasActionsSlot = computed(() => Boolean(slots.actions))
const onSortChange = (event: Event) => {
  emit('update:sortMode', (event.target as HTMLSelectElement).value)
}
</script>

<style scoped>
.search-players-page {
  --search-unit: 0.5rem;
  --search-space-1: var(--search-unit);
  --search-space-2: calc(var(--search-unit) * 2);
  --search-space-3: calc(var(--search-unit) * 3);
  --search-space-4: calc(var(--search-unit) * 4);
  --search-space-8: calc(var(--search-unit) * 8);
  --search-space-12: calc(var(--search-unit) * 12);
  --search-space-16: calc(var(--search-unit) * 16);
  --search-space-fluid: clamp(var(--search-space-3), calc(var(--search-space-2) + 3vw), calc(var(--search-unit) * 10));
  --search-edge-space: clamp(var(--search-space-1), calc(var(--search-space-1) + 1vw), var(--search-space-3));
  --search-modal-edge-space: clamp(var(--search-space-3), calc(var(--search-space-2) + 4vw), calc(var(--search-unit) * 10));
  --search-header-height: var(--app-header-height);
  --search-content-max: 100%;
  --search-modal-content-max: calc(var(--search-unit) * 100);
  --search-sidebar-width: calc(var(--search-unit) * 36);
  --search-results-min: calc(var(--search-unit) * 56);
  --search-player-grid-columns: 5;
  --search-player-visual-height: calc(var(--search-unit) * 19);
  --search-staff-visual-height: calc(var(--search-unit) * 14);
  --search-team-visual-height: calc(var(--search-unit) * 14);
  --search-player-photo-size: calc(var(--search-unit) * 8);
  --search-fact-icon-size: calc(var(--search-unit) * 4);
  --search-hit-size: calc(var(--search-unit) * 5);
  --search-radius: var(--search-unit);
  --search-radius-round: calc(var(--search-unit) * 999);
  --search-border: 0.0625rem;
  --search-font-eyebrow: calc(var(--search-unit) * 1.75);
  --search-font-title: clamp(calc(var(--search-unit) * 5), calc(var(--search-unit) * 3 + 4vw), calc(var(--search-unit) * 7.25));
  --search-font-card-title: calc(var(--search-unit) * 2);
  --search-font-text: calc(var(--search-unit) * 2.125);
  --search-font-small: calc(var(--search-unit) * 1.75);
  --search-line-tight: 1;
  --search-line-title: 1.18;
  --search-line-base: 1.55;
  --search-color-bg: oklch(11.5% 0.018 264);
  --search-color-bg-soft: oklch(16% 0.021 264 / 0.92);
  --search-color-section: oklch(18% 0.023 264);
  --search-color-panel: oklch(9.5% 0.014 264 / 0.96);
  --search-color-panel-soft: color-mix(in oklch, oklch(16% 0.021 264 / 0.92) 82%, oklch(0% 0 0 / 0));
  --search-color-panel-line: oklch(96% 0.008 264 / 0.08);
  --search-color-text: oklch(98% 0.006 264);
  --search-color-muted: oklch(88% 0.012 264);
  --search-color-subtle: oklch(76% 0.03 264);
  --search-color-accent: oklch(69.205% 0.20658 42.58);
  --search-color-shadow: oklch(0% 0 0 / 0.5);
  --search-color-accent-strong: oklch(74.736% 0.18012 57.36);
  --search-color-open: color-mix(in oklch, oklch(74.736% 0.18012 57.36) 62%, oklch(98% 0.006 264));
  --search-color-watch: oklch(75% 0.18 58);
  --search-color-busy: oklch(70% 0.2 42);
  --search-color-overlay-start: color-mix(in oklch, oklch(11.5% 0.018 264) 94%, oklch(0% 0 0 / 0));
  --search-color-overlay-mid: color-mix(in oklch, oklch(11.5% 0.018 264) 84%, oklch(0% 0 0 / 0));
  --search-color-overlay-end: color-mix(in oklch, oklch(11.5% 0.018 264) 92%, oklch(0% 0 0 / 0));
  --search-color-transparent: oklch(0% 0 0 / 0);
  --search-gradient-overlay: linear-gradient(90deg, var(--search-color-overlay-start), var(--search-color-overlay-mid), var(--search-color-overlay-end));
  --search-gradient-depth: linear-gradient(180deg, var(--search-color-transparent), var(--search-color-bg));
}

.search-players-page {
  margin-top: calc(var(--search-header-height) * -1);
  background-color: var(--search-color-bg);
  color: var(--search-color-text);
  font-family: var(--font-ui, ui-sans-serif, system-ui, sans-serif);
  letter-spacing: 0;
  isolation: isolate;

  @apply relative w-full overflow-hidden;
}

.search-players-page--app-layout {
  --search-header-height: var(--app-header-height);
  margin-top: 0;
}

.search-players-page::before,
.search-players-page::after {
  position: fixed;
  inset: 0;
  z-index: 1;
  width: 100vw;
  height: 100svh;
  pointer-events: none;
  content: "";
}

.search-players-page::before {
  background: var(--search-gradient-overlay);
}

.search-players-page::after {
  background: var(--search-gradient-depth);
}

.search-players-page__image {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100vw;
  height: 100svh;
  object-fit: cover;
  pointer-events: none;
}

.search-players-section-inner {
  width: min(calc(100% - (var(--search-edge-space) * 2)), var(--search-content-max));

  @apply mx-auto grid;
}

.search-players-page--modal-filters .search-players-section-inner {
  width: min(calc(100% - (var(--search-modal-edge-space) * 2)), var(--search-modal-content-max));
}

.search-players-page__inner {
  z-index: 2;
  min-height: 100svh;
  padding: calc(var(--search-header-height) + var(--search-space-8)) 0 var(--search-space-16);

  @apply relative;
}

.search-players-page--app-layout .search-players-page__inner {
  min-height: calc(100svh - var(--search-header-height));
  padding-block-start: var(--search-space-8);
}

.search-players-page--compact .search-players-page__inner,
.search-players-page--app-layout.search-players-page--compact .search-players-page__inner {
  min-height: auto;
  padding-block-start: var(--search-space-4);
  padding-block-end: var(--search-space-6);
}

.search-players-page__layout {
  gap: var(--search-space-4);

  @apply flex flex-wrap items-start justify-start;
}

.search-players-eyebrow {
  margin: 0;
  color: var(--search-color-accent);
  font-size: var(--search-font-eyebrow);
  line-height: var(--search-line-base);

  @apply font-semibold;
}

.search-players-results {
  flex: 1 1 var(--search-results-min);
  gap: var(--search-space-4);

  @apply grid;
}

.search-players-results__head {
  gap: var(--search-space-4);

  @apply flex flex-wrap items-end justify-between;
}

.search-players-results__copy {
  max-width: calc(var(--search-unit) * 82);
  gap: var(--search-space-2);

  @apply grid;
}

.search-players-results__copy h1,
.search-players-results__copy p {
  margin: 0;
}

.search-players-results__copy h1 {
  color: var(--search-color-text);
  font-size: var(--search-font-title);
  line-height: var(--search-line-tight);
  overflow-wrap: anywhere;

  @apply font-semibold;
}

.search-players-results__copy p:not(.search-players-eyebrow) {
  color: var(--search-color-muted);
  font-size: var(--search-font-text);
  line-height: var(--search-line-base);
}

.search-players-results__summary {
  gap: var(--search-space-2);

  @apply flex flex-wrap items-center;
}

.search-players-results__summary span {
  min-height: var(--search-hit-size);
  padding: 0 var(--search-space-3);
  border: var(--search-border) solid var(--search-color-panel-line);
  border-radius: var(--search-radius-round);
  background-color: var(--search-color-bg-soft);
  color: var(--search-color-text);
  font-size: var(--search-font-small);
  line-height: var(--search-line-tight);

  @apply inline-flex items-center font-semibold;
}

.search-players-results__summary--toolbar {
  margin-left: auto;
}

.search-players-games ul {
  gap: var(--search-space-2);
  margin: 0;
  padding: 0;
  list-style: none;

  @apply flex flex-wrap;
}

.search-players-results__toolbar {
  gap: var(--search-space-3);

  @apply flex flex-wrap items-center justify-between;
}

.search-players-results__toolbar p {
  margin: 0;
  color: var(--search-color-muted);
  font-size: var(--search-font-small);
  line-height: var(--search-line-base);

  @apply font-semibold;
}

.search-players-sort {
  gap: var(--search-space-2);
  color: var(--search-color-muted);
  font-size: var(--search-font-small);

  @apply flex items-center font-semibold;
}

.search-players-sort select {
  min-height: var(--search-hit-size);
  padding: 0 var(--search-space-3);
  border: var(--search-border) solid var(--search-color-panel-line);
  border-radius: var(--search-radius);
  background-color: var(--search-color-panel);
  color: var(--search-color-text);
  font-size: var(--search-font-small);
}

.search-players-player-list {
  grid-template-columns: repeat(var(--search-player-grid-columns), minmax(0, 1fr));
  gap: var(--search-space-3);
  margin: 0;
  padding: 0;
  list-style: none;

  @apply grid;
}

.search-players-player-list > li {
  min-width: 0;
  width: 100%;
}

.search-players-results__empty {
  padding: var(--search-space-4);
  border: var(--search-border) solid var(--search-color-panel-line);
  border-radius: var(--search-radius);
  background-color: var(--search-color-section);
  color: var(--search-color-muted);
  font-size: var(--search-font-text);
  line-height: var(--search-line-base);
}

.search-players-sort select:focus-visible {
  outline: calc(var(--search-border) * 3) solid var(--search-color-accent);
  outline-offset: calc(var(--search-border) * 4);
}

@media (max-width: 96rem) {
  .search-players-page {
    --search-player-grid-columns: 4;
  }
}

@media (max-width: 72rem) {
  .search-players-page {
    --search-player-grid-columns: 3;
  }
}

@media (max-width: 56rem) {
  .search-players-page {
    --search-player-grid-columns: 2;
  }
}

@media (max-width: 48rem) {
  .search-players-page {
    --search-player-grid-columns: 1;
  }
}
</style>
