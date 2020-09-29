import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'katex/dist/katex.min.css'
import { Button, Tabs, TabPane, Form, FormItem, Input, PageHeader, Message, Popover, Tag } from 'element-ui'
Vue.config.productionTip = false

Vue.use(Button)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(PageHeader)
Vue.use(Popover)
Vue.use(Tag)
Vue.prototype.$message = Message
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
