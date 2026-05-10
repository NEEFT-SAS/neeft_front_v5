import type {
  CreatePlayerEducationExperienceDTO,
  CreatePlayerExperienceDTO,
  CreatePlayerGameDTO,
  CreatePlayerProfessionalExperienceDTO,
  CreatePlayerRecommendationDTO,
  CreatePlayerReportDTO,
  CreatePlayerStaffRoleDTO,
  PlayerAvailabilityPresenter,
  PlayerBadgePresenter,
  PlayerEducationExperiencePresenter,
  PlayerExperiencePresenter,
  PlayerProfilePresenter,
  PlayerProfessionalExperiencePresenter,
  PlayerSocialLinkPresenter,
  PlayerSocialLinkToUpdateDTO,
  PlayerStaffRolePresenter,
  UpdatePlayerAvailabilitiesDTO,
  UpdatePlayerEducationExperienceDTO,
  UpdatePlayerExperienceDTO,
  UpdatePlayerGameDTO,
  UpdatePlayerProfessionalExperienceDTO,
  UpdatePlayerProfileDTO,
  UpdatePlayerStaffRoleDTO
} from '@neeft-sas/shared'
import { createAuthenticatedApi } from '~/utils/createAuthenticatedApi'

type APIResponse<TData> = {
  data: TData
  meta?: Record<string, unknown>
}

type FollowActionPayload = {
  followerType: 'PLAYER' | 'TEAM'
  followerSlug?: string
}

type FollowStatusResponse = {
  isFollowingAsPlayer: boolean
  isFriend: boolean
  followingAsTeams: Array<{ teamSlug: string }>
}

const withData = async <TData>(request: Promise<TData>): Promise<APIResponse<TData>> => {
  return { data: await request }
}

