index.html

**移动端的惯例添加**
```JavaScript
 <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no">
 ```
>- width - viewport的宽度 height - viewport的高度
>- initial-scale - 初始的缩放比例
>- minimum-scale - 允许用户缩放到的最小比例
>- maximum-scale - 允许用户缩放到的最大比例
>- user-scalable - 用户是否可以手动缩放

[在移动浏览器中使用viewport元标签控制布局](https://developer.mozilla.org/zh-CN/docs/Mobile/Viewport_meta_tag)

[viewport标签](https://www.cnblogs.com/2050/p/3877280.html)

### 添加依赖
package.json

- babel-runtime
- fastclick [解决移动端点击300毫秒延迟](https://www.jianshu.com/p/16d3e4f9b2a9)
- babel-polyfill 对es6的api进行转义例如promise

>npm i babel-runtime fastclick babel-polyfill

      在main.js 中import babel-polyfill

```JavaScript
import fastclick from 'fastclick'
/* 去掉300毫秒的延时 */
fastclick.attach(document.body)
```
[参考](http://blog.csdn.net/feifanzhuli/article/details/78247388?locationNum=1&fps=1)

