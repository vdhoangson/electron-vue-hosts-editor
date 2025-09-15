import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLanguage() {
  const { locale, t } = useI18n()

  const availableLocales = ref([
    { code: 'vi', name: 'Tiếng Việt', flag: 'vn' },
    { code: 'en', name: 'English', flag: 'gb' },
  ])

  const currentLocale = ref(locale.value)

  const currentLocaleName = computed(() => {
    const localeObj = availableLocales.value.find(l => l.code === currentLocale.value)
    return localeObj ? localeObj.name : 'Tiếng Việt'
  })

  const setLocale = newLocale => {
    if (newLocale && ['vi', 'en'].includes(newLocale)) {
      try {
        locale.value = newLocale
        currentLocale.value = newLocale
        localStorage.setItem('locale', newLocale)
        return true
      } catch (error) {
        console.error('Error saving locale to localStorage:', error)
        return false
      }
    }
    return false
  }

  const resetToDefault = () => {
    return setLocale('vi')
  }

  const getSavedLocale = () => {
    try {
      const saved = localStorage.getItem('locale')
      return saved && ['vi', 'en'].includes(saved) ? saved : 'vi'
    } catch (error) {
      console.warn('Error reading locale from localStorage:', error)
      return 'vi'
    }
  }

  return {
    currentLocale,
    availableLocales,
    currentLocaleName,
    setLocale,
    resetToDefault,
    getSavedLocale,
  }
}
