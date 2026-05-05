import { playerSearchSchema } from './entities/players'
import { staffSearchSchema } from './entities/staffs'
import { teamSearchSchema } from './entities/teams'
import { searchGameCapabilities } from './games/capabilities'
import type { ComposedSearchSchema, SearchEntityKind, SearchEntitySchema, SearchFilterCapability, SearchFilterDefinition, SearchGameId } from './types'

const entitySchemas: Record<SearchEntityKind, SearchEntitySchema> = {
  players: playerSearchSchema,
  staffs: staffSearchSchema,
  teams: teamSearchSchema
}

const getCapabilityOptions = (game: SearchGameId | null, capability: SearchFilterCapability) => {
  if (!game) return []
  return searchGameCapabilities[game]?.[capability] || []
}

const hasCapability = (game: SearchGameId | null, capability: SearchFilterCapability) => {
  return getCapabilityOptions(game, capability).length > 0
}

const composeFilter = (filter: SearchFilterDefinition, selectedGame: SearchGameId | null): SearchFilterDefinition | null => {
  if (filter.capability && !hasCapability(selectedGame, filter.capability)) return null

  if ('optionsCapability' in filter && filter.optionsCapability) {
    const options = getCapabilityOptions(selectedGame, filter.optionsCapability)
    if (!options.length) return null

    return {
      ...filter,
      options
    }
  }

  return filter
}

export const composeSearchSchema = (entity: SearchEntityKind, selectedGame: SearchGameId | null = null): ComposedSearchSchema => {
  const schema = entitySchemas[entity]

  return {
    entity,
    selectedGame,
    filters: schema.filters
      .map(filter => composeFilter(filter, selectedGame))
      .filter((filter): filter is SearchFilterDefinition => filter !== null)
  }
}
