import { footerCompany, footerLegal, footerLinks, footerProduct, footerSocial, footerSolutions } from '../../datas/navigations/footers/landing'
import { landingHeaderActions, landingHeaderNav } from '../../datas/navigations/headers/landing'
import { getSafeMarketplaceImageSrc } from '../../utils/marketplaceImages'
import { useGlobalConfig } from './useGlobalConfig'

export type LandingNavigationItem = {
  to: string
  labelKey: string
}

export type LandingActionItem = LandingNavigationItem & {
  variant: 'outlined' | 'filled'
  color: 'primary' | 'secondary'
}

export type ExternalNavigationItem = {
  href: string
  labelKey: string
  icon: string
}

export type PageSeoMeta = {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard: 'summary' | 'summary_large_image'
  twitterImage?: string
}

export type LocalizedPageSeoMeta = {
  titleKey: string
  descriptionKey: string
  ogTitleKey?: string
  ogDescriptionKey?: string
  ogImage?: string
  twitterCard: 'summary' | 'summary_large_image'
  twitterImage?: string
}

export type PageViewConfig = {
  bannerUrl: string
}

export type PageEntryConfig<TSeo = PageSeoMeta> = PageViewConfig & {
  seo: TSeo
}

export type DynamicPageEntryConfig = PageViewConfig & {
  seo: (value: string) => PageSeoMeta
}

export type MarketplaceServiceImageConfig = {
  bannerPlaceholderUrl: string
  getServiceBannerUrl: (url: string | null | undefined) => string
}

export type PageConfig = {
  menus: {
    landing: {
      header: {
        nav: readonly LandingNavigationItem[]
        actions: readonly LandingActionItem[]
      }
      footer: {
        solutions: readonly LandingNavigationItem[]
        product: readonly LandingNavigationItem[]
        company: readonly LandingNavigationItem[]
        links: readonly LandingNavigationItem[]
        legal: readonly LandingNavigationItem[]
        social: readonly ExternalNavigationItem[]
      }
    }
  }
  landing: {
    home: PageEntryConfig
  }
  messages: PageEntryConfig
  search: {
    players: PageEntryConfig<LocalizedPageSeoMeta>
    staffs: PageEntryConfig<LocalizedPageSeoMeta>
    teams: PageEntryConfig<LocalizedPageSeoMeta>
  }
  marketplace: {
    service: MarketplaceServiceImageConfig
    index: PageEntryConfig
    services: PageEntryConfig
    orders: PageEntryConfig
    sales: PageEntryConfig
    orderDetail: DynamicPageEntryConfig
    saleDetail: DynamicPageEntryConfig
  }
}

const globalConfig = useGlobalConfig()
const defaultOgImage = globalConfig.global.assets.images.defaultOg
const defaultBannerUrl = globalConfig.global.assets.images.default
const marketplaceBannerUrl = globalConfig.global.assets.images.marketplaceCover
const getServiceBannerUrl = (url: string | null | undefined) => getSafeMarketplaceImageSrc(url) || marketplaceBannerUrl

