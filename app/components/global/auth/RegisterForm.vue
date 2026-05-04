<template>
  <CustomRouteTabs
    class="register-form__wizard-tabs"
    :items="wizardTabs"
    :model-value="currentStepValue"
    :aria-label="t('landing.auth.register.aria.wizard')"
    theme="app"
    size="sm"
    full-width
    @select="onWizardTabSelect"
  />

  <form class="register-form" novalidate @submit.prevent="onSubmit">
    <section
      v-if="currentStep === 1"
      id="register-step-informations"
      class="register-form__step"
      :aria-label="t('landing.auth.register.aria.personalInformation')"
    >
      <CustomInputText
        id="register-email"
        v-model="emailValue"
        name="email"
        type="email"
        autocomplete="email"
        :label="t('landing.auth.register.fields.email')"
        label-position="inside"
        :error-message="emailErrorMessage"
        required
        size="lg"
      />

      <CustomInputText
        id="register-username"
        v-model="usernameValue"
        name="username"
        type="text"
        autocomplete="username"
        :label="t('landing.auth.register.fields.username')"
        label-position="inside"
        :error-message="usernameErrorMessage"
        required
        size="lg"
      />

      <CustomInputText
        id="register-first-name"
        v-model="firstNameValue"
        name="firstName"
        type="text"
        autocomplete="given-name"
        :label="t('landing.auth.register.fields.firstName')"
        label-position="inside"
        :error-message="firstNameErrorMessage"
        required
        size="lg"
      />

      <div class="register-form__field">
        <CustomInputText
          id="register-last-name"
          v-model="lastNameValue"
          name="lastName"
          type="text"
          autocomplete="family-name"
          :label="t('landing.auth.register.fields.lastName')"
          label-position="inside"
          :error-message="lastNameErrorMessage"
          required
          size="lg"
        />
      </div>

      <CustomInputDatepicker
        id="register-birth-date"
        v-model="birthDateValue"
        name="birthDate"
        :label="t('landing.auth.register.fields.birthDate')"
        label-position="inside"
        format="DD-MM-YYYY"
        :min-date="minimumBirthDate"
        :max-date="maximumBirthDate"
        :placeholder="t('landing.auth.register.placeholders.birthDate')"
        :error-message="birthDateErrorMessage"
        required
        size="lg"
      />

      <CustomInputSelection
        id="register-gender"
        v-model="genderValue"
        name="gender"
        :label="t('landing.auth.register.fields.gender')"
        label-position="inside"
        :placeholder="t('landing.auth.register.placeholders.gender')"
        :options="genderOptions"
        option-value="value"
        option-label="label"
        :error-message="genderErrorMessage"
        required
        size="lg"
      />

      <CustomButton
        class="register-form__submit"
        :label="t('landing.auth.register.actions.continue')"
        type="submit"
        theme="landing"
        variant="filled"
        color="primary"
        size="lg"
        :disabled="!isStepOneFilled || isSubmitting"
      />
    </section>

    <section
      v-else
      id="register-step-security"
      class="register-form__step"
      :aria-label="t('landing.auth.register.aria.accountSecurity')"
    >
      <CustomInputText
        id="register-password"
        v-model="passwordValue"
        name="password"
        :type="passwordInputType"
        autocomplete="new-password"
        :label="t('landing.auth.register.fields.password')"
        label-position="inside"
        :right-icon="passwordIcon"
        right-icon-action
        right-icon-toggle
        :right-icon-pressed="passwordVisible"
        :right-icon-aria-label="t('landing.auth.register.aria.passwordVisibility')"
        :error-message="passwordErrorMessage"
        required
        size="lg"
        @right-icon-click="togglePasswordVisibility"
      />

      <CustomInputText
        id="register-password-confirmation"
        v-model="passwordConfirmationValue"
        name="passwordConfirmation"
        :type="passwordConfirmationInputType"
        autocomplete="new-password"
        :label="t('landing.auth.register.fields.passwordConfirmation')"
        label-position="inside"
        :right-icon="passwordConfirmationIcon"
        right-icon-action
        right-icon-toggle
        :right-icon-pressed="passwordConfirmationVisible"
        :right-icon-aria-label="t('landing.auth.register.aria.passwordConfirmationVisibility')"
        :error-message="passwordConfirmationErrorMessage"
        required
        size="lg"
        @right-icon-click="togglePasswordConfirmationVisibility"
      />

      <CustomInputText
        id="register-referral-code"
        v-model="referralCodeValue"
        class="register-form__field--wide"
        name="referralCode"
        type="text"
        autocomplete="off"
        :label="t('landing.auth.register.fields.referralCode')"
        label-position="inside"
        :error-message="referralCodeErrorMessage"
        :disabled="isReferralCodeLocked"
        size="lg"
      />

      <div class="register-form__actions">
        <CustomButton
          :label="t('landing.auth.register.actions.back')"
          type="button"
          theme="landing"
          variant="outlined"
          color="secondary"
          size="lg"
          @click="goToPreviousStep"
        />
        <CustomButton
          :label="t('landing.auth.register.actions.submit')"
          type="submit"
          theme="landing"
          variant="filled"
          color="primary"
          size="lg"
          :disabled="!isStepTwoFilled || isSubmitting"
        />
      </div>
    </section>
  </form>
