import type { CreateTeamDTO, TeamPresenter, TeamPrivateProfilePresenter, UpdateTeamDTO, UserTeamPresenter } from '@neeft-sas/shared'
import { createAuthenticatedApi } from '~/utils/createAuthenticatedApi'

type APIResponse<TData> = {
  data: TData
  meta?: Record<string, unknown>
}

export type TeamApi = {
  getTeamBySlug: (slug: string) => Promise<TeamPresenter>
  getTeamPrivateProfile: (slug: string) => Promise<TeamPrivateProfilePresenter>
  profile: {
    get: (slug: string) => Promise<APIResponse<TeamPresenter>>
    update: (teamId: string, input: UpdateTeamDTO) => Promise<APIResponse<TeamPresenter>>
  }
  getMyTeams: () => Promise<UserTeamPresenter[]>
  createTeam: (input: CreateTeamDTO) => Promise<UserTeamPresenter>
}

const withData = async <TData>(request: Promise<TData>): Promise<APIResponse<TData>> => {
  return { data: await request }
}

export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
  const api = createAuthenticatedApi(apiBaseUrl, auth.token)

  const teamAPI: TeamApi = {
    getTeamBySlug: async (slug: string) => {
      return await api<TeamPresenter>(`/teams/${encodeURIComponent(slug)}`, { cache: 'no-store' })
    },

    getTeamPrivateProfile: async (slug: string) => {
      return await api<TeamPrivateProfilePresenter>(`/teams/${encodeURIComponent(slug)}/private`, {
        method: 'GET',
        cache: 'no-store'
      })
    },

    profile: {
      get: async (slug: string) => {
        return await withData(api<TeamPresenter>(`/teams/${encodeURIComponent(slug)}`, { cache: 'no-store' }))
      },
      update: async (teamId: string, input: UpdateTeamDTO) => {
        return await withData(api<TeamPresenter>(
          `/teams/${encodeURIComponent(teamId)}`,
          {
            method: 'PATCH',
            body: input,
            cache: 'no-store'
          }
        ))
      }
    },

    getMyTeams: async () => {
      return await api<UserTeamPresenter[]>('/teams/me', {
        method: 'GET',
        cache: 'no-store'
      })
    },

    createTeam: async (input: CreateTeamDTO) => {
      return await api<UserTeamPresenter>('/teams', {
        method: 'POST',
        body: input,
        cache: 'no-store'
      })
    }
  }

  return {
    provide: {
      teamAPI
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $teamAPI: TeamApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $teamAPI: TeamApi
  }
}
