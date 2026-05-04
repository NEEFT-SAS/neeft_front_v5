<template>
  <form class="login-form" novalidate @submit.prevent="onSubmit">
    <CustomInputText
      id="login-email"
      v-model="emailValue"
      name="email"
      type="email"
      autocomplete="username"
      :label="t('landing.auth.login.fields.email')"
      label-position="inside"
      :error-message="emailErrorMessage"
      required
      size="lg"
    />

    <CustomInputText
      id="login-password"
      v-model="passwordValue"
      name="password"
      :type="passwordInputType"
      autocomplete="current-password"
      :label="t('landing.auth.login.fields.password')"
      label-position="inside"
      :right-icon="passwordIcon"
      right-icon-action
      right-icon-toggle
      :right-icon-pressed="passwordVisible"
      :right-icon-aria-label="t('landing.auth.login.aria.passwordVisibility')"
      :error-message="passwordErrorMessage"
      required
      size="lg"
      @right-icon-click="togglePasswordVisibility"
    />

    <NuxtLink class="login-form__forgot" to="/forgot-password">
      {{ t('landing.auth.login.actions.forgottenPassword') }}
    </NuxtLink>

    <CustomButton
      :label="t('landing.auth.login.actions.submit')"
      type="submit"
      theme="landing"
      variant="filled"
      color="primary"
      size="lg"
      :disabled="!meta.valid || isSubmitting"
    />
  </form>
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { UserLoginDto } from '@neeft-sas/shared'
import { useToast } from '~/composables/useToast'

const { t } = useI18n()
const localePath = useLocalePath()
const { $authAPI } = useNuxtApp()
const toast = useToast()

const { handleSubmit, meta, isSubmitting } = useForm<UserLoginDto>({
  initialValues: {
    email: '',
    password: ''
  }
})

const { value: emailValue, errorMessage: emailErrorMessage, setErrors: setEmailErrors } = useField<string>('email', 'required|email')
const { value: passwordValue, errorMessage: passwordErrorMessage, setErrors: setPasswordErrors } = useField<string>('password', 'required|min:8')

const passwordVisible = ref(false)

const passwordInputType = computed(() => (passwordVisible.value ? 'text' : 'password'))
const passwordIcon = computed(() => (passwordVisible.value ? 'lucide:eye-off' : 'lucide:eye'))

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await $authAPI.login({ email: values.email, password: values.password })
    return await navigateTo(localePath('/'), { replace: true })
  } catch (error: any) {
    setEmailErrors(error.fields?.email || [])
    setPasswordErrors(error.fields?.password || [])

    toast.add({
      variant: 'error',
      title: t('landing.auth.login.toast.error.title'),
      desc: t('landing.auth.login.toast.error.message')
    })
  }
})
</script>

<style scoped>
.login-form {
  gap: var(--space-2);
  display: grid;
}

.login-form__forgot {
  justify-self: end;
  margin-bottom: var(--space-2);
  font-size: calc(var(--unit) * 2);
  line-height: var(--line-base);
  color: var(--color-muted);
  font-weight: var(--font-weight-semibold);
  text-decoration-color: currentColor;
  text-decoration-thickness: calc(var(--border) * 2);
  text-underline-offset: calc(var(--border) * 5);
  text-decoration: none;
}

.login-form__forgot:hover {
  text-decoration: underline;
}

.login-form :deep(.cus-button) {
  width: 100%;
  min-width: 0;
}
</style>
