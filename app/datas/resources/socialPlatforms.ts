import { RscSocialPlatformTypeEnum } from '@neeft-sas/shared'
import type { RscSocialPlatformPresenter } from '@neeft-sas/shared'

type SocialPlatformIconSource = Partial<Pick<RscSocialPlatformPresenter, 'key' | 'icon'>> & {
  slug?: string | null
}

const platformIconBySlug: Record<string, string> = {
  twitter: 'simple-icons:x',
  x: 'simple-icons:x',
  twitch: 'simple-icons:twitch',
  instagram: 'simple-icons:instagram',
  youtube: 'simple-icons:youtube',
  tiktok: 'simple-icons:tiktok',
  discord: 'simple-icons:discord'
}

export const fallbackSocialPlatforms: RscSocialPlatformPresenter[] = [
  {
    id: 1,
    key: 'twitter',
    label: 'Twitter',
    type: RscSocialPlatformTypeEnum.USERNAME,
    baseUrl: 'https://twitter.com/{username}',
    placeholder: 'username',
    example: 'neeft',
    icon: platformIconBySlug.twitter
  },
  {
    id: 2,
    key: 'twitch',
    label: 'Twitch',
    type: RscSocialPlatformTypeEnum.USERNAME,
    baseUrl: 'https://twitch.tv/{username}',
    placeholder: 'username',
    example: 'neeft',
    icon: platformIconBySlug.twitch
  },
  {
    id: 3,
    key: 'instagram',
    label: 'Instagram',
    type: RscSocialPlatformTypeEnum.HANDLE,
    baseUrl: 'https://instagram.com/{username}',
    placeholder: 'username',
    example: 'neeft',
    icon: platformIconBySlug.instagram
  },
  {
    id: 4,
    key: 'youtube',
    label: 'YouTube',
    type: RscSocialPlatformTypeEnum.URL,
    baseUrl: 'https://youtube.com/{username}',
    placeholder: 'channel',
    example: '@neeft',
    icon: platformIconBySlug.youtube
  },
  {
    id: 5,
    key: 'tiktok',
    label: 'TikTok',
    type: RscSocialPlatformTypeEnum.HANDLE,
    baseUrl: 'https://tiktok.com/@{username}',
    placeholder: 'username',
    example: 'neeft',
    icon: platformIconBySlug.tiktok
  },
  {
    id: 6,
    key: 'discord',
    label: 'Discord',
    type: RscSocialPlatformTypeEnum.USERNAME,
    baseUrl: 'https://discord.gg/{username}',
    placeholder: 'invite',
    example: 'neeft',
    icon: platformIconBySlug.discord
  }
]

export const normalizeSocialPlatformIcon = (platform: SocialPlatformIconSource) => {
  const slug = (platform.slug || platform.key || '').toLowerCase()
  const icon = platform.icon || ''

  return platformIconBySlug[slug] || platformIconBySlug[icon.replace(/^uil:/, '')] || icon || 'lucide:link'
}

export const normalizeSocialPlatforms = (value: readonly RscSocialPlatformPresenter[] = []): RscSocialPlatformPresenter[] => {
  return value
    .map((platform): RscSocialPlatformPresenter | null => {
      if (!platform.id || !platform.label) return null
      return {
        ...platform,
        icon: normalizeSocialPlatformIcon(platform)
      }
    })
    .filter((item): item is RscSocialPlatformPresenter => item !== null)
}

export const getFallbackSocialPlatformById = (id: number) => {
  return fallbackSocialPlatforms.find(platform => platform.id === id) || null
}
