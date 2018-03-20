# part3.0 歌单详情页面

经过分析得到这个url

https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg


获取歌单数据

recommend.js

```js
export function getRecommend () {/*...*/}
/**
 * 获取歌单数据
 */
export function getDiscList() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
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
  return jsonp(url, data, options)
}
```
recommend.vue 引用
```js
import { getRecommend, getDiscList } from 'api/recommend'
// ...
 methods: {
    _getRecommend() {/*...*/},
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data.list)
        }
      })
    }
  }
```
* 定义完成测试却不能正确的得到数据

![image](./images/getDiscList-error.png)
```js
__jp1({"code":-2,"subcode":-2,"message":"parameter failed!","notice":0,"tips":"parameter failed!","time":1521529965})
```
原因是qqMusic对请求连接的receive和host做了校验,还有跨域的限制
对比第一次请求中response中却没有下面的的值
```js
access-control-allow-credentials:true
access-control-allow-origin:http://y.qq.com
referer:https://y.qq.com/portal/playlist.html
```
> 那么如何绕过校验拿到数据?

使用后端代理
* 在开发的vue项目的时候会启动一个server,这个server
* 可以在dev-server.js中代理这个请求


但是问题是新版本的vue-cli中没有 dev-server.js 和 dev-client.js了


https://github.com/vuejs-templates/webpack/pull/975

问题解决:
http://blog.csdn.net/github_37533433/article/details/78936133

http://blog.csdn.net/qq_34645412/article/details/78833860

[使用before参考webpack文档](https://webpack.js.org/configuration/dev-server/#devserver-before)

## 在webpack.dev.conf.js 配置路由 代理转发获取数据

```js
//通过代理来请求qqmusic 歌单页面
const axios = require('axios')
const express = require('express')
const app = express()
const apiRoutes = express.Router()
//...
 watchOptions: {
      poll: config.dev.poll,
    },


    // 添加before
    before(app){
      apiRoutes.get('/getDiscList', function(req, res) {
        let url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers:{
            referer:'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          // 透传 将 /getDiscList 透传给qqmusic
          params: req.query
        }).then(response => {
          // 透传个我们上一个请求 /getDiscList
          res.json(response.data)
        }).catch(e => console.log(e))
      })
       app.use('/api', apiRoutes)
    }
```

修改 recommend.js
```js
import axios from 'axios'

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
    //console.log(res.data)
    return Promise.resolve(res.data)
  })
}
```
我们需要的是一个json

* 通过设置host rece



