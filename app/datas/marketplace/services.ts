export type MarketplaceServiceCategory = 'community' | 'coaching' | 'management' | 'creative' | 'growth' | 'analysis'

export type MarketplaceServiceOffer = {
  id: string
  title: string
  description: string
  price: number
}

export type MarketplaceServiceStep = {
  title: string
  description: string
}

export type MarketplaceServiceReview = {
  id: string
  author: string
  role: string
  rating: number
  date: string
  comment: string
}

export type MarketplaceService = {
  id?: string
  slug: string
  title: string
  category: MarketplaceServiceCategory
  categoryLabel: string
  icon: string
  provider: string
  providerRole: string
  games: string[]
  price: number
  billingLabel: string
  rating: number
  reviewCount: number
  reviews: MarketplaceServiceReview[]
  responseTime: string
  duration: string
  levelLabel: string
  shortDescription: string
  description: string[]
  coverImage: string
  galleryImages: string[]
  highlights: string[]
  deliverables: string[]
  process: MarketplaceServiceStep[]
  tags: string[]
  offers?: MarketplaceServiceOffer[]
}

export const marketplaceCategories = [
  { value: 'all', label: 'Tous les services', icon: 'lucide:layout-grid' },
  { value: 'community', label: 'Community', icon: 'lucide:messages-square' },
  { value: 'coaching', label: 'Coaching', icon: 'lucide:target' },
  { value: 'management', label: 'Management', icon: 'lucide:briefcase-business' },
  { value: 'creative', label: 'Creation', icon: 'lucide:clapperboard' },
  { value: 'growth', label: 'Croissance', icon: 'lucide:trending-up' },
  { value: 'analysis', label: 'Analyse', icon: 'lucide:chart-no-axes-combined' }
] as const

export type MarketplaceCategoryFilter = (typeof marketplaceCategories)[number]['value']

