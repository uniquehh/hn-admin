<template>
  <div style="width: 80%">
    <el-form ref="form" :model="form" :rules="rules" label-width="auto">
      <el-form-item
        v-for="col in column"
        :label="col.label"
        :prop="col.prop">
        <el-input v-if="col.type ==='number'" v-model="form[col.prop]" :placeholder="col.placeholder" type="number" />
        <el-input v-if="col.type ==='input'" v-model="form[col.prop]" :placeholder="col.placeholder" :maxlength="col.maxLength" show-word-limit/>
        <el-input v-if="col.type === 'textarea'"  type="textarea"   rows="5"
          placeholder="请输入内容"
          v-model="form[col.prop]"
          :maxlength="col.maxLength"
          show-word-limit ></el-input>
        <el-upload v-if="col.type ==='upload'"
                   class="avatar-uploader"
                   ref="upload"
                   :action="uploadFileUrl"
                   :show-file-list="false"
                   :on-success="(response,file,fileList)=>handleAvatarSuccess(response,file,fileList,col.prop)"
                   :limit="1"
                   :accept="col.accept"
                   :auto-upload="true">
          <img v-if="form[col.prop]!=''&&form[col.prop]" :src="form[col.prop]" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-select v-if="col.type ==='select'" v-model="form[col.prop]"   :filterabel="col.search" @change="selectChange($event,col.prop)"
                   :placeholder="col.placeholder">
          <el-option
            v-for="cycle in (typeof col.options === 'function' ? asyncOptions[col.prop] : col.options)"
            :key="cycle.id"
            :label="cycle.name"
            :value="cycle.id"
          />
        </el-select>
        <editor v-if="col.type === 'editer'"   v-model="form[col.prop]" :min-height="col.height||100"></editor>
        <el-checkbox-group v-model="checkboxData" v-if="col.type === 'checkbox'" @change="(value)=>checkBoxChange(value,col.prop)">
          <el-checkbox v-for="cycle in (typeof col.options === 'function' ? asyncOptions[col.prop] : col.options)"
                       :label="cycle.id"
                       :key="cycle.id">{{cycle.name}}
          </el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-if="col.type === 'radio'" v-model="form[col.prop]">
          <el-radio  v-for="cycle in (typeof col.options === 'function' ? asyncOptions[col.prop] : col.options)"
                     :label="cycle.id">{{cycle.name}}</el-radio>
        </el-radio-group>

        <el-date-picker v-if="col.type==='date'"
          :style="col.style"
          :value-format="col.format"
          type="date"
          v-model="form[col.prop]"
          :placeholder="col.placeholder">
        </el-date-picker>


      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'easyForm',
    props: {
      form: {
        type: Object,
        default: function() {
          return {}
        }
      },
      column: {
        type: Array,
        default: []
      },
      rules: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    data() {
      return {
        checkboxData:[],
        uploadFileUrl: process.env.VUE_APP_BASE_API + '/common/upload',
        asyncOptions: {},
        asyncFunctions: {}
      }
    },
    mounted() {
      if (this.column) {
        const len = this.column ? this.column.length : 0
        for (let i = 0; i < len; i++) {
          const item = this.column[i]
          // 处理需要异步获取的数据（如单选框、复选框、下拉选择等组件）
          if (typeof item.options === 'function') {
            this.asyncOptions[item.prop] = []
            item.options((data) => {
              this.asyncOptions[item.prop] = data
              this.$forceUpdate()
            })
          }
        }
      }
    },
    methods: {
      handleAvatarSuccess(response, file, fileList, prop) {
        this.form[prop] = response.url
        this.$forceUpdate()
        console.log(this.$refs.upload)
        this.$refs['upload'][0].clearFiles();
      },
      checkBoxChange(value,prop){
          this.form[prop] = value.join(",");
      },
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.$emit('submitForm') ;
            this.checkboxData=[]
          }
        })
      },
      cancel() {
        this.$emit('cancel')
        this.checkboxData=[]
      },
      loadCheckBox(form,prop){
        this.checkboxData=[]
        if (form[prop]!=undefined&&form[prop]!=''){
          this.checkboxData = form[prop].split(",")
          this.$forceUpdate()
        }
        console.log( this.checkboxData);
      },
      selectChange(value,  prop) {
        this.$emit('selectChange', value, prop);
      },
    }
  }
</script>

<style scoped>
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

  .dialog-footer {
    text-align: center;
  }
</style>
