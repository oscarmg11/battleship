import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { i18n } from '@/locales/i18n.ts'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.mount('#app')
