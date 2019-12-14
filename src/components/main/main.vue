<template >
  <Layout style="height: 100%" class="skin-blue">
    <Layout v-if="layout === 'toptest'" style="height: 100%" class="main-layout-top">
      <Header class="main-layout-header">
        <div class="main-layout-logo">
          <img v-show="!collapsed" class="max-logo" :src="maxLogo"  key="max-logo" />
          <img v-show="collapsed" class="min-logo" :src="minLogo" key="min-logo" />
        </div>
        <side-menu accordion ref="sideMenu"  mode="horizontal" :active-name="$route.name"  @on-select="turnToPage"
                   :menu-list="menuList"></side-menu>
      </Header>
        <Content :class="mainClass" :style="{margin: '70px 20px', background: '#fff', minHeight: '500px'}">
          <Layout class="main-layout-content-wrapper">
            <custom-bread-crumb class="main-layout-bread-crumb" v-show="screenWidth>768" show-icon :list="breadCrumbList"></custom-bread-crumb>
            <div class="main-layout-tag-nav-wrapper">
              <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
            </div>
            <Content class="main-layout-view-wrapper">
              <keep-alive :include="cacheList">
                <router-view/>
              </keep-alive>
              <ABackTop :height="100" :bottom="80" :right="50" container=".main-layout-view-wrapper"></ABackTop>
            </Content>
          </Layout>
        </Content>
    </Layout>

    <Layout v-else="" style="height: 100%" class="main-layout-left">
      <Sider hide-trigger collapsible :width="220" :collapsed-width="64" v-model="collapsed" class="left-sider"
             :style="{overflow: 'hidden'}">
        <div class="main-layout-logo">
          <img v-show="!collapsed" class="max-logo" :src="maxLogo"  key="max-logo" />
          <img v-show="collapsed" class="min-logo" :src="minLogo" key="min-logo" />
        </div>
        <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage"
                   :menu-list="menuList">
        </side-menu>
      </Sider>
      <Layout>
      <Header class="main-layout-header">
          <div :class="headerLogoClass">
            <!-- <img v-show="!collapsed" :src="maxLogo"  key="max-logo" />
             <img v-show="collapsed" :src="minLogo" key="min-logo" />-->
          </div>
          <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollapsedChange"></sider-trigger>
          <custom-bread-crumb class="main-layout-bread-crumb" v-show="screenWidth>768" show-icon :list="breadCrumbList"></custom-bread-crumb>
          <ul class="main-layout-header-bar">
            <li>
              <fullscreen :screenWidth="screenWidth" v-model="isFullscreen"/>
            </li>
            <li>
              <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader"  :has-read="hasReadErrorPage" :count="errorCount"></error-store>
            </li>
            <li>
              <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
            </li>
            <li>
              <user :user-avatar="userAvatar" :nick-name="nickName" :user-name="userName"/>
            </li>
            <li>
              <Icon @click.native="value1 = true" type="md-settings" :size="18"></Icon>
            </li>
          </ul>
        </Header>
        <Content :class="mainClass">
          <Layout class="main-layout-content-wrapper">
              <div class="main-layout-tag-nav-wrapper">
                <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
              </div>
              <Content class="main-layout-view-wrapper">
                <keep-alive :include="cacheList">
                  <router-view/>
                </keep-alive>
                <ABackTop :height="100" :bottom="80" :right="50" container=".main-layout-view-wrapper"></ABackTop>
              </Content>
          </Layout>
        </Content>
      </Layout>
    </Layout>
    <Drawer :closable="false" width="300" v-model="value1">
      <h3>导航布局</h3>
      <div>
        <p @click="changeLayout('left')" style="display: inline-block;margin-left: 20px;cursor: pointer"><img src="../../assets/images/layout-left.svg"/></p>
        <p @click="changeLayout('top')" style="display: inline-block;margin-left: 20px;cursor: pointer"><img src="../../assets/images/layout-top.svg"/></p>
      </div>
    </Drawer>
  </Layout>
</template>

<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import siderTrigger from './components/header-bar/sider-trigger'
import customBreadCrumb from './components/header-bar/custom-bread-crumb'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
import minLogo from '@/assets/images/logo-min.png'
import maxLogo from '@/assets/images/logo.png'
import './main.less'
import Layout from '../../../node_modules/iview/src/components/layout/layout'
export default {
  name: 'Main',
  components: {
    Layout,
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop,
    customBreadCrumb,
    siderTrigger
  },
  data () {
    return {
      value1: false,
      collapsed: false,
      layout: '',
      minLogo,
      maxLogo,
      isFullscreen: false,
      screenWidth: 0
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    },
    headerLogoClass () {
      return [
        'main-layout-header-logo',
        this.collapsed ? 'main-layout-header-logo-collapsed' : ''
      ]
    },
    mainClass () {
      return [
        'main-layout-content',
        this.collapsed ? 'main-layout-content-collapsed' : ''
      ]
    },
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvatar () {
      return this.$store.state.user.avatarImgPath
    },
    userName () {
      return this.$store.state.user.userName
    },
    nickName () {
      return this.$store.state.user.nickName
    },

    cacheList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    changeLayout (layout) {
      if (!layout) {
        layout = 'left'
      }
      localStorage.setItem('layout', layout)
      this.$Message.info('选择布局:' + layout)
      this.layout = layout
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type === 'all') {
        this.turnToPage(this.$config.homeName)
      } else if (routeEqual(this.$route, route)) {
        if (type !== 'others') {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    setLayout () {
      let layout = localStorage.getItem('layout')
      if (!layout) {
        layout = 'left'
        localStorage.setItem('layout', layout)
      }
      this.layout = layout
    }
  },
  watch: {
    screenWidth (val) {
      const that = this
      if (val < 768) {
        // 小于768强制折叠
        that.handleCollapsedChange(true)
      } else {
        that.handleCollapsedChange(false)
      }
    },
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs['sideMenu'].updateOpenName(newRoute.name)
    }
  },
  mounted () {
    const that = this
    // 宽度适应
    that.screenWidth = document.body.clientWidth
    window.onresize = () => {
      return (() => {
        that.screenWidth = document.body.clientWidth
      })()
    }
    // 设置布局
    this.setLayout()
    // 初始化设置面包屑导航和标签导航
    this.setTagNavList()
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
  }
}
</script>
