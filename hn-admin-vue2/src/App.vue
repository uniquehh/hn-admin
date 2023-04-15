<template>
  <div id="app">
    <router-view />
    <!-- 按钮模板 -->
    <!-- <el-button icon="el-icon-upload">导出全部</el-button> -->
    <!-- <el-button icon="el-icon-plus" type="primary">新增企业</el-button> -->
    <!-- <el-button>重置</el-button> -->
    <!-- <el-button type="primary">搜索</el-button> -->
    <!-- <el-button icon="el-icon-search" type="primary">搜索</el-button> -->
    <!-- <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
  <!-- 日期选择 suffix-icon -->
  <!-- <el-input
    placeholder="请选择日期"
    prefix-icon="el-icon-date"
    v-model="input1">
  </el-input> -->
  <!-- 搜索框 -->
  <!-- <el-input
    placeholder="请输入内容"
    prefix-icon="el-icon-search"
    v-model="input2">
  </el-input> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    // ...mapState('user', ['userInfo','isLogin']),
    ...mapState('topMenu', ['topMenus', 'current']),
  },
  mounted() {

  },
  updated() {
    // console.log(this.$route)
    this.stSetTopCurrent(this.$route.fullPath)
    this.handleMianBao(this.$route.fullPath)
  },
  beforeDestroy() {
    // 关闭页面前清除顶部菜单缓存数据--下次进入页面自动跳转首页
    this.removeTopMenuStorage()
  },
  methods: {
    ...mapMutations('topMenu', ['stSetTopMenus', 'stSetTopCurrent']),
  }
}
</script>

<style lang="scss">
/* 主题颜色 #409EFF */
@import '@/assets/css/hncss.scss';

* {
  margin: 0;
  padding: 0;
  text-decoration: none;
}

#app {
  overflow: hidden;
}

.page {
  font-size: 14px;
  height: 100%;
  word-break: break-all;
  word-wrap: break-word;
}

.el-menu-item:hover {
  background-color: #409EFF !important;
  color: white !important;
}

.el-menu-item:hover i {
  color: white !important;
}

.el-submenu__title:hover {
  background-color: #409EFF !important;
  color: white !important;
}

.el-submenu__title:hover i {
  color: white !important;
}

.hn-menus-box i {
  color: #fff !important;
}

.el-pagination__jump {
  margin-left: 0px !important;
}

.el-table th.el-table__cell {
  background-color: #FAFAFA !important;
}

.el-input {
  width: unset !important;
}</style>
