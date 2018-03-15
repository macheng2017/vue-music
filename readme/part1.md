# 使用vue脚手架
### vue init webpack vue-music
>可以帮我们初始化 webpack的配置,


  * Runtime + Compiler: recommended for most users
  * Runtime-only: about 6KB lighter min+gzip, but templates (or any Vue-specific HTML)
      are ONLY allowed in .vue files - r
      ender functions are required elsewhere
>
    Runtime + CompilerRuntime-only 小了6k大小省略了一个模板的编译过程,编译过程是在webpack 使用vue-loader编译 .vue 文件的时候做的
    第一个可以不基于.vue文件的开发,可以 运行时编译因为有compiler





下图的 ESLink what?

    eslink 是es6代码风格检查器

![image](./images/vue-init-webpack.png)

* 这个是什么?

Standard (https://github.com/standard/standard)

  Airbnb (https://github.com/airbnb/javascript)
  none (configure it yourself)

目录结构,将脚手架没有创建出来的文件创建出来

.gitkeep 是保证如果是空文件可以上传到GitHub上而不被过滤掉

修改App.vue


<template>
<div id="app">
hello world
<router-view/>
</div>
</template>

<script type="text/ecmascript-6">

</script>

<style lang="stylus" scoped rel="stylesheet/stylus" >
@import "~common/stylus/variable"
#app {
color:$color-theme
}
</style>




样式文件

base 是基础的样式文件

@import "variable.styl"

body, html
line-height: 1
font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback'
user-select: none
-webkit-tap-highlight-color: transparent
background: $color-background
color: $color-text










