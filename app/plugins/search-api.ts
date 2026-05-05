import type {
  RscGameCharacterPresenter,
  RscGamePlatformPresenter,
  RscGamePositionPresenter,
  RscGamePresenter,
  RscGameRankPresenter,
  SearchPlayersPresenter,
  SearchPlayersQueryDto,
  SearchTeamsPresenter,
  SearchTeamsQueryDto
} from '@neeft-sas/shared'
import { toInt } from '@neeft-sas/shared'
import { createAuthenticatedApi } from '~/utils/createAuthenticatedApi'

export type SearchApi = {
  searchPlayers: (query: SearchPlayersQueryDto) => Promise<SearchPlayersPresenter>
  searchTeams: (query: SearchTeamsQueryDto) => Promise<SearchTeamsPresenter>
}

const toBoundedInt = (
  value: unknown,
  fallback: number,
  options: { min: number, max?: number }
) => {
  const intValue = Math.trunc(toInt(value, fallback))
  if (intValue < options.min) return fallback
  if (typeof options.max === 'number' && intValue > options.max) return fallback
  return intValue
}

const getQueryList = <TValue>(values: TValue[] | undefined) => {
  return values?.length ? values : undefined
}

export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
  const api = createAuthenticatedApi(apiBaseUrl, auth.token, { unwrapData: false })

  const searchPlayers = async (query: SearchPlayersQueryDto) => {
    const page = toBoundedInt(query.page, 1, { min: 1 })
    const perPage = toBoundedInt(query.perPage, 20, { min: 1, max: 50 })

    return await api<SearchPlayersPresenter>('/search/players', {
      method: 'GET',
      query: {
        q: query.q || undefined,
        page,
        perPage,
        nationalityId: query.nationalityId || undefined,
        languageIds: getQueryList(query.languageIds),
        badgeIds: getQueryList(query.badgeIds),
        hasProfilePicture: query.hasProfilePicture,
        hasSocialLinks: query.hasSocialLinks,
        minExperienceCount: query.minExperienceCount,
        minProfileScore: query.minProfileScore,
        gameId: query.gameId,
        ageMin: query.ageMin,
        ageMax: query.ageMax,
        modeId: query.modeId,
        rankMin: query.rankMin,
        rankMax: query.rankMax,
        eloMin: query.eloMin,
        eloMax: query.eloMax,
        recruitable: query.recruitable,
        positionIds: getQueryList(query.positionIds),
        platformIds: getQueryList(query.platformIds),
        characterIds: getQueryList(query.characterIds)
      },
      cache: 'no-store'
    })
  }

  const searchTeams = async (query: SearchTeamsQueryDto) => {
    const page = toBoundedInt(query.page, 1, { min: 1 })
    const perPage = toBoundedInt(query.perPage, 20, { min: 1, max: 50 })

    return await api<SearchTeamsPresenter>('/search/teams', {
      method: 'GET',
      query: {
        q: query.q || undefined,
        page,
        perPage,
        countryId: query.countryId || undefined,
        languageIds: getQueryList(query.languageIds),
        gameId: query.gameId,
        teamStatus: query.teamStatus
      },
      cache: 'no-store'
    })
  }

  return {
    provide: {
      searchAPI: {
        searchPlayers,
        searchTeams
      } satisfies SearchApi
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $searchAPI: SearchApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $searchAPI: SearchApi
  }
}
