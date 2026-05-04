<template>
  <div
    ref="rootElement"
    class="cus-input-date"
    :data-size="props.size"
    :data-open="isOpen ? 'true' : 'false'"
    :data-selected="props.selected ? 'true' : 'false'"
    :data-disabled="props.disabled ? 'true' : 'false'"
    :data-error="hasError ? 'true' : 'false'"
    :data-placement="popupPlacement"
    :data-mode="props.mode"
    :data-label-position="props.labelPosition"
    :data-empty="textValue.length === 0 ? 'true' : 'false'"
    :data-has-inside-label="hasInsideLabel ? 'true' : 'false'"
  >
    <label v-if="hasExternalLabel" class="cus-input-date__label" :for="inputId">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="cus-input-date__required" aria-hidden="true">*</span>
    </label>

    <div ref="controlElement" class="cus-input-date__control">
      <span v-if="showInsideLabel" class="cus-input-date__inside-label" aria-hidden="true">
        <span class="cus-input-date__inside-label-text">{{ props.label }}</span>
        <span v-if="props.required" class="cus-input-date__required">*</span>
      </span>
      <Icon class="cus-input-date__icon cus-input-date__icon--left" name="lucide:calendar-days" aria-hidden="true" />
      <input
        :id="inputId"
        ref="inputElement"
        class="cus-input-date__input"
        type="text"
        :name="props.name || undefined"
        :value="textValue"
        :placeholder="placeholderValue"
        :required="props.required"
        :disabled="props.disabled"
        :autocomplete="props.autocomplete"
        inputmode="numeric"
        :maxlength="inputMaxLength"
        :pattern="inputPattern"
        :aria-label="accessibleLabel"
        :aria-invalid="hasError ? 'true' : undefined"
        :aria-describedby="describedBy"
        @input="onInput"
        @change="emit('change', $event)"
        @keydown="onInputKeydown"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      >
      <button
        ref="triggerElement"
        class="cus-input-date__icon-button"
        type="button"
        :disabled="props.disabled"
        aria-haspopup="dialog"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="isOpen ? popupId : undefined"
        :aria-label="calendarButtonLabel"
        @click="togglePopup"
        @keydown="onTriggerKeydown"
      >
        <Icon class="cus-input-date__icon" :name="isOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'" aria-hidden="true" />
      </button>
    </div>

    <p :id="formatId" class="cus-input-date__format">
      {{ formatDescription }}
    </p>

    <div
      v-if="isOpen"
      :id="popupId"
      class="cus-input-date__popup"
      role="dialog"
      :aria-labelledby="headingId"
      :style="popupStyle"
      @keydown="onPopupKeydown"
    >
      <div class="cus-input-date__calendar-header">
        <button
          class="cus-input-date__nav-button"
          type="button"
          :disabled="!canGoPreviousPage"
          :aria-label="previousPageLabel"
          @click="goToPage(-1)"
        >
          <Icon class="cus-input-date__nav-icon" name="lucide:chevron-left" aria-hidden="true" />
        </button>

        <h2 :id="headingId" class="cus-input-date__heading" aria-live="polite">
          {{ headerLabel }}
        </h2>

        <button
          class="cus-input-date__nav-button"
          type="button"
          :disabled="!canGoNextPage"
          :aria-label="nextPageLabel"
          @click="goToPage(1)"
        >
          <Icon class="cus-input-date__nav-icon" name="lucide:chevron-right" aria-hidden="true" />
        </button>
      </div>

      <table v-if="props.mode === 'date'" class="cus-input-date__calendar" role="grid" :aria-labelledby="headingId">
        <thead>
          <tr>
            <th v-for="weekday in weekDayLabels" :key="weekday.key" scope="col" class="cus-input-date__weekday">
              <abbr :title="weekday.long">{{ weekday.short }}</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="week in calendarWeeks" :key="week.key">
            <td v-for="day in week.days" :key="day.key" class="cus-input-date__day-cell">
              <button
                v-if="day.isVisible"
                :ref="(element) => setDayButtonRef(day.iso, element)"
                class="cus-input-date__day"
                type="button"
                :tabindex="day.iso === activeDateKey ? 0 : -1"
                :disabled="day.isDisabled"
                :aria-label="day.ariaLabel"
                :aria-selected="day.isSelected ? 'true' : undefined"
                :data-today="day.isToday ? 'true' : 'false'"
                :data-selected="day.isSelected ? 'true' : 'false'"
                :data-active="day.iso === activeDateKey ? 'true' : 'false'"
                @click="selectDate(day.date)"
                @keydown="onDayKeydown($event, day.date)"
              >
                {{ day.label }}
              </button>
              <span v-else class="cus-input-date__day-placeholder" aria-hidden="true"></span>
            </td>
          </tr>
        </tbody>
      </table>

      <table v-else class="cus-input-date__month-grid" role="grid" :aria-labelledby="headingId">
        <tbody>
          <tr v-for="row in monthRows" :key="row.key">
            <td v-for="month in row.months" :key="month.key" class="cus-input-date__month-cell">
              <button
                :ref="(element) => setMonthButtonRef(month.key, element)"
                class="cus-input-date__month"
                type="button"
                :tabindex="month.key === activeDateKey ? 0 : -1"
                :disabled="month.isDisabled"
                :aria-label="month.ariaLabel"
                :aria-selected="month.isSelected ? 'true' : undefined"
                :data-selected="month.isSelected ? 'true' : 'false'"
                :data-active="month.key === activeDateKey ? 'true' : 'false'"
                @click="selectMonth(month.date)"
                @keydown="onMonthKeydown($event, month.date)"
              >
                {{ month.label }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p
      :id="errorId"
      class="cus-input-date__error"
      :data-visible="hasError ? 'true' : 'false'"
      :aria-live="hasError ? 'polite' : undefined"
      :aria-hidden="hasError ? undefined : 'true'"
    >
      {{ props.errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
type DateFormat = 'YYYY-MM-DD' | 'DD-MM-YYYY'
type DatepickerMode = 'date' | 'month'

type CalendarDay = {
  date: Date
  iso: string
  key: string
  label: string
  ariaLabel: string
  isVisible: boolean
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
}

type CalendarWeek = {
  key: string
  days: CalendarDay[]
}

type CalendarMonth = {
  date: Date
  key: string
  label: string
  ariaLabel: string
  isSelected: boolean
  isDisabled: boolean
}

type CalendarMonthRow = {
  key: string
  months: CalendarMonth[]
}

const isoDatePattern = /^(\d{4})[/-](\d{2})[/-](\d{2})$/
const localDatePattern = /^(\d{2})[/-](\d{2})[/-](\d{4})$/
const isoMonthPattern = /^(\d{4})[/-](\d{2})$/
const localMonthPattern = /^(\d{2})[/-](\d{4})$/
const dateDigitCount = 'YYYYMMDD'.length
const monthDigitCount = 'YYYYMM'.length
const generatedId = useId()

const props = defineProps({
  modelValue: { type: String, default: '' },
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  label: { type: String, default: '' },
  labelPosition: {
    type: String,
    default: 'outside',
    validator: (value: string) => ['inside', 'outside'].includes(value)
  },
  placeholder: { type: String, default: '' },
  formatLabel: { type: String, default: '' },
  format: {
    type: String,
    default: 'YYYY-MM-DD',
    validator: (value: string) => ['YYYY-MM-DD', 'DD-MM-YYYY'].includes(value)
  },
  separator: { type: String, default: '' },
  mode: {
    type: String,
    default: 'date',
    validator: (value: string) => ['date', 'month'].includes(value)
  },
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
  nextMonthLabel: { type: String, default: 'Mois suivant' },
  previousYearLabel: { type: String, default: 'Annee precedente' },
  nextYearLabel: { type: String, default: 'Annee suivante' }
})

const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur', 'open', 'close'])

const rootElement = ref<HTMLElement | null>(null)
const controlElement = ref<HTMLElement | null>(null)
const inputElement = ref<HTMLInputElement | null>(null)
const triggerElement = ref<HTMLButtonElement | null>(null)
const dayButtonElements = ref(new Map<string, HTMLButtonElement>())
const monthButtonElements = ref(new Map<string, HTMLButtonElement>())
const textValue = ref('')
const isOpen = ref(false)
const popupPlacement = ref('bottom')
const popupInlineStart = ref('')
const popupBlockStart = ref('')
const popupInlineSize = ref('')

const startOfDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const today = startOfDate(new Date())
const padDatePart = (value: number) => String(value).padStart(2, '0')
const activeFormat = computed(() => props.format as DateFormat)
const activeMode = computed(() => props.mode as DatepickerMode)
const dateSeparator = computed(() => props.separator || (activeFormat.value === 'DD-MM-YYYY' ? '/' : '-'))

const toIsoDate = (date: Date) => {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`
}

const toIsoMonth = (date: Date) => {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}`
}

const buildDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return startOfDate(date)
}

const buildMonth = (year: number, month: number) => {
  const date = new Date(year, month - 1, 1)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1) return null
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

const parseMonthValue = (value: string) => {
  const normalizedValue = value
  if (!normalizedValue) return null

  const date = parseDateValue(normalizedValue)
  if (date) return new Date(date.getFullYear(), date.getMonth(), 1)

  const isoMatch = isoMonthPattern.exec(normalizedValue)
  if (isoMatch) return buildMonth(Number(isoMatch[1]), Number(isoMatch[2]))

  const localMatch = localMonthPattern.exec(normalizedValue)
  if (localMatch) return buildMonth(Number(localMatch[2]), Number(localMatch[1]))

  const digits = normalizedValue.replace(/\D/g, '')
  if (digits.length !== monthDigitCount) return null

  if (activeFormat.value === 'YYYY-MM-DD') {
    return buildMonth(Number(digits.slice(0, 4)), Number(digits.slice(4, 6)))
  }

  return buildMonth(Number(digits.slice(2, 6)), Number(digits.slice(0, 2)))
}

const parseInputValue = (value: string) => {
  return activeMode.value === 'month' ? parseMonthValue(value) : parseDateValue(value)
}

const formatDateValue = (date: Date) => {
  const year = String(date.getFullYear())
  const month = padDatePart(date.getMonth() + 1)
  const day = padDatePart(date.getDate())
  const separator = dateSeparator.value

  if (activeFormat.value === 'YYYY-MM-DD') return [year, month, day].join(separator)
  return [day, month, year].join(separator)
}

const formatMonthValue = (date: Date) => {
  const year = String(date.getFullYear())
  const month = padDatePart(date.getMonth() + 1)
  const separator = dateSeparator.value

  if (activeFormat.value === 'YYYY-MM-DD') return [year, month].join(separator)
  return [month, year].join(separator)
}

const formatValueForInput = (date: Date) => {
  if (activeMode.value === 'month') return formatMonthValue(date)
  return formatDateValue(date)
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
  const maxDigits = activeMode.value === 'month' ? monthDigitCount : dateDigitCount
  const digits = value.replace(/\D/g, '').slice(0, maxDigits)

  if (activeMode.value === 'month') {
    return activeFormat.value === 'YYYY-MM-DD' ? formatDigits(digits, [4, 2]) : formatDigits(digits, [2, 4])
  }

  return activeFormat.value === 'YYYY-MM-DD' ? formatDigits(digits, [4, 2, 2]) : formatDigits(digits, [2, 2, 4])
}

const isCompleteInputValue = (value: string) => {
  const expectedDigits = activeMode.value === 'month' ? monthDigitCount : dateDigitCount
  return value.replace(/\D/g, '').length === expectedDigits
}

const compareDates = (leftDate: Date, rightDate: Date) => {
  return startOfDate(leftDate).getTime() - startOfDate(rightDate).getTime()
}

const compareMonths = (leftDate: Date, rightDate: Date) => {
  return (leftDate.getFullYear() - rightDate.getFullYear()) * 12 + leftDate.getMonth() - rightDate.getMonth()
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
const selectedDate = computed(() => parseInputValue(props.modelValue))
const selectedKey = computed(() => {
  if (!selectedDate.value) return ''
  return activeMode.value === 'month' ? toIsoMonth(selectedDate.value) : toIsoDate(selectedDate.value)
})
const minDateValue = computed(() => props.minDate || props.min)
const maxDateValue = computed(() => props.maxDate || props.max)
const minDate = computed(() => parseInputValue(minDateValue.value))
const maxDate = computed(() => parseInputValue(maxDateValue.value))
const hasError = computed(() => props.errorMessage.length > 0)

const isDateDisabled = (date: Date) => {
  if (minDate.value && compareDates(date, minDate.value) < 0) return true
  if (maxDate.value && compareDates(date, maxDate.value) > 0) return true
  return false
}

const isMonthDisabled = (date: Date) => {
  if (minDate.value && compareMonths(date, minDate.value) < 0) return true
  if (maxDate.value && compareMonths(date, maxDate.value) > 0) return true
  return false
}

const clampDate = (date: Date) => {
  let nextDate = activeMode.value === 'month' ? getMonthStart(date) : startOfDate(date)

  if (minDate.value) {
    const minCompare = activeMode.value === 'month' ? compareMonths(nextDate, minDate.value) : compareDates(nextDate, minDate.value)
    if (minCompare < 0) nextDate = minDate.value
  }

  if (maxDate.value) {
    const maxCompare = activeMode.value === 'month' ? compareMonths(nextDate, maxDate.value) : compareDates(nextDate, maxDate.value)
    if (maxCompare > 0) nextDate = maxDate.value
  }

  return activeMode.value === 'month' ? getMonthStart(nextDate) : startOfDate(nextDate)
}

const activeDate = ref(clampDate(selectedDate.value || today))
const displayedMonth = ref(getMonthStart(activeDate.value))

const inputId = computed(() => props.id || `cus-input-date-${generatedId}`)
const formatId = computed(() => `${inputId.value}-format`)
const errorId = computed(() => `${inputId.value}-error`)
const popupId = computed(() => `${inputId.value}-popup`)
const headingId = computed(() => `${inputId.value}-heading`)
const formatPlaceholderValue = computed(() => {
  if (props.placeholder) return props.placeholder
  if (activeMode.value === 'month') return activeFormat.value === 'YYYY-MM-DD' ? 'YYYY-MM' : `MM${dateSeparator.value}YYYY`
  return activeFormat.value === 'YYYY-MM-DD' ? `YYYY${dateSeparator.value}MM${dateSeparator.value}DD` : `DD${dateSeparator.value}MM${dateSeparator.value}YYYY`
})
const placeholderValue = computed(() => {
  return formatPlaceholderValue.value
})
const inputMaxLength = computed(() => formatPlaceholderValue.value.length)
const inputPattern = computed(() => {
  const separatorPattern = dateSeparator.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (activeMode.value === 'month') {
    return activeFormat.value === 'YYYY-MM-DD'
      ? `\\d{4}${separatorPattern}\\d{2}`
      : `\\d{2}${separatorPattern}\\d{4}`
  }

  return activeFormat.value === 'YYYY-MM-DD'
    ? `\\d{4}${separatorPattern}\\d{2}${separatorPattern}\\d{2}`
    : `\\d{2}${separatorPattern}\\d{2}${separatorPattern}\\d{4}`
})
const formatDescription = computed(() => props.formatLabel || `Format attendu : ${formatPlaceholderValue.value}`)
const describedBy = computed(() => {
  const ids = [formatId.value]
  if (props.errorMessage) ids.push(errorId.value)
  return ids.join(' ')
})
const accessibleLabel = computed(() => {
  if (hasExternalLabel.value) return undefined
  if (props.label) return props.label
  if (placeholderValue.value) return placeholderValue.value
  if (props.name) return props.name
  return undefined
})
const hasExternalLabel = computed(() => props.label.length > 0 && props.labelPosition === 'outside')
const hasInsideLabel = computed(() => props.label.length > 0 && props.labelPosition === 'inside')
const showInsideLabel = computed(() => hasInsideLabel.value && textValue.value.length === 0)
const calendarButtonLabel = computed(() => {
  if (!isOpen.value) return props.openCalendarLabel
  return props.closeCalendarLabel
})
const activeDateKey = computed(() => {
  return activeMode.value === 'month' ? toIsoMonth(activeDate.value) : toIsoDate(activeDate.value)
})
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
const yearFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
  year: 'numeric'
}))
const dayAriaFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}))
const monthNameFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
  month: 'short'
}))
const monthAriaFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
  month: 'long',
  year: 'numeric'
}))
const weekdayShortFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
  weekday: 'short'
}))
const weekdayLongFormatter = computed(() => new Intl.DateTimeFormat(props.locale, {
  weekday: 'long'
}))

