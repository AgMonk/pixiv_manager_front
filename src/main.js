import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './assets/js/utils'
import Clipboard from 'v-clipboard3';

import {AlarmClock, Star, StarFilled} from "@element-plus/icons"


createApp(App)
    .use(Clipboard)
    .component("star",Star)
    .component("alarm-clock",AlarmClock)
    .component("star-filled",StarFilled)
    .use(store)
    .use(router)
    .use(ElementPlus, {locale: zhCn,})
    .mount('#app')
