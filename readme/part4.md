# part4.0 联系人列表-歌手详情页

新建文件
    src/api/singer.js
经过分析从这个连接获取数据

https://c.y.qq.com/v8/fcg-bin/v8.fcg

```js
import jsonp from 'common/js/jsonp'
import {commonParmas, options} from './config'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParmas, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    loginUin: 0,
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options)
}
```

和其recommend.js页面是一样的

## 数据聚合

通过观察发现歌手的头像有一部分数是不变的
这样我们可以将一些有用的数据,放到我们的list当中
例如:

https://y.gtimg.cn/music/photo_new/T001R300x300M000002J4UUk29y8BY.jpg

```js
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
//...
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
          map.hot.items.push({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
            avatar: 'https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000'
          })

        }
        // 生成字母列表
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
      map[key].items.push({
        id: item.Fsinger_mid,
        name: item.Fsinger_name,
        avatar: 'https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000'
      })
    });
    }
```

创建一个对象将重复的数据放到一个对象当中

创建一个Singer类

```js
export default class Singer {
  constructor({id, name}) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
```

```js
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
            id:item.Fsinger_mid,
            name:item.Fsinger_name
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
      map[key].items.push(new Singer ({
        id: item.Fsinger_mid,
        name: item.Fsinger_name,
      }))
    })
    }
  ```

* 上面的map中定义了,有两种对象 一种为hot下面的列表
* 列表中保存了同样的数据只是数据结构的定义方式不一样
* 下面的列表是一个无序的

![image](./images/map.png)

![image](./images/vue-music00012.png)

## 将map排序

```js
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
```

```js
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
```

## 类通讯录的组件

创建文件
/src/base/listview/listview.vue

```html
<template>
  <scroll class="listview" :data="data">
    <ul >
      <li class="list-group" v-for="(group, index) in data" :key="index" >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="(item, index) in group.items" :key="index">
            <img class="avatar" :src="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
export default {
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  components: {
    Scroll
  }
}
</script>
```

## 在singer.vue中引入刚刚定义的组件

```html
import Listview from 'base/listview/listview'

<template>
 <div class="singer">
   <listview :data="singers"/>
</div>
</template>
```

## 使用懒加载

因为之前使用了 v-lazy插件,这里直接使用即可

```js
 v-lazy="item.avatar"
```

## 实现右侧快速入口

