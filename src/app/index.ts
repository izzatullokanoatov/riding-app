import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'
import './styles/main.css'

export const app = createApp(App)

app.use(store)

export { store }
