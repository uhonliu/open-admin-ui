<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    try {
      document.body.removeChild(document.getElementById('appLoading'))
      setTimeout(function () {
        document.getElementById('app').style.display = 'block'
      }, 500)
    } catch (e) {

    }
  }
}
</script>

<style lang="less">
    .size{
        width: 100%;
        height: 100%;
    }
    html,body{
        .size;
        overflow: hidden;
        margin: 0;
        padding: 0;
    }
    #app {
        .size;
    }
</style>
