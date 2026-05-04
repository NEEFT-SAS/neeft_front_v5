import { config as loadEnv } from 'dotenv'

loadEnv({ quiet: true })

export type AppMode = 'development' | 'production'

export const requireEnv = (key: string) => {
  const value = process.env[key]
  if (!value) throw new Error(`Missing environment variable: ${key}`)

  return value
}

export const requireAppMode = (key = 'MODE'): AppMode => {
  const mode = requireEnv(key).toLowerCase()

  if (mode !== 'development' && mode !== 'production') {
    throw new Error(`Invalid environment variable ${key}: ${mode}`)
  }

  return mode
}

export const requireModeEnv = (keys: Record<AppMode, string>) => {
  return requireEnv(keys[requireAppMode()])
}

export const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '')

export const apiBaseUrl = normalizeBaseUrl(requireModeEnv({
  development: 'API_DEV_URL',
  production: 'API_PROD_URL'
}))
