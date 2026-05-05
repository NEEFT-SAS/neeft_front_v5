import type { PlayerProfilePresenter } from '@neeft-sas/shared'

type SlugValue = string | string[] | null | undefined
type RefValue<T> = { value: T }

type ViewedUserProfilePageCtx = {
  slug: RefValue<string>
  profile: RefValue<PlayerProfilePresenter | null>
  pending: RefValue<boolean>
  error: RefValue<unknown>
  refresh: () => Promise<void>
  isOwner: RefValue<boolean>
  canEdit: RefValue<boolean>
}

const VIEWED_USER_PROFILE_CTX = Symbol('VIEWED_USER_PROFILE_CTX')

const resolvePageContext = (slugRef?: () => SlugValue): ViewedUserProfilePageCtx => {
  if (!slugRef) {
    const injected = inject<ViewedUserProfilePageCtx | null>(VIEWED_USER_PROFILE_CTX, null)
    if (!injected) {
      throw new Error('useViewedUserProfile() must be used under pages/players/[slug].vue')
    }
    return injected
  }

  const session = useSessionStore()
  const { $playerAPI } = useNuxtApp()

  const slug = computed(() => {
    const rawSlug = slugRef() as SlugValue
    const firstSlug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug
    const value = String(firstSlug ?? '')

    if (!value) return ''
    if (value === 'null') return ''
    if (value === 'undefined') return ''

    return value
  })

  const cacheKey = 'viewed-user-profile:profile'

  const { data, pending, error, refresh } = useAsyncData<PlayerProfilePresenter | null>(
    cacheKey,
    async () => {
      if (!slug.value) return null

      try {
        // await session.bootstrap()
      } catch {
        // Ignore auth errors for public profiles
      }
      const response = await $playerAPI.profile.get(slug.value)
      return response.data
    },
    {
      default: () => null,
      watch: [slug]
    }
  )

  watch(slug, () => {
    data.value = null
  })

  const normalizedMySlug = computed(() => {
    const rawSession = session.me as unknown as Record<string, unknown> | null
    const dataValue = rawSession?.data as Record<string, unknown> | undefined
    const player = (dataValue?.player as Record<string, unknown> | undefined)
      ?? (rawSession?.player as Record<string, unknown> | undefined)

    return String(player?.slug ?? '').toLowerCase()
  })

  const normalizedRouteSlug = computed(() => String(slug.value ?? '').toLowerCase())

  const isOwner = computed(() => {
    if (!normalizedMySlug.value) return false
    return normalizedMySlug.value === normalizedRouteSlug.value
  })

  const canEdit = computed(() => {
    if (isOwner.value) return true
    return false
  })

  onBeforeUnmount(() => {
    if (!import.meta.client) return
    clearNuxtData(cacheKey)
  })

  const ctx: ViewedUserProfilePageCtx = {
    slug,
    profile: data,
    pending,
    error,
    refresh,
    isOwner,
    canEdit
  }

  provide(VIEWED_USER_PROFILE_CTX, ctx)

  return ctx
}

export function useViewedUserProfile(slugRef?: () => SlugValue) {
  const ctx = resolvePageContext(slugRef)

  return {
    profile: ctx.profile,
    slug: ctx.slug,
    canEdit: ctx.canEdit,
    pending: ctx.pending,
    error: ctx.error,
    refresh: ctx.refresh,
    isOwner: ctx.isOwner
  }
}
