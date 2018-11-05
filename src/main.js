import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './views/App.vue'
import ElementUI from 'element-ui'
import './assets/theme/theme-darkblue/index.css'
const eventsHub = new Vue()
Vue.use(ElementUI)

new Vue({
  el: '#app',
  template: '<App/>',
  render: h => h(App)
}).$mount('#app')

