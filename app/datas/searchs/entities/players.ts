import type { SearchEntitySchema } from '../types'
import { searchAgeOptions, searchCountryOptions, searchLanguageOptions } from '../filters/options'
import { searchGameOptions } from '../games/capabilities'

export const playerSearchSchema: SearchEntitySchema = {
  entity: 'players',
  filters: [
    {
      key: 'pseudo',
      type: 'text',
      label: 'Pseudo',
      field: 'pseudo',
      icon: 'lucide:search',
      placeholder: 'Pseudo'
    },
    {
      key: 'age',
      type: 'range',
      label: 'Age',
      field: 'age',
      icon: 'lucide:calendar-days',
      minLabel: 'Age minimum',
      maxLabel: 'Age maximum',
      minPlaceholder: 'Min',
      maxPlaceholder: 'Max',
      options: searchAgeOptions
    },
    {
      key: 'countries',
      type: 'multiFacet',
      label: 'Pays',
      field: 'country',
      icon: 'lucide:flag',
      options: searchCountryOptions,
      searchable: true
    },
    {
      key: 'languages',
      type: 'multiFacet',
      label: 'Langues',
      field: 'languages',
      icon: 'lucide:messages-square',
      options: searchLanguageOptions
    },
    {
      key: 'games',
      type: 'singleFacet',
      label: 'Jeu principal',
      field: 'mainGame',
      icon: 'lucide:gamepad-2',
      options: searchGameOptions
    },
    {
      key: 'platforms',
      type: 'multiFacet',
      label: 'Plateformes du jeu',
      field: 'platforms',
      icon: 'lucide:monitor-smartphone',
      capability: 'platforms',
      optionsCapability: 'platforms'
    },
    {
      key: 'modes',
      type: 'multiFacet',
      label: 'Mode de jeu',
      field: 'gameMode',
      icon: 'lucide:list',
      capability: 'modes',
      optionsCapability: 'modes'
    },
    {
      key: 'ranks',
      type: 'range',
      label: 'Rang',
      field: 'rankOrder',
      icon: 'lucide:trophy',
      capability: 'ranks',
      optionsCapability: 'ranks',
      minLabel: 'Rang minimum',
      maxLabel: 'Rang maximum',
      minPlaceholder: 'Min',
      maxPlaceholder: 'Max'
    },
    {
      key: 'elo',
      type: 'range',
      label: 'Elo',
      field: 'elo',
      icon: 'lucide:trending-up',
      capability: 'elo',
      optionsCapability: 'elo',
      minLabel: 'Elo minimum',
      maxLabel: 'Elo maximum',
      minPlaceholder: 'Min',
      maxPlaceholder: 'Max'
    },
    {
      key: 'positions',
      type: 'multiFacet',
      label: 'Positions en jeu',
      field: 'positions',
      icon: 'lucide:crosshair',
      capability: 'positions',
      optionsCapability: 'positions'
    },
    {
      key: 'recruitable',
      type: 'boolean',
      label: 'Recrutable',
      field: 'recruitable',
      icon: 'lucide:shield-plus',
      optionLabel: 'Recrutable uniquement',
      trueValue: 'true'
    }
  ]
}
