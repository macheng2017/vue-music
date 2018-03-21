<template>
 <div class="tab">
   <router-link class="tab-item" tab="div" to="/recommend"><span class="tab-link">推荐</span></router-link>
   <router-link class="tab-item" tab="div" to="/singer"><span class="tab-link">歌手</span></router-link>
   <router-link class="tab-item" tab="div" to="/rank"><span class="tab-link">排行</span></router-link>
   <router-link class="tab-item" tab="div" to="/search"><span class="tab-link">搜索</span></router-link>

 </div>
</template>

<script>
export default {
  beforeCreate() {
    console.log('Tab beforeCreate')
  },
  created() {
    console.log('Tab created')
  },
  beforeMountet() {
    console.log('Tab beforeMountet')
  },
  beforeUpdate() {
    console.log('Tab beforeUpdate')
  },
  updated() {
    console.log('Tab updated')
  },
  mounted() {
    console.log('Tab Mountetd')
  },
  beforeDestroy() {
    console.log('Tab beforeDestory')
  },
  destroyed() {
    console.log('Tab destory')
  }

}
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"
  .tab
    display: flex
    height: 44px
    line-height: 44px
    font-size: $font-size-medium
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        padding-bottom: 5px
        color: $color-text-l
      &.router-link-active
        .tab-link
          color: $color-theme
          border-bottom: 2px solid $color-theme
</style>
