import type {
  RscGameCharacterPresenter,
  RscGameModePresenter,
  RscGamePlatformPresenter,
  RscGamePositionPresenter,
  RscGamePresenter,
  RscGameRankPresenter
} from '@neeft-sas/shared'

type RefValue<T> = { value: T }
type GameIdSource = number | string | null | undefined | RefValue<unknown> | (() => unknown)
type SelectionOption = { id: number, label: string, icon?: string }
type RscGameWithResources = RscGamePresenter & {
  rscGamePlatforms?: RscGamePlatformPresenter[]
  rscGamePositions?: RscGamePositionPresenter[]
  rscGameCharacters?: RscGameCharacterPresenter[]
  rscGameModes?: RscGameModePresenter[]
  rscGameRanks?: RscGameRankPresenter[]
}

const readGameIdSource = (source: GameIdSource) => {
  if (typeof source === 'function') return source()
  if (source && typeof source === 'object' && 'value' in source) return source.value
  return source
}

const readGameId = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value

  const parsed = Number(String(value ?? ''))
  return Number.isFinite(parsed) ? parsed : null
}

const sortGames = (games: RscGamePresenter[]) => {
  return [...games].sort((a, b) => String(a.name ?? '').localeCompare(String(b.name ?? '')))
}

const toSelectionOptions = <TResource extends { id: number, name?: string | null, icon?: string | null }>(items: TResource[]) => {
  return items.reduce<SelectionOption[]>((result, item) => {
    const label = String(item.name ?? '')
    if (!label) return result

    result.push({
      id: item.id,
      label,
      icon: item.icon ?? undefined
    })

    return result
  }, [])
}

const sortGameResourceItems = <TResource extends { name?: string, order?: number }>(items: TResource[]) => {
  return [...items].sort((a, b) => {
    const leftOrder = Number(a.order ?? 0)
    const rightOrder = Number(b.order ?? 0)

    if (leftOrder !== rightOrder) return leftOrder - rightOrder
    return String(a.name ?? '').localeCompare(String(b.name ?? ''))
  })
}

const readGameResourceItems = <TResource extends { id: number, name?: string, order?: number }>(items: TResource[] | undefined) => {
  if (!Array.isArray(items)) return [] as TResource[]
  return sortGameResourceItems(items)
}

export function useGameResources(gameIdSource: GameIdSource) {
  const resourcesStore = useResourcesStore()

  const gameId = computed(() => {
    return readGameId(readGameIdSource(gameIdSource))
  })

  const games = computed(() => {
    return sortGames(resourcesStore.resources.rscGames ?? [])
  })

  const gameOptions = computed(() => {
    return toSelectionOptions(games.value)
  })

  const game = computed<RscGamePresenter | null>(() => {
    if (gameId.value === null) return null
    return (resourcesStore.resources.rscGames ?? []).find(item => item.id === gameId.value) ?? null
  })

  const platforms = computed<RscGamePlatformPresenter[]>(() => {
    return readGameResourceItems((game.value as RscGameWithResources | null)?.rscGamePlatforms)
  })

  const platformOptions = computed(() => {
    return toSelectionOptions(platforms.value)
  })

  const positions = computed<RscGamePositionPresenter[]>(() => {
    return readGameResourceItems((game.value as RscGameWithResources | null)?.rscGamePositions)
  })

  const positionOptions = computed(() => {
    return toSelectionOptions(positions.value)
  })

  const characters = computed<RscGameCharacterPresenter[]>(() => {
    return readGameResourceItems((game.value as RscGameWithResources | null)?.rscGameCharacters)
  })

  const characterOptions = computed(() => {
    return toSelectionOptions(characters.value)
  })

  const modes = computed<RscGameModePresenter[]>(() => {
    return readGameResourceItems((game.value as RscGameWithResources | null)?.rscGameModes)
  })

  const modeOptions = computed(() => {
    return toSelectionOptions(modes.value)
  })

  const ranks = computed<RscGameRankPresenter[]>(() => {
    return readGameResourceItems((game.value as RscGameWithResources | null)?.rscGameRanks)
  })

  const rankOptions = computed(() => {
    return toSelectionOptions(ranks.value)
  })

  const loading = computed(() => resourcesStore.loading)
  const loaded = computed(() => resourcesStore.loaded)
  const error = computed(() => resourcesStore.lastError)

  return {
    gameId,
    games,
    gameOptions,
    game,
    platforms,
    platformOptions,
    positions,
    positionOptions,
    characters,
    characterOptions,
    modes,
    modeOptions,
    ranks,
    rankOptions,
    loading,
    loaded,
    error,
    bootstrap: resourcesStore.bootstrap
  }
}