const headerLabel = computed(() => {
  if (activeMode.value === 'month') return yearFormatter.value.format(displayedMonth.value)
  return monthFormatter.value.format(displayedMonth.value)
})
const previousPageLabel = computed(() => activeMode.value === 'month' ? props.previousYearLabel : props.previousMonthLabel)
const nextPageLabel = computed(() => activeMode.value === 'month' ? props.nextYearLabel : props.nextMonthLabel)

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

const calendarWeeks = computed<CalendarWeek[]>(() => {
  const monthStart = getMonthStart(displayedMonth.value)
  const monthOffset = (monthStart.getDay() - props.firstDayOfWeek + 7) % 7
  const gridStart = addDays(monthStart, -monthOffset)

  return Array.from({ length: 6 }, (_, weekIndex) => {
    const days = Array.from({ length: 7 }, (_, dayIndex) => {
      const date = addDays(gridStart, weekIndex * 7 + dayIndex)
      const iso = toIsoDate(date)
      const isVisible = date.getMonth() === displayedMonth.value.getMonth()

      return {
        date,
        iso,
        key: iso,
        label: isVisible ? String(date.getDate()) : '',
        ariaLabel: isVisible ? dayAriaFormatter.value.format(date) : '',
        isVisible,
        isToday: isVisible && compareDates(date, today) === 0,
        isSelected: isVisible && selectedKey.value === iso,
        isDisabled: !isVisible || isDateDisabled(date)
      }
    })

    return {
      key: `week-${weekIndex}-${toIsoDate(days[0].date)}`,
      days
    }
  }).filter((week) => week.days.some((day) => day.isVisible))
})

