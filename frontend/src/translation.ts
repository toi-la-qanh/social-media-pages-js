import { createI18n, useI18n } from 'vue-i18n'

// Import JSON translations
import en from './locales/en.json'
import vi from './locales/vi.json'
import ja from './locales/ja.json'
const messages = {
  en,
  vi,
  ja,
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,          
  locale: sessionStorage.getItem("language") || "en",           
  fallbackLocale: 'en',
  messages,
})

export function useTranslation() {
  return useI18n()
}

export default i18n