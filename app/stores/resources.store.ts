import { defineStore } from 'pinia'
import type { ResourcesPresenter, RscCountryPresenter, RscGamePresenter, RscLanguagePresenter, RscProfileBadgePresenter, RscStaffRolePresenter } from '@neeft-sas/shared'
import { normalizeSocialPlatforms } from '~/datas/resources/socialPlatforms'
import { profileContractTypeOptions, profileGenderOptions, type ProfileOption, profileWorkSectorOptions, profileYesNoOptions } from '~/datas/resources/profileOptions'

export type AppResources = ResourcesPresenter & {
  rscWorkSectors: ProfileOption[]
  rscContractTypes: ProfileOption[]
  rscYesNo: ProfileOption<boolean>[]
  rscGenders: ProfileOption[]
}

type ResourcesCacheEntry = {
  savedAt: number
  resources: AppResources
}

type ResourcesResponse = Partial<ResourcesPresenter> & {
  data?: Partial<ResourcesPresenter>
  meta?: {
    version?: string
  }
}

const RESOURCES_STORAGE_KEY = 'neeft:resources-cache:v1'
const RESOURCES_CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24

let refreshPromise: Promise<void> | null = null

const emptyResources = (): AppResources => ({
  version: 'unknown',
  rscSocialPlatforms: [],
  rscProfileBadges: [],
  rscCountries: [],
  rscLanguages: [],
  rscGames: [],
  rscStaffRoles: [],
  rscWorkSectors: profileWorkSectorOptions,
  rscContractTypes: profileContractTypeOptions,
  rscYesNo: profileYesNoOptions,
  rscGenders: profileGenderOptions
})

const getResourceList = <TItem>(value: TItem[] | undefined) => {
  return value ?? []
}

export const normalizeResources = (input: ResourcesResponse | null | undefined): AppResources => {
  const response = input ?? {}
  const resources = response.data ?? response
  const platforms = normalizeSocialPlatforms(resources.rscSocialPlatforms ?? [])

  return {
    version: response.meta?.version || resources.version || 'unknown',
    rscSocialPlatforms: platforms,
    rscProfileBadges: getResourceList<RscProfileBadgePresenter>(resources.rscProfileBadges),
    rscCountries: getResourceList<RscCountryPresenter>(resources.rscCountries),
    rscLanguages: getResourceList<RscLanguagePresenter>(resources.rscLanguages),
    rscGames: getResourceList<RscGamePresenter>(resources.rscGames),
    rscStaffRoles: getResourceList<RscStaffRolePresenter>(resources.rscStaffRoles),
    rscWorkSectors: profileWorkSectorOptions,
    rscContractTypes: profileContractTypeOptions,
    rscYesNo: profileYesNoOptions,
    rscGenders: profileGenderOptions
  }
}

const readResourcesCache = (): ResourcesCacheEntry | null => {
  if (!import.meta.client) return null

  const raw = window.localStorage.getItem(RESOURCES_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<ResourcesCacheEntry>
    const savedAt = Number(parsed.savedAt ?? 0)

    if (!Number.isFinite(savedAt) || savedAt <= 0) {
      window.localStorage.removeItem(RESOURCES_STORAGE_KEY)
      return null
    }

    return {
      savedAt,
      resources: normalizeResources(parsed.resources)
    }
  } catch {
    window.localStorage.removeItem(RESOURCES_STORAGE_KEY)
    return null
  }
}

const writeResourcesCache = (resources: AppResources, savedAt: number) => {
  if (!import.meta.client) return

  window.localStorage.setItem(RESOURCES_STORAGE_KEY, JSON.stringify({ savedAt, resources }))
}

const removeResourcesCache = () => {
  if (!import.meta.client) return
  window.localStorage.removeItem(RESOURCES_STORAGE_KEY)
}

export const useResourcesStore = defineStore('resources', {
  state: () => ({
    resources: emptyResources(),
    loaded: false,
    loading: false,
    lastError: null as string | null,
    hydratedFromCache: false,
    lastSyncAt: null as number | null
  }),

  getters: {
    rscSocialPlatforms: state => state.resources.rscSocialPlatforms,
    rscGames: state => state.resources.rscGames,
    rscStaffRoles: state => state.resources.rscStaffRoles,
    rscWorkSectors: state => state.resources.rscWorkSectors,
    rscContractTypes: state => state.resources.rscContractTypes,
    rscYesNo: state => state.resources.rscYesNo,
    rscGenders: state => state.resources.rscGenders,
    cacheIsFresh: state => Boolean(state.lastSyncAt && Date.now() - state.lastSyncAt < RESOURCES_CACHE_MAX_AGE_MS)
  },

  actions: {
    hydrateFromCache() {
      const cache = readResourcesCache()
      if (!cache) return false

      this.resources = cache.resources
      this.loaded = true
      this.hydratedFromCache = true
      this.lastSyncAt = cache.savedAt

      return true
    },

    persistToCache() {
      if (!this.lastSyncAt) return
      writeResourcesCache(this.resources, this.lastSyncAt)
    },

    clearCache() {
      removeResourcesCache()
    },

    async refresh() {
      if (refreshPromise) return refreshPromise

      refreshPromise = (async () => {
        this.loading = true
        this.lastError = null

        try {
          this.resources = normalizeResources(await useNuxtApp().$resourceAPI.get())
          this.loaded = true
          this.hydratedFromCache = false
          this.lastSyncAt = Date.now()
          this.persistToCache()
        } catch (error) {
          this.lastError = error instanceof Error ? error.message : 'resources_fetch_failed'
          throw error
        } finally {
          this.loading = false
          refreshPromise = null
        }
      })()

      return refreshPromise
    },

    async bootstrap(forceRefresh = false) {
      if (forceRefresh) {
        await this.refresh().catch(() => undefined)
        return
      }

      const hasCache = this.hydrateFromCache()
      if (hasCache && this.cacheIsFresh) return

      await this.refresh().catch(() => undefined)
    },

    async init(forceRefresh = true) {
      await this.bootstrap(forceRefresh)
    }
  }
})
