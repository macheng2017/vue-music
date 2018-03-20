<template>
 <div class="recommend">
   <div class="recommend-content">
     <div v-if="this.recommends.length" class="slider-wrapper">
         <!-- 放到slider组件的插槽中 -->
       <slider>
          <div  v-for="item in recommends" :key="item.id">
            <!-- 从获取的数据可以得到linkUrl -->
            <a :href="item.linkUrl">
              <img :src="item.picUrl">
            </a>

          </div>
       </slider>

     </div>
     <div class="recommend-list">
       <h1 class="list-title">热门歌单</h1>
     </div>
   </div>
 </div>
</template>

<script>
import Slider from 'base/slider/slider'
import { ERR_OK } from 'api/config'
import { getRecommend, getDiscList } from 'api/recommend'
export default {
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  data() {
    return {
      recommends: []
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
          console.log(res.data.list)
        }
      })
    }
  },
  components: {
    Slider
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

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
