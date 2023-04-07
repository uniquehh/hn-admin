<template>
  <div class="hn-topnav-menus">
    <el-menu default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item class="hn-hmenu-item" index="1">
      <span style="margin-right: 5px;">处理这些</span>
      <i style="font-size: 14px;" class="el-icon-close"></i>
    </el-menu-item>
    <el-menu-item class="hn-hmenu-item" index="2">
      <span style="margin-right: 5px;">处理这些</span>
      <i style="font-size: 14px;" class="el-icon-close"></i>
    </el-menu-item>
    <el-menu-item class="hn-hmenu-item" index="3">
      <span style="margin-right: 5px;">处理这些</span>
      <i style="font-size: 14px;" class="el-icon-close"></i>
    </el-menu-item>
  </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style lang="scss" scoped>
.hn-topnav-menus{
  background-color: white;
}
.el-menu--horizontal{
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
}
.hn-hmenu-item{
  height: 36px !important;
  line-height: 36px !important;
  &:hover{
    background-color: #409EFF !important;
  }
}
.hn-hmenu-item [class^=el-icon-]{
  margin-right: 0;
  width: unset;
}
</style>