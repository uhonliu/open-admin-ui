<template id="myiframe">
  <div>
    <iframe  :src="src" width="100%" :height="frameHeight"></iframe>
  </div>
</template>
<script>
import { getParams } from '@/libs/util'
export default {
  name: 'IFrameView',
  data () {
    return {
      src: '',
      frameHeight: 0,
      screenHeight: 0
    }
  },

  watch: {
    'screenHeight' (val) {
      val = parseInt(val) - 150
      this.setFrameHeight(val)
    },
    '$route' (val) {
      this.getRouterData()
    }
  },
  methods: {
    getRouterData: function () { // 获取 iframe src 路径
      const params = getParams(window.location.href)
      this.src = decodeURIComponent(params.src)
    },
    setFrameHeight: function (height) {
      this.frameHeight = height
    }
  },
  mounted () {
    this.getRouterData()
    const that = this
    // 高度适应
    that.screenHeight = document.body.clientHeight
    window.onresize = () => {
      return (() => {
        that.screenHeight = document.body.clientHeight
      })()
    }
  }
}
</script>
