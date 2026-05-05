import type { SearchEntitySchema } from '../types'
import { searchAvailabilityOptions, searchCountryOptions, searchLanguageOptions, searchLevelOptions, searchStaffRoleOptions } from '../filters/options'
import { searchGameOptions } from '../games/capabilities'

export const staffSearchSchema: SearchEntitySchema = {
  entity: 'staffs',
  filters: [
    {
      key: 'query',
      type: 'text',
      label: 'Staff',
      field: 'query',
      icon: 'lucide:search',
      placeholder: 'Nom, jeu, specialite'
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
      key: 'roles',
      type: 'multiFacet',
      label: 'Role',
      field: 'role',
      icon: 'lucide:crosshair',
      options: searchStaffRoleOptions
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
      key: 'availability',
      type: 'multiFacet',
      label: 'Disponibilite',
      field: 'availability',
      icon: 'lucide:clock',
      options: searchAvailabilityOptions
    },
    {
      key: 'levels',
      type: 'multiFacet',
      label: 'Experience',
      field: 'level',
      icon: 'lucide:trophy',
      options: searchLevelOptions
    }
  ]
}
