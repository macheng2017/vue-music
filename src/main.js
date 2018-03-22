import Vue from 'vue'
import App from './App'
import router from './router'
import 'common/stylus/index.styl'
import 'babel-polyfill'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

/* 去掉300毫秒的延时 */
fastclick.attach(document.body)
// or with options
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
