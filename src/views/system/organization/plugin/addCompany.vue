<template>
  <el-dialog :title="title" :visible="addCompanySwitch" width="600px" append-to-body :show-close="true" @close="handaddCompanyClose">
    <el-form ref="fruitForm" :model="companyForm" :rules="companyRule" label-width="100px">
      <el-form-item label="公司名称" prop="deptName">
        <el-input v-model="companyForm.deptName" placeholder="请输入公司名称,最多20个字" maxlength="20"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitCompanyForm">确 定</el-button>
      <el-button @click="cancelFruit">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {  addCompany, updateDept,getDept} from "@/api/system/dept";
  export default {
    name: "addCompany",
    props:['addCompanySwitch','title','deptId'],
    data(){
      return {
        companyForm:{
          deptId: undefined,
          parentId: 0,
          deptName: undefined,
          orderNum: 1,
          leader: undefined,
          phone: undefined,
          email: undefined,
          status: "0"
        },
        companyRule:{
          deptName:[
            { required: true, message: "公司名称不能为空", trigger: "blur" }
          ]
        }
      }
    },
    watch:{
      addCompanySwitch(val){
        this.show =val;
        if (val){
          this.listCompanyData();
        }
      }
    },
    methods:{
      listCompanyData(){
        if (this.deptId&&this.deptId!=''){
          getDept(this.deptId).then(response => {
            this.companyForm = response.data;
          });
        }
      },
      handaddCompanyClose(){
        this.$emit('update:addCompanySwitch',false)
        this.resetCompanyFrom();
      },
      loadSubperList(){
        this.$emit('afterAdd');
      },
      resetCompanyFrom(){
        this.companyForm = {
          deptId: undefined,
          parentId: 0,
          deptName: undefined,
          orderNum: 1,
          leader: undefined,
          phone: undefined,
          email: undefined,
          status: "0"
        }
      },
      submitCompanyForm: function(){
        this.$refs['fruitForm'].validate(valid => {
          if(valid){
            if (this.companyForm.deptId != undefined){
              updateDept(this.companyForm).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.loadSubperList();
                this.handaddCompanyClose();
              });
            } else{
              addCompany(this.companyForm).then(response=>{
                this.$modal.msgSuccess("新增成功");
                this.loadSubperList();
                this.handaddCompanyClose();

              })
            }
          }
        })
      },
      cancelFruit() {
        this.handaddCompanyClose();
        this.resetCompanyFrom();
      },
    }
  }
</script>

<style scoped>

</style>
