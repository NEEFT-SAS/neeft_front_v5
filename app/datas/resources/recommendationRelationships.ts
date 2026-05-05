export type RecommendationRelationshipValue = 'teammate' | 'coach' | 'recruiter' | 'manager' | 'partner' | 'staff'

export type RecommendationRelationshipOption = {
  i18nLabel: 'coequipier' | 'coach' | 'recruteur' | 'manager' | 'partenaire' | 'staff'
  value: RecommendationRelationshipValue
}

export const recommendationRelationshipOptions = [
  { i18nLabel: 'coequipier', value: 'teammate' },
  { i18nLabel: 'coach', value: 'coach' },
  { i18nLabel: 'recruteur', value: 'recruiter' },
  { i18nLabel: 'manager', value: 'manager' },
  { i18nLabel: 'partenaire', value: 'partner' },
  { i18nLabel: 'staff', value: 'staff' }
] as const satisfies readonly RecommendationRelationshipOption[]
