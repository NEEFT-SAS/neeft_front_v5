export const landingHeaderNav = [
  { to: '/players', labelKey: 'landing.layout.header.navigation.players' },
  { to: '/teams', labelKey: 'landing.layout.header.navigation.teams' },
  { to: '/recruitment', labelKey: 'landing.layout.header.navigation.recruitment' },
  { to: '/staff', labelKey: 'landing.layout.header.navigation.staff' },
  { to: '/maps/teams', labelKey: 'landing.layout.header.navigation.map' },
  { to: '/premium', labelKey: 'landing.layout.header.navigation.pricing' }
] as const

export const landingHeaderActions = [
  { to: '/app', labelKey: 'landing.layout.header.actions.openApp', variant: 'outlined' as const, color: 'primary' as const },
  { to: '/login', labelKey: 'landing.layout.header.actions.login', variant: 'filled' as const, color: 'secondary' as const }
] as const
