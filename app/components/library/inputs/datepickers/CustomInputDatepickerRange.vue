<template>
  <div
    ref="rootElement"
    class="cus-input-date-range"
    :data-size="props.size"
    :data-open="isOpen ? 'true' : 'false'"
    :data-selected="props.selected ? 'true' : 'false'"
    :data-disabled="props.disabled ? 'true' : 'false'"
    :data-error="hasError ? 'true' : 'false'"
    :data-label-position="props.labelPosition"
    :data-has-inside-label="hasInsideLabel ? 'true' : 'false'"
  >
    <label v-if="hasExternalLabel" :id="labelId" class="cus-input-date-range__label">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="cus-input-date-range__required" aria-hidden="true">*</span>
    </label>

    <div
      ref="fieldsElement"
      class="cus-input-date-range__fields"
      role="group"
      :aria-labelledby="hasExternalLabel ? labelId : undefined"
      :aria-label="accessibleGroupLabel"
      :aria-describedby="describedBy"
    >
      <div class="cus-input-date-range__field" :data-active="activeEndpoint === 'start' ? 'true' : 'false'">
        <label class="cus-input-date-range__field-label" :for="startInputId">
          {{ props.startLabel }}
        </label>
        <div ref="startControlElement" class="cus-input-date-range__control">
          <Icon class="cus-input-date-range__icon cus-input-date-range__icon--left" name="lucide:calendar-days" aria-hidden="true" />
          <span v-if="showStartInsideLabel" class="cus-input-date-range__inside-label" aria-hidden="true">
            <span class="cus-input-date-range__inside-label-text">{{ props.startLabel }}</span>
            <span v-if="props.required" class="cus-input-date-range__required">*</span>
          </span>
          <input
            :id="startInputId"
            ref="startInputElement"
            class="cus-input-date-range__input"
            type="text"
            :name="startInputName"
            :value="startTextValue"
            :placeholder="startPlaceholderValue"
            :required="props.required"
            :disabled="props.disabled"
            :autocomplete="props.autocomplete"
            inputmode="numeric"
            :maxlength="inputMaxLength"
            :pattern="inputPattern"
            :aria-invalid="hasError ? 'true' : undefined"
            :aria-describedby="describedBy"
            @input="onInput($event, 'start')"
            @change="onInputChange($event, 'start')"
            @keydown="onInputKeydown($event, 'start')"
            @focus="onInputFocus($event, 'start')"
            @blur="emit('blur', 'start', $event)"
          >
          <button
            class="cus-input-date-range__icon-button"
            type="button"
            :disabled="props.disabled"
            aria-haspopup="dialog"
            :aria-expanded="isOpen && activeEndpoint === 'start' ? 'true' : 'false'"
            :aria-controls="isOpen ? popupId : undefined"
            :aria-label="startCalendarButtonLabel"
            @click="togglePopup('start')"
            @keydown="onTriggerKeydown($event, 'start')"
          >
            <Icon class="cus-input-date-range__icon" :name="isOpen && activeEndpoint === 'start' ? 'lucide:chevron-up' : 'lucide:chevron-down'" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div class="cus-input-date-range__field" :data-active="activeEndpoint === 'end' ? 'true' : 'false'">
        <label class="cus-input-date-range__field-label" :for="endInputId">
          {{ props.endLabel }}
        </label>
        <div ref="endControlElement" class="cus-input-date-range__control">
          <Icon class="cus-input-date-range__icon cus-input-date-range__icon--left" name="lucide:calendar-days" aria-hidden="true" />
          <span v-if="showEndInsideLabel" class="cus-input-date-range__inside-label" aria-hidden="true">
            <span class="cus-input-date-range__inside-label-text">{{ props.endLabel }}</span>
            <span v-if="props.required" class="cus-input-date-range__required">*</span>
          </span>
          <input
            :id="endInputId"
            ref="endInputElement"
            class="cus-input-date-range__input"
            type="text"
            :name="endInputName"
            :value="endTextValue"
            :placeholder="endPlaceholderValue"
            :required="props.required"
            :disabled="props.disabled"
            :autocomplete="props.autocomplete"
            inputmode="numeric"
            :maxlength="inputMaxLength"
            :pattern="inputPattern"
            :aria-invalid="hasError ? 'true' : undefined"
            :aria-describedby="describedBy"
            @input="onInput($event, 'end')"
            @change="onInputChange($event, 'end')"
            @keydown="onInputKeydown($event, 'end')"
            @focus="onInputFocus($event, 'end')"
            @blur="emit('blur', 'end', $event)"
          >
          <button
            class="cus-input-date-range__icon-button"
            type="button"
            :disabled="props.disabled"
            aria-haspopup="dialog"
            :aria-expanded="isOpen && activeEndpoint === 'end' ? 'true' : 'false'"
            :aria-controls="isOpen ? popupId : undefined"
            :aria-label="endCalendarButtonLabel"
            @click="togglePopup('end')"
            @keydown="onTriggerKeydown($event, 'end')"
          >
            <Icon class="cus-input-date-range__icon" :name="isOpen && activeEndpoint === 'end' ? 'lucide:chevron-up' : 'lucide:chevron-down'" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <p :id="formatId" class="cus-input-date-range__format">
      {{ formatDescription }}
    </p>

    <p :id="statusId" class="cus-input-date-range__status" aria-live="polite">
      {{ rangeStatus }}
    </p>

    <div
      v-if="isOpen"
      :id="popupId"
      class="cus-input-date-range__popup"
      role="dialog"
      :aria-labelledby="headingId"
      :style="popupStyle"
      @keydown="onPopupKeydown"
    >
      <div class="cus-input-date-range__calendar-header">
        <button
          class="cus-input-date-range__nav-button"
          type="button"
          :disabled="!canGoPreviousPage"
          :aria-label="props.previousMonthLabel"
          @click="goToPage(-1)"
        >
          <Icon class="cus-input-date-range__nav-icon" name="lucide:chevron-left" aria-hidden="true" />
        </button>

        <h2 :id="headingId" class="cus-input-date-range__heading" aria-live="polite">
          {{ headerLabel }}
        </h2>

        <button
          class="cus-input-date-range__nav-button"
          type="button"
          :disabled="!canGoNextPage"
          :aria-label="props.nextMonthLabel"
          @click="goToPage(1)"
        >
          <Icon class="cus-input-date-range__nav-icon" name="lucide:chevron-right" aria-hidden="true" />
        </button>
      </div>

      <table class="cus-input-date-range__calendar" role="grid" :aria-labelledby="headingId">
        <thead>
          <tr>
            <th v-for="weekday in weekDayLabels" :key="weekday.key" scope="col" class="cus-input-date-range__weekday">
              <abbr :title="weekday.long">{{ weekday.short }}</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="week in calendarWeeks" :key="week.key">
            <td v-for="day in week.days" :key="day.key" class="cus-input-date-range__day-cell">
              <button
                v-if="day.isVisible"
                :ref="(element) => setDayButtonRef(day.iso, element)"
                class="cus-input-date-range__day"
                type="button"
                :tabindex="day.iso === activeDateKey ? 0 : -1"
                :disabled="day.isDisabled"
                :aria-label="day.ariaLabel"
                :aria-selected="day.isRangeStart || day.isRangeEnd ? 'true' : undefined"
                :data-today="day.isToday ? 'true' : 'false'"
                :data-active="day.iso === activeDateKey ? 'true' : 'false'"
                :data-range-start="day.isRangeStart ? 'true' : 'false'"
                :data-range-end="day.isRangeEnd ? 'true' : 'false'"
                :data-range-between="day.isRangeBetween ? 'true' : 'false'"
                :data-range-preview="day.isRangePreview ? 'true' : 'false'"
                @click="selectDate(day.date)"
                @mouseenter="previewDate = day.date"
                @mouseleave="previewDate = null"
                @keydown="onDayKeydown($event, day.date)"
              >
                {{ day.label }}
              </button>
              <span v-else class="cus-input-date-range__day-placeholder" aria-hidden="true"></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p
      :id="errorId"
      class="cus-input-date-range__error"
      :data-visible="hasError ? 'true' : 'false'"
      :aria-live="hasError ? 'polite' : undefined"
      :aria-hidden="hasError ? undefined : 'true'"
    >
      {{ props.errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

type DateFormat = 'YYYY-MM-DD' | 'DD-MM-YYYY'
type RangeEndpoint = 'start' | 'end'

type DateRangeValue = {
  start?: string
  end?: string
}

type CalendarDay = {
  date: Date
  iso: string
  key: string
  label: string
  ariaLabel: string
  isVisible: boolean
  isToday: boolean
  isDisabled: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
  isRangeBetween: boolean
  isRangePreview: boolean
}

type CalendarWeek = {
  key: string
  days: CalendarDay[]
}

type OrderedRange = {
  start: Date
  end: Date
}

const isoDatePattern = /^(\d{4})[/-](\d{2})[/-](\d{2})$/
const localDatePattern = /^(\d{2})[/-](\d{2})[/-](\d{4})$/
const dateDigitCount = 'YYYYMMDD'.length
const generatedId = useId()

const props = defineProps({
  modelValue: {
    type: Object as PropType<DateRangeValue | null>,
    default: () => ({ start: '', end: '' })
  },
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  startName: { type: String, default: '' },
  endName: { type: String, default: '' },
  label: { type: String, default: '' },
  labelPosition: {
    type: String,
    default: 'outside',
    validator: (value: string) => ['inside', 'outside'].includes(value)
  },
  ariaLabel: { type: String, default: '' },
  startLabel: { type: String, default: 'Date de debut' },
  endLabel: { type: String, default: 'Date de fin' },
  startPlaceholder: { type: String, default: '' },
  endPlaceholder: { type: String, default: '' },
  formatLabel: { type: String, default: '' },
  format: {
    type: String,
    default: 'YYYY-MM-DD',
    validator: (value: string) => ['YYYY-MM-DD', 'DD-MM-YYYY'].includes(value)
  },
  separator: { type: String, default: '' },
  locale: { type: String, default: 'fr-FR' },
  firstDayOfWeek: {
    type: Number,
    default: 1,
    validator: (value: number) => Number.isInteger(value) && value >= 0 && value <= 6
  },
  min: { type: String, default: '' },
  max: { type: String, default: '' },
  minDate: { type: String, default: '' },
  maxDate: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  autocomplete: { type: String, default: 'off' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
  openCalendarLabel: { type: String, default: 'Ouvrir le calendrier' },
  closeCalendarLabel: { type: String, default: 'Fermer le calendrier' },
  previousMonthLabel: { type: String, default: 'Mois precedent' },
  nextMonthLabel: { type: String, default: 'Mois suivant' }
})

const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur', 'open', 'close'])

const rootElement = ref<HTMLElement | null>(null)
const fieldsElement = ref<HTMLElement | null>(null)
const startControlElement = ref<HTMLElement | null>(null)
const endControlElement = ref<HTMLElement | null>(null)
const startInputElement = ref<HTMLInputElement | null>(null)
const endInputElement = ref<HTMLInputElement | null>(null)
const dayButtonElements = ref(new Map<string, HTMLButtonElement>())
const startTextValue = ref('')
const endTextValue = ref('')
const activeEndpoint = ref<RangeEndpoint>('start')
const previewDate = ref<Date | null>(null)
const isOpen = ref(false)
const popupInlineStart = ref('')
const popupBlockStart = ref('')
const popupInlineSize = ref('')

function startOfDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

const today = startOfDate(new Date())
const padDatePart = (value: number) => String(value).padStart(2, '0')
const activeFormat = computed(() => props.format as DateFormat)
const dateSeparator = computed(() => props.separator || (activeFormat.value === 'DD-MM-YYYY' ? '/' : '-'))

const toIsoDate = (date: Date) => {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`
}

const buildDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return startOfDate(date)
}

const parseDateValue = (value: string) => {
  const normalizedValue = value
  if (!normalizedValue) return null

  const isoMatch = isoDatePattern.exec(normalizedValue)
  if (isoMatch) return buildDate(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]))

  const localMatch = localDatePattern.exec(normalizedValue)
  if (localMatch) return buildDate(Number(localMatch[3]), Number(localMatch[2]), Number(localMatch[1]))

  const digits = normalizedValue.replace(/\D/g, '')
  if (digits.length !== dateDigitCount) return null

  if (activeFormat.value === 'YYYY-MM-DD') {
    return buildDate(Number(digits.slice(0, 4)), Number(digits.slice(4, 6)), Number(digits.slice(6, 8)))
  }

  return buildDate(Number(digits.slice(4, 8)), Number(digits.slice(2, 4)), Number(digits.slice(0, 2)))
}

const formatDateValue = (date: Date) => {
  const year = String(date.getFullYear())
  const month = padDatePart(date.getMonth() + 1)
  const day = padDatePart(date.getDate())
  const separator = dateSeparator.value

  if (activeFormat.value === 'YYYY-MM-DD') return [year, month, day].join(separator)
  return [day, month, year].join(separator)
}

const formatDigits = (digits: string, groups: number[]) => {
  const parts = []
  let cursor = 0

  for (const group of groups) {
    const part = digits.slice(cursor, cursor + group)
    if (part) parts.push(part)
    cursor += group
  }

  return parts.join(dateSeparator.value)
}

const formatTypedValue = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, dateDigitCount)
  return activeFormat.value === 'YYYY-MM-DD' ? formatDigits(digits, [4, 2, 2]) : formatDigits(digits, [2, 2, 4])
}

const isCompleteInputValue = (value: string) => {
  return value.replace(/\D/g, '').length === dateDigitCount
}

const compareDates = (leftDate: Date, rightDate: Date) => {
  return startOfDate(leftDate).getTime() - startOfDate(rightDate).getTime()
}

const addDays = (date: Date, amount: number) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

const addMonths = (date: Date, amount: number) => {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

const getMonthStart = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

const getMonthEnd = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

const getDaysInMonth = (date: Date) => getMonthEnd(date).getDate()
const activeDate = ref(today)
const displayedMonth = ref(getMonthStart(activeDate.value))

const orderRange = (firstDate: Date, secondDate: Date): OrderedRange => {
  if (compareDates(firstDate, secondDate) <= 0) {
    return {
      start: startOfDate(firstDate),
      end: startOfDate(secondDate)
    }
  }

  return {
    start: startOfDate(secondDate),
    end: startOfDate(firstDate)
  }
}

const normalizedModelValue = computed(() => ({
  start: props.modelValue?.start || '',
  end: props.modelValue?.end || ''
}))
const startDate = computed(() => parseDateValue(normalizedModelValue.value.start))
const endDate = computed(() => parseDateValue(normalizedModelValue.value.end))
const startDateKey = computed(() => startDate.value ? toIsoDate(startDate.value) : '')
const endDateKey = computed(() => endDate.value ? toIsoDate(endDate.value) : '')
const selectedRange = computed(() => {
  if (!startDate.value || !endDate.value) return null
  return orderRange(startDate.value, endDate.value)
})
const previewRange = computed(() => {
  if (activeEndpoint.value !== 'end' || !startDate.value || !previewDate.value || endDate.value) return null
  return orderRange(startDate.value, previewDate.value)
})
const minDateValue = computed(() => props.minDate || props.min)
const maxDateValue = computed(() => props.maxDate || props.max)
const minDate = computed(() => parseDateValue(minDateValue.value))
const maxDate = computed(() => parseDateValue(maxDateValue.value))
const hasError = computed(() => props.errorMessage.length > 0)

const isDateDisabled = (date: Date) => {
  if (minDate.value && compareDates(date, minDate.value) < 0) return true
  if (maxDate.value && compareDates(date, maxDate.value) > 0) return true
  return false
}

const clampDate = (date: Date) => {
  let nextDate = startOfDate(date)

  if (minDate.value && compareDates(nextDate, minDate.value) < 0) nextDate = minDate.value
  if (maxDate.value && compareDates(nextDate, maxDate.value) > 0) nextDate = maxDate.value

  return startOfDate(nextDate)
}

const inputId = computed(() => props.id || `cus-input-date-range-${generatedId}`)
const labelId = computed(() => `${inputId.value}-label`)
const startInputId = computed(() => `${inputId.value}-start`)
const endInputId = computed(() => `${inputId.value}-end`)
const formatId = computed(() => `${inputId.value}-format`)
const statusId = computed(() => `${inputId.value}-status`)
const errorId = computed(() => `${inputId.value}-error`)
const popupId = computed(() => `${inputId.value}-popup`)
const headingId = computed(() => `${inputId.value}-heading`)
const startInputName = computed(() => props.startName || (props.name ? `${props.name}-start` : undefined))
const endInputName = computed(() => props.endName || (props.name ? `${props.name}-end` : undefined))
const hasExternalLabel = computed(() => props.label.length > 0 && props.labelPosition === 'outside')
const hasInsideLabel = computed(() => props.labelPosition === 'inside')
const formatPlaceholder = computed(() => {
  if (activeFormat.value === 'YYYY-MM-DD') return `YYYY${dateSeparator.value}MM${dateSeparator.value}DD`
  return `DD${dateSeparator.value}MM${dateSeparator.value}YYYY`
})
const startPlaceholderValue = computed(() => {
  return props.startPlaceholder || formatPlaceholder.value
})
const endPlaceholderValue = computed(() => {
  return props.endPlaceholder || formatPlaceholder.value
})
const showStartInsideLabel = computed(() => hasInsideLabel.value && props.startLabel.length > 0 && startTextValue.value.length === 0)
const showEndInsideLabel = computed(() => hasInsideLabel.value && props.endLabel.length > 0 && endTextValue.value.length === 0)
const inputMaxLength = computed(() => formatPlaceholder.value.length)
const inputPattern = computed(() => {
  const separatorPattern = dateSeparator.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (activeFormat.value === 'YYYY-MM-DD') return `\\d{4}${separatorPattern}\\d{2}${separatorPattern}\\d{2}`
  return `\\d{2}${separatorPattern}\\d{2}${separatorPattern}\\d{4}`
})
const formatDescription = computed(() => props.formatLabel || `Format attendu : ${formatPlaceholder.value}`)
const describedBy = computed(() => {
  const ids = [formatId.value, statusId.value]
  if (props.errorMessage) ids.push(errorId.value)
  return ids.join(' ')
})
const accessibleGroupLabel = computed(() => {
  if (hasExternalLabel.value) return undefined
  if (props.label) return props.label
  return props.ariaLabel || props.name || inputId.value
})
const startCalendarButtonLabel = computed(() => {
  return isOpen.value && activeEndpoint.value === 'start' ? props.closeCalendarLabel : props.openCalendarLabel
})
const endCalendarButtonLabel = computed(() => {
  return isOpen.value && activeEndpoint.value === 'end' ? props.closeCalendarLabel : props.openCalendarLabel
})
const activeDateKey = computed(() => toIsoDate(activeDate.value))
const popupStyle = computed(() => {
  if (!popupInlineStart.value || !popupBlockStart.value || !popupInlineSize.value) return undefined

  return {
    '--datepicker-popup-inline-start': popupInlineStart.value,
    '--datepicker-popup-block-start': popupBlockStart.value,
    '--datepicker-popup-inline-size': popupInlineSize.value
  }
})

const monthFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
  month: 'long',
  year: 'numeric'
}))
const dayAriaFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}))
const weekdayShortFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
  weekday: 'short'
}))
const weekdayLongFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
  weekday: 'long'
}))

const headerLabel = computed(() => monthFormatter.value.format(displayedMonth.value))
const rangeStatus = computed(() => {
  if (!isOpen.value) return ''
  if (activeEndpoint.value === 'start') return 'Selectionnez la date de debut.'
  return 'Selectionnez la date de fin.'
})

const weekDayLabels = computed(() => {
  const sunday = new Date(2026, 1, 1)

  return Array.from({ length: 7 }, (_, index) => {
    const weekdayIndex = (props.firstDayOfWeek + index) % 7
    const date = addDays(sunday, weekdayIndex)

    return {
      key: String(weekdayIndex),
      short: weekdayShortFormatter.value.format(date).replace(/\.$/, ''),
      long: weekdayLongFormatter.value.format(date)
    }
  })
})

const isDateInRange = (date: Date, range: OrderedRange | null) => {
  if (!range) return false
  return compareDates(date, range.start) >= 0 && compareDates(date, range.end) <= 0
}

const isDateInsideRange = (date: Date, range: OrderedRange | null) => {
  if (!range) return false
  return compareDates(date, range.start) > 0 && compareDates(date, range.end) < 0
}

const buildDayAriaLabel = (date: Date, isRangeStart: boolean, isRangeEnd: boolean, isRangeBetween: boolean) => {
  const label = dayAriaFormatter.value.format(date)
  if (isRangeStart && isRangeEnd) return `${label}, debut et fin de periode`
  if (isRangeStart) return `${label}, debut de periode`
  if (isRangeEnd) return `${label}, fin de periode`
  if (isRangeBetween) return `${label}, dans la periode selectionnee`
  return label
}

const calendarWeeks = computed<CalendarWeek[]>(() => {
  const monthStart = getMonthStart(displayedMonth.value)
  const monthOffset = (monthStart.getDay() - props.firstDayOfWeek + 7) % 7
  const gridStart = addDays(monthStart, -monthOffset)

  return Array.from({ length: 6 }, (_, weekIndex) => {
    const days = Array.from({ length: 7 }, (_, dayIndex) => {
      const date = addDays(gridStart, weekIndex * 7 + dayIndex)
      const iso = toIsoDate(date)
      const isVisible = date.getMonth() === displayedMonth.value.getMonth()
      const isRangeStart = isVisible && startDateKey.value === iso
      const isRangeEnd = isVisible && endDateKey.value === iso
      const isRangeBetween = isVisible && isDateInsideRange(date, selectedRange.value)
      const isRangePreview = isVisible && !isRangeBetween && isDateInRange(date, previewRange.value)

      return {
        date,
        iso,
        key: iso,
        label: isVisible ? String(date.getDate()) : '',
        ariaLabel: isVisible ? buildDayAriaLabel(date, isRangeStart, isRangeEnd, isRangeBetween) : '',
        isVisible,
        isToday: isVisible && compareDates(date, today) === 0,
        isDisabled: !isVisible || isDateDisabled(date),
        isRangeStart,
        isRangeEnd,
        isRangeBetween,
        isRangePreview
      }
    })

    return {
      key: `week-${weekIndex}-${toIsoDate(days[0].date)}`,
      days
    }
  }).filter((week) => week.days.some((day) => day.isVisible))
})

const canGoPreviousPage = computed(() => {
  const previousMonth = addMonths(displayedMonth.value, -1)
  return !minDate.value || compareDates(getMonthEnd(previousMonth), minDate.value) >= 0
})

const canGoNextPage = computed(() => {
  const nextMonth = addMonths(displayedMonth.value, 1)
  return !maxDate.value || compareDates(getMonthStart(nextMonth), maxDate.value) <= 0
})

const setDayButtonRef = (iso: string, element: unknown) => {
  if (element instanceof HTMLButtonElement) {
    dayButtonElements.value.set(iso, element)
    return
  }

  dayButtonElements.value.delete(iso)
}

const focusActiveTarget = async () => {
  await nextTick()
  dayButtonElements.value.get(activeDateKey.value)?.focus()
}

const updateDisplayedMonthFromDate = (date: Date) => {
  displayedMonth.value = getMonthStart(date)
}

const setActiveDate = async (date: Date, shouldFocus = true) => {
  activeDate.value = clampDate(date)
  updateDisplayedMonthFromDate(activeDate.value)
  if (shouldFocus) await focusActiveTarget()
}

const getTokenPixels = (tokenName: string) => {
  if (!rootElement.value) return 0
  const rawValue = window.getComputedStyle(rootElement.value).getPropertyValue(tokenName)
  if (!rawValue) return 0

  const measureElement = document.createElement('div')
  measureElement.style.position = 'absolute'
  measureElement.style.visibility = 'hidden'
  measureElement.style.width = rawValue
  measureElement.style.pointerEvents = 'none'
  rootElement.value.appendChild(measureElement)

  const pixels = measureElement.getBoundingClientRect().width
  measureElement.remove()

  return pixels
}

const updatePopupGeometry = () => {
  if (!fieldsElement.value || !rootElement.value) return

  const rect = fieldsElement.value.getBoundingClientRect()
  const unit = getTokenPixels('--unit')
  const viewportGap = unit * 2
  const headerHeight = getTokenPixels('--landing-header-height')
  const topBoundary = headerHeight + viewportGap
  const preferredWidth = unit * 54
  const availableWidth = Math.max(window.innerWidth - viewportGap * 2, 0)
  const width = availableWidth > 0 ? Math.min(Math.max(rect.width, preferredWidth), availableWidth) : rect.width
  const expectedHeight = unit * (18 + calendarWeeks.value.length * 6)
  const availableBelow = window.innerHeight - rect.bottom - viewportGap
  const availableAbove = rect.top - topBoundary
  const shouldOpenBelow = availableBelow >= expectedHeight || availableBelow >= availableAbove
  const left = Math.min(Math.max(rect.left, viewportGap), window.innerWidth - viewportGap - width)
  const preferredTop = shouldOpenBelow ? rect.bottom + viewportGap : rect.top - viewportGap - expectedHeight

  popupInlineStart.value = `${Math.max(left, viewportGap)}px`
  popupBlockStart.value = `${Math.max(preferredTop, topBoundary)}px`
  popupInlineSize.value = `${width}px`
}

const syncTextValues = () => {
  startTextValue.value = startDate.value ? formatDateValue(startDate.value) : normalizedModelValue.value.start
  endTextValue.value = endDate.value ? formatDateValue(endDate.value) : normalizedModelValue.value.end
}

const focusInput = (endpoint: RangeEndpoint) => {
  nextTick(() => {
    const inputElement = endpoint === 'start' ? startInputElement.value : endInputElement.value
    inputElement?.focus()
  })
}

const openPopup = async (endpoint: RangeEndpoint) => {
  if (props.disabled) return

  activeEndpoint.value = endpoint
  const endpointDate = endpoint === 'start' ? startDate.value : endDate.value
  const baseDate = endpointDate || startDate.value || endDate.value || activeDate.value || today
  activeDate.value = clampDate(baseDate)
  updateDisplayedMonthFromDate(activeDate.value)

  if (!isOpen.value) {
    isOpen.value = true
    emit('open')
  }

  await nextTick()
  updatePopupGeometry()
  await focusActiveTarget()
}

const closePopup = (shouldFocusInput = false) => {
  if (!isOpen.value) return
  const endpoint = activeEndpoint.value
  isOpen.value = false
  previewDate.value = null
  emit('close')

  if (shouldFocusInput) focusInput(endpoint)
}

const togglePopup = (endpoint: RangeEndpoint) => {
  if (isOpen.value && activeEndpoint.value === endpoint) {
    closePopup()
    return
  }

  openPopup(endpoint)
}

const emitRangeValue = (start: string, end: string) => {
  const nextValue = { start, end }
  emit('update:modelValue', nextValue)
  return nextValue
}

const emitEndpointValue = (endpoint: RangeEndpoint, value: string, event?: Event) => {
  const nextValue = {
    ...normalizedModelValue.value,
    [endpoint]: value
  }

  emit('update:modelValue', nextValue)
  emit('input', endpoint, value, event)
  return nextValue
}

const onInput = (event: Event, endpoint: RangeEndpoint) => {
  const target = event.target as HTMLInputElement
  const formattedValue = formatTypedValue(target.value)
  target.value = formattedValue

  if (endpoint === 'start') startTextValue.value = formattedValue
  else endTextValue.value = formattedValue

  emitEndpointValue(endpoint, formattedValue, event)

  if (!isCompleteInputValue(formattedValue)) return

  const parsedDate = parseDateValue(formattedValue)
  if (!parsedDate) return

  activeDate.value = clampDate(parsedDate)
  updateDisplayedMonthFromDate(activeDate.value)
}

const onInputChange = (event: Event, endpoint: RangeEndpoint) => {
  emit('change', normalizedModelValue.value, endpoint, event)
}

const onInputFocus = (event: FocusEvent, endpoint: RangeEndpoint) => {
  activeEndpoint.value = endpoint
  emit('focus', endpoint, event)
}

const onInputKeydown = (event: KeyboardEvent, endpoint: RangeEndpoint) => {
  if (props.disabled) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    openPopup(endpoint)
    return
  }

  if (event.key === 'Escape') {
    closePopup()
  }
}

const onTriggerKeydown = (event: KeyboardEvent, endpoint: RangeEndpoint) => {
  if (props.disabled) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    openPopup(endpoint)
  }
}

const selectDate = (date: Date) => {
  if (isDateDisabled(date)) return

  const nextDate = startOfDate(date)
  activeDate.value = nextDate
  updateDisplayedMonthFromDate(nextDate)
  previewDate.value = null

  if (activeEndpoint.value === 'start') {
    if (!endDate.value) {
      emitRangeValue(formatDateValue(nextDate), '')
      activeEndpoint.value = 'end'
      return
    }

    const range = orderRange(nextDate, endDate.value)
    const nextValue = emitRangeValue(formatDateValue(range.start), formatDateValue(range.end))
    emit('change', nextValue, 'start')
    closePopup(true)
    return
  }

  if (!startDate.value) {
    emitRangeValue(formatDateValue(nextDate), '')
    activeEndpoint.value = 'end'
    return
  }

  const range = orderRange(startDate.value, nextDate)
  const nextValue = emitRangeValue(formatDateValue(range.start), formatDateValue(range.end))
  emit('change', nextValue, 'end')
  closePopup(true)
}

const goToPage = async (offset: number) => {
  if ((offset < 0 && !canGoPreviousPage.value) || (offset > 0 && !canGoNextPage.value)) return

  const nextMonth = addMonths(displayedMonth.value, offset)
  const day = Math.min(activeDate.value.getDate(), getDaysInMonth(nextMonth))
  await setActiveDate(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day))
  updatePopupGeometry()
}

const moveActiveDate = (amount: number) => {
  setActiveDate(addDays(activeDate.value, amount))
}

const moveActiveDateToWeekEdge = (direction: number) => {
  const offset = (activeDate.value.getDay() - props.firstDayOfWeek + 7) % 7
  const edgeOffset = direction < 0 ? -offset : 6 - offset
  setActiveDate(addDays(activeDate.value, edgeOffset))
}

const onDayKeydown = (event: KeyboardEvent, date: Date) => {
  activeDate.value = startOfDate(date)

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    moveActiveDate(1)
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    moveActiveDate(-1)
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActiveDate(7)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActiveDate(-7)
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    moveActiveDateToWeekEdge(-1)
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    moveActiveDateToWeekEdge(1)
    return
  }

  if (event.key === 'PageUp') {
    event.preventDefault()
    goToPage(event.shiftKey ? -12 : -1)
    return
  }

  if (event.key === 'PageDown') {
    event.preventDefault()
    goToPage(event.shiftKey ? 12 : 1)
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectDate(activeDate.value)
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closePopup(true)
  }
}

const onPopupKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Tab') closePopup()
}

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!rootElement.value?.contains(event.target as Node)) closePopup()
}

watch([() => props.modelValue, () => props.format, () => props.separator], () => {
  syncTextValues()
  const baseDate = activeEndpoint.value === 'start' ? startDate.value : endDate.value
  const fallbackDate = startDate.value || endDate.value
  const nextDate = baseDate || fallbackDate
  if (!nextDate) return

  activeDate.value = clampDate(nextDate)
  updateDisplayedMonthFromDate(activeDate.value)
}, { immediate: true })

watch([minDate, maxDate], () => {
  activeDate.value = clampDate(activeDate.value)
  updateDisplayedMonthFromDate(activeDate.value)
})

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('pointerdown', onDocumentPointerDown)
    window.addEventListener('resize', updatePopupGeometry)
    window.addEventListener('scroll', updatePopupGeometry, true)
    return
  }

  document.removeEventListener('pointerdown', onDocumentPointerDown)
  window.removeEventListener('resize', updatePopupGeometry)
  window.removeEventListener('scroll', updatePopupGeometry, true)
})

watch(() => props.disabled, (disabled) => {
  if (disabled) closePopup()
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  window.removeEventListener('resize', updatePopupGeometry)
  window.removeEventListener('scroll', updatePopupGeometry, true)
})
</script>

<style scoped>
.cus-input-date-range {
  --input-height-sm: calc(var(--unit) * 5);
  --input-height-md: calc(var(--unit) * 6);
  --input-height-lg: calc(var(--unit) * 8);
  --input-padding-x-sm: calc(var(--unit) * 1.5);
  --input-padding-x-md: calc(var(--unit) * 2);
  --input-padding-x-lg: calc(var(--unit) * 3);
  --input-gap-sm: calc(var(--unit) * 0.75);
  --input-gap-md: var(--space-1);
  --input-gap-lg: calc(var(--unit) * 1.25);
  --input-font-sm: calc(var(--unit) * 2);
  --input-font-md: calc(var(--unit) * 2.125);
  --input-font-lg: calc(var(--unit) * 2.25);
  --input-icon-sm: calc(var(--unit) * 1.75);
  --input-icon-md: calc(var(--unit) * 2);
  --input-icon-lg: calc(var(--unit) * 2.25);
  --input-bg: color-mix(in oklch, var(--color-bg-soft) 88%, var(--color-panel));
  --input-text: var(--color-text);
  --input-label: var(--color-muted);
  --input-placeholder: color-mix(in oklch, var(--color-subtle) 76%, var(--color-transparent));
  --input-icon: var(--color-subtle);
  --input-border: var(--color-panel-line);
  --input-hover-bg: var(--color-bg-soft-hover);
  --input-hover-border: color-mix(in oklch, var(--color-line) 68%, var(--color-accent));
  --input-selected-bg: color-mix(in oklch, var(--color-bg-soft-hover) 84%, var(--color-accent));
  --input-selected-border: var(--color-accent-strong);
  --input-selected-outline: color-mix(in oklch, var(--color-accent-strong) 42%, var(--color-transparent));
  --input-error: oklch(66% 0.19 28);
  --input-error-bg: color-mix(in oklch, var(--input-error) 14%, var(--color-bg-soft));
  --input-error-border: var(--input-error);
  --input-error-outline: color-mix(in oklch, var(--input-error) 34%, var(--color-transparent));
  --input-error-text: color-mix(in oklch, var(--input-error) 80%, var(--landing-color-header-strong));
  --input-disabled-bg: color-mix(in oklch, var(--color-surface-deep) 72%, var(--color-transparent));
  --input-disabled-text: color-mix(in oklch, var(--color-text) 42%, var(--color-transparent));
  --input-disabled-border: color-mix(in oklch, var(--color-line) 68%, var(--color-transparent));
  --datepicker-popup-bg: color-mix(in oklch, var(--color-panel) 92%, var(--color-bg-soft));
  --datepicker-popup-border: color-mix(in oklch, var(--color-line) 86%, var(--color-transparent));
  --datepicker-hover-bg: color-mix(in oklch, var(--landing-color-header-strong) 10%, var(--color-transparent));
  --datepicker-selected-bg: color-mix(in oklch, var(--color-accent) 18%, var(--color-transparent));
  --datepicker-range-bg: color-mix(in oklch, var(--color-accent) 12%, var(--color-transparent));
  --datepicker-range-preview-bg: color-mix(in oklch, var(--color-accent-strong) 8%, var(--color-transparent));
  --datepicker-today-border: color-mix(in oklch, var(--color-accent-strong) 62%, var(--color-transparent));
  --datepicker-shadow: 0 calc(var(--unit) * 2) calc(var(--unit) * 5) var(--color-shadow);
  --datepicker-popup-layer: var(--layer-popover);
  --datepicker-popup-inline-start: var(--space-2);
  --datepicker-popup-block-start: var(--landing-header-height);
  --datepicker-popup-inline-size: calc(var(--unit) * 54);
  --datepicker-day-gap: calc(var(--unit) * 0.5);
  --input-current-height: var(--input-height-md);
  --input-current-padding-x: var(--input-padding-x-md);
  --input-current-gap: var(--input-gap-md);
  --input-current-font: var(--input-font-md);
  --input-current-icon: var(--input-icon-md);
  position: relative;
  gap: var(--space-1);

  @apply grid w-full;
}

.cus-input-date-range__label {
  gap: calc(var(--unit) * 0.5);
  color: var(--input-label);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);

  @apply inline-flex w-fit items-center;
}

.cus-input-date-range__required {
  color: var(--input-error);
}

.cus-input-date-range__fields {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(var(--landing-card-min) * 0.5)), 1fr));
  gap: var(--input-current-gap);

  @apply grid w-full;
}

.cus-input-date-range__field {
  gap: calc(var(--unit) * 0.5);

  @apply grid min-w-0;
}

.cus-input-date-range__field-label {
  color: var(--input-label);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-date-range[data-label-position='inside'] .cus-input-date-range__field-label {
  @apply sr-only;
}

.cus-input-date-range__control {
  position: relative;
  gap: var(--input-current-gap);
  height: var(--input-current-height);
  min-height: var(--input-current-height);
  padding: 0 var(--input-current-padding-x);
  border: var(--border) solid var(--input-border);
  border-radius: var(--radius);
  outline: calc(var(--border) * 2) solid var(--color-transparent);
  outline-offset: calc(var(--border) * 2);
  background-color: var(--input-bg);
  color: var(--input-text);
  transition-duration: var(--motion-fast);

  @apply flex w-full items-center transition-colors;
}

.cus-input-date-range__inside-label {
  position: absolute;
  inset-inline-start: calc(var(--input-current-padding-x) + var(--input-current-icon) + var(--input-current-gap));
  inset-inline-end: calc(var(--input-current-padding-x) + var(--input-current-icon) + var(--input-current-gap));
  top: 50%;
  z-index: 1;
  gap: calc(var(--unit) * 0.5);
  max-width: calc(100% - (var(--input-current-padding-x) * 2) - (var(--input-current-icon) * 2) - (var(--input-current-gap) * 2));
  color: var(--input-placeholder);
  font-size: var(--input-current-font);
  line-height: var(--line-tight);
  pointer-events: none;
  transform: translateY(-50%);

  @apply inline-flex items-center overflow-hidden whitespace-nowrap;
}

.cus-input-date-range__inside-label-text {
  @apply truncate;
}

.cus-input-date-range__input {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  background-color: var(--color-transparent);
  color: inherit;
  caret-color: var(--color-accent-strong);
  font-family: inherit;
  font-size: var(--input-current-font);
  line-height: var(--line-tight);

  @apply appearance-none;
}

.cus-input-date-range__input::placeholder {
  color: var(--input-placeholder);
  opacity: 1;
}

.cus-input-date-range[data-has-inside-label='true'] .cus-input-date-range__input::placeholder {
  color: var(--color-transparent);
}

.cus-input-date-range__icon,
.cus-input-date-range__nav-icon {
  width: var(--input-current-icon);
  height: var(--input-current-icon);
  color: var(--input-icon);

  @apply shrink-0;
}

.cus-input-date-range__icon-button,
.cus-input-date-range__nav-button {
  padding: 0;
  border: 0;
  border-radius: var(--radius);
  background-color: var(--color-transparent);
  color: var(--input-icon);
  transition-duration: var(--motion-fast);

  @apply inline-flex shrink-0 cursor-pointer items-center justify-center transition-colors;
}

.cus-input-date-range__icon-button {
  width: calc(var(--input-current-icon) + var(--input-current-gap));
  height: calc(var(--input-current-icon) + var(--input-current-gap));
}

.cus-input-date-range__icon-button:hover,
.cus-input-date-range__nav-button:hover:not(:disabled) {
  background-color: var(--datepicker-hover-bg);
  color: var(--landing-color-header-strong);
}

.cus-input-date-range__icon-button:focus-visible,
.cus-input-date-range__nav-button:focus-visible {
  outline: calc(var(--border) * 2) solid var(--color-accent-strong);
  outline-offset: calc(var(--border) * 2);
}

.cus-input-date-range__icon-button:disabled,
.cus-input-date-range__nav-button:disabled {
  color: var(--input-disabled-text);

  @apply cursor-not-allowed;
}

.cus-input-date-range__format,
.cus-input-date-range__status {
  @apply sr-only;
}

.cus-input-date-range__popup {
  position: fixed;
  inset-block-start: var(--datepicker-popup-block-start);
  inset-inline-start: var(--datepicker-popup-inline-start);
  z-index: var(--datepicker-popup-layer);
  inline-size: var(--datepicker-popup-inline-size);
  padding: var(--input-current-gap);
  border: var(--border) solid var(--datepicker-popup-border);
  border-radius: var(--radius);
  background-color: var(--datepicker-popup-bg);
  box-shadow: var(--datepicker-shadow);
}

.cus-input-date-range__calendar-header {
  grid-template-columns: var(--input-current-height) minmax(0, 1fr) var(--input-current-height);
  gap: var(--input-current-gap);
  padding: var(--input-current-gap);

  @apply grid items-center;
}

.cus-input-date-range__heading {
  margin: 0;
  color: var(--input-text);
  font-size: var(--input-current-font);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  text-align: center;
}

.cus-input-date-range__nav-button {
  width: var(--input-current-height);
  height: var(--input-current-height);
}

.cus-input-date-range__calendar {
  width: 100%;
  border-collapse: separate;
  border-spacing: var(--datepicker-day-gap);
  table-layout: fixed;
}

.cus-input-date-range__weekday {
  color: var(--input-label);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
  text-align: center;
}

.cus-input-date-range__weekday abbr {
  text-decoration: none;
}

.cus-input-date-range__day-cell {
  padding: 0;
}

.cus-input-date-range__day,
.cus-input-date-range__day-placeholder {
  width: 100%;
  min-height: calc(var(--input-current-height) * 0.9);
  border: var(--border) solid var(--color-transparent);
  border-radius: var(--radius);
}

.cus-input-date-range__day {
  background-color: var(--color-transparent);
  color: var(--input-text);
  font-family: inherit;
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  transition-duration: var(--motion-fast);

  @apply cursor-pointer transition-colors;
}

.cus-input-date-range__day-placeholder {
  @apply block;
}

.cus-input-date-range__day:hover:not(:disabled),
.cus-input-date-range__day[data-active='true']:not(:disabled) {
  border-color: var(--datepicker-popup-border);
  background-color: var(--datepicker-hover-bg);
}

.cus-input-date-range__day[data-today='true'] {
  border-color: var(--datepicker-today-border);
}

.cus-input-date-range__day[data-range-preview='true'] {
  background-color: var(--datepicker-range-preview-bg);
}

.cus-input-date-range__day[data-range-between='true'] {
  background-color: var(--datepicker-range-bg);
}

.cus-input-date-range__day[data-range-start='true'],
.cus-input-date-range__day[data-range-end='true'] {
  border-color: var(--input-selected-border);
  background-color: var(--datepicker-selected-bg);
  color: var(--input-text);
}

.cus-input-date-range__day:focus-visible {
  outline: calc(var(--border) * 2) solid var(--color-accent-strong);
  outline-offset: calc(var(--border) * 2);
}

.cus-input-date-range__day:disabled {
  color: var(--input-disabled-text);

  @apply cursor-not-allowed;
}

.cus-input-date-range__error {
  margin: 0;
  min-height: calc(var(--font-eyebrow) * var(--line-base));
  color: var(--input-error-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-date-range__error[data-visible='false'] {
  visibility: hidden;
}

.cus-input-date-range[data-size='sm'] {
  --input-current-height: var(--input-height-sm);
  --input-current-padding-x: var(--input-padding-x-sm);
  --input-current-gap: var(--input-gap-sm);
  --input-current-font: var(--input-font-sm);
  --input-current-icon: var(--input-icon-sm);
}

.cus-input-date-range[data-size='md'] {
  --input-current-height: var(--input-height-md);
  --input-current-padding-x: var(--input-padding-x-md);
  --input-current-gap: var(--input-gap-md);
  --input-current-font: var(--input-font-md);
  --input-current-icon: var(--input-icon-md);
}

.cus-input-date-range[data-size='lg'] {
  --input-current-height: var(--input-height-lg);
  --input-current-padding-x: var(--input-padding-x-lg);
  --input-current-gap: var(--input-gap-lg);
  --input-current-font: var(--input-font-lg);
  --input-current-icon: var(--input-icon-lg);
}

.cus-input-date-range:not([data-disabled='true']):hover .cus-input-date-range__control {
  border-color: var(--input-hover-border);
  background-color: var(--input-hover-bg);
}

.cus-input-date-range:not([data-disabled='true']) .cus-input-date-range__field:focus-within .cus-input-date-range__control,
.cus-input-date-range:not([data-disabled='true']) .cus-input-date-range__field[data-active='true'] .cus-input-date-range__control,
.cus-input-date-range:not([data-disabled='true'])[data-selected='true'] .cus-input-date-range__control {
  border-color: var(--input-selected-border);
  outline-color: var(--input-selected-outline);
  background-color: var(--input-selected-bg);
}

.cus-input-date-range:not([data-disabled='true']) .cus-input-date-range__field:focus-within .cus-input-date-range__field-label,
.cus-input-date-range:not([data-disabled='true']) .cus-input-date-range__field[data-active='true'] .cus-input-date-range__field-label,
.cus-input-date-range:not([data-disabled='true'])[data-selected='true'] .cus-input-date-range__label {
  color: var(--color-accent-strong);
}

.cus-input-date-range:not([data-disabled='true'])[data-error='true'] .cus-input-date-range__label,
.cus-input-date-range:not([data-disabled='true'])[data-error='true'] .cus-input-date-range__field-label {
  color: var(--input-error-text);
}

.cus-input-date-range:not([data-disabled='true'])[data-error='true'] .cus-input-date-range__control {
  border-color: var(--input-error-border);
  outline-color: var(--input-error-outline);
  background-color: var(--input-error-bg);
}

.cus-input-date-range[data-disabled='true'] .cus-input-date-range__label,
.cus-input-date-range[data-disabled='true'] .cus-input-date-range__field-label,
.cus-input-date-range[data-disabled='true'] .cus-input-date-range__control,
.cus-input-date-range[data-disabled='true'] .cus-input-date-range__icon {
  color: var(--input-disabled-text);
}

.cus-input-date-range[data-disabled='true'] .cus-input-date-range__control {
  border-color: var(--input-disabled-border);
  background-color: var(--input-disabled-bg);

  @apply cursor-not-allowed;
}

.cus-input-date-range[data-disabled='true'] .cus-input-date-range__input {
  @apply cursor-not-allowed;
}
</style>