</template>

<script setup lang="ts">
import type { UserLoginDto, UserRegisteredPresenter, UserRegisterRequestDto } from '@neeft-sas/shared'
import { REFERRAL_CODE_MAX_LENGTH, REFERRAL_CODE_MIN_LENGTH, REFERRAL_CODE_PATTERN, useSessionStore } from '~/stores/session.store'
import { useField, useForm } from 'vee-validate'
import type { GenderOption, GenderOptionValue, RegisterFieldName, RegisterFormValues, RegisterStep, WizardTabItem } from '~/types/register'

const { t } = useI18n()
const localePath = useLocalePath()
const { $authAPI } = useNuxtApp()
const toast = useToast()
const sessionStore = useSessionStore()

const usernamePattern = /^[a-zA-Z0-9_.-]+$/
const namePattern = /^[\p{L}' -]+$/u
const genderOptionValues: GenderOptionValue[] = ['woman', 'man', 'non_binary', 'not_shared']
const registrationFieldErrorLabel = 'Erreur'

const registerToastKeys = {
  success: {
    title: 'landing.auth.register.toast.success.title',
    message: 'landing.auth.register.toast.success.message'
  },
  emailError: {
    title: 'landing.auth.register.toast.error.email.title',
    message: 'landing.auth.register.toast.error.email.message'
  },
  genericError: {
    title: 'landing.auth.register.toast.error.generic.title',
    message: 'landing.auth.register.toast.error.generic.message'
  }
} as const

const genderPayloadByValue: Record<GenderOptionValue, RegisterGender> = {
  woman: 'WOMAN' as RegisterGender,
  man: 'MAN' as RegisterGender,
  non_binary: 'OTHER' as RegisterGender,
  not_shared: 'OTHER' as RegisterGender
}

const formFieldByApiField: Record<string, RegisterFieldName> = {
  email: 'email',
  username: 'username',
  firstname: 'firstName',
  firstName: 'firstName',
  lastname: 'lastName',
  lastName: 'lastName',
  birthdate: 'birthDate',
  birthDate: 'birthDate',
  gender: 'gender',
  password: 'password',
  referralCode: 'referralCode',
  referral_code: 'referralCode'
}

const steps: { value: RegisterStep, labelKey: string, titleKey: string }[] = [
  {
    value: 1,
    labelKey: 'landing.auth.register.steps.information',
    titleKey: 'landing.auth.register.steps.titles.information'
  },
  {
    value: 2,
    labelKey: 'landing.auth.register.steps.security',
    titleKey: 'landing.auth.register.steps.titles.security'
  }
]

const genderOptions = computed<GenderOption[]>(() => {
  return genderOptionValues.map((value) => ({
    value,
    label: t(`resource.genderOptions.${value}`)
  }))
})

const currentStep = ref<RegisterStep>(1)
const passwordVisible = ref(false)
const passwordConfirmationVisible = ref(false)
const isReferralCodeLocked = ref(false)
const route = useRoute()

const padDatePart = (value: number) => String(value).padStart(2, '0')
const formatLocalDate = (date: Date) => {
  return `${padDatePart(date.getDate())}/${padDatePart(date.getMonth() + 1)}/${date.getFullYear()}`
}

const parseBirthDate = (value: string) => {
  const [day, month, year] = value.split(/[/-]/).map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

const today = new Date()
const minimumBirthDate = '01/01/1900'
const maximumBirthDate = formatLocalDate(new Date(today.getFullYear() - 13, today.getMonth(), today.getDate()))

const usernameRules = { required: true, min: 3, max: 24, regex: usernamePattern }
const nameRules = { required: true, min: 2, max: 60, regex: namePattern }
const birthDateRules = { required: true, date_between: { min: minimumBirthDate, max: maximumBirthDate } }
const genderRules = { required: true, one_of: genderOptionValues }
const passwordRules = 'required|password'
const passwordConfirmationRules = 'required|confirmed:@password'
const referralCodeRules = {
  min: REFERRAL_CODE_MIN_LENGTH,
  max: REFERRAL_CODE_MAX_LENGTH,
  regex: REFERRAL_CODE_PATTERN
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const getApiErrorPayload = (error: unknown) => {
  if (!isRecord(error)) return null

  if (isRecord(error.data)) return error.data

  const response = error.response
  if (isRecord(response) && isRecord(response._data)) return response._data

  return null
}

const getFirstApiErrorMessage = (value: unknown) => {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''

  return value.find((message): message is string => (
    typeof message === 'string' && message.length > 0
  )) || ''
}

const { handleSubmit, validateField, isSubmitting, setErrors } = useForm<RegisterFormValues>({
  initialValues: {
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    password: '',
    passwordConfirmation: '',
    referralCode: ''
  }
})

const { value: emailValue, errorMessage: emailErrorMessage } = useField<string>('email', 'required|email')
const { value: usernameValue, errorMessage: usernameErrorMessage } = useField<string>('username', usernameRules)
const { value: firstNameValue, errorMessage: firstNameErrorMessage } = useField<string>('firstName', nameRules)
const { value: lastNameValue, errorMessage: lastNameErrorMessage } = useField<string>('lastName', nameRules)
const { value: birthDateValue, errorMessage: birthDateErrorMessage } = useField<string>('birthDate', birthDateRules)
const { value: genderValue, errorMessage: genderErrorMessage } = useField<string>('gender', genderRules)
const { value: passwordValue, errorMessage: passwordErrorMessage } = useField<string>('password', passwordRules)
const { value: passwordConfirmationValue, errorMessage: passwordConfirmationErrorMessage, validate: validatePasswordConfirmationField } = useField<string>('passwordConfirmation', passwordConfirmationRules)
const { value: referralCodeValue, errorMessage: referralCodeErrorMessage } = useField<string>('referralCode', referralCodeRules)

const getRegistrationFieldErrors = (error: unknown) => {
  const payload = getApiErrorPayload(error)
  const fieldErrors: Partial<Record<RegisterFieldName, string>> = {}
  if (!payload) return fieldErrors

  if (isRecord(payload.fields)) {
    Object.entries(payload.fields).forEach(([apiField, messages]) => {
      const formField = formFieldByApiField[apiField]
      const message = getFirstApiErrorMessage(messages)
      if (formField && message) fieldErrors[formField] = message
    })
  }

  return fieldErrors
}

const lockReferralCode = (value: string) => {
  referralCodeValue.value = value
  isReferralCodeLocked.value = true
}

const syncReferralCodeStorage = () => {
  if (!import.meta.client) return

  const referralCode = sessionStore.syncReferralCodeFromQuery(route.query)
  if (referralCode) {
    lockReferralCode(referralCode)
    return
  }

  isReferralCodeLocked.value = false
}

const stepOneFields: RegisterFieldName[] = ['email', 'username', 'firstName', 'lastName', 'birthDate', 'gender']
const stepTwoFields: RegisterFieldName[] = ['password', 'passwordConfirmation', 'referralCode']

const currentStepData = computed(() => steps.find((step) => step.value === currentStep.value) ?? steps[0]!)
const currentStepLabel = computed(() => t('landing.auth.register.steps.progress', { current: currentStep.value, total: steps.length }))
const currentStepTitle = computed(() => t(currentStepData.value.titleKey))
const currentStepValue = computed(() => String(currentStep.value))

const isStepOneFilled = computed(() => {
  return emailValue.value.length > 0
    && usernameValue.value.length > 0
    && firstNameValue.value.length > 0
    && lastNameValue.value.length > 0
    && birthDateValue.value.length > 0
    && genderValue.value.length > 0
})

const isStepTwoFilled = computed(() => {
  return passwordValue.value.length > 0 && passwordConfirmationValue.value.length > 0
})

const hasStepOneError = computed(() => {
  return Boolean(
    emailErrorMessage.value
    || usernameErrorMessage.value
    || firstNameErrorMessage.value
    || lastNameErrorMessage.value
    || birthDateErrorMessage.value
    || genderErrorMessage.value
  )
})

const hasStepTwoError = computed(() => {
  return Boolean(
    passwordErrorMessage.value
    || passwordConfirmationErrorMessage.value
    || referralCodeErrorMessage.value
  )
})

const passwordInputType = computed(() => (passwordVisible.value ? 'text' : 'password'))
const passwordIcon = computed(() => (passwordVisible.value ? 'lucide:eye-off' : 'lucide:eye'))
const passwordConfirmationInputType = computed(() => (passwordConfirmationVisible.value ? 'text' : 'password'))
const passwordConfirmationIcon = computed(() => (passwordConfirmationVisible.value ? 'lucide:eye-off' : 'lucide:eye'))
const wizardTabs = computed<WizardTabItem[]>(() => {
  return steps.map((step) => {
    const label = t(step.labelKey)
    const invalid = step.value === 1 ? hasStepOneError.value : hasStepTwoError.value

    return {
      label,
      value: String(step.value),
      disabled: step.value === 2 && !isStepOneFilled.value,
      invalid,
      invalidLabel: registrationFieldErrorLabel
    }
  })
})

const validateStepFields = async (fieldNames: RegisterFieldName[]) => {
  const results = await Promise.all(fieldNames.map((fieldName) => validateField(fieldName)))
  return results.every((result) => result.valid)
}

const toRegisterPayload = (values: RegisterFormValues): UserRegisterRequestDto => {
  const referralCode = values.referralCode
  const payload: UserRegisterRequestDto = {
    email: values.email,
    username: values.username,
    firstname: values.firstName,
    lastname: values.lastName,
    password: values.password,
    birthdate: parseBirthDate(values.birthDate),
    gender: genderPayloadByValue[values.gender as GenderOptionValue]
  }

  if (referralCode) payload.referralCode = referralCode

  return payload
}

const toLoginPayload = (email: string, password: string): UserLoginDto => ({
  email,
  password
})

const getPlayerProfilePath = (slug: string | undefined) => {
  const normalizedSlug = slug
  if (!normalizedSlug) throw new Error('Missing registered user slug')

  return localePath(`/players/${encodeURIComponent(normalizedSlug)}`)
}

const addRegisterToast = (
  variant: 'success' | 'error',
  keys: typeof registerToastKeys.success | typeof registerToastKeys.emailError | typeof registerToastKeys.genericError
) => {
  toast.add({
    variant,
    title: t(keys.title),
    desc: t(keys.message),
    icon: variant === 'success' ? 'lucide:circle-check' : 'lucide:circle-alert',
    position: 'top-right'
  })
}

const loginRegisteredUser = async (email: string, password: string) => {
  const session = await $authAPI.login(toLoginPayload(email, password))
  if (!session) throw new Error('Login failed')
}

const applyRegistrationError = (error: unknown) => {
  const fieldErrors = getRegistrationFieldErrors(error)
  if (Object.keys(fieldErrors).length === 0) return false

  setErrors(fieldErrors)

  if (stepOneFields.some((fieldName) => fieldErrors[fieldName])) {
    currentStep.value = 1
  } else if (stepTwoFields.some((fieldName) => fieldErrors[fieldName])) {
    currentStep.value = 2
  }

  addRegisterToast('error', fieldErrors.email ? registerToastKeys.emailError : registerToastKeys.genericError)

  return true
}

const goToNextStep = async () => {
  const isValidStep = await validateStepFields(stepOneFields)
  if (!isValidStep) return

  currentStep.value = 2
}

const goToPreviousStep = () => {
  currentStep.value = 1
}

const onWizardTabSelect = async (item: WizardTabItem) => {
  if (item.value === '1') {
    goToPreviousStep()
    return
  }

  await goToNextStep()
}

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const togglePasswordConfirmationVisibility = () => {
  passwordConfirmationVisible.value = !passwordConfirmationVisible.value
}

watch(passwordValue, () => {
  if (!passwordConfirmationValue.value) return
  validatePasswordConfirmationField()
})

watch(() => route.query, () => {
  syncReferralCodeStorage()
})

onMounted(() => {
  syncReferralCodeStorage()
})

const submitRegistration = handleSubmit(async (values) => {
  let registeredUser: UserRegisteredPresenter

  try {
    registeredUser = await $authAPI.register(toRegisterPayload(values))
    sessionStore.clearReferralCode()
    await loginRegisteredUser(values.email, values.password)
    await sessionStore.refresh()
  } catch (error) {
    if (applyRegistrationError(error)) return

    addRegisterToast('error', registerToastKeys.genericError)
    return
  }

  addRegisterToast('success', registerToastKeys.success)

  return await navigateTo(getPlayerProfilePath(registeredUser.slug), { replace: true })
}, ({ errors }) => {
  if (stepOneFields.some((fieldName) => errors[fieldName])) currentStep.value = 1
})

const onSubmit = async () => {
  if (currentStep.value === 1) {
    await goToNextStep()
    return
  }

  return await submitRegistration()
}

defineExpose({
  currentStep,
  currentStepLabel,
  currentStepTitle,
  currentStepValue,
  wizardTabs,
  isStepOneFilled,
  isStepTwoFilled,
  isSubmitting,
  onWizardTabSelect,
  onSubmit
})
</script>

<style scoped lang="scss">
.register-form {
  --auth-field-min: calc(var(--unit) * 24);
  display: grid;
  gap: var(--space-1);
}

.register-form__step {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--auth-field-min)), 1fr));
  column-gap: var(--space-2);
  row-gap: var(--space-1);
}

.register-form__field,
.register-form__field--wide,
.register-form__actions,
.register-form__submit {
  grid-column: 1 / -1;
}

.register-form__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2);
}

.register-form__submit {
  margin-top: var(--space-1);
}

.register-form :deep(.cus-button) {
  width: 100%;
  min-width: 0;
}

@media (max-width: 36rem) {
  .register-form__actions {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
