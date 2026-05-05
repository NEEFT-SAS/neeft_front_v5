export const isNativeImageSource = (value: string) => {
  return value.startsWith('blob:') || value.startsWith('data:')
}