const pageConfig: PageConfig = {
  menus: {
    landing: {
      header: {
        nav: landingHeaderNav,
        actions: landingHeaderActions
      },
      footer: {
        solutions: footerSolutions,
        product: footerProduct,
        company: footerCompany,
        links: footerLinks,
        legal: footerLegal,
        social: footerSocial
      }
    }
  },
  landing: {
    home: {
      bannerUrl: globalConfig.global.assets.images.landingCrowd,
      seo: {
        title: 'NEEFT',
        description: globalConfig.global.description,
        ogTitle: 'NEEFT',
        ogDescription: globalConfig.global.description,
        ogImage: defaultOgImage,
        twitterCard: 'summary_large_image',
        twitterImage: defaultOgImage
      }
    }
  },
  messages: {
    bannerUrl: defaultBannerUrl,
    seo: {
      title: 'Messages - Neeft',
      description: 'Messagerie globale Neeft pour gerer tes conversations esport.',
      ogTitle: 'Messages - Neeft',
      ogDescription: 'Messagerie globale Neeft pour gerer tes conversations esport.',
      twitterCard: 'summary_large_image'
    }
  },
  search: {
    players: {
      bannerUrl: defaultBannerUrl,
      seo: {
        titleKey: 'app.search.players.seo.title',
        descriptionKey: 'app.search.players.seo.description',
        ogTitleKey: 'app.search.players.seo.title',
        ogDescriptionKey: 'app.search.players.seo.description',
        ogImage: defaultOgImage,
        twitterCard: 'summary_large_image',
        twitterImage: defaultOgImage
      }
    },
    staffs: {
      bannerUrl: defaultBannerUrl,
      seo: {
        titleKey: 'app.search.staffs.seo.title',
        descriptionKey: 'app.search.staffs.seo.description',
        ogTitleKey: 'app.search.staffs.seo.title',
        ogDescriptionKey: 'app.search.staffs.seo.description',
        ogImage: defaultOgImage,
        twitterCard: 'summary_large_image',
        twitterImage: defaultOgImage
      }
    },
    teams: {
      bannerUrl: defaultBannerUrl,
      seo: {
        titleKey: 'app.search.teams.seo.title',
        descriptionKey: 'app.search.teams.seo.description',
        ogTitleKey: 'app.search.teams.seo.title',
        ogDescriptionKey: 'app.search.teams.seo.description',
        ogImage: defaultOgImage,
        twitterCard: 'summary_large_image',
        twitterImage: defaultOgImage
      }
    }
  },
  marketplace: {
    service: {
      bannerPlaceholderUrl: marketplaceBannerUrl,
      getServiceBannerUrl
    },
    index: {
      bannerUrl: marketplaceBannerUrl,
      seo: {
        title: 'Marketplace esport',
        description: 'Services esport pour trouver un community manager, un coach, un manager ou un expert operationnel.',
        ogTitle: 'Marketplace esport',
        ogDescription: 'Services esport pour structurer un projet joueur, equipe ou staff.',
        ogImage: defaultOgImage,
        twitterCard: 'summary_large_image',
        twitterImage: defaultOgImage
      }
    },
    services: {
      bannerUrl: marketplaceBannerUrl,
      seo: {
        title: 'Mes services marketplace',
        description: 'Gestion des services proposes sur la marketplace.',
        ogTitle: 'Mes services marketplace',
        ogDescription: 'Gestion des fiches services et prestations marketplace.',
        twitterCard: 'summary'
      }
    },
    orders: {
      bannerUrl: marketplaceBannerUrl,
      seo: {
        title: 'Commandes achetees',
        description: 'Suivi des commandes marketplace achetees a des vendeurs.',
        ogTitle: 'Commandes achetees',
        ogDescription: 'Suivi des services commandes sur la marketplace.',
        twitterCard: 'summary'
      }
    },
    sales: {
      bannerUrl: marketplaceBannerUrl,
      seo: {
        title: 'Ventes marketplace',
        description: 'Liste des ventes et commandes passees sur tes services marketplace.',
        ogTitle: 'Ventes marketplace',
        ogDescription: 'Liste des ventes et commandes passees sur tes services marketplace.',
        twitterCard: 'summary'
      }
    },
    orderDetail: {
      bannerUrl: marketplaceBannerUrl,
      seo: orderId => ({
        title: `Detail commande ${orderId}`,
        description: 'Detail et suivi d une commande marketplace achetee.',
        ogTitle: `Detail commande ${orderId}`,
        ogDescription: 'Detail et suivi d une commande marketplace achetee.',
        twitterCard: 'summary'
      })
    },
    saleDetail: {
      bannerUrl: marketplaceBannerUrl,
      seo: orderId => ({
        title: `Detail vente ${orderId}`,
        description: 'Detail et suivi d une vente marketplace.',
        ogTitle: `Detail vente ${orderId}`,
        ogDescription: 'Detail et suivi d une vente marketplace.',
        twitterCard: 'summary'
      })
    }
  }
}

export const usePageConfig = () => pageConfig
