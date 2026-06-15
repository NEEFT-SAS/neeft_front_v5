import { useGlobalConfig } from './config/useGlobalConfig'
import { usePageConfig } from './config/usePageConfig'
import { useProfileConfig } from './config/useProfileConfig'
import type { GlobalConfig } from './config/useGlobalConfig'
import type { PageConfig } from './config/usePageConfig'
import type { ProfileConfig } from './config/useProfileConfig'

export type { AppNavigationItem, AppNavigationMenu, GlobalAssetsConfig, GlobalConfig } from './config/useGlobalConfig'

export type { DynamicPageEntryConfig, ExternalNavigationItem, LandingActionItem, LandingNavigationItem, LocalizedPageSeoMeta, MarketplaceServiceImageConfig, PageConfig, PageEntryConfig, PageSeoMeta, PageViewConfig } from './config/usePageConfig'

export type { ProfileConfig, ProfileImageFallbackOptions, ProfileImageKind, ProfileKind, ProfilePlaceholderConfig } from './config/useProfileConfig'
export { usePageConfig } from './config/usePageConfig'

export type AppConfig = GlobalConfig & PageConfig & {
  profile: ProfileConfig
}

const config: AppConfig = {
  ...useGlobalConfig(),
  ...usePageConfig(),
  profile: useProfileConfig()
}

export const useConfig = () => config
