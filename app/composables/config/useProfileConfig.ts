import { useGlobalConfig } from './useGlobalConfig'

export type ProfilePlaceholderConfig = {
  avatarPlaceholderUrl: string
  bannerPlaceholderUrl: string
}

export type ProfileKind = 'team' | 'user'

export type ProfileImageKind = 'avatar' | 'banner'

export type ProfileImageFallbackOptions = {
  profileKind: ProfileKind
  imageKind: ProfileImageKind
}

export type ProfileConfig = {
  teamProfileConfig: ProfilePlaceholderConfig
  userProfileConfig: ProfilePlaceholderConfig
  getProfileImageUrl: (url: string | null | undefined, options: ProfileImageFallbackOptions) => string
  getTeamAvatarUrl: (url: string | null | undefined) => string
  getTeamBannerUrl: (url: string | null | undefined) => string
  getUserAvatarUrl: (url: string | null | undefined) => string
  getUserBannerUrl: (url: string | null | undefined) => string
}

const globalConfig = useGlobalConfig()

const teamProfileConfig: ProfilePlaceholderConfig = {
  avatarPlaceholderUrl: globalConfig.global.assets.logos.defaultAvatar,
  bannerPlaceholderUrl: globalConfig.global.assets.images.default
}

const userProfileConfig: ProfilePlaceholderConfig = {
  avatarPlaceholderUrl: globalConfig.global.assets.logos.defaultAvatar,
  bannerPlaceholderUrl: globalConfig.global.assets.images.default
}

const getResolvedImageUrl = (url: string | null | undefined) => {
  const resolvedUrl = typeof url === 'string' ? url.trim() : ''
  return resolvedUrl || null
}

const getProfilePlaceholderUrl = ({ profileKind, imageKind }: ProfileImageFallbackOptions) => {
  const config = profileKind === 'team' ? teamProfileConfig : userProfileConfig
  return imageKind === 'banner' ? config.bannerPlaceholderUrl : config.avatarPlaceholderUrl
}

const getProfileImageUrl = (url: string | null | undefined, options: ProfileImageFallbackOptions) => getResolvedImageUrl(url) || getProfilePlaceholderUrl(options)

const profileConfig: ProfileConfig = {
  teamProfileConfig,
  userProfileConfig,
  getProfileImageUrl,
  getTeamAvatarUrl: (url) => getProfileImageUrl(url, { profileKind: 'team', imageKind: 'avatar' }),
  getTeamBannerUrl: (url) => getProfileImageUrl(url, { profileKind: 'team', imageKind: 'banner' }),
  getUserAvatarUrl: (url) => getProfileImageUrl(url, { profileKind: 'user', imageKind: 'avatar' }),
  getUserBannerUrl: (url) => getProfileImageUrl(url, { profileKind: 'user', imageKind: 'banner' })
}

export const useProfileConfig = () => profileConfig
