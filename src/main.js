// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import TreeTable from 'tree-table-vue'
import Treeselect from '@riophae/vue-treeselect'
import 'highlight.js/styles/googlecode.css' // 样式文件
import VueNeditorWrap from 'vue-neditor-wrap' // 百度编辑器
import area from './libs/area' // 地区选择

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

// 注册组件
Vue.component(TreeTable.name, TreeTable)
Vue.component('treeselect', Treeselect)
Vue.component('vue-neditor-wrap', VueNeditorWrap)

/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

/**
 * 注册指令
 */
importDirective(Vue)

/**
 * 按钮全新控制
 *authorities 多个用,号隔开
 * v-show="hasAuthority('systemUserCreate')"
 * v-show="hasAuthority('systemUserCreate,systemUserUpdate,')"
 * @param authorities
 * @returns {boolean}
 */
Vue.prototype.hasAuthority = function (authorities) {
  if (!authorities) {
    return false
  }
  return authorities.split(',').some(item => {
    return store.state.user.access.includes('ACTION_' + item)
  })
}

/**
 * @description 获取baseUrl
 */
let baseUrl = '' // 这里是一个默认的url，可以没有
switch (process.env.NODE_ENV) {
  case 'development':
    baseUrl = config.apiUrl.dev // 这里是本地的请求url
    break
  case 'production':
    baseUrl = config.apiUrl.pro // 生产环境url
    break
}
Vue.prototype.baseUrl = baseUrl
Vue.prototype.uploadUrl = baseUrl + '/filekjzd/laravel-u-editor-server/server'
Vue.prototype.workOrderFile = baseUrl + '/file/dfs/upload' // 工单文件上传接口

// 地区data
Vue.prototype.AREA = area

// Ueditor
Vue.prototype.UEDITOR_HOME_URL = '/Neditor/'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
