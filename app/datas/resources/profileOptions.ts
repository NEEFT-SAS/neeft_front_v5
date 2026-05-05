export type ProfileOption<TValue extends string | boolean = string> = {
  value: TValue
  label: string
}

export const profileYesNoOptions: ProfileOption<boolean>[] = [
  { value: true, label: 'Oui' },
  { value: false, label: 'Non' }
]

export const profileGenderOptions: ProfileOption[] = [
  { value: 'MAN', label: 'Homme' },
  { value: 'WOMAN', label: 'Femme' },
  { value: 'OTHER', label: 'Autre' }
]

export const profileWorkSectorOptions: ProfileOption[] = [
  { value: 'information_technology', label: 'Informatique' },
  { value: 'video_games', label: 'Jeu video' },
  { value: 'e_sport', label: 'Esport' },
  { value: 'graphic_design', label: 'Design graphique' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Sante' },
  { value: 'finance', label: 'Finance' },
  { value: 'entertainment', label: 'Divertissement' },
  { value: 'sports', label: 'Sport' },
  { value: 'music', label: 'Musique' },
  { value: 'film_and_tv', label: 'Film et TV' },
  { value: 'literature', label: 'Litterature' },
  { value: 'travel_and_tourism', label: 'Voyage et tourisme' },
  { value: 'food_and_beverage', label: 'Restauration' },
  { value: 'fashion_and_beauty', label: 'Mode et beaute' },
  { value: 'automotive', label: 'Automobile' },
  { value: 'real_estate', label: 'Immobilier' },
  { value: 'environment_and_sustainability', label: 'Environnement' },
  { value: 'other', label: 'Autre' }
]

export const profileContractTypeOptions: ProfileOption[] = [
  { value: 'full_time', label: 'CDI' },
  { value: 'part_time', label: 'CDD' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Stage' },
  { value: 'apprenticeship', label: 'Alternance' },
  { value: 'temporary', label: 'Interim' },
  { value: 'unpaid', label: 'Benevolat' },
  { value: 'ceo', label: 'Dirigeant' },
  { value: 'other', label: 'Autre' }
]
