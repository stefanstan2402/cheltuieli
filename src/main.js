import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ToastPlugin from 'vue-toast-notification';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'vue-toast-notification/dist/theme-bootstrap.css';

const app = createApp(App)

app.use(router)
app.use(ToastPlugin)

app.mount('#app')
