import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import vi from '../locales/vi.json'

// Get saved language from localStorage or default to Vietnamese
const getSavedLocale = () => {
  try {
    const saved = localStorage.getItem('locale')
    // Validate that the saved locale is one of our supported locales
    if (saved && ['vi', 'en'].includes(saved)) {
      return saved
    }
  } catch (error) {
    console.warn('Error reading locale from localStorage:', error)
  }
  return 'vi' // Default fallback
}

const savedLocale = getSavedLocale()

const i18n = createI18n({
  legacy: false, // Enable Composition API mode
  locale: savedLocale,
  fallbackLocale: 'vi',
  messages: {
    en,
    vi,
  },
})

export default i18n