const monthRows = computed<CalendarMonthRow[]>(() => {
  const year = displayedMonth.value.getFullYear()
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(year, index, 1)
    const key = toIsoMonth(date)

    return {
      date,
      key,
      label: monthNameFormatter.value.format(date).replace(/\.$/, ''),
      ariaLabel: monthAriaFormatter.value.format(date),
      isSelected: selectedKey.value === key,
      isDisabled: isMonthDisabled(date)
    }
  })

  return Array.from({ length: 4 }, (_, rowIndex) => {
    return {
      key: `month-row-${rowIndex}`,
      months: months.slice(rowIndex * 3, rowIndex * 3 + 3)
    }
  })
})

const canGoPreviousPage = computed(() => {
  if (activeMode.value === 'month') {
    const previousYearEnd = new Date(displayedMonth.value.getFullYear() - 1, 11, 1)
    return !minDate.value || compareMonths(previousYearEnd, minDate.value) >= 0
  }

  const previousMonth = addMonths(displayedMonth.value, -1)
  return !minDate.value || compareDates(getMonthEnd(previousMonth), minDate.value) >= 0
})

const canGoNextPage = computed(() => {
  if (activeMode.value === 'month') {
    const nextYearStart = new Date(displayedMonth.value.getFullYear() + 1, 0, 1)
    return !maxDate.value || compareMonths(nextYearStart, maxDate.value) <= 0
  }

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

const setMonthButtonRef = (key: string, element: unknown) => {
  if (element instanceof HTMLButtonElement) {
    monthButtonElements.value.set(key, element)
    return
  }

  monthButtonElements.value.delete(key)
}

const focusActiveTarget = async () => {
  await nextTick()
  if (activeMode.value === 'month') {
    monthButtonElements.value.get(activeDateKey.value)?.focus()
    return
  }

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
  if (!controlElement.value || !rootElement.value) return

  const rect = controlElement.value.getBoundingClientRect()
  const unit = getTokenPixels('--unit')
  const viewportGap = unit * 2
  const headerHeight = getTokenPixels('--landing-header-height')
  const topBoundary = headerHeight + viewportGap
  const preferredWidth = unit * 46
  const availableWidth = Math.max(window.innerWidth - viewportGap * 2, 0)
  const width = availableWidth > 0 ? Math.min(Math.max(rect.width, preferredWidth), availableWidth) : rect.width
  const expectedHeight = activeMode.value === 'month' ? unit * 44 : unit * (18 + calendarWeeks.value.length * 6)
  const availableBelow = window.innerHeight - rect.bottom - viewportGap
  const availableAbove = rect.top - topBoundary
  const shouldOpenBelow = availableBelow >= expectedHeight || availableBelow >= availableAbove
  const left = Math.min(Math.max(rect.left, viewportGap), window.innerWidth - viewportGap - width)
  const preferredTop = shouldOpenBelow ? rect.bottom + viewportGap : rect.top - viewportGap - expectedHeight

  popupPlacement.value = shouldOpenBelow ? 'bottom' : 'top'
  popupInlineStart.value = `${Math.max(left, viewportGap)}px`
  popupBlockStart.value = `${Math.max(preferredTop, topBoundary)}px`
  popupInlineSize.value = `${width}px`
}

const syncTextValue = () => {
  const parsedValue = selectedDate.value
  textValue.value = parsedValue ? formatValueForInput(parsedValue) : props.modelValue
}

const openPopup = async () => {
  if (props.disabled || isOpen.value) return

  const baseDate = selectedDate.value || activeDate.value || today
  activeDate.value = clampDate(baseDate)
  updateDisplayedMonthFromDate(activeDate.value)
  isOpen.value = true
  emit('open')

  await nextTick()
  updatePopupGeometry()
  await focusActiveTarget()
}

const closePopup = (shouldFocusInput = false) => {
  if (!isOpen.value) return
  isOpen.value = false
  emit('close')

  if (shouldFocusInput) {
    nextTick(() => {
      inputElement.value?.focus()
    })
  }
}

const togglePopup = () => {
  if (isOpen.value) {
    closePopup()
    return
  }

  openPopup()
}

const emitInputValue = (value: string, event?: Event) => {
  emit('update:modelValue', value)
  emit('input', event)
}

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const formattedValue = formatTypedValue(target.value)
  textValue.value = formattedValue
  target.value = formattedValue
  emitInputValue(formattedValue, event)

  if (!isCompleteInputValue(formattedValue)) return

  const parsedDate = parseInputValue(formattedValue)
  if (!parsedDate) return

  activeDate.value = clampDate(parsedDate)
  updateDisplayedMonthFromDate(activeDate.value)
}

const onInputKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    openPopup()
    return
  }

  if (event.key === 'Escape') {
    closePopup()
  }
}

