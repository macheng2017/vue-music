<template>
  <div id="app">
      <m-header></m-header>
      <tab></tab>
      <keep-alive>
        <router-view/>
      </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
export default{
  components: {
    MHeader,
    Tab
  },
  beforeCreate() {
    console.log('App beforeCreate')
  },
  created() {
    console.log('App created')
  },
  beforeMountet() {
    console.log('App beforeMountet')
  },
  beforeUpdate() {
    console.log('App beforeUpdate')
  },
  updated() {
    console.log('App updated')
  },
  mounted() {
    console.log('App Mountetd')
  },
  beforeDestroy() {
    console.log('App beforeDestory')
  },
  destroyed() {
    console.log('App destory')
  }
}
</script>
<style  lang="stylus" scoped rel="stylesheet/stylus">
</style>
