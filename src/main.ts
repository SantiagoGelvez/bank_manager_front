import './index.css'

// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia} from 'pinia'
import App from './App.vue'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp(App)
const pinia = createPinia()

app.use(VueSweetalert2)
app.use(pinia)
app.use(router)

app.mount('#app')
