<template>
<div ref="wrapper">
  <slot></slot>
</div>
</template>

<script>
import BScroll from 'better-scroll'
export default {

  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    }
  },
  beforeCreate() {
    console.log('Scroll beforeCreate')
  },
  beforeMountet() {
    console.log('Scroll beforeMountet')
  },
  beforeUpdate() {
    console.log('Scroll beforeUpdate')
  },
  updated() {
    console.log('Scroll updated')
  },
  beforeDestroy() {
    console.log('Scroll beforeDestory')
  },
  destroyed() {
    console.log('Scroll destory')
  },
  created() {
    console.log('scroll created')
  },
  mounted() {
    console.log('scroll mounted')
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
    },
    // 代理方法
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    // 滚动到某个位置
    scrollTo() {
      // 这里为什么要用apply 因为scrollTo需要接受一些参数,需要应用到下面的语句
      // 第一参数是this.scroll是当前上下文 arguments 是传传入的参数
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },

  // 保证组件内部自动刷新 函数式 命令式
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
