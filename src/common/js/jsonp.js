import originJSONP from 'jsonp'
/**
 *
 * @param {*} url 通常向服务端传入URL是带参数的,jsonp 是不支持传入object data的
 * 需要先将url带上参数拼接好才能传入jsonp库,而为了便于我们的使用,我们希望url是一个比较纯净的地址
 * 使用data传入参数
 * @param {*} data
 * @param {*} option
 */
export default function jsonp (url, data, option) {
  url += (url.indexof('?') < 0) ? '?' : '&' + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
/**
 *将传入的data对象也就是将要传入的url参数放入到url当中
 */

function param (data) {
  let url = ''
  for (const k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    // 将参数添加到url之后
    url += `&${k}=${encodeURIComponent(value)}`
  }
  // 需要删除多余的&
  return url ? url.substring(1) : ''
}
