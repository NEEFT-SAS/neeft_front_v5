import type { UserSessionPresenter, UserTeamPresenter } from '@neeft-sas/shared'
import { toStringArray } from '@neeft-sas/shared'
import { defineStore } from 'pinia'

export enum SessionStatusEnum {
  UNKNOWN = 'unknown',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  ANONYMOUS = 'anonymous'
}

export const REFERRAL_CODE_MIN_LENGTH = 4
export const REFERRAL_CODE_MAX_LENGTH = 32
export const REFERRAL_CODE_PATTERN = /^[a-zA-Z0-9-]+$/
export const REFERRAL_STORAGE_KEY = 'neeft:referral-code'
export const REFERRAL_QUERY_KEYS = ['referredCode', 'referralCode', 'referral'] as const

type SessionState = {
  status: SessionStatusEnum
  me: UserSessionPresenter | null
  myTeams: UserTeamPresenter[]
  myTeamsLoaded: boolean
  lastError: string | null
  referralCode: string | null
}

let bootstrapPromise: Promise<void> | null = null

export const normalizeReferralCode = (value: unknown): string | null => {
  const rawValue = toStringArray(value)?.[0]
  if (!rawValue) return null

  const normalized = rawValue
  if (!normalized) return null
  if (normalized.length < REFERRAL_CODE_MIN_LENGTH) return null
  if (normalized.length > REFERRAL_CODE_MAX_LENGTH) return null
  if (!REFERRAL_CODE_PATTERN.test(normalized)) return null

  return normalized
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : 'session_bootstrap_failed'
}

const getAuthToken = () => {
  const auth = useAuth()
  return String(auth.token.value ?? '')
}

const getSessionSlug = (session: UserSessionPresenter | null) => {
  return session?.slug || null
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    status: SessionStatusEnum.UNKNOWN,
    me: null,
    myTeams: [],
    myTeamsLoaded: false,
    lastError: null,
    referralCode: null
  }),

  getters: {
    isLoggedIn: (state) => state.status === SessionStatusEnum.AUTHENTICATED,
    mySlug: (state) => getSessionSlug(state.me),
    myTeamSlugs: (state) => state.myTeams.map(team => team.slug),
    isMemberOfTeam: (state) => (slug: string) => state.myTeams.some(team => team.slug === slug)
  },

  actions: {
    resetAuthState() {
      this.status = SessionStatusEnum.ANONYMOUS
      this.me = null
      this.myTeams = []
      this.myTeamsLoaded = false
      this.lastError = null
      bootstrapPromise = null
    },

    setAuthenticatedSession(me: UserSessionPresenter) {
      this.status = SessionStatusEnum.AUTHENTICATED
      this.me = me
      this.myTeamsLoaded = false
      this.lastError = null
    },

    async bootstrap() {
      if (bootstrapPromise) return bootstrapPromise
      if (this.status === SessionStatusEnum.AUTHENTICATED) {
        if (!this.myTeamsLoaded) return this.fetchMyTeams()
        return Promise.resolve()
      }

      if (this.status === SessionStatusEnum.ANONYMOUS && import.meta.client && getAuthToken()) {
        this.status = SessionStatusEnum.UNKNOWN
      }

      if (this.status !== SessionStatusEnum.UNKNOWN) return Promise.resolve()

      bootstrapPromise = (async () => {
        this.status = SessionStatusEnum.LOADING
        this.lastError = null

        try {
          const { $authAPI } = useNuxtApp()
          const me = await $authAPI.getMySession()

          if (me) {
            this.setAuthenticatedSession(me)
            await this.fetchMyTeams()
            return
          }

          this.resetAuthState()
        } catch (error) {
          this.resetAuthState()
          this.lastError = getErrorMessage(error)
        } finally {
          bootstrapPromise = null
        }
      })()

      return bootstrapPromise
    },

    async refresh() {
      this.status = SessionStatusEnum.UNKNOWN
      this.me = null
      this.myTeams = []
      this.myTeamsLoaded = false
      this.lastError = null
      bootstrapPromise = null

      await this.bootstrap()
    },

    async fetchMyTeams() {
      try {
        const { $teamAPI } = useNuxtApp()
        this.myTeams = await $teamAPI.getMyTeams()
      } catch {
        this.myTeams = []
      } finally {
        this.myTeamsLoaded = true
      }
    },

    hydrateReferralCode() {
      if (!import.meta.client) return this.referralCode

      const normalized = normalizeReferralCode(window.localStorage.getItem(REFERRAL_STORAGE_KEY))
      this.referralCode = normalized

      if (!normalized) window.localStorage.removeItem(REFERRAL_STORAGE_KEY)

      return normalized
    },

    setReferralCode(value: unknown) {
      const normalized = normalizeReferralCode(value)
      this.referralCode = normalized

      if (import.meta.client) {
        if (normalized) {
          window.localStorage.setItem(REFERRAL_STORAGE_KEY, normalized)
        } else {
          window.localStorage.removeItem(REFERRAL_STORAGE_KEY)
        }
      }

      return normalized
    },

    syncReferralCodeFromQuery(query: Record<string, unknown>) {
      const routeReferralCode = REFERRAL_QUERY_KEYS
        .map((key) => normalizeReferralCode(query[key]))
        .find((value): value is string => Boolean(value))

      if (routeReferralCode) return this.setReferralCode(routeReferralCode)

      return this.hydrateReferralCode()
    },

    clearReferralCode() {
      this.setReferralCode(null)
    },

    async logout() {
      try {
        const auth = useAuth()
        await auth.signOut({ redirect: false })
      } finally {
        this.resetAuthState()
      }
    }
  }
})
