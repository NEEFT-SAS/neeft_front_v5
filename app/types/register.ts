import type { UserRegisterRequestDto } from '@neeft-sas/shared'

export type RegisterStep = 1 | 2

export type RegisterFormValues = {
  email: string
  username: string
  firstName: string
  lastName: string
  birthDate: string
  gender: string
  password: string
  passwordConfirmation: string
  referralCode: string
}

export type RegisterFieldName = keyof RegisterFormValues

export type GenderOptionValue = 'woman' | 'man' | 'non_binary' | 'not_shared'
export type RegisterGender = UserRegisterRequestDto['gender']

export type GenderOption = {
  value: GenderOptionValue
  label: string
}

export type WizardTabItem = {
  label: string
  to?: string
  value: string
  disabled?: boolean
  invalid?: boolean
  invalidLabel?: string
  ariaLabel?: string
}
