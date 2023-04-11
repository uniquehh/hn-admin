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
              <h3 style="margin-bottom: 10px;">欢迎登录</h3>
              <h3 style="margin-bottom: 30px;">欢迎登录XX数字化信息管理平台</h3>
            </div>
            <el-form :model="loginForm" :rules="loginRules" ref="lgForm">
              <el-form-item prop="userName">
                <el-input
                  placeholder="请输入账号"
                  prefix-icon="el-icon-user"
                  v-model="loginForm.userName"
                  type="text"
                />
              </el-form-item>
              <el-form-item class="hn-login-pass" prop="password">
                <el-input
                  placeholder="请输入密码"
                  prefix-icon="el-icon-lock"
                  v-model="loginForm.password"
                  show-password
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button style="width: 100%;" type="primary" @click="submitForm">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
export default {
  data() {
    return {
      loginForm: {
        userName: "",
        password: "",
      },
      loginRules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      }
    }
  },
  computed: {
    ...mapState('user', ['userInfo','isLogin']),
  },
  mounted() {

  },
  methods: {
    ...mapMutations('user',['stSetUserInfo','stSetIsLogin']),
    // login
    submitForm() {
      this.$refs.lgForm.validate((valid) => {
        if (valid) {
          let pass = this.$md5(this.loginForm.password)
          let res = this.request('/auth/login', {
            account: this.loginForm.userName,
            password: pass,
          }, 'post')
          console.log(res)

          // this.stSetUserInfo({ name: "zahsng" })
          // this.stSetIsLogin(true)
          // this.$router.replace({path:'/index'})
        } else {
          return false;
        }
      });
    },


  },
}

</script>
<style lang="scss" scoped>
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
  ::v-deep .el-input{
    width: 100% !important;
  }
}
.hn-login-pass{
  margin-bottom: 30px;
}

</style>