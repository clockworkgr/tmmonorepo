import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import  vueLib from '@starport/vue'
console.log(vueLib);
createApp(App).use(store).use(router).use(vueLib).mount('#app')
