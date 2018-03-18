<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'
export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    }, 20)
  },
  methods: {

    /**
     *     //需要计算slider的宽度,这里的slider是横向的
     *1. 首先需要先获取slider下面的列表到底有多少个元素
     *2. 然后初始化sliderGroup的宽度 width = 0 随后用计算结果赋值
     *3. 获得slider的宽度这个是被里面图片撑开,即获取里面图片宽度即可
     *4. 使用循环计算sliderGroup的宽度并赋值给width
     *      1.现获取到每个子元素child
     *      2.位每个子元素添加class属性,添加class的方法addClass已经抽离成公用方法了
     *      3.每个child设置宽度
     *5. 如果this.loop是true,接下来会初始化loop
          1.实际上是clone两个dom,为了保证循环切换
          2. 需要加两倍的sliderwith

     *
     *
     */
    _setSliderWidth() {
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')

        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400,
        click: true
      })
      /**
       * 滚动当前页圆点放大
       * 维护currentPageIndex 将滚动到某一页与其关联
       * better-scroll 在滚动的时候会派发一个事件的
       * 可以在初始化initSlider定义一个事件
       * 如果在loop模式下默认会在第一个和最后一个元素中添加2个元素
       * 则pageIndex -=1
       */
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        if (this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _initDots() {
      // dots 是图片上的小圆点,在下面顶一个长度为children.length的空数组
      this.dots = new Array(this.children.length)
    },
    _play() {
      let pageIndex = this.currentPageIndex + 1
      if (this.loop) {
        // 和上面的逻辑是一样的,因为有副本的缘故
        pageIndex += 1
      }
      // 定义定时器
      this.timer = setTimeout(() => {
        // 切换时使用better-scroll goToPage()
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
