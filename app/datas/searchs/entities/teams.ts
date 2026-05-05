import type { SearchEntitySchema } from '../types'
import { searchCountryOptions, searchLanguageOptions } from '../filters/options'
import { searchGameOptions } from '../games/capabilities'

const searchTeamStatusOptions = [
  { label: 'Recrute', value: 'open', icon: 'lucide:users' },
  { label: 'Complet', value: 'full', icon: 'lucide:shield-x' }
]

export const teamSearchSchema: SearchEntitySchema = {
  entity: 'teams',
  filters: [
    {
      key: 'query',
      type: 'text',
      label: 'Equipe',
      field: 'query',
      icon: 'lucide:search',
      placeholder: 'Nom, jeu, besoin'
    },
    {
      key: 'games',
      type: 'singleFacet',
      label: 'Jeu',
      field: 'game',
      icon: 'lucide:gamepad-2',
      options: searchGameOptions
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
      key: 'teamStatus',
      type: 'singleFacet',
      label: 'Statut',
      field: 'teamStatus',
      icon: 'lucide:shield',
      options: searchTeamStatusOptions
    }
  ]
}
