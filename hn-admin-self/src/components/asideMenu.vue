<template>
  <div class="hn-aside-menu">
    <div class="hn-aside-title">
      <img @click="isCollapse=!isCollapse" src="../assets/logo.png" alt="">
      <span v-show="!isCollapse">管理系统</span>
    </div>
    <div class="hn-menus-box">
      <el-menu
        default-active="1"
        :collapse="isCollapse"
        text-color="#81ADCC"
        active-text-color="#fff"
        background-color="#252526"
      >
        <template v-for="(item) in menus" :key="item.id">
          <!-- 有子菜单才渲染 -->
          <el-sub-menu :index="item.id" v-if="item.child">
            <template #title>
              <el-icon><location /></el-icon>
              <span :title="item.title">{{ item.title }}</span>
            </template>
            <el-menu-item v-for="(items) in item.child" :key="items.id" :index="items.id">
              <el-icon><icon-menu /></el-icon>
              <span :title="items.title">{{ items.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          <!-- 无子菜单才渲染 -->
          <el-menu-item :index="item.id" v-else>
            <el-icon><icon-menu /></el-icon>
            <span :title="item.title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const isCollapse = ref(true)
let menus = ref([
  {id:"1",title:"菜单1"},
  {id:"2",title:"菜飒啊啊啊试试大道段试试飒单2",child:[{id:"2-1",title:"菜单2的子菜单啊啊啊啊啊啊单"}]},
  {id:"3",title:"菜单3"},
  {id:"4",title:"菜单4",child:[{id:"3-1",title:"菜单4的子菜单"}]},
  {id:"5",title:"菜单5",child:[{id:"4-1",title:"菜单5的子菜单"}]},
  {id:"6",title:"菜杀杀杀杀杀杀杀杀杀单6"},
  {id:"7",title:"菜单6"},
  {id:"8",title:"菜单6"},
  {id:"9",title:"菜单6"},
  {id:"10",title:"菜单6"},
  {id:"11",title:"菜单6"},
  {id:"12",title:"菜单6"},
  {id:"13",title:"菜单6"},
  {id:"14",title:"菜单6"},
  {id:"6",title:"菜单6"},
  {id:"6",title:"菜单6"},
  {id:"6",title:"菜单6"},
  {id:"6",title:"菜单6"},
  {id:"6",title:"菜单6"},
  {id:"6",title:"菜单6"},
  {id:"6",title:"菜单6"},
  {id:"6",title:"菜单6"},
  {id:"6",title:"菜单6"},
  {id:"6",title:"菜单888"},
])

function handleOpen(key, keyPath) {
  console.log(key, keyPath)
} 

function handleClose(key, keyPath){
  console.log(key, keyPath)

}

</script>

<style scoped>
.hn-aside-title{
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 15px 0;
  cursor: pointer;
}
.hn-aside-title img{
  width: 30px;
  height: 30px;
}
.hn-menus-box{
  margin-right: -17px;
  overflow-y: auto;
  max-height: calc(100vh - 60px);
}
.el-menu{
  max-width: 260px;
}

/* .el-menu-item{
  
} */
.el-menu-item span{
  display: inline-block;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-menu-item .el-icon{
  margin-right: 10px;
}
.el-sub-menu__title span {
  display: inline-block;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 20px;
}
</style>
