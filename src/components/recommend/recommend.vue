<template>
 <div class="recommend">
   <scroll class="recommend-content" :data="discList" ref="scroll">
    <div>
     <div v-if="this.recommends.length" class="slider-wrapper">
         <!-- 放到slider组件的插槽中 -->
       <slider>
          <div  v-for="item in recommends" :key="item.id">
            <!-- 从获取的数据可以得到linkUrl -->
            <a :href="item.linkUrl">
              <img @load="loadImage" :src="item.picUrl">
            </a>

          </div>
       </slider>

     </div>
     <div class="recommend-list">
       <h1 class="list-title">热门歌单</h1>

        <ul>
          <li class="item" v-for="(item, index) in discList" :key="index">
            <div class="icon">
              <img width="60" height="60" v-lazy="item.imgurl" alt="">
            </div>
            <div class="text">
              <h2 class="name" v-html="item.creator.name"></h2>
              <p class="desc" v-html="item.dissname"></p>
            </div>
          </li>
        </ul>
      </div>
      </div>

      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>

    </scroll>
 </div>
</template>

<script>
import Loading from 'base/loading/loading'
import Slider from 'base/slider/slider'
import { ERR_OK } from 'api/config'
import { getRecommend, getDiscList } from 'api/recommend'
import Scroll from 'base/scroll/scroll'

export default {
  beforeCreate() {
    console.log('Recommend beforeCreate')
  },

  beforeMountet() {
    console.log('Recommend beforeMountet')
  },
  beforeUpdate() {
    console.log('Recommend beforeUpdate')
  },
  updated() {
    console.log('Recommend updated')
  },
  mounted() {
    console.log('Recommend Mountetd')
  },
  beforeDestroy() {
    console.log('Recommend beforeDestory')
  },
  destroyed() {
    console.log('Recommend destory')
  },
  created() {
    console.log('recommend created')
    this._getRecommend()
    setTimeout(() => {
      this._getDiscList()
    }, 2000)
  },
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data.slider)
          this.recommends = res.data.slider
        }
      })
        .catch(err => console.log(err))
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    loadImage() {
      // 高频小套路 设置一个标志位,确保逻辑只执行一次
      if (!this.checkLoaded) {
        console.log('图片加载重新计算...')
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
