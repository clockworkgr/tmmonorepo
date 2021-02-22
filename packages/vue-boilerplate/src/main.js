import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import  vueLib from '@clockwork-projects/vue-components'
console.log(vueLib);
const app = createApp(App)
app.config.globalProperties._depsLoaded=true
app.use(store).use(router).use(vueLib).mount('#app')
