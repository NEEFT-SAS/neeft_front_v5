const BLOCKED_IMAGE_PROTOCOLS = ['blob:', 'data:', 'file:', 'javascript:']

export const getSafeMarketplaceImageSrc = (value: unknown) => {
  const src = typeof value === 'string' ? value.trim() : ''
  if (!src) return ''

  const normalizedSrc = src.toLowerCase()
  if (BLOCKED_IMAGE_PROTOCOLS.some(protocol => normalizedSrc.startsWith(protocol))) return ''

  return src
}

export const isSafeMarketplaceImageSrc = (value: unknown) => Boolean(getSafeMarketplaceImageSrc(value))