export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
  const api = createAuthenticatedApi(apiBaseUrl, auth.token)

  const getPlayerBySlug = async (slug: string) => {
    return await api<PlayerProfilePresenter>(`/players/${encodeURIComponent(slug)}`, { cache: 'no-store' })
  }

  const playerAPI = {
    getPlayerBySlug,

    reportUser: async (input: CreatePlayerReportDTO & { slug: string }) => {
      return await withData(api<unknown>(
        `/players/${encodeURIComponent(input.slug)}/report`,
        {
          method: 'POST',
          body: input,
          cache: 'no-store'
        }
      ))
    },

    followPlayer: async (slug: string, payload: FollowActionPayload) => {
      return await api(`/players/${encodeURIComponent(slug)}/follow`, {
        method: 'POST',
        body: payload,
        cache: 'no-store'
      })
    },

    unfollowPlayer: async (slug: string, payload: FollowActionPayload) => {
      return await api(`/players/${encodeURIComponent(slug)}/follow`, {
        method: 'DELETE',
        body: payload,
        cache: 'no-store'
      })
    },

    getPlayerFollowStatus: async (slug: string) => {
      return await api<FollowStatusResponse>(`/players/${encodeURIComponent(slug)}/follow-status`, {
        method: 'GET',
        cache: 'no-store'
      })
    },

    profile: {
      get: async (slug: string) => {
        return await withData(api<PlayerProfilePresenter>(`/players/${encodeURIComponent(slug)}`, { cache: 'no-store' }))
      },
      update: async (slug: string, input: UpdatePlayerProfileDTO) => {
        return await withData(api<PlayerProfilePresenter>(
          `/players/${encodeURIComponent(slug)}`,
          {
            method: 'PATCH',
            body: input,
            cache: 'no-store'
          }
        ))
      }
    },

    games: {
      list: async <TItem = Record<string, unknown>>(slug: string) => {
        return await withData(api<TItem[]>(`/players/${encodeURIComponent(slug)}/games`, { cache: 'no-store' }))
      },
      get: async <TItem = Record<string, unknown>>(slug: string, gameId: string | number) => {
        return await withData(api<TItem>(
          `/players/${encodeURIComponent(slug)}/games/${encodeURIComponent(String(gameId))}`,
          { cache: 'no-store' }
        ))
      },
      create: async <TItem = Record<string, unknown>>(slug: string, input: CreatePlayerGameDTO) => {
        return await withData(api<TItem>(
          `/players/${encodeURIComponent(slug)}/games`,
          {
            method: 'POST',
            body: input,
            cache: 'no-store'
          }
        ))
      },
      patch: async <TItem = Record<string, unknown>>(slug: string, gameId: string | number, input: UpdatePlayerGameDTO) => {
        return await withData(api<TItem>(
          `/players/${encodeURIComponent(slug)}/games/${encodeURIComponent(String(gameId))}`,
          {
            method: 'PATCH',
            body: input,
            cache: 'no-store'
          }
        ))
      },
      delete: async (slug: string, gameId: string | number) => {
        return await withData(api<{ deleted: boolean }>(
          `/players/${encodeURIComponent(slug)}/games/${encodeURIComponent(String(gameId))}`,
          {
            method: 'DELETE',
            cache: 'no-store'
          }
        ))
      }
    },

    staffs: {
      list: async <TItem = PlayerStaffRolePresenter>(slug: string) => {
        return await withData(api<TItem[]>(`/players/${encodeURIComponent(slug)}/staff-roles`, { cache: 'no-store' }))
      },
      get: async <TItem = PlayerStaffRolePresenter>(slug: string, roleId: string) => {
        return await withData(api<TItem>(
          `/players/${encodeURIComponent(slug)}/staff-roles/${encodeURIComponent(roleId)}`,
          { cache: 'no-store' }
        ))
      },
      create: async <TItem = PlayerStaffRolePresenter>(slug: string, input: CreatePlayerStaffRoleDTO) => {
        return await withData(api<TItem>(
          `/players/${encodeURIComponent(slug)}/staff-roles`,
          {
            method: 'POST',
            body: input,
            cache: 'no-store'
          }
        ))
      },
      patch: async <TItem = PlayerStaffRolePresenter>(slug: string, roleId: string, input: UpdatePlayerStaffRoleDTO) => {
        return await withData(api<TItem>(
          `/players/${encodeURIComponent(slug)}/staff-roles/${encodeURIComponent(roleId)}`,
          {
            method: 'PATCH',
            body: input,
            cache: 'no-store'
          }
        ))
      },
      delete: async (slug: string, roleId: string) => {
        return await withData(api<{ deleted: boolean }>(
          `/players/${encodeURIComponent(slug)}/staff-roles/${encodeURIComponent(roleId)}`,
          {
            method: 'DELETE',
            cache: 'no-store'
          }
        ))
      }
    },

    esportExperiences: {
      list: async (slug: string) => {
        return await withData(api<PlayerExperiencePresenter[]>(`/players/${encodeURIComponent(slug)}/esport-experiences`, { cache: 'no-store' }))
      },
      get: async (slug: string, experienceId: string) => {
        return await withData(api<PlayerExperiencePresenter>(
          `/players/${encodeURIComponent(slug)}/esport-experiences/${encodeURIComponent(experienceId)}`,
          { cache: 'no-store' }
        ))
      },
      create: async (slug: string, input: CreatePlayerExperienceDTO) => {
        return await withData(api<PlayerExperiencePresenter>(
          `/players/${encodeURIComponent(slug)}/esport-experiences`,
          {
            method: 'POST',
            body: input,
            cache: 'no-store'
          }
        ))
      },
      patch: async (slug: string, experienceId: string, input: UpdatePlayerExperienceDTO) => {
        return await withData(api<PlayerExperiencePresenter>(
          `/players/${encodeURIComponent(slug)}/esport-experiences/${encodeURIComponent(experienceId)}`,
          {
            method: 'PATCH',
            body: input,
            cache: 'no-store'
          }
        ))
      },
      delete: async (slug: string, experienceId: string) => {
        return await withData(api<unknown>(
          `/players/${encodeURIComponent(slug)}/esport-experiences/${encodeURIComponent(experienceId)}`,
          {
            method: 'DELETE',
            cache: 'no-store'
          }
        ))
      }
    },

    educationExperiences: {
      list: async (slug: string) => {
        return await withData(api<PlayerEducationExperiencePresenter[]>(`/players/${encodeURIComponent(slug)}/education-experiences`, { cache: 'no-store' }))
      },
      get: async (slug: string, experienceId: string) => {
        return await withData(api<PlayerEducationExperiencePresenter>(
          `/players/${encodeURIComponent(slug)}/education-experiences/${encodeURIComponent(experienceId)}`,
          { cache: 'no-store' }
        ))
      },
      create: async (slug: string, input: CreatePlayerEducationExperienceDTO) => {
        return await withData(api<PlayerEducationExperiencePresenter>(
          `/players/${encodeURIComponent(slug)}/education-experiences`,
          {
            method: 'POST',
            body: input,
            cache: 'no-store'
          }
        ))
      },
      patch: async (slug: string, experienceId: string, input: UpdatePlayerEducationExperienceDTO) => {
        return await withData(api<PlayerEducationExperiencePresenter>(
          `/players/${encodeURIComponent(slug)}/education-experiences/${encodeURIComponent(experienceId)}`,
          {
            method: 'PATCH',
            body: input,
            cache: 'no-store'
          }
        ))
      },
      delete: async (slug: string, experienceId: string) => {
        return await withData(api<unknown>(
          `/players/${encodeURIComponent(slug)}/education-experiences/${encodeURIComponent(experienceId)}`,
          {
            method: 'DELETE',
            cache: 'no-store'
          }
        ))
      }
    },

    professionalExperiences: {
      list: async (slug: string) => {
        return await withData(api<PlayerProfessionalExperiencePresenter[]>(`/players/${encodeURIComponent(slug)}/professional-experiences`, { cache: 'no-store' }))
      },
      get: async (slug: string, experienceId: string) => {
        return await withData(api<PlayerProfessionalExperiencePresenter>(
          `/players/${encodeURIComponent(slug)}/professional-experiences/${encodeURIComponent(experienceId)}`,
          { cache: 'no-store' }
        ))
      },
      create: async (slug: string, input: CreatePlayerProfessionalExperienceDTO) => {
        return await withData(api<PlayerProfessionalExperiencePresenter>(
          `/players/${encodeURIComponent(slug)}/professional-experiences`,
          {
            method: 'POST',
            body: input,
            cache: 'no-store'
          }
        ))
      },
      patch: async (slug: string, experienceId: string, input: UpdatePlayerProfessionalExperienceDTO) => {
        return await withData(api<PlayerProfessionalExperiencePresenter>(
          `/players/${encodeURIComponent(slug)}/professional-experiences/${encodeURIComponent(experienceId)}`,
          {
            method: 'PATCH',
            body: input,
            cache: 'no-store'
          }
        ))
      },
      delete: async (slug: string, experienceId: string) => {
        return await withData(api<unknown>(
          `/players/${encodeURIComponent(slug)}/professional-experiences/${encodeURIComponent(experienceId)}`,
          {
            method: 'DELETE',
            cache: 'no-store'
          }
        ))
      }
    },

    badges: {
      list: async <TItem = PlayerBadgePresenter>(slug: string) => {
        return await withData(api<TItem[]>(`/players/${encodeURIComponent(slug)}/badges`, { cache: 'no-store' }))
      }
    },

    socials: {
      list: async (slug: string) => {
        return await withData(api<PlayerSocialLinkPresenter[]>(`/players/${encodeURIComponent(slug)}/socials`, { cache: 'no-store' }))
      },
      replace: async (slug: string, input: { links: PlayerSocialLinkToUpdateDTO[] }) => {
        return await withData(api<PlayerSocialLinkPresenter[]>(
          `/players/${encodeURIComponent(slug)}/socials`,
          {
            method: 'PATCH',
            body: { links: input.links },
            cache: 'no-store'
          }
        ))
      }
    },

    availabilities: {
      list: async (slug: string) => {
        return await withData(api<PlayerAvailabilityPresenter[]>(`/players/${encodeURIComponent(slug)}/availabilities`, { cache: 'no-store' }))
      },
      replace: async (slug: string, input: UpdatePlayerAvailabilitiesDTO) => {
        return await withData(api<PlayerAvailabilityPresenter[]>(
          `/players/${encodeURIComponent(slug)}/availabilities`,
          {
            method: 'PATCH',
            body: input,
            cache: 'no-store'
          }
        ))
      }
    },

    recommendations: {
      received: async <TItem = Record<string, unknown>>(slug: string) => {
        return await withData(api<TItem[]>(`/players/${encodeURIComponent(slug)}/recommendations/received`, { cache: 'no-store' }))
      },
      given: async <TItem = Record<string, unknown>>(slug: string) => {
        return await withData(api<TItem[]>(`/players/${encodeURIComponent(slug)}/recommendations/given`, { cache: 'no-store' }))
      },
      create: async <TOutput = unknown>(slug: string, input: CreatePlayerRecommendationDTO | Record<string, unknown>) => {
        return await withData(api<TOutput>(
          `/players/${encodeURIComponent(slug)}/recommendations`,
          {
            method: 'POST',
            body: input,
            cache: 'no-store'
          }
        ))
      },
      request: async <TOutput = unknown>(slug: string, input: Record<string, unknown>) => {
        try {
          return await withData(api<TOutput>(
            `/players/${encodeURIComponent(slug)}/recommendations/requests`,
            {
              method: 'POST',
              body: input,
              cache: 'no-store'
            }
          ))
        } catch (error) {
          const statusCode = Number((error as { statusCode?: unknown }).statusCode ?? 0)
          if (statusCode !== 404) throw error

          return await withData(api<TOutput>(
            `/players/${encodeURIComponent(slug)}/recommendations/request`,
            {
              method: 'POST',
              body: input,
              cache: 'no-store'
            }
          ))
        }
      }
    }
  }

  return {
    provide: {
      playerAPI
    }
  }
})
