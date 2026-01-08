import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from './translation'
import router from './router/router'
import { socket } from './socket'

const app = createApp(App)
app.config.globalProperties.$socket = socket;
app.use(i18n)
app.use(router)
app.config.globalProperties.$router = router;
app.mount('#app')
