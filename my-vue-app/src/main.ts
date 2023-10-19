import {createApp} from 'vue';
import './style.css';
import App from './App.vue';
import router from "./router";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import vant from 'vant';
import 'vant/lib/index.css';

const app = createApp(App)
// @ts-ignore
app.use(ElementPlus).use(router).use(vant).mount('#app');
