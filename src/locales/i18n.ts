import { createI18n } from 'vue-i18n'
import { es } from '@/locales/es.ts'

export const i18n = createI18n({
    locale: navigator.language,
    fallbackLocale: 'en',
    messages: {
        es,
    }
})
