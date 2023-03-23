<template>
  <div class="item-tip">
    <div >
      <div class="tip">
        <label>用户端APP</label>
        <el-button size="mini" type="primary" style="float:right;margin:5px" v-hasPermi="['baseSetting:version:update']" @click="saveVersionData">保存</el-button>
      </div>
      <div>
        <el-form ref="form" :model="form" label-width="120px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="安卓版本号" >
                <el-input v-model="form.versionNum"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="是否强制更新" >
                <el-checkbox v-model="form.forcedUpdate" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item label="安卓更新地址" >
                <el-input v-model="form.appPath"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item label="安卓更新说明" >
                <el-input type="textarea" v-model="form.comment"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-form ref="iosForm" :model="iosForm" label-width="120px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="IOS版本号" >
                <el-input v-model="iosForm.versionNum"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="是否强制更新" >
                <el-checkbox v-model="iosForm.forcedUpdate" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item label="IOS更新地址" >
                <el-input v-model="iosForm.appPath"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item label="IOS更新说明" >
                <el-input type="textarea" v-model="iosForm.comment"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </div>
    </div>

    <div >
      <div class="tip">
        <label>员工端APP</label>
        <el-button size="mini" type="primary" style="float:right;margin:5px" v-hasPermi="['baseSetting:version:update']" @click="saveStaffVersionData">保存</el-button>
      </div>
      <div>
        <el-form ref="staffForm" :model="staffForm" label-width="120px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="安卓版本号" >
                <el-input v-model="staffForm.versionNum"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="是否强制更新" >
                <el-checkbox v-model="staffForm.forcedUpdate" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item label="安卓更新地址" >
                <el-input v-model="staffForm.appPath"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item label="安卓更新说明" >
                <el-input type="textarea" v-model="staffForm.comment"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-form ref="staffIosForm" :model="staffIosForm" label-width="120px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="IOS版本号" >
                <el-input v-model="staffIosForm.versionNum"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="是否强制更新" >
                <el-checkbox v-model="staffIosForm.forcedUpdate" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item label="IOS更新地址" >
                <el-input v-model="staffIosForm.appPath"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item label="IOS更新说明" >
                <el-input type="textarea" v-model="staffIosForm.comment"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </div>
    </div>
  </div>
</template>

<script>
  import { getVersionById,saveVersion} from '@/api/baseSetting/version'
  export default {
    name: "version",
    data() {
      return {
        form:{},
        iosForm:{},
        staffForm:{},
        staffIosForm:{},
        platformForm:{},
        uploadFileUrl: process.env.VUE_APP_BASE_API + '/common/upload',
      }
    },
    created() {
      this.getverion();
    },
    methods:{
      saveVersionData(){
        this.form.forcedUpdate = this.form.forcedUpdate?0:1;
        this.iosForm.forcedUpdate = this.iosForm.forcedUpdate?0:1;
        saveVersion(this.form).then(response=>{
          this.$modal.msgSuccess("更新成功");
          this.getverion()
        })
        saveVersion(this.iosForm).then(response=>{
          this.$modal.msgSuccess("更新成功");
          this.getverion()
        })
      },
      saveStaffVersionData(){
        this.staffForm.forcedUpdate = this.staffForm.forcedUpdate?0:1;
        this.staffIosForm.forcedUpdate = this.staffIosForm.forcedUpdate?0:1;
        saveVersion(this.staffForm).then(response=>{
          this.$modal.msgSuccess("更新成功");
          this.getverion()
        })
        saveVersion(this.staffIosForm).then(response=>{
          this.$modal.msgSuccess("更新成功");
          this.getverion()
        })
      },
      getverion(){
        getVersionById(1).then(response=>{
          this.form = response.data;
          this.form.forcedUpdate = this.form.forcedUpdate===0?true:false;
        })
        getVersionById(2).then(response=>{
          this.iosForm = response.data;
          this.iosForm.forcedUpdate = this.iosForm.forcedUpdate===0?true:false;
        })
        getVersionById(3).then(response=>{
          this.staffForm = response.data;
          this.staffForm.forcedUpdate = this.staffForm.forcedUpdate===0?true:false;
        })
        getVersionById(4).then(response=>{
          this.staffIosForm = response.data;
          this.staffIosForm.forcedUpdate = this.staffIosForm.forcedUpdate===0?true:false;
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .item-tip {
    margin-bottom: 10px;
    .tip {
      margin:10px 0px;
      height: 40px;
      line-height: 40px;
      background: #eee;
      text-align: left;
      font-size: 14px;
      border-left: 4px solid #50bfff;
      padding-left: 10px;
      justify-content: space-between;
    }

  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    border: 1px solid #ddd;
    margin-top: 10px;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