const marketplaceServiceReviews: Record<string, MarketplaceServiceReview[]> = {
  'community-manager-esport': [
    {
      id: 'community-manager-esport-review-1',
      author: 'Nina V.',
      role: 'Manager roster Valorant',
      rating: 5,
      date: '9 juin 2026',
      comment: 'Le calendrier est clair, les posts sortent au bon moment et le Discord est enfin suivi sans relance.'
    },
    {
      id: 'community-manager-esport-review-2',
      author: 'Owen R.',
      role: 'Fondateur club',
      rating: 5,
      date: '2 juin 2026',
      comment: 'Tres bon cadrage editorial. On garde une presence propre sans devoir micro-manager chaque publication.'
    }
  ],
  'coach-performance-competitive': [
    {
      id: 'coach-performance-competitive-review-1',
      author: 'Yanis M.',
      role: 'Joueur dueliste',
      rating: 5,
      date: '8 juin 2026',
      comment: 'Review directe, pas de blabla. Je suis reparti avec trois priorites simples a travailler en ranked.'
    },
    {
      id: 'coach-performance-competitive-review-2',
      author: 'Malo T.',
      role: 'IGL amateur',
      rating: 4,
      date: '31 mai 2026',
      comment: 'La session a rendu mes erreurs de placement beaucoup plus visibles. Le plan de travail est facile a suivre.'
    }
  ],
  'manager-equipe-tournois': [
    {
      id: 'manager-equipe-tournois-review-1',
      author: 'Lena P.',
      role: 'Team owner',
      rating: 5,
      date: '6 juin 2026',
      comment: 'On a gagne en rigueur sur les inscriptions et les disponibilites. Tout le monde sait quoi faire.'
    },
    {
      id: 'manager-equipe-tournois-review-2',
      author: 'Hugo R.',
      role: 'Coach Rocket League',
      rating: 4,
      date: '28 mai 2026',
      comment: 'Tres utile pour garder le planning propre pendant les semaines chargees de scrims et de tournois.'
    }
  ],
  'agent-manager-joueur': [
    {
      id: 'agent-manager-joueur-review-1',
      author: 'Alex B.',
      role: 'Joueur flex',
      rating: 5,
      date: '5 juin 2026',
      comment: 'Mon profil est devenu beaucoup plus lisible. Les messages de candidature font plus pro et plus courts.'
    },
    {
      id: 'agent-manager-joueur-review-2',
      author: 'Samir K.',
      role: 'Joueur LFT',
      rating: 4,
      date: '24 mai 2026',
      comment: 'Bon accompagnement pour cibler les bonnes equipes et eviter les candidatures trop generales.'
    }
  ],
  'montage-video-highlights': [
    {
      id: 'montage-video-highlights-review-1',
      author: 'Kenan D.',
      role: 'Joueur Valorant',
      rating: 5,
      date: '9 juin 2026',
      comment: 'Montage lisible, rythme propre et pas surcharge. Le rendu est exploitable directement pour recruteurs.'
    },
    {
      id: 'montage-video-highlights-review-2',
      author: 'Nora S.',
      role: 'Content lead',
      rating: 5,
      date: '1 juin 2026',
      comment: 'Les clips gardent la lecture du gameplay tout en etant assez dynamiques pour les reseaux.'
    }
  ],
  'partenariats-sponsoring-equipe': [
    {
      id: 'partenariats-sponsoring-equipe-review-1',
      author: 'Owen R.',
      role: 'Fondateur club',
      rating: 5,
      date: '7 juin 2026',
      comment: 'Le deck est plus clair et nos offres sont enfin faciles a presenter a un partenaire potentiel.'
    },
    {
      id: 'partenariats-sponsoring-equipe-review-2',
      author: 'Emma C.',
      role: 'Responsable structure',
      rating: 4,
      date: '26 mai 2026',
      comment: 'Bonne priorisation des prospects et des contreparties. On a une base commerciale plus credible.'
    }
  ],
  'analyste-data-matchs': [
    {
      id: 'analyste-data-matchs-review-1',
      author: 'Noah F.',
      role: 'Assistant coach',
      rating: 5,
      date: '4 juin 2026',
      comment: 'Le rapport fait ressortir les patterns recurrents sans noyer le staff dans les chiffres.'
    },
    {
      id: 'analyste-data-matchs-review-2',
      author: 'Elise G.',
      role: 'Coach collectif',
      rating: 4,
      date: '27 mai 2026',
      comment: 'Les axes d entrainement sont clairs et directement utilisables pour preparer les prochaines sessions.'
    }
  ]
}

