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
