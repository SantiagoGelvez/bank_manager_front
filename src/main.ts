import './index.css'
// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia} from 'pinia'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.config.globalProperties.$filters = {
	currency(value: number) {
		const formatter = new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP'
		})
		return formatter.format(value)
	}
}

app.mount('#app')
