import type { PlayerProfilePresenter, UserGamePresenter, PlayerStaffRolePresenter, RecommendationPresenter } from '@neeft-sas/shared'

type SlugValue = string | string[] | null | undefined
type RefValue<T> = { value: T }

type ViewedUserProfilePageCtx = {
  slug: RefValue<string>
  profile: RefValue<PlayerProfilePresenter | null>
  pending: RefValue<boolean>
  error: RefValue<unknown>
  refresh: () => Promise<void>
  updateProfile: (updates: Partial<PlayerProfilePresenter>) => void
  updatePlayerProfile: (updates: Partial<PlayerProfilePresenter>) => Promise<void>
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

  const updateProfile = (updates: Partial<PlayerProfilePresenter>) => {
    if (data.value) {
      data.value = { ...data.value, ...updates }
    }
  }

  const updatePlayerProfile = async (updates: Partial<PlayerProfilePresenter>) => {
    if (!slug.value || !data.value) return

    await $playerAPI.profile.update(slug.value, updates)
    data.value = { ...data.value, ...updates }
  }

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
    updateProfile,
    updatePlayerProfile,
    isOwner,
    canEdit
  }

  provide(VIEWED_USER_PROFILE_CTX, ctx)

  return ctx
}

export function useViewedUserProfile(slugRef?: () => SlugValue) {
  const ctx = resolvePageContext(slugRef)

  const useGameSection = () => {
    const { $playerAPI } = useNuxtApp()
    const cacheKey = `viewed-user-profile:games:${ctx.slug.value}`

    const { data, pending, error, refresh } = useAsyncData<UserGamePresenter[]>(
      cacheKey,
      async () => {
        if (!ctx.slug.value) return []
        try {
          const response = await $playerAPI.games.list(ctx.slug.value)
          return response.data
        } catch (err) {
          if ((err as { statusCode?: unknown }).statusCode === 404) return []
          throw err
        }
      },
      {
        default: () => [],
        watch: [ctx.slug]
      }
    )

    return {
      items: data,
      pending,
      error,
      refresh
    }
  }

  const useStaffSection = () => {
    const { $playerAPI } = useNuxtApp()
    const cacheKey = `viewed-user-profile:staff:${ctx.slug.value}`

    const { data, pending, error, refresh } = useAsyncData<PlayerStaffRolePresenter[]>(
      cacheKey,
      async () => {
        if (!ctx.slug.value) return []
        try {
          const response = await $playerAPI.staffs.list(ctx.slug.value)
          return response.data
        } catch (err) {
          if ((err as { statusCode?: unknown }).statusCode === 404) return []
          throw err
        }
      },
      {
        default: () => [],
        watch: [ctx.slug]
      }
    )

    return {
      items: data,
      pending,
      error,
      refresh
    }
  }

  const useRecommendationsSection = () => {
    const { $playerAPI } = useNuxtApp()
    const cacheKey = `viewed-user-profile:recommendations:${ctx.slug.value}`

    const { data, pending, error, refresh } = useAsyncData<RecommendationPresenter[]>(
      cacheKey,
      async () => {
        if (!ctx.slug.value) return []
        try {
          const response = await $playerAPI.recommendations.received(ctx.slug.value)
          return response.data
        } catch (err) {
          if ((err as { statusCode?: unknown }).statusCode === 404) return []
          throw err
        }
      },
      {
        default: () => [],
        watch: [ctx.slug]
      }
    )

    return {
      items: data,
      pending,
      error,
      refresh
    }
  }

  const useExperienceSection = (
    key: string,
    fetchItems: (slug: string) => Promise<{ data: Record<string, unknown>[] }>
  ) => {
    const cacheKey = `viewed-user-profile:${key}:${ctx.slug.value}`

    const { data, pending, error, refresh } = useAsyncData<Record<string, unknown>[]>(
      cacheKey,
      async () => {
        if (!ctx.slug.value) return []
        try {
          const response = await fetchItems(ctx.slug.value)
          return response.data
        } catch (err) {
          if ((err as { statusCode?: unknown }).statusCode === 404) return []
          throw err
        }
      },
      {
        default: () => [],
        watch: [ctx.slug]
      }
    )

    return {
      items: data,
      pending,
      error,
      refresh
    }
  }

  const useEsportExperienceSection = () => {
    const { $playerAPI } = useNuxtApp()
    const section = useExperienceSection('esport-experiences', slug => $playerAPI.esportExperiences.list(slug))

    const createEsportExperience = async (input: any) => {
      if (!slug.value || !section.items.value) return

      const response = await $playerAPI.esportExperiences.create(slug.value, input)
      section.items.value = [...section.items.value, response.data]
    }

    const updateEsportExperience = async (experienceId: string, input: any) => {
      if (!slug.value || !section.items.value) return

      const response = await $playerAPI.esportExperiences.patch(slug.value, experienceId, input)
      section.items.value = section.items.value.map(exp =>
        String(exp.id) === String(experienceId) ? response.data : exp
      )
    }

    return {
      ...section,
      createEsportExperience,
      updateEsportExperience
    }
  }

  const useEducationExperienceSection = () => {
    const { $playerAPI } = useNuxtApp()
    const section = useExperienceSection('education-experiences', slug => $playerAPI.educationExperiences.list(slug))

    const createEducationExperience = async (input: any) => {
      if (!slug.value || !section.items.value) return

      const response = await $playerAPI.educationExperiences.create(slug.value, input)
      section.items.value = [...section.items.value, response.data]
    }

    const updateEducationExperience = async (experienceId: string, input: any) => {
      if (!slug.value || !section.items.value) return

      const response = await $playerAPI.educationExperiences.patch(slug.value, experienceId, input)
      section.items.value = section.items.value.map(exp =>
        String(exp.id) === String(experienceId) ? response.data : exp
      )
    }

    return {
      ...section,
      createEducationExperience,
      updateEducationExperience
    }
  }

  const useProfessionalExperienceSection = () => {
    const { $playerAPI } = useNuxtApp()
    const section = useExperienceSection('professional-experiences', slug => $playerAPI.professionalExperiences.list(slug))

    const createProfessionalExperience = async (input: any) => {
      if (!slug.value || !section.items.value) return

      const response = await $playerAPI.professionalExperiences.create(slug.value, input)
      section.items.value = [...section.items.value, response.data]
    }

    const updateProfessionalExperience = async (experienceId: string, input: any) => {
      if (!slug.value || !section.items.value) return

      const response = await $playerAPI.professionalExperiences.patch(slug.value, experienceId, input)
      section.items.value = section.items.value.map(exp =>
        String(exp.id) === String(experienceId) ? response.data : exp
      )
    }

    return {
      ...section,
      createProfessionalExperience,
      updateProfessionalExperience
    }
  }

  return {
    profile: ctx.profile,
    slug: ctx.slug,
    canEdit: ctx.canEdit,
    pending: ctx.pending,
    error: ctx.error,
    refresh: ctx.refresh,
    updateProfile: ctx.updateProfile,
    updatePlayerProfile: ctx.updatePlayerProfile,
    isOwner: ctx.isOwner,
    useGameSection,
    useStaffSection,
    useRecommendationsSection,
    useEsportExperienceSection,
    useEducationExperienceSection,
    useProfessionalExperienceSection
  }
}
