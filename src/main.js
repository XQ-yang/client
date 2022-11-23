import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'
import ViewUI from "view-ui-plus"
import 'view-ui-plus/dist/styles/viewuiplus.css'
import * as ElIcons from '@element-plus/icons-vue'
import locale  from "element-plus/es/locale/lang/zh-cn";

const app = createApp(App)
// 全局注册el-icon
for (const iconName in ElIcons) {
    app.component(iconName, ElIcons[iconName])
}
app.use(ElementUI,{locale}).use(ViewUI).use(store).use(router).mount('#app')
