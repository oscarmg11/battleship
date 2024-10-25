import { i18n } from '@/locales/i18n.ts'

export function translate(text: string): string {
    return i18n.global.t(text)
}