const onTriggerKeydown = (event: KeyboardEvent) => {
  if (props.disabled) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    openPopup()
  }
}

const selectDate = (date: Date) => {
  if (isDateDisabled(date)) return

  const nextDate = startOfDate(date)
  const nextValue = formatDateValue(nextDate)
  activeDate.value = nextDate
  updateDisplayedMonthFromDate(nextDate)
  textValue.value = nextValue
  emit('update:modelValue', nextValue)
  emit('change', nextValue, nextDate)
  closePopup(true)
}

const selectMonth = (date: Date) => {
  if (isMonthDisabled(date)) return

  const nextDate = getMonthStart(date)
  const nextValue = formatMonthValue(nextDate)
  activeDate.value = nextDate
  updateDisplayedMonthFromDate(nextDate)
  textValue.value = nextValue
  emit('update:modelValue', nextValue)
  emit('change', nextValue, nextDate)
  closePopup(true)
}

const goToPage = async (offset: number) => {
  if ((offset < 0 && !canGoPreviousPage.value) || (offset > 0 && !canGoNextPage.value)) return

  if (activeMode.value === 'month') {
    await setActiveDate(new Date(displayedMonth.value.getFullYear() + offset, activeDate.value.getMonth(), 1))
    updatePopupGeometry()
    return
  }

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

const moveActiveMonth = (amount: number) => {
  setActiveDate(addMonths(activeDate.value, amount))
}

const moveActiveMonthToRowEdge = (direction: number) => {
  const rowOffset = activeDate.value.getMonth() % 3
  const edgeOffset = direction < 0 ? -rowOffset : 2 - rowOffset
  setActiveDate(addMonths(activeDate.value, edgeOffset))
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

const onMonthKeydown = (event: KeyboardEvent, date: Date) => {
  activeDate.value = getMonthStart(date)

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    moveActiveMonth(1)
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    moveActiveMonth(-1)
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActiveMonth(3)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActiveMonth(-3)
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    moveActiveMonthToRowEdge(-1)
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    moveActiveMonthToRowEdge(1)
    return
  }

  if (event.key === 'PageUp') {
    event.preventDefault()
    moveActiveMonth(event.shiftKey ? -120 : -12)
    return
  }

  if (event.key === 'PageDown') {
    event.preventDefault()
    moveActiveMonth(event.shiftKey ? 120 : 12)
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectMonth(activeDate.value)
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

watch([() => props.modelValue, () => props.format, () => props.separator, () => props.mode], () => {
  syncTextValue()
  const parsedDate = selectedDate.value
  if (!parsedDate) return

  activeDate.value = clampDate(parsedDate)
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
.cus-input-date {
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
  --datepicker-today-border: color-mix(in oklch, var(--color-accent-strong) 62%, var(--color-transparent));
  --datepicker-shadow: 0 calc(var(--unit) * 2) calc(var(--unit) * 5) var(--color-shadow);
  --datepicker-popup-layer: var(--layer-popover);
  --datepicker-popup-inline-start: var(--space-2);
  --datepicker-popup-block-start: var(--landing-header-height);
  --datepicker-popup-inline-size: calc(var(--unit) * 46);
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

.cus-input-date__label {
  gap: calc(var(--unit) * 0.5);
  color: var(--input-label);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);

  @apply inline-flex w-fit items-center;
}

.cus-input-date__required {
  color: var(--input-error);
}

.cus-input-date__control {
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

.cus-input-date__inside-label {
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

.cus-input-date__inside-label-text {
  @apply truncate;
}

.cus-input-date__input {
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

.cus-input-date__input::placeholder {
  color: var(--input-placeholder);
  opacity: 1;
}

.cus-input-date[data-has-inside-label='true'][data-empty='true'] .cus-input-date__input::placeholder {
  color: var(--color-transparent);
}

.cus-input-date__icon,
.cus-input-date__nav-icon {
  width: var(--input-current-icon);
  height: var(--input-current-icon);
  color: var(--input-icon);

  @apply shrink-0;
}

.cus-input-date__icon-button,
.cus-input-date__nav-button {
  padding: 0;
  border: 0;
  border-radius: var(--radius);
  background-color: var(--color-transparent);
  color: var(--input-icon);
  transition-duration: var(--motion-fast);

  @apply inline-flex shrink-0 cursor-pointer items-center justify-center transition-colors;
}

.cus-input-date__icon-button {
  width: calc(var(--input-current-icon) + var(--input-current-gap));
  height: calc(var(--input-current-icon) + var(--input-current-gap));
}

.cus-input-date__icon-button:hover,
.cus-input-date__nav-button:hover:not(:disabled) {
  background-color: var(--datepicker-hover-bg);
  color: var(--landing-color-header-strong);
}

.cus-input-date__icon-button:focus-visible,
.cus-input-date__nav-button:focus-visible {
  outline: calc(var(--border) * 2) solid var(--color-accent-strong);
  outline-offset: calc(var(--border) * 2);
}

.cus-input-date__icon-button:disabled,
.cus-input-date__nav-button:disabled {
  color: var(--input-disabled-text);

  @apply cursor-not-allowed;
}

.cus-input-date__format {
  @apply sr-only;
}

.cus-input-date__popup {
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

.cus-input-date__calendar-header {
  grid-template-columns: var(--input-current-height) minmax(0, 1fr) var(--input-current-height);
  gap: var(--input-current-gap);
  padding: var(--input-current-gap);

  @apply grid items-center;
}

.cus-input-date__heading {
  margin: 0;
  color: var(--input-text);
  font-size: var(--input-current-font);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  text-align: center;
}

.cus-input-date__nav-button {
  width: var(--input-current-height);
  height: var(--input-current-height);
}

.cus-input-date__calendar,
.cus-input-date__month-grid {
  width: 100%;
  border-collapse: separate;
  border-spacing: var(--datepicker-day-gap);
  table-layout: fixed;
}

.cus-input-date__weekday {
  color: var(--input-label);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
  text-align: center;
}

.cus-input-date__weekday abbr {
  text-decoration: none;
}

.cus-input-date__day-cell,
.cus-input-date__month-cell {
  padding: 0;
}

.cus-input-date__day,
.cus-input-date__month,
.cus-input-date__day-placeholder {
  width: 100%;
  min-height: calc(var(--input-current-height) * 0.9);
  border: var(--border) solid var(--color-transparent);
  border-radius: var(--radius);
}

.cus-input-date__day,
.cus-input-date__month {
  background-color: var(--color-transparent);
  color: var(--input-text);
  font-family: inherit;
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  transition-duration: var(--motion-fast);

  @apply cursor-pointer transition-colors;
}

.cus-input-date__month {
  min-height: var(--input-current-height);
  padding: 0 var(--input-current-gap);
}

.cus-input-date__day-placeholder {
  @apply block;
}

.cus-input-date__day:hover:not(:disabled),
.cus-input-date__day[data-active='true']:not(:disabled),
.cus-input-date__month:hover:not(:disabled),
.cus-input-date__month[data-active='true']:not(:disabled) {
  border-color: var(--datepicker-popup-border);
  background-color: var(--datepicker-hover-bg);
}

.cus-input-date__day[data-today='true'] {
  border-color: var(--datepicker-today-border);
}

.cus-input-date__day[data-selected='true'],
.cus-input-date__month[data-selected='true'] {
  border-color: var(--input-selected-border);
  background-color: var(--datepicker-selected-bg);
  color: var(--input-text);
}

.cus-input-date__day:focus-visible,
.cus-input-date__month:focus-visible {
  outline: calc(var(--border) * 2) solid var(--color-accent-strong);
  outline-offset: calc(var(--border) * 2);
}

.cus-input-date__day:disabled,
.cus-input-date__month:disabled {
  color: var(--input-disabled-text);

  @apply cursor-not-allowed;
}

.cus-input-date__error {
  margin: 0;
  min-height: calc(var(--font-eyebrow) * var(--line-base));
  color: var(--input-error-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-date__error[data-visible='false'] {
  visibility: hidden;
}

.cus-input-date[data-size='sm'] {
  --input-current-height: var(--input-height-sm);
  --input-current-padding-x: var(--input-padding-x-sm);
  --input-current-gap: var(--input-gap-sm);
  --input-current-font: var(--input-font-sm);
  --input-current-icon: var(--input-icon-sm);
}

.cus-input-date[data-size='md'] {
  --input-current-height: var(--input-height-md);
  --input-current-padding-x: var(--input-padding-x-md);
  --input-current-gap: var(--input-gap-md);
  --input-current-font: var(--input-font-md);
  --input-current-icon: var(--input-icon-md);
}

.cus-input-date[data-size='lg'] {
  --input-current-height: var(--input-height-lg);
  --input-current-padding-x: var(--input-padding-x-lg);
  --input-current-gap: var(--input-gap-lg);
  --input-current-font: var(--input-font-lg);
  --input-current-icon: var(--input-icon-lg);
}

.cus-input-date:not([data-disabled='true']):hover .cus-input-date__control {
  border-color: var(--input-hover-border);
  background-color: var(--input-hover-bg);
}

.cus-input-date:not([data-disabled='true'])[data-error='true'] .cus-input-date__label {
  color: var(--input-error-text);
}

.cus-input-date:not([data-disabled='true'])[data-error='true'] .cus-input-date__control {
  border-color: var(--input-error-border);
  outline-color: var(--input-error-outline);
  background-color: var(--input-error-bg);
}

.cus-input-date:not([data-disabled='true']):not([data-error='true']):focus-within .cus-input-date__control,
.cus-input-date:not([data-disabled='true']):not([data-error='true'])[data-open='true'] .cus-input-date__control,
.cus-input-date:not([data-disabled='true']):not([data-error='true'])[data-selected='true'] .cus-input-date__control {
  border-color: var(--input-selected-border);
  outline-color: var(--input-selected-outline);
  background-color: var(--input-selected-bg);
}

.cus-input-date:not([data-disabled='true']):not([data-error='true']):focus-within .cus-input-date__label,
.cus-input-date:not([data-disabled='true']):not([data-error='true'])[data-open='true'] .cus-input-date__label,
.cus-input-date:not([data-disabled='true']):not([data-error='true'])[data-selected='true'] .cus-input-date__label {
  color: var(--color-accent-strong);
}

.cus-input-date[data-disabled='true'] .cus-input-date__label,
.cus-input-date[data-disabled='true'] .cus-input-date__control,
.cus-input-date[data-disabled='true'] .cus-input-date__icon {
  color: var(--input-disabled-text);
}

.cus-input-date[data-disabled='true'] .cus-input-date__control {
  border-color: var(--input-disabled-border);
  background-color: var(--input-disabled-bg);

  @apply cursor-not-allowed;
}

.cus-input-date[data-disabled='true'] .cus-input-date__input {
  @apply cursor-not-allowed;
}
</style>