使用数组的[map方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

// 生成一个符合条件的的数组
```js  computed: {
    shotCutList() {
      return this.data.map((currentValue, index, array) => {
        return currentValue.title.substr(0,1)
      })
    }
  }
  computed: {
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0,1)
      })
    }
  },
```

```html
 <div class="list-shortcut"  @touchstart="onShortcut">
      <ul>
        <li v-for="(item, index) in shortcutList" class="item" :key="index" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
</scroll>
```

字母索引

* 需要在字母列表上加上点击事件@touchstart="onShortcut
* 需要在点击的当前字母上加上索引
* 通过遍历的(item, index) 拿到索引 加上:data-index="index"的属性
* 定义方法onShortcutTouchStart(e)中通过dom上的:data-index获取
* 由于是基础的dom操作所以,将其封装到dom.js当中
*

/common/js/dom.js
```js
/**
 * 获取dom上的特定属性名称
 * 由于v-for循环出来的子元素 :data-index="index"值是一变动的
 * @param {*} el 传进来的元素
 * @param {*} name 元素的后缀 (data-index的index)
 * @param {*} val  当元素没有属性的时候,在其上加上元素
 */
export function getData (el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}
```


## 在scroll 扩展两个方法上添加滚动组件到相应位置

* 调用better-scroll 方法的封装
*

扩展scroll组件中的方法

```js
    // 滚动到某个位置
    scrollTo() {
      // 这里为什么要用apply 因为scrollTo需要接受一些参数,需要应用到下面的语句
      // 第一参数是this.scroll是当前上下文 arguments 是传传入的参数
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.sccroll.scrollToElement.apply(this.scroll, arguments)
    }
```

```js
  methods: {
    onShortcutTouchStart(e) {
      // 获取子元素上的:data-index = "index" 属性值
      let anchorIndex = getData(e.target, 'index')
      this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
    }
  }
```

[参考](https://github.com/ustbhuangyi/better-scroll/blob/master/example/components/scroll/scroll.vue)

## 添加滑动查找

* 监听touchmove事件
* 需要阻止左边滚动添加 @touchmove.stop.prevent 阻止事件冒泡,阻止浏览器原生滚动

@touchmove.stop.prevent="onShortcutTouchMove"

onShortcutTouchMove 的原理

* 从touchstart到touchmove到滚动的当前位置之差data
* 根据data确定滚动到了几个元素
* 从touchstart 获取一个位置,到touchmove获取一个位置

* 在开始的时候获取一个touch
* 第一次触碰到手指文touchs[0]
* 需要在两个函数之间共享
* 在created(){ } 定义一个this.touch

> 为什么不在data:{}中定义this.touch={} ?

原因是vue会在添加data中的属性添加getter和setter,也就是会观察属性值的变化,而我们不需要vue监听touch的变化,添加touch是为了让两个函数之间可以获取到同样的数据

```js
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'

// 18 实在css定义每个元素的高度
const ANCHOR_HEIGHT = 18
//...
created() {
  this.touch = {}
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
    _scrollTo(index) {
      // 第二个参数  滚动动画时间为0
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    }
  }
}
</script>


```

## 左右联动,右侧字母高亮

### 左右联动原理

* 左右联动,右侧必须知道左侧滚动的位置,根据位置实时计算滚动落在了那个区间
* 知道了那个区间,需要知道对应右侧的那个索引,那个区间索引应该高亮
* 需要实时监听y轴滚动的位置
* 对scroll组件进行拓展



```js
 // 用来标识scroll是否监听滚动事件
    // 一般的列表不用监听,除非是像我们接下来做的左右联动的组建
    listenScroll: {
      type: Boolean,
      default: false
    }
// ...
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      // 需要在初始化的时候监听scroll的滚动事件
      if (this.listenScroll) {
        // 拿到 pos 位置,使用回调
        // 派发事件出去
        let me = this
        this.scroll.on('scroll', (pos) => {
          // 这里的this默认是指向scroll的,我们需要vue实例的this所以,在外面转存一下即可
          // 这样我们就可以使用vue实例的$emit派发一个scroll事件,将滚动位置pos传递出去,
          // 在外面需要的位置监听此次派发scroll,即可
          me.$emit('scroll', pos)
        })
      }
```

### 在组件listview.vue当中添加

* 设置绑定listenScroll,这样就可以将listenScroll=true传递进去
* 设置监听@scroll="scroll" 这样就可以监听到从scroll组件中派发过来的事件并接收到pos参数

```html
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          @scroll="scroll" >

```

```js
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0

    }
  },
  watch: {
    data() {
      setTimeout(()=>{
        this._calculateHeight()
      }, 20),
      scrollY(newY) {
        // 先对listHeight做一次引用,下面会多次使用
        const listHeight = this.listHeight
        // 判断坐标落在那个位置,通过对比上下限
        for (let i = 0; i < listHeight.length; i++){
          // 获取下限
          let height1 = listHeight[i]
          // 获取上限
          let height2 = listHeight[i+1]
          // !height2 不是遍历到最后一个 或者 -newY 往下滚动的时候y值是一个负值 加个-号 变成正值,因为height的计算都是正值 大于下限 且 小于上限
          if(!height2 || (-newY > height1 && -newY < height2){
          // 那么这个值就在这个区间
            this.currentIndex = i
            console.log(this.currentIndex)
            return
        }

      }
      this.currentIndxe = 0
    }
  }

  methods: {
    // ...
    scroll(pos) {
      //1.  这里需要维护一个scrollY,观测一个实时滚动的位置
      //2.  这个实时滚动的位置是通过一个scroll事件
      this.scrollY = pos.y
      //3.  还要维护一个currentIndex 当前显示的第几个字母栏,其对应的什么字母右侧相应的字母应该高亮,默认是0 也就是第一个应该高亮
      //4.  接下来,就需要实时的获取scrollY,并且计算scrollY落在那个列表位置,而每个group都有高度,需要计算下每个group的高度
      //5.  需要写一个方法,与饿了么商品列表的左右联动是一样的
      //6. _calculateHeight(){}这个私有调用时机是在哪? 当我们的data,即传递给listview的data发生变化时我们需要重新计算其高度
      //7. 添加一个 watch data发生变化了 需要延时计算一下setTimeout, 延时的原因是数据变化到dom的变化是有一个延时,通常是在确保所有手机兼容性都可以,就可以在20毫秒
      //8.  dom计算好了就可以计算高度,计算每个group的高度this._calculateHeight()
      //9. 可以在初始化的时候created写一个初始高度[],由_calculateHeight()方法维护


      // 我们现在可以观察scrollY了 因为我们通过better-scroll拿到这个scrollY,所以就可以watch它的变化


    this._calculateHeight() {
      // 在这里重新初始化一下
      this.listHeight = []
      // 获取group的高度
      const list = this.$refs.listGroup
      // 定义开始高度
      let height = 0
      // 第一个元素高度也是0
      this.listHight.push(height)
      // 使用循环遍历这个list
      for(let i= 0; i<list.length; i++) {
        let item = list[i]
        // 因为它是个dom可以直接用clientHeight去获取高度
        height += item.clientHeight
        // 这样就得到从第一个到最后一个元素的所有高度
        this.listHeight.push(height)
        // 这样这个scrollY变化的时候我们就可以通过对比scrollY 和这个list知道scrollY落在了第几个区间,然后从而可以得到这个currentIndex
      }
    }
  }
   },
```

* 建议私有方法放在下面,共有的或者绑定事件的方法放在上面

>有一个问题,只能监听到手指按住滚动,惯性滚动监听不到?

原因是scroll 滚动 probeType 默认值是1 监听到实时滚动需要改到3

需要传递进去3

**注意组件传值的方法?**

```html
 :probeType = "probeType"

<scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType = "probeType"
          @scroll="scroll" >
```

```js
  created() {
    //...
    this.probeType = 3
  },
```

## 现在可以拿到currentIndex了

```html
<div class="list-shortcut"  @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            class="item"
            :key="index"
            :class="{'current': currentIndex==index}"
            :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
```

添加当后面的值为true时候
:class="{'current': currentIndex===index}"

[用法参考Class 与 Style 绑定 — Vue.js ](https://cn.vuejs.org/v2/guide/class-and-style.html)

> 问题滚动到最上方的时候高亮消失?

将上面的逻辑拆分
1. 当滚动到顶部的时候 newY > 0
2. 在中间部分
3. 当滚动到底部,且-newY 大于最后一个元素的上限

```js
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
  ```
