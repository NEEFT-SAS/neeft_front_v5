import { configure, defineRule } from 'vee-validate'
import { required, email, min, max, regex, one_of as oneOf, confirmed } from '@vee-validate/rules'

const fieldLabels = {
  email: 'Adresse e-mail',
  username: "Nom d'utilisateur",
  firstName: 'Prenom',
  lastName: 'Nom de famille',
  birthDate: 'Date de naissance',
  gender: 'Genre',
  password: 'Mot de passe',
  passwordConfirmation: 'Confirmation',
  referralCode: 'Code de parrainage'
}

const localDatePattern = /^(\d{2})[/-](\d{2})[/-](\d{4})$/
const isoDatePattern = /^(\d{4})[/-](\d{2})[/-](\d{2})$/

const getFieldLabel = (field) => fieldLabels[field] || String(field)

const getRuleParam = (params, key, index) => {
  if (Array.isArray(params)) return params[index]
  if (params && typeof params === 'object') return params[key]
  return undefined
}

const parseDateValue = (value) => {
  const text = String(value || '')
  if (!text) return null

  const localMatch = localDatePattern.exec(text)
  const isoMatch = isoDatePattern.exec(text)
  const day = localMatch ? Number(localMatch[1]) : isoMatch ? Number(isoMatch[3]) : 0
  const month = localMatch ? Number(localMatch[2]) : isoMatch ? Number(isoMatch[2]) : 0
  const year = localMatch ? Number(localMatch[3]) : isoMatch ? Number(isoMatch[1]) : 0

  if (!day || !month || !year) return null

  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null

  return new Date(year, month - 1, day)
}

const getLengthParam = (params) => {
  return getRuleParam(params, 'length', 0) ?? getRuleParam(params, 'min', 0) ?? getRuleParam(params, 'max', 0)
}

export default defineNuxtPlugin(() => {
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)
  defineRule('max', max)
  defineRule('regex', regex)
  defineRule('one_of', oneOf)
  defineRule('confirmed', confirmed)
  
  defineRule('required_boolean', (value) => {
    if (typeof value === 'boolean') return true
    return 'Ce champ est requis.'
  })

  defineRule('password', (value) => {
    if (value === null || value === undefined || String(value).length === 0) return true
    const password = String(value)
    const pattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
    return pattern.test(password) || 'Le mot de passe doit contenir au moins 8 caracteres, avec lettres et chiffres.'
  })

  defineRule('date_between', (value, params, ctx) => {
    if (value === null || value === undefined || String(value).length === 0) return true

    const date = parseDateValue(value)
    const label = getFieldLabel(ctx?.field)
    if (!date) return `${label} invalide.`

    const minValue = getRuleParam(params, 'min', 0)
    const maxValue = getRuleParam(params, 'max', 1)
    const minDate = minValue ? parseDateValue(minValue) : null
    const maxDate = maxValue ? parseDateValue(maxValue) : null

    if (minDate && date < minDate) return `${label} invalide.`
    if (maxDate && date > maxDate) return `${label} ne peut pas etre dans le futur.`

    return true
  })

  configure({
    generateMessage: (ctx) => {
      const label = getFieldLabel(ctx.field)
      const ruleName = ctx.rule?.name
      const params = ctx.rule?.params

      if (ruleName === 'required') return `${label} requis.`
      if (ruleName === 'email') return `${label} invalide.`
      if (ruleName === 'min') return `${label} doit contenir au moins ${getLengthParam(params)} caracteres.`
      if (ruleName === 'max') return `${label} doit contenir au maximum ${getLengthParam(params)} caracteres.`
      if (ruleName === 'regex') return `${label} invalide.`
      if (ruleName === 'one_of') return `${label} invalide.`
      if (ruleName === 'confirmed') return 'La confirmation ne correspond pas.'
      if (ruleName === 'password') return 'Le mot de passe doit contenir au moins 8 caracteres, avec lettres et chiffres.'

      return `${label} invalide.`
    },
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true
  })
})
