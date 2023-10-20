import {createApp} from 'vue';
import './style.css';
import App from './App.vue';
import router from "./router";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import vant from 'vant';
import 'vant/lib/index.css';
import { createPinia } from 'pinia'
const app = createApp(App)
const pinia = createPinia()
// @ts-ignore
app.use(ElementPlus).use(router).use(vant).use(pinia).mount('#app');
