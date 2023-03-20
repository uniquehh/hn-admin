<template>
  <el-dialog :title="title" :visible="addDeptOpen" width="600px" append-to-body :show-close="true" @close="handaddClose">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24" v-if="form.parentId !== 0">
          <el-form-item label="上级部门" prop="parentId">
            <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!isLevel3">
        <el-col :span="12">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="form.deptName" placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isLevel3">
        <el-col :span="12">
          <el-form-item label="岗位名称" prop="deptName">
            <el-input v-model="form.deptName" placeholder="请输入岗位名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!isLevel3">
        <el-col :span="12">
          <el-form-item label="负责人" prop="leader">
            <el-select
              v-model="form.leader"
              placeholder="请选择负责人"
              clearable
              style="width: 120px"
            >
              <el-option
                v-for="dict in userList"
                :key="dict.nickName"
                :label="dict.nickName"
                :value="dict.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancelDept">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild ,getDeptUser} from "@/api/system/dept";
  import { listUser  } from "@/api/system/user";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    export default {
        name: "addDept",
      props:['addDeptOpen','title','parent','deptId','level'],
      components:{Treeselect},
      data(){
          return {
            form: {},
            deptOptions: [],
            userList:[],
            isLevel3:false,
            rules: {
              parentId: [
                { required: true, message: "上级部门不能为空", trigger: "blur" }
              ],
              deptName: [
                { required: true, message: "部门名称不能为空", trigger: "blur" }
              ],
              orderNum: [
                { required: true, message: "显示排序不能为空", trigger: "blur" }
              ],
              email: [
                {
                  type: "email",
                  message: "请输入正确的邮箱地址",
                  trigger: ["blur", "change"]
                }
              ],
              phone: [
                {
                  pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                  message: "请输入正确的手机号码",
                  trigger: "blur"
                }
              ]
            }
          }
      },
      watch:{
        addDeptOpen(val){
          this.show =val;
          if (val){
            this.listDeptData();
            this.queryListUser();
          }
        }
      },
      created(){

      },
      methods:{
        listDeptData(){
          if (this.deptId&&this.deptId!=''){
            getDept(this.deptId).then(response => {
              this.form = response.data;
              if(parseInt(this.form.leader)){
                this.form.leader = parseInt(this.form.leader);
              }else{
                this.form.leader = undefined;
              }
              if (this.level==1||this.level==2){
                this.isLevel3 = false
              } else{
                this.isLevel3 = true
              }
            });
            listDeptExcludeChild(this.deptId).then(response => {
              this.deptOptions = this.handleTree(response.data, "deptId");
            });
          }else{
            if (this.level==1){
              this.isLevel3 = false
            } else{
              this.isLevel3 = true
            }
            listDept().then(response => {
              this.deptOptions = this.handleTree(response.data, "deptId");
              this.form.parentId=this.parent;
            });
          }
        },
        reset() {
          this.form = {
            deptId: undefined,
            parentId: undefined,
            deptName: undefined,
            orderNum: 1,
            leader: undefined,
            phone: undefined,
            email: undefined,
            status: "0"
          };
          this.resetForm("form");
        },
        handaddClose(){
          this.reset()
          this.loadSubperList();
          this.$emit('update:addDeptOpen',false)
        },
        cancelDept(){
          this.handaddClose();
        },
        submitForm: function() {
          this.$refs["form"].validate(valid => {
            if (valid) {
              if (this.form.deptId != undefined) {
                updateDept(this.form).then(response => {
                  this.$modal.msgSuccess("修改成功");
                  this.loadSubperList();
                  this.handaddClose();
                });
              } else {
                addDept(this.form).then(response => {
                  this.$modal.msgSuccess("新增成功");
                  this.handaddClose();
                  this.loadSubperList();
                });
              }
            }
          });
        },
        loadSubperList(){
          this.$emit('afterAdd');
        },
        normalizer(node) {
          if (node.children && !node.children.length) {
            delete node.children;
          }
          return {
            id: node.deptId,
            label: node.deptName,
            children: node.children
          };
        },
        queryListUser(){
          if (this.deptId){
            getDeptUser(this.deptId).then(response => {
                this.userList = response.data;
              });
          }
        }

      }
    }
</script>

<style scoped>

</style>
