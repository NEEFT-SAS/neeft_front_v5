type AppLanguageResource = {
  code: string
  language: string
  label: string
  flagVariant: 'bands' | 'cross'
  flagColors: readonly string[]
  files: readonly string[]
}

export const appLanguages = [
  {
    code: 'fr',
    language: 'fr-FR',
    label: 'Francais',
    flagVariant: 'bands',
    flagColors: [
      'oklch(39% 0.143 263)',
      'oklch(98% 0.006 264)',
      'oklch(55% 0.212 27)'
    ],
    files: [
      'fr/global/common.json',
      'fr/global/resource.json',
      'fr/landing/layout.json',
      'fr/landing/home/home.json',
      'fr/landing/auth/auth.json',
      'fr/app/search/search.json',
      'fr/app/search/search-layout.json',
      'fr/app/search/search-filters.json',
      'fr/app/search/search-cards.json'
    ]
  },
  {
    code: 'en',
    language: 'en-US',
    label: 'English',
    flagVariant: 'cross',
    flagColors: [
      'oklch(98% 0.006 264)',
      'oklch(55% 0.212 27)'
    ],
    files: [
      'en/global/common.json',
      'en/global/resource.json',
      'en/landing/layout.json',
      'en/landing/home/home.json',
      'en/landing/auth/auth.json',
      'en/app/search/search.json',
      'en/app/search/search-layout.json',
      'en/app/search/search-filters.json',
      'en/app/search/search-cards.json'
    ]
  }
] as const satisfies readonly AppLanguageResource[]

export type AppLanguage = (typeof appLanguages)[number]
export type AppLanguageCode = AppLanguage['code']

export const defaultAppLanguageCode: AppLanguageCode = 'fr'
