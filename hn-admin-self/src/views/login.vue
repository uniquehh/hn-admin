<template>
  <!-- <div class="about">
    <h1 v-hasPower="['1234']">This is an about page</h1>
  </div> -->
  <div class="page">
    <div class="hn-login-bgbox">
      <div class="hn-login-form">
        <div class="hn-login-main">
          <div class="hn-login-cont">
            <div class="hn-login-title">
              <h4 style="margin-bottom: 10px;">欢迎登录</h4>
              <h4 style="margin-bottom: 30px;">欢迎登录XX数字化信息管理平台</h4>
            </div>
            <div class="hn-login-user">
              <el-input
                placeholder="请输入账号"
                :prefix-icon="User"
                v-model="userName"
                type="text"
              />
            </div>
            <div class="hn-login-pass">
              <el-input
                placeholder="请输入密码"
                :prefix-icon="Lock"
                v-model="password"
                show-password
                type="password"
              />
            </div>
            <el-button style="width: 100%;" color="#4E72ED">登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,getCurrentInstance } from 'vue'
import { User, Lock,View,Hide } from '@element-plus/icons-vue'
let { proxy } = getCurrentInstance()
let password = ref("")
let userName = ref("")
let showPass = ref(false)
// proxy.$axios('asd/fff', { a: 1, b: "" })


</script>
<style scoped>
.hn-login-bgbox{
  width: 100%;
  height: 100vh;
  background: url("@/assets/img/loginbg1.jpg") no-repeat center;
  background-size: cover;
}
.hn-login-form{
  background-color: #4E72ED;
  /* opacity: 0.8; */
  border-radius: 5px;
  box-sizing: border-box;
  padding-top: 10px;
  width: 350px;
  position: absolute;
  top: 200px;
  right: 250px;
}
.hn-login-main{
  background-color: rgba(255, 255, 255,1);
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  padding-top: 60px;
  padding-bottom: 80px;
}
.hn-login-cont{
  width: 240px;
  margin: 0 auto;
}
.hn-login-user{
  margin-bottom: 15px;
}
.hn-login-user,.hn-login-pass{
  width: 240px;
}
.hn-login-pass{
  margin-bottom: 30px;
}

</style>