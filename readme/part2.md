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
import 'babel-polyfill' //一定要写到最开始的 babel-runtime 是不用写在代码中,在编译过程中自动调用
import fastclick from 'fastclick'
/* 去掉300毫秒的延时 */
fastclick.attach(document.body)//推荐用法
```
  [fastclick参考](https://github.com/ftlabs/fastclick)

#   实现m-header组件
*  位置
    *  ./components/m-header/


variable 中定义了一些通用的规范 字体 颜色,导入之后就可以用了(例如:$color-background)

mixin 中定义了一些方法 bg-img 将logo图片导入

在APP.vue 引入组件m-header.vue

```JavaScript
<template>
  <div id="app">
      <m-header></m-header>
    <!-- <router-view/> -->
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'compontents/m-header/m-header'
export default{
  components:{
    MHeader
  }
}
</script>

```

>NOTE: 命名: 将m-header的组件名在注册组件的时候换成了驼峰命名
>
>html中大小写不敏感m-header 在js当中m-header不支持只能用驼峰
![image](./readme/images/error2.png)

webpack.base.conf.js
别名的配置
```JavaScript
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
      'common':resolve('src/common'),
      'components':resolve('src/components'),
    }
  },
```
# 2.1
