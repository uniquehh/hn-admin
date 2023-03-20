<template>
  <el-dialog :title="title" :visible="addMemberOpen" width="600px" append-to-body :show-close="true" @close="handaddClose">
    <el-form ref="memberFrom" :model="memberFrom" :rules="rules" label-width="auto">
      <el-row>
        <el-col :span="12">
          <el-form-item label="工号" prop="memberNum">
            <el-input v-model="memberFrom.memberNum" placeholder="请输入员工工号" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model="memberFrom.userName" placeholder="请输入用户姓名" maxlength="30" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phonenumber">
            <el-input v-model="memberFrom.phonenumber" placeholder="请输入联系电话" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="cardId">
            <el-input v-model="memberFrom.cardId" placeholder="请输入18位身份证号" maxlength="18" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="所属部门及岗位" prop="deptId">
            <treeselect v-model="memberFrom.deptId" :options="deptOptions" placeholder="请选择所属部门及岗位" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="是否部门负责人" prop="leader">
            <el-select
              v-model="memberFrom.leader"
              placeholder="请选择是否部门负责人">
            <el-option
                v-for="item in leader"
                :key="item.name"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="入职时间" prop="checkInTime">
            <el-date-picker v-model="memberFrom.checkInTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus } from "@/api/system/user";
  import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";
  import { treeselect } from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";

    export default {
      name: "addMember",
      props:['addMemberOpen','title','userId'],
      components: { Treeselect },
      data() {
        return {
          memberFrom:{
            userId: "",
            memberNum:"",
            leader:"",
            cardId:"",
            checkInTime:"",
            userName: "",
            nickName: "",
            password: "",
            phonenumber: "",
            email: "",
            sex: "",
            status: "0",
            remark: "",
            roleIds: [100]
          },
          deptOptions:[],
          leader:[
            {code:1,name:'是'},
            {code:0,name:'否'}
          ],
          rules: {
            memberNum:[
              { required: true, message: "员工工号不能为空", trigger: "blur" }
            ],
            userName: [
              { required: true, message: "用户名称不能为空", trigger: "blur" },
              { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
            ],
            cardId: [
              { required: true, message: "用户身份证号码不能为空", trigger: "blur" }
            ],
            deptId:[
              { required: true, message: "部门岗位不能为空", trigger: "change" }
            ],
            leader:[
              { required: true, message: "请选择是否是部门负责人", trigger: "change" }
            ],
            phonenumber: [
              { required: true, message: "联系电话不能未空", trigger: "blur" },
              {
                pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                message: "请输入正确的手机号码",
                trigger: "blur"
              }
            ],
            checkInTime: [
              { required: true, message: "入职时间不能为空", trigger: "blur" }
            ]
          }
        }
      },
      watch:{
        addMemberOpen(val){
          this.show =val;
          if (val){
            this.getTreeselect();
            this.updateUser();
          }
        }
      },
      methods:{
        handaddClose(){
          this.reset()
          this.loadSubperList();
          this.$emit('update:addMemberOpen',false);
          this.$emit('update:userId',"");
        },
        loadSubperList(){
          this.$emit('afterAdd');
        },
        submitForm: function() {
          this.$refs["memberFrom"].validate(valid => {
            if (valid) {
              this.memberFrom.roleIds=[100];
              if (this.memberFrom.userId != undefined&&this.memberFrom.userId!='') {
                updateUser(this.memberFrom).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.handaddClose();
                  this.loadSubperList();
                });
              } else {
                addUser(this.memberFrom).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.handaddClose();
                  this.loadSubperList();
                });
              }
            }
          });
        },
        cancel() {
          this.open = false;
          this.reset();
          this.$emit('update:addMemberOpen',false)
          this.$emit('update:userId',"");
        },
        getTreeselect() {
          treeselect().then(response => {
            this.deptOptions = response.data;
          });
        },
        reset() {
          this.memberFrom = {
            userId: "",
            memberNum:"",
            leader:"",
            cardId:"",
            checkInTime:"",
            deptId: undefined,
            userName: "",
            nickName: "",
            password: "",
            phonenumber: "",
            email: "",
            sex: "",
            status: "0",
            remark: "",
            roleIds: [100]
          };
          this.resetForm("memberFrom");
        },
        updateUser(){
          if (this.userId){
            getUser(this.userId).then(response => {
              this.memberFrom = response.data;
            });
          }

        }
      }
    }
</script>

<style scoped>

</style>
