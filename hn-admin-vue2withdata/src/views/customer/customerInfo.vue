<template>
  <div class="hn-cusinfo-main">
    <!-- 左侧记录、转移 -->
    <div class="hn-custim-left">
      <div class="hn-custiml-telhis">
        <div class="hn-custimlt-head">
          <i class="el-icon-24gl-phoneLoudspeaker"></i>
          <span class="hn-custimlth-text">沟通历史</span>
        </div>
        <div class="hn-custimlt-item">
          <div class="hn-custimlti-left"></div>
          <div class="hn-custimlti-right">
            <div class="hn-custimltir-time">2023-03-15 12:55:23</div>
            <div class="hn-custimltir-user">
              <img class="hn-custimltiru-img" src="../../assets/img/defAvatar.png">
              <span>账号</span>
            </div>
            <div class="hn-custimltir-info">
              shid水水水水水水顶顶顶顶顶顶顶顶顶
            </div>
          </div>
        </div>
      </div>
      <div class="hn-custiml-movecut">
        <div class="hn-custimlt-head">
          <i class="el-icon-caret-bottom"></i>
          <span class="hn-custimlth-text">将此客户转移给同事</span>
        </div>
        <div class="hn-custm-warp">
          <el-form :model="moveCustForm" :rules="moveCustFormRules" label-width="80px" ref="moveCustForm">
            <el-form-item label="转移客户" required prop="staffId">
              <el-select clearable v-model="moveCustForm.staffId" placeholder="请选择转移同事">
                <el-option v-for="(item) in staffs" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 中间派单、回访 -->
    <div class="hn-custim-center">
      <div class="hn-custimc-top">
        <div class="hn-custimcm-head">
          <div class="hn-custimcmh-left">
            <i class="el-icon-duanxin"></i>
            <span class="hn-custimlth-text">回访结果</span>
          </div>
          <el-button icon="el-icon-plus" type="primary">派单</el-button>
        </div>
        <div class="hn-custm-warp">
          <el-input
            class="hn-custimcmt-inp"
            type="textarea"
            placeholder="请输入回访结果"
            v-model="hfResult"
            maxlength="255"
            show-word-limit
          ></el-input>
          <el-button icon="el-icon-s-promotion" type="primary">提交回访结果</el-button>
        </div>
      </div>
      <div class="hn-custimc-center">
        <div class="hn-custimcm-head">
          <div class="hn-custimcmh-left">
            <i class="el-icon-date"></i>
            <span class="hn-custimlth-text">新增回访计划</span>
          </div>
        </div>
        <div class="hn-custm-warp">
          <div class="hn-custimcc-th">
            <div class="hn-custimcct-text">回访日期</div>
            <el-date-picker v-model="value" type="date" placeholder="请选择下次回访日期"></el-date-picker>
          </div>
          <div class="hn-custimcc-th">
            <div class="hn-custimcct-text">计划内容</div>
            <el-input
              type="textarea"
              placeholder="请输入计划回访内容"
              v-model="hfResult"
              maxlength="255"
              show-word-limit
            ></el-input>
          </div>
          <el-button icon="el-icon-plus" type="primary">提交回访计划</el-button>
        </div>
      </div>
      <div class="hn-custimc-bottom">
        <div class="hn-custimcm-head">
          <div class="hn-custimcmh-left">
            <i class="el-icon-user-solid"></i>
            <span class="hn-custimlth-text">客户回访任务</span>
          </div>
          <i class="el-icon-dibudaohanglan-"></i>
        </div>
        <div class="hn-custm-warp">
          <div class="hn-custimcc-th">
            <span style="margin-right: 10px;">是否关闭此客户回访计划</span>
            <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="dictName" label="回访日期">
            </el-table-column>
            <el-table-column prop="dictUse" label="回访状态">
              <!-- <template slot-scope="scope">
                <span>{{ scope.row.dictUse ? '使用中' : '未使用' }}</span>
              </template> -->
            </el-table-column>
            <el-table-column prop="edit" label="计划内容">
              <!-- <template slot-scope="scope">
                <el-button type="warning" icon="el-icon-delete">释放客户</el-button>
              </template> -->
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 右侧表单 -->
    <div class="hn-custim-right">
      <div class="hn-custimr-main">
        <div class="hn-custimcm-head">
          <div class="hn-custimcmh-left">
            <i class="el-icon-user-solid"></i>
            <span class="hn-custimlth-text">客户基本信息</span>
          </div>
        </div>
        <div class="hn-custm-warp">
          <el-form ref="form" :model="form">
            <div class="hn-fitem-box">
              <el-form-item label="编号：" style="width: 200px;">
                <el-input style="width: 130px;" v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="手机：" style="width: 200px;">
                <el-input style="width: 145px;" v-model="form.name"></el-input>
              </el-form-item>
            </div>
            <div class="hn-fitem-box">
              <el-form-item label="姓名：" style="width: 200px;">
                <el-input style="width: 130px;" v-model="form.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="性别：" style="width: 200px;">
                <el-select style="width: 145px;" v-model="form.region" placeholder="请选择性别">
                  <el-option label="女" value="beijing"></el-option>
                  <el-option label="男" value="shanghai"></el-option>
                  <el-option label="保密" value="shanghai"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="hn-fitem-box">
              <el-form-item label="微信：" style="width: 200px;">
                <el-input style="width: 130px;" v-model="form.name" placeholder="请输入微信"></el-input>
              </el-form-item>
              <el-form-item label="QQ：" style="width: 200px;">
                <el-input style="width: 145px;" v-model="form.name" placeholder="请输入QQ"></el-input>
              </el-form-item>
            </div>

            <el-form-item label="计入系统日期：">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" ></el-date-picker>
            </el-form-item>

            <el-form-item label="是否联系上：">
              <el-select v-model="form.region">
                <el-option label="是" value="beijing"></el-option>
                <el-option label="否" value="shanghai"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="来源：">
              <el-select v-model="form.region" disabled>
                <el-option label="是" value="beijing"></el-option>
                <el-option label="否" value="shanghai"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="等级：">
              <el-radio-group v-model="form.resource">
                <el-radio label="A"></el-radio>
                <el-radio label="B"></el-radio>
              </el-radio-group>
            </el-form-item>

            <div class="hn-fitem-box">
              <el-form-item label="地区：" style="width: 100%;">
                <el-select style="width: 110px;margin-right: 10px;" v-model="form.region" placeholder="省">
                  <el-option label="是" value="beijing"></el-option>
                  <el-option label="否" value="shanghai"></el-option>
                </el-select>
                <el-select style="width: 110px;margin-right: 10px;" v-model="form.region" placeholder="市">
                  <el-option label="是" value="beijing"></el-option>
                  <el-option label="否" value="shanghai"></el-option>
                </el-select>
                <el-select style="width: 110px;" v-model="form.region" placeholder="区">
                  <el-option label="是" value="beijing"></el-option>
                  <el-option label="否" value="shanghai"></el-option>
                </el-select>
              </el-form-item>
            </div>
            
            <el-form-item label="备注：">
              <el-input type="textarea" placeholder="请输入备注" v-model="hfResult" maxlength="1024" show-word-limit></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-check">更新客户信息</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      value:"",



      moveCustForm:{
        staffId:""
      },
      moveCustFormRules:{
        staffId:[
          { required: true, message: '请选择同事', trigger: 'blur' },
        ]
      },
      staffs:[],//员工数据
      hfResult:"",//回访结果
      tableData:[],//客户回访任务表格
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>