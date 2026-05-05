export const getSearchAvatarFallback = (seed: string) => {
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(seed)}`
}

export const getSearchBannerFallback = (seed: string) => {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(seed)}`
}
