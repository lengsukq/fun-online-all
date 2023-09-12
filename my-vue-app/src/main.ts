import {createApp} from 'vue';
import './style.css';
import App from './App.vue';
import router from "./router";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

console.log(ElementPlus,typeof ElementPlus)
const app = createApp(App)
app.use(ElementPlus as object).use(router).mount('#app');
