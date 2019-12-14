<template>
  <div class="rank">
    <h4 class="title">{{title}}</h4>
    <ul class="list">
      <li :key="index" v-for="(item, index) in list">
        <span :class="index < 3 ? 'active' : null">{{index + 1}}</span>
        <span >{{item.name}}</span>
        <span >{{item.total}}</span>
      </li>
    </ul>
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" rel="stylesheet/less">
  .rank{
    text-align: left;
    .title{
    }
    .list{
      margin: 25px 0 0;
      padding: 0;
      list-style: none;
      li {
        margin-top: 16px;
        span {
          color: rgba(0,0,0,.65);
          font-size: 14px;
          line-height: 22px;
        }
        span:first-child {
          background-color: #f5f5f5;
          border-radius: 20px;
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          margin-right: 24px;
          height: 20px;
          line-height: 20px;
          width: 20px;
          text-align: center;
        }
        span.active {
          background-color: #314659;
          color: #fff;
        }
        span:last-child {
          float: right;
        }
      }
    }
  }
</style>
<script type="text/ecmascript-6">
export default {
  name: 'login',
  props: ['title', 'list'],
  data () {
    return {
      val: {
        phone: '',
        code: ''
      }
    }
  },
  methods: {},
  created () {

  },
  components: {}
}
</script>
