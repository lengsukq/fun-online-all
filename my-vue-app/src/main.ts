import {createApp} from 'vue';
import './style.css';
import App from './App.vue';
import router from "./router";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import Options from "@vitejs/plugin-vue";

const app = createApp(App)
const ele: Options = ElementPlus;
app.use(ele).use(router).mount('#app');
