<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
/* 主题颜色 #409EFF */
@import './assets/css/hncss.scss';
*{margin: 0;padding: 0;text-decoration: none;}
#app{
  overflow: hidden;
}
.page{
  font-size: 14px;
  height: 100%;
  word-break: break-all;
  word-wrap: break-word;
}
.el-menu-item:hover{
  background-color: #409EFF !important;
  color: white !important;
}
.el-menu-item:hover i{
  color: white !important;
}
.el-submenu__title:hover{
  background-color: #409EFF !important;
  color: white !important;
}
.el-submenu__title:hover i{
  color: white !important;
}
.hn-menus-box i{
  color: #fff !important;
}
</style>
