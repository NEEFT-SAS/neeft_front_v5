export type AppNavigationItem = {
  label: string
  to: string
  icon?: string
}

export type AppNavigationMenu = {
  key: string
  label: string
  icon: string
  items: readonly AppNavigationItem[]
}

export type GlobalAssetsConfig = {
  logos: {
    mark: string
    app: string
    defaultAvatar: string
  }
  images: {
    default: string
    defaultOg: string
    landingHero: string
    landingCrowd: string
    landingHome: string
    landingHomeAlt: string
    marketplaceCover: string
  }
}

export type GlobalConfig = {
  global: {
    name: string
    shortName: string
    description: string
    assets: GlobalAssetsConfig
  }
  app: {
    navigation: {
      menus: readonly AppNavigationMenu[]
      links: readonly AppNavigationItem[]
    }
  }
}

const globalConfig: GlobalConfig = {
  global: {
    name: 'NEEFT',
    shortName: 'NEEFT',
    description: 'Plateforme esport pour connecter joueurs, equipes, staffs et partenaires.',
    assets: {
      logos: {
        mark: '/images/logos/neeft/Logo_NEEFT_FOX.png',
        app: '/images/logos/neeft/Logo_NEEFT_FOX.png',
        defaultAvatar: '/images/logos/neeft/Logo_NEEFT_FOX.png'
      },
      images: {
        default: '/images/landing/competition-arena.jpg',
        defaultOg: '/images/landing/competition-arena.jpg',
        landingHero: '/images/landing/home.png',
        landingCrowd: '/images/landing/home-crowd.jpg',
        landingHome: '/images/landing/home.png',
        landingHomeAlt: '/images/landing/home2.png',
        marketplaceCover: '/images/landing/competition-arena.jpg'
      }
    }
  },
  app: {
    navigation: {
      menus: [
        {
          key: 'directories',
          label: 'Rechercher',
          icon: 'lucide:search',
          items: [
            { label: 'Rechercher un joueur', to: '/search/players', icon: 'lucide:gamepad-2' },
            { label: 'Rechercher une equipe', to: '/search/teams', icon: 'lucide:users-round' },
            { label: 'Rechercher un staff', to: '/search/staffs', icon: 'lucide:user-round-cog' }
          ]
        }
      ],
      links: [
        { label: 'Marketplace', to: '/marketplace', icon: 'lucide:store' },
        { label: 'Messages', to: '/messages', icon: 'lucide:messages-square' },
        { label: 'Feed', to: '/feed', icon: 'lucide:newspaper' },
        { label: 'Offres de recrutement', to: '/recruitment', icon: 'lucide:briefcase-business' }
      ]
    }
  }
}

export const useGlobalConfig = () => globalConfig
