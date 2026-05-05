import { appLanguages, defaultAppLanguageCode } from '../app/datas/resources/languages'

export const nuxtI18nConfig = {
  strategy: 'prefix_except_default',
  defaultLocale: defaultAppLanguageCode,
  langDir: 'locales',
  locales: appLanguages.map(({ code, language, files }) => ({
    code,
    language,
    files: [...files]
  }))
}
