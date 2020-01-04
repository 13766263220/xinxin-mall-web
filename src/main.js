// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
Vue.config.productionTip = false

//引入element-ui
import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css" //导入css文件
Vue.use(ElementUI)

//引入axios
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';//端口设置
Vue.prototype.$http=axios;//将axios改写到vue原型属性,调用方式例如this.$http.post(xxx)

//引入qs
import qs from "qs"
Vue.prototype.$qs=qs





/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
