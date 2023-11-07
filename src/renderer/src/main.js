import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// custom-vue-scrollbar
import 'custom-vue-scrollbar/dist/style.css'

// unocss
import 'virtual:uno.css'

// tailwind reset style
import '@unocss/reset/tailwind.css'
import './index.scss'

createApp(App)
  .use(router)
  .mount('#app')
