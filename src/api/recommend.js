import jsonp from 'common/js/jsonp'
import {commonParmas, options} from './config'
import axios from 'axios'
/**
 * 获取轮播图推荐数据
 */
export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  // Object.assign将对象和一堆参数合并成一个对象
  const data = Object.assign({}, commonParmas, {
    needNewCode: 1,
    platform: 'h5',
    uin: 0
  })
  return jsonp(url, data, options)
}
/**
 * 获取歌单数据
 */
export function getDiscList() {
  const url = '/api/getDiscList'
  // 合并/拼接 公共数据
  const data = Object.assign({}, commonParmas, {
    // picmid: 1,
    rnd: Math.random(),
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    console.log(res.data)
    return Promise.resolve(res.data)
  })
}
