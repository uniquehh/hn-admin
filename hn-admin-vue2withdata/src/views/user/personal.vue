<template>
  <div class="hn-user-pson">
    <div class="hn-user-head">
      <div class="pbgimg hn-userh-img" :style="userInfo.headImg
        ? 'background-image:url(' + userInfo.headImg + ')'
        :'background-image:url(/assets/img/defAvatar.png)'">
        <div class="hn-userhi-icon">
          <i class="el-icon-camera"></i>
        </div>
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
        <span class="hn-userhi-edit">编辑资料</span>
      </div>
      <div class="hn-useri-tr">姓名：{{ userInfo.realName }}</div>
      <div class="hn-useri-tr">电话：{{ userInfo.phone }}</div>
      <div class="hn-useri-tr">邮箱：{{ userInfo.realName }}</div>
      <div class="hn-useri-tr">密码：{{ userInfo.realName }}</div>
      <div class="hn-useri-tr">性别：{{ userInfo.sex==0?'女': userInfo.sex == 1 ?'男':'保密' }}</div>
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
          <el-form-item label="性别" required prop="sex">
            <el-select v-model="editUserForm.sex" placeholder="请选择性别">
              <el-option v-for="(sex) in sexOption" :key="sex.value" :label="sex.label" :value="sex.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email" type="email" placeholder="请输入邮箱" autocomplete="off"></el-input>
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
          <el-input v-model="ePassForm.realName" placeholder="请输入旧密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass" required>
          <el-input v-model="ePassForm.phone" placeholder="请输入新密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confPass" required>
            <el-input v-model="ePassForm.phone" placeholder="请再次输入新密码" autocomplete="off"></el-input>
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
      showEUDialog: false,
      editUserForm: {
        "email": "",
        "phone": "",
        "realName": "",
        "sex": 2
      },
      editUserFormRules: {
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' },
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
    ...mapState('personal', ['showDialog']),
  },
  created() {

  },
  methods: {
    // 修改密码弹窗关闭
    ...mapMutations('personal', ['stSetPsonDialog']),
    // 修改用户资料
    editUserInfo() {
      this.request("",this.editUserForm,'post')
    },
    // 编辑用户弹窗确认
    eUserFormConfirm() {
      this.$refs.editUserForm.validate((valid) => {
        if (valid) {

          this.showEUDialog = false
        } else {
          return false;
        }
      })
    },
    // 修改用户密码
    editUserPass() {
      this.request("", this.ePassForm, 'post')
    },
    // 修改密码弹窗确认
    ePassFormConfirm() {
      this.$refs.ePassForm.validate((valid) => {
        if (valid) {

          this.stSetPsonDialog(false) //关闭弹窗
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

