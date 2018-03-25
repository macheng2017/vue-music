<template>
 <div class="singer">
   <listview :data="singers">
   </listview>
</div>

</template>

<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import Listview from 'base/listview/listview'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  data () {
    return {
      singers: []
    }
  },
  components: {
    Listview
  },
  created() {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data.list)
          this.singers = res.data.list
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    // 构建符合我们列表的数据
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          )
        }
        // 生成字母列表
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // 或者这种方式 new Singer (item.Fsinger_mid, item.Fsinger_name) 想一下两种写法那种更好
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 为了得到有序列表,需要处理map
      /**
       * 1. 将map,根据title的值分成两份
       * 2. 字母列表放到ret数组中,title值为 HOT_NAME
       * 3.
      */
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match('[a-zA-Z]{1}')) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        // a.title.charCodeAt(0) - b.title.charCodeAt(0) 如果大于零则返回 true
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // 将数组排序后链接到一起
      return hot.concat(ret)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%

</style>
