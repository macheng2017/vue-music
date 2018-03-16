import jsonp from 'common/js/jsonp'
import {commonParmas, options} from './config'
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