export const marketplaceServices: MarketplaceService[] = [
  {
    slug: 'community-manager-esport',
    title: 'Community Manager esport',
    category: 'community',
    categoryLabel: 'Community',
    icon: 'lucide:messages-square',
    provider: 'Camille Moreau',
    providerRole: 'Community strategist',
    games: ['Valorant', 'League of Legends', 'Rocket League'],
    price: 490,
    billingLabel: 'par mois',
    rating: 4.9,
    reviewCount: 128,
    reviews: marketplaceServiceReviews['community-manager-esport'],
    responseTime: 'Reponse sous 2 h',
    duration: 'Engagement 30 jours',
    levelLabel: 'Equipe semi-pro et pro',
    shortDescription: 'Animation quotidienne, calendrier editorial et reporting pour faire vivre une communaute esport active.',
    description: [
      'Un accompagnement complet pour structurer la presence sociale de votre equipe, garder une ligne editoriale claire et transformer les temps forts en contenus utiles.',
      'Le service couvre la planification, la redaction, la moderation, les publications et un bilan lisible pour suivre la progression de la communaute.'
    ],
    coverImage: '/images/landing/home-crowd.jpg',
    galleryImages: ['/images/landing/home-crowd.jpg', '/images/landing/competition-arena.jpg', '/images/landing/home.png'],
    highlights: ['Calendrier editorial', 'Moderation Discord', 'Bilan hebdomadaire'],
    deliverables: ['Planning social mensuel', '12 publications optimisees', 'Moderation communaute', 'Reporting performance'],
    process: [
      { title: 'Audit', description: 'Analyse des canaux existants, de la cible et du rythme de publication actuel.' },
      { title: 'Cadence', description: 'Construction du calendrier editorial et validation des priorites de communication.' },
      { title: 'Execution', description: 'Publication, moderation et ajustements hebdomadaires selon les reactions de la communaute.' }
    ],
    tags: ['Discord', 'X', 'Instagram', 'Planning']
  },
  {
    slug: 'coach-performance-competitive',
    title: 'Coach performance competitive',
    category: 'coaching',
    categoryLabel: 'Coaching',
    icon: 'lucide:target',
    provider: 'Noe Lambert',
    providerRole: 'Coach performance',
    games: ['Valorant'],
    price: 85,
    billingLabel: 'par session',
    rating: 4.8,
    reviewCount: 96,
    reviews: marketplaceServiceReviews['coach-performance-competitive'],
    responseTime: 'Reponse sous 4 h',
    duration: 'Session 90 min',
    levelLabel: 'Joueurs ambitieux',
    shortDescription: 'Session individuelle avec review VOD, objectifs d entrainement et plan de progression concret.',
    description: [
      'Une session structuree pour identifier les pertes de valeur en match, isoler les habitudes a corriger et prioriser les axes de progression.',
      'Le coach fournit une feuille de route concise afin que le joueur sache quoi travailler entre deux sessions.'
    ],
    coverImage: '/images/landing/competition-arena.jpg',
    galleryImages: ['/images/landing/competition-arena.jpg', '/images/landing/home2.png', '/images/landing/home-crowd.jpg'],
    highlights: ['Review VOD', 'Plan individuel', 'Suivi priorise'],
    deliverables: ['Analyse de deux parties', 'Plan d entrainement 7 jours', 'Checklist de routines', 'Debrief ecrit'],
    process: [
      { title: 'Preparation', description: 'Collecte des VOD, du role joue et des objectifs competitifs.' },
      { title: 'Session', description: 'Review partagee avec focus sur les decisions, le positionnement et la communication.' },
      { title: 'Plan', description: 'Synthese actionnable avec priorites, exercices et criteres de progression.' }
    ],
    tags: ['VOD', 'SoloQ', 'Scrims', 'Routine']
  },
  {
    slug: 'manager-equipe-tournois',
    title: 'Manager equipe et tournois',
    category: 'management',
    categoryLabel: 'Management',
    icon: 'lucide:briefcase-business',
    provider: 'Sarah Klein',
    providerRole: 'Team manager',
    games: ['Valorant', 'League of Legends', 'Rocket League'],
    price: 690,
    billingLabel: 'par mois',
    rating: 4.7,
    reviewCount: 74,
    reviews: marketplaceServiceReviews['manager-equipe-tournois'],
    responseTime: 'Reponse sous 1 h',
    duration: 'Engagement 30 jours',
    levelLabel: 'Rosters actifs',
    shortDescription: 'Organisation du roster, inscriptions tournois, suivi des disponibilites et coordination competitive.',
    description: [
      'Un pilotage operationnel pour soulager les joueurs et garder une structure claire autour des matchs, entrainements et competitions.',
      'Le service installe des routines de suivi, une communication propre et une vision fiable des prochaines echeances.'
    ],
    coverImage: '/images/landing/home.png',
    galleryImages: ['/images/landing/home.png', '/images/landing/competition-arena.jpg', '/images/landing/home-crowd.jpg'],
    highlights: ['Planning roster', 'Suivi tournois', 'Coordination staff'],
    deliverables: ['Calendrier competitif', 'Tableau disponibilites', 'Gestion inscriptions', 'Compte rendu hebdomadaire'],
    process: [
      { title: 'Cadre', description: 'Recuperation du roster, des contraintes horaires et des objectifs competitifs.' },
      { title: 'Organisation', description: 'Mise en place du planning, des rappels et des canaux de suivi.' },
      { title: 'Pilotage', description: 'Coordination continue, arbitrage des priorites et reporting de progression.' }
    ],
    tags: ['Roster', 'Planning', 'Tournois', 'Staff']
  },
  {
    slug: 'agent-manager-joueur',
    title: 'Manager carriere joueur',
    category: 'management',
    categoryLabel: 'Management',
    icon: 'lucide:user-round-search',
    provider: 'Ilyes Bernard',
    providerRole: 'Talent manager',
    games: ['Valorant', 'League of Legends'],
    price: 240,
    billingLabel: 'par mission',
    rating: 4.8,
    reviewCount: 63,
    reviews: marketplaceServiceReviews['agent-manager-joueur'],
    responseTime: 'Reponse sous 6 h',
    duration: 'Mission 10 jours',
    levelLabel: 'Joueurs en recherche',
    shortDescription: 'Optimisation du profil joueur, preparation des prises de contact et strategie de candidature.',
    description: [
      'Un accompagnement pour rendre le profil joueur plus lisible, mieux positionner les objectifs et contacter les bonnes structures.',
      'Le service combine audit du profil, repositionnement du discours et preparation d un kit de candidature clair.'
    ],
    coverImage: '/images/landing/home2.png',
    galleryImages: ['/images/landing/home2.png', '/images/landing/home.png', '/images/landing/competition-arena.jpg'],
    highlights: ['Audit profil', 'Pitch joueur', 'Ciblage equipes'],
    deliverables: ['Profil optimise', 'Message de candidature', 'Liste de structures ciblees', 'Plan de relance'],
    process: [
      { title: 'Diagnostic', description: 'Analyse du profil, des resultats, des objectifs et des points de preuve disponibles.' },
      { title: 'Positionnement', description: 'Clarification du pitch joueur et des criteres de recherche.' },
      { title: 'Activation', description: 'Preparation des messages, ciblage et sequence de relance.' }
    ],
    tags: ['Carriere', 'Tryout', 'Profil', 'Candidature']
  },
  {
    slug: 'montage-video-highlights',
    title: 'Montage video highlights',
    category: 'creative',
    categoryLabel: 'Creation',
    icon: 'lucide:clapperboard',
    provider: 'Mila Gerard',
    providerRole: 'Video editor',
    games: ['Valorant', 'Rocket League'],
    price: 120,
    billingLabel: 'par video',
    rating: 4.9,
    reviewCount: 142,
    reviews: marketplaceServiceReviews['montage-video-highlights'],
    responseTime: 'Reponse sous 3 h',
    duration: 'Livraison 72 h',
    levelLabel: 'Joueurs et equipes',
    shortDescription: 'Montage dynamique de clips competitifs pour profil joueur, reseaux sociaux ou annonce de roster.',
    description: [
      'Un montage court, lisible et rythme pour presenter les meilleurs moments sans perdre la qualite de lecture du gameplay.',
      'Chaque video est preparee pour les formats sociaux et livree avec une version adaptee a la publication rapide.'
    ],
    coverImage: '/images/landing/competition-arena.jpg',
    galleryImages: ['/images/landing/competition-arena.jpg', '/images/landing/home.png', '/images/landing/home-crowd.jpg'],
    highlights: ['Format social', 'Sound design', 'Livraison rapide'],
    deliverables: ['Video 45 a 75 secondes', 'Version verticale', 'Miniature simple', 'Deux retours inclus'],
    process: [
      { title: 'Selection', description: 'Reception des clips, objectifs de diffusion et references de rythme.' },
      { title: 'Montage', description: 'Assemblage, sound design, titrage et exports adaptes.' },
      { title: 'Retours', description: 'Ajustements sur timing, textes et ordre des actions.' }
    ],
    tags: ['Highlights', 'TikTok', 'Reels', 'Roster reveal']
  },
  {
    slug: 'partenariats-sponsoring-equipe',
    title: 'Strategie partenariats',
    category: 'growth',
    categoryLabel: 'Croissance',
    icon: 'lucide:handshake',
    provider: 'Thomas Delcourt',
    providerRole: 'Partnership consultant',
    games: ['Valorant', 'League of Legends', 'Rocket League'],
    price: 390,
    billingLabel: 'par mission',
    rating: 4.6,
    reviewCount: 51,
    reviews: marketplaceServiceReviews['partenariats-sponsoring-equipe'],
    responseTime: 'Reponse sous 8 h',
    duration: 'Mission 14 jours',
    levelLabel: 'Clubs et collectifs',
    shortDescription: 'Construction d une offre partenaire, ciblage des prospects et preparation du dossier commercial.',
    description: [
      'Un service pour transformer une audience, un calendrier et une equipe en proposition commerciale claire.',
      'La mission aide a definir les actifs valorisables, les contreparties et une liste de contacts coherente avec votre niveau actuel.'
    ],
    coverImage: '/images/landing/home-crowd.jpg',
    galleryImages: ['/images/landing/home-crowd.jpg', '/images/landing/home2.png', '/images/landing/competition-arena.jpg'],
    highlights: ['Dossier partenaire', 'Ciblage prospects', 'Offres claires'],
    deliverables: ['Deck partenariat', 'Grille de packages', 'Liste de prospects', 'Script de prise de contact'],
    process: [
      { title: 'Inventaire', description: 'Lecture de vos audiences, resultats, evenements et actifs media.' },
      { title: 'Offre', description: 'Structuration des packages et des contreparties mesurables.' },
      { title: 'Prospection', description: 'Ciblage, messages et priorisation des premiers contacts.' }
    ],
    tags: ['Sponsor', 'Deck', 'Prospection', 'Club']
  },
  {
    slug: 'analyste-data-matchs',
    title: 'Analyste data matchs',
    category: 'analysis',
    categoryLabel: 'Analyse',
    icon: 'lucide:chart-no-axes-combined',
    provider: 'Elena Rossi',
    providerRole: 'Performance analyst',
    games: ['Valorant', 'League of Legends'],
    price: 180,
    billingLabel: 'par rapport',
    rating: 4.7,
    reviewCount: 69,
    reviews: marketplaceServiceReviews['analyste-data-matchs'],
    responseTime: 'Reponse sous 5 h',
    duration: 'Livraison 5 jours',
    levelLabel: 'Staffs competitifs',
    shortDescription: 'Rapport clair sur vos matchs, tendances de performance, patterns adverses et priorites tactiques.',
    description: [
      'Une analyse orientee decision pour comprendre ce qui se repete dans vos matchs et prioriser les ajustements collectifs.',
      'Le rapport met en avant les patterns mesurables, les situations critiques et les sequences a retravailler en entrainement.'
    ],
    coverImage: '/images/landing/home.png',
    galleryImages: ['/images/landing/home.png', '/images/landing/home2.png', '/images/landing/competition-arena.jpg'],
    highlights: ['Rapport tactique', 'Patterns adverses', 'Priorites staff'],
    deliverables: ['Analyse de 5 matchs', 'Synthese tactique', 'Axes entrainement', 'Support staff partageable'],
    process: [
      { title: 'Collecte', description: 'Reception des VOD, contexte des matchs et objectifs tactiques.' },
      { title: 'Analyse', description: 'Tag des situations recurrentes et comparaison des sequences clés.' },
      { title: 'Restitution', description: 'Rapport priorise avec points de vigilance et exercices proposes.' }
    ],
    tags: ['Data', 'VOD', 'Tactique', 'Rapport']
  }
]

export const getMarketplaceServiceBySlug = (slug: string) => {
  return marketplaceServices.find(service => service.slug === slug) || null
}

export const formatMarketplacePrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(price)
}
