<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType = "probeType"
          @scroll="scroll" >

    <ul >
      <li class="list-group" v-for="(group, index) in data" :key="index" ref="listGroup" >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="(item, index) in group.items" :key="index">
            <img class="avatar"  v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"  @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            class="item"
            :key="index"
            :class="{'current': currentIndex===index}"
            :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'

// 18 实在css定义每个元素的高度
const ANCHOR_HEIGHT = 18
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0

    }
  },
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  },
  created() {
    this.listenScroll = true
    this.touch = {}
    this.listHeight = []
    this.probeType = 3
  },
  methods: {
    onShortcutTouchStart(e) {
      // 获取子元素上的:data-index = "index" 属性值
      let anchorIndex = getData(e.target, 'index')
      // 在开始的时候获取一个touch
      // 第一次触碰到手指文touchs[0]
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      // 先记录下当前的锚点
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // | 0 向下取整
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      // 先定义好锚点的高度
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      // 1.  这里需要维护一个scrollY,观测一个实时滚动的位置
      // 2.  这个实时滚动的位置是通过一个scroll事件
      this.scrollY = pos.y
      // 3.  还要维护一个currentIndex 当前显示的第几个字母栏,其对应的什么字母右侧相应的字母应该高亮,默认是0 也就是第一个应该高亮
      // 4.  接下来,就需要实时的获取scrollY,并且计算scrollY落在那个列表位置,而每个group都有高度,需要计算下每个group的高度
      // 5.  需要写一个方法,与饿了么商品列表的左右联动是一样的
      // 6. _calculateHeight(){}这个私有调用时机是在哪? 当我们的data,即传递给listview的data发生变化时我们需要重新计算其高度
      // 7. 添加一个 watch data发生变化了 需要延时计算一下setTimeout, 延时的原因是数据变化到dom的变化是有一个延时,通常是在确保所有手机兼容性都可以,就可以在20毫秒
      // 8.  dom计算好了就可以计算高度,计算每个group的高度this._calculateHeight()
      // 9. 可以在初始化的时候created写一个初始高度[],由_calculateHeight()方法维护

      // 我们现在可以观察scrollY了 因为我们通过better-scroll拿到这个scrollY,所以就可以watch它的变化
    },
    _scrollTo(index) {
      // 第二个参数  滚动动画时间为0
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight() {
      // 在这里重新初始化一下
      this.listHeight = []
      // 获取group的高度
      const list = this.$refs.listGroup
      // 定义开始高度
      let height = 0
      // 第一个元素高度也是0
      this.listHeight.push(height)
      // 使用循环遍历这个list
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        // 因为它是个dom可以直接用clientHeight去获取高度
        height += item.clientHeight
        // 这样就得到从第一个到最后一个元素的所有高度
        this.listHeight.push(height)
        // 这样这个scrollY变化的时候我们就可以通过对比scrollY 和这个list知道scrollY落在了第几个区间,然后从而可以得到这个currentIndex
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      // 先对listHeight做一次引用,下面会多次使用
      const listHeight = this.listHeight

      // 当滚动到顶部, newY>0

      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间滚动

      // 判断坐标落在那个位置,通过对比上下限
      for (let i = 0; i < listHeight.length - 1; i++) {
        // 获取下限
        let height1 = listHeight[i]
        // 获取上限
        let height2 = listHeight[i + 1]
        // !height2 不是遍历到最后一个 或者 -newY 往下滚动的时候y值是一个负值 加个-号 变成正值,因为height的计算都是正值 大于下限 且 小于上限
        if (!height2 || (-newY > height1 && -newY < height2)) {
        // 那么这个值就在这个区间
          this.currentIndex = i
          console.log(this.currentIndex)
          return
        }
      }
      // 当滚动到底部,且-newY 大于最后一个元素的上限
      this.currentIndxe = listHeight.length - 2
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"

.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
