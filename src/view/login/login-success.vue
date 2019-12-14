<template id="success">
  <div>
    登录成功
  </div>
</template>
<script>
import { getParams } from '@/libs/util'
export default {
  name: 'LoginSuccess',
  data () {
    return {
      frameHeight: 0,
      screenHeight: 0
    }
  },

  watch: {
    '$route' (val) {
      this.getRouterData()
    }
  },
  methods: {
    getRouterData: function () { // 获取 iframe src 路径
      const params = getParams(window.location.href)
      let token = decodeURIComponent(params.token)
      if (token) {
        this.$store.commit('setToken', { token, auto: true })
        if (window.opener && !window.opener.closed) {
          window.parent.opener.location.reload()
        }
        window.close()
      }
    }
  },
  mounted () {
    this.getRouterData()
  }
}
</script>
