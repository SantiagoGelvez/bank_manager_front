import './index.css'

// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia} from 'pinia'
import App from './App.vue'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const pinia = createPinia()
const app = createApp(App)

app.use(VueSweetalert2)
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
