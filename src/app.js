import { createApp } from 'vue'
import App from './App.vue'

// Import global styles
import './assets/app.scss'

// Vuetify
import vuetify from './config/vuetify'

// i18n
import i18n from './config/i18n'

const app = createApp(App)
app.use(vuetify)
app.use(i18n)
app.mount('#app')
