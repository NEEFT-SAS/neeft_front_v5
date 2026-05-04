export const landingHeaderNav = [
  { to: '/players', label: 'Players' },
  { to: '/teams', label: 'Teams' },
  { to: '/recruitment', label: 'Recruitment' },
  { to: '/staff', label: 'Staff' },
  { to: '/maps/teams', label: 'Esport Map' },
  { to: '/premium', label: 'Pricing' }
] as const

export const landingHeaderActions = [
  { to: '/app', label: 'Open App', variant: 'outlined' as const, color: 'primary' as const },
  { to: '/login', label: 'Login', variant: 'filled' as const, color: 'secondary' as const }
] as const
