<template>
  <div class="hn-user-pson">
    <div class="hn-user-head">
      <div class="hn-userh-img">
        <el-avatar :size="88" :src="userInfo.headImg? userInfo.headImg :require('../../assets/img/defAvatar.png')">
        </el-avatar>
        <el-upload
          class="hn-userhi-icon"
          :action="config.apiUrl+'/file/addFiles'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="{token:userInfo.token}"
          name="img"
        >
          <i class="el-icon-camera"></i>
        </el-upload>
        
      </div>
      <div class="hn-userh-info">
        <div class="hn-userhi-name">{{ userInfo.realName }}</div>
        <div class="hn-userhi-tip">推荐尺寸88*88/500k JPG、GIF、PNG格式上传</div>
      </div>
    </div>
    <!-- 用户信息 -->
    <div class="hn-user-info">
      <div class="hn-userhi-name">
        <span>基本资料</span>
        <span class="hn-userhi-edit" @click="openEdit">编辑资料</span>
      </div>
      <div class="hn-useri-tr">姓名：{{ userInfo.realName }}</div>
      <div class="hn-useri-tr">性别：{{ userInfo.sex==0?'女': userInfo.sex == 1 ?'男':'保密' }}</div>
      <div class="hn-useri-tr">年龄：{{ userInfo.age }}</div>
      <div class="hn-useri-tr">电话：{{ userInfo.phone }}</div>
      <div class="hn-useri-tr">是否被禁止接单：{{ userInfo.whetherReceive?'是':'否' }}</div>
    </div>
    <!-- 编辑用户资料 -->
    <el-dialog title="修改资料" width="600px" :visible.sync="showEUDialog">
      <el-form :model="editUserForm"  :rules="editUserFormRules" ref="editUserForm">
        <div class="hn-fitem-box">
          <el-form-item label="真实姓名" prop="realName" required>
            <el-input v-model="editUserForm.realName" placeholder="请输入真实姓名" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="phone" required>
            <el-input v-model="editUserForm.phone" placeholder="请输入电话号码" autocomplete="off"></el-input>
          </el-form-item>
        </div>
      
        <div class="hn-fitem-box">
          <el-form-item label="性别" prop="sex">
            <el-select v-model="editUserForm.sex" placeholder="请选择性别">
              <el-option v-for="(sex) in sexOption" :key="sex.value" :label="sex.label" :value="sex.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model="editUserForm.age" type="number" placeholder="请输入年龄" autocomplete="off"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="showEUDialog = false">取 消</el-button>
        <el-button  type="primary" @click="eUserFormConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" width="600px" :visible.sync="showDialog">
      <el-form :model="ePassForm"  :rules="ePassFormRules" ref="ePassForm">
        <el-form-item label="旧密码" prop="oldPass" required>
          <el-input v-model="ePassForm.oldPass" placeholder="请输入旧密码" show-password type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass" required>
          <el-input v-model="ePassForm.newPass" placeholder="请输入新密码" show-password type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confPass" required>
          <el-input v-model="ePassForm.confPass" placeholder="请再次输入新密码" show-password type="password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="stSetPsonDialog(false)">取 消</el-button>
        <el-button  type="primary" @click="ePassFormConfirm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import config from '/src/util/config.js'
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.ePassForm.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      config,
      showEUDialog: false,
      editUserForm: {
        "age": "",
        "phone": "",
        "realName": "",
        "sex": 0
      },
      editUserFormRules: {
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
        ],
      },
      sexOption: [
        { value: 0, label: '女' },
        { value: 1, label: '男' },
        { value: 2, label: '保密' }
      ],
      ePassForm: {
        oldPass: "",
        newPass: "",
        confPass:""
      },
      ePassFormRules: {
        oldPass: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
        ],
        newPass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
        ],
        confPass: [
          { validator: validatePass2, trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    showDialog:{
      get(){
        return this.$store.state.personal.showDialog;
      },
      set(v) {
        console.log(v)
        this.stSetPsonDialog(v)
      }
    },
  },
  created() {

  },
  methods: {
    // 修改密码弹窗关闭
    ...mapMutations('personal', ['stSetPsonDialog']),
    // 打卡编辑资料弹窗
    openEdit(){
      this.editUserForm.age = this.userInfo.age
      this.editUserForm.realName = this.userInfo.realName
      this.editUserForm.phone = this.userInfo.phone
      this.editUserForm.sex = this.userInfo.sex
      this.showEUDialog = true
    },
    // 上传文件成功回调
    handleAvatarSuccess(res, file) {
      console.log(res,'upload')
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 编辑用户弹窗确认
    eUserFormConfirm() {
      this.$refs.editUserForm.validate((valid) => {
        if (valid) {
          this.request("/user/editUserinfo",{...this.editUserForm,id:this.userInfo.id},'put').then((res)=>{
            if(res.code==0){
              this.showEUDialog = false
              // this.getUserInfo()
              this.hnMsg()
              setTimeout(() => {
                this.hnMsgBox2().then(()=>{
                  this.loginOut(false)
                })
              }, 1500);
            }
          })
        } else {
          return false;
        }
      })
    },
    // 修改密码弹窗确认
    ePassFormConfirm() {
      this.$refs.ePassForm.validate((valid) => {
        if (valid) {
          this.request("/user/updateUserPassword",{
            oldPassword:this.$md5(this.ePassForm.oldPass),
            newPassword:this.$md5(this.ePassForm.newPass),
            userId:this.userInfo.id
          },'put','form').then((res)=>{
            if(res.code==0){
              this.stSetPsonDialog(false)
              this.hnMsg()
              setTimeout(() => {
                this.hnMsgBox2("密码修改成功，需要您重新登录！").then(()=>{
                  this.loginOut(false)
                })
              }, 1500)
            }
          })
        } else {
          return false;
        }
      })
    },
  }
}
</script>

<style>

</style>

