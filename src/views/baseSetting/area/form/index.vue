<template>
  <div class="app-container">
    <el-dialog :title="title" :visible="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="登录账号" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入区域登录账号"/>
        </el-form-item>
        <el-form-item label="负责人" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入区域负责人名称"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="phonenumber">
          <el-input v-model="form.phonenumber" placeholder="请输入区域负责人联系电话"/>
        </el-form-item>
        <div class="txt-label">
          <label>销售佣金比例</label>
        </div>
        <el-form-item prop="firstInvitedCommission" label="邀请用户首次开通会员">
          <el-input style="width: 60%"
                    v-model="form.firstInvitedCommission"
                    type="number"
                    placeholder="请输入佣金比例">
          </el-input>
          %，
        </el-form-item>
        <el-form-item prop="invitedCommission" label="后期续费用户佣金">
          <el-input style="width: 60%"
                    v-model="form.invitedCommission"
                    type="number"
                    placeholder="请输入佣金比例">
          </el-input>
          %
        </el-form-item>
        <div class="txt-label">
          <label>平台抽成比例</label>
        </div>
        <el-form-item prop="orderBonus" label="商城订单抽取订单实付金额">
          <el-input style="width: 60%"
                    v-model="form.orderBonus"
                    type="number"
                    placeholder="请输入百分百">
          </el-input>
          %
        </el-form-item>
        <el-form-item prop="vipBonus" label="开通会员抽取支付金额">
          <el-input style="width: 60%"
                    v-model="form.vipBonus"
                    type="number"
                    placeholder="请输入百分百">
          </el-input>
          %
        </el-form-item>
        <el-form-item prop="rechargeBonus" label="充值钱包抽取支付金额">
          <el-input style="width: 60%"
                    v-model="form.rechargeBonus"
                    type="number"
                    placeholder="请输入百分百">
          </el-input>
          %
        </el-form-item>
        <div class="txt-label">
          <label>区域自提点图片</label>
        </div>
        <el-form-item prop="selfLiftingPic">
          <el-upload
            class="avatar-uploader"
            ref="upload"
            :action="uploadFileUrl"
            :show-file-list="false"
            :on-success="(response,file,fileList)=>handleAvatarSuccess(response,file,fileList,'selfLiftingPic')"
            :limit="1"
            accept=".png,.jpg,.jpeg"
            :auto-upload="true">
            <img v-if="form.selfLiftingPic!=''&&form.selfLiftingPic" :src="form.selfLiftingPic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <div class="txt-label">
          <label>区域自提点地址</label>
        </div>

        <el-form-item label="详细地址：" prop="selfLiftingPoint">
          <el-autocomplete
            v-model="form.selfLiftingPoint"
            style="width:100%;"
            popper-class="autoAddressClass"
            :fetch-suggestions="querySearchAsync"
            :trigger-on-focus="false"
            placeholder="详细地址"
            clearable
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <i class="el-icon-search fl mgr10" />
              <div style="overflow:hidden;">
                <div class="title">{{ item.title }}</div>
                <span class="address ellipsis">{{ item.address }}</span>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <div id="map-container" style="width:100%;height:500px;" />

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getDetail,areaConfigList,addArea } from '@/api/baseSetting/area';

  export default {
    name: 'addArea',
    props: ['title', 'open','detailId'],
    components: {

    },
    data() {
      return {
        map: '', // 地图实例
        mk: '', // Marker实例
        location:{
        },
        locationPoint: null,
        uploadFileUrl: process.env.VUE_APP_BASE_API + '/common/upload',
        form: {
          sysUser:{}
        },
        rules: {
          userName:[
            { required: true, message: "登录账号不能为空", trigger: "blur" },
          ],
          nickName:[
            { required: true, message: "负责人不能为空", trigger: "blur" },
          ],
          phonenumber:[
            { required: true, message: "联系电话不能为空", trigger: "blur" },
          ]
        }
      }
    },
    async mounted() {
    },
    watch:{
      open(val){
        if (val){
          if (this.detailId){
            this.loadDetail();
          }
        }
      }
    },
    created() {

    },
    methods: {
      getAddrByPoint(point) {
        var that = this
        var geco = new BMap.Geocoder()
        geco.getLocation(point, function(res) {
          that.mk.setPosition(point)
          that.map.panTo(point)
          that.form.selfLiftingPoint = res.address + res.surroundingPois[0].title
          that.form.addrPoint = point
        })
      },
      // 8-1、地址搜索
      querySearchAsync(str, cb) {
        var options = {
          onSearchComplete: function(res) {
            var s = []
            if (local.getStatus() == BMAP_STATUS_SUCCESS) {
              for (var i = 0; i < res.getCurrentNumPois(); i++) {
                s.push(res.getPoi(i))
              }
              cb(s)
            } else {
              cb(s)
            }
          }
        }
        var local = new BMap.LocalSearch(this.map, options)
        local.search(str)
      },
      // 8-2、选择地址
      handleSelect(item) {
        this.form.selfLiftingPoint = item.address + item.title
        this.form.addrPoint = item.point
        this.map.clearOverlays()
        this.mk = new BMap.Marker(item.point)
        this.map.addOverlay(this.mk)
        this.map.panTo(item.point)
      },
      loadDetail(){
        getDetail(this.detailId).then(response=>{
          this.form = response.data;
          console.log(response.data)
          this.location.lng=response.data.lng;
          this.location.lat= response.data.lat;
          this.initMap();
          this.loadBaseConfig();
        })
      },
      loadBaseConfig(){
        areaConfigList().then(response=>{
          let data =response.data;
          for (let i=0;i<data.length;i++){
            let key = data[i].configKey;
            if (key ==='firstInvitedCommission' && !this.form.firstInvitedCommission){
              this.form.firstInvitedCommission = data[i].configValue
            }else  if (key ==='invitedCommission' && !this.form.invitedCommission){
              this.form.invitedCommission = data[i].configValue
            }else if (key ==='orderBonus' && !this.form.orderBonus){
              this.form.orderBonus = data[i].configValue
            }else if (key ==='vipBonus' && !this.form.vipBonus){
              this.form.vipBonus = data[i].configValue
            }else if (key ==='rechargeBonus' && !this.form.rechargeBonus){
              this.form.rechargeBonus = data[i].configValue
            }
          }
        })
      },
      submitForm() {
        this.form.lng = this.form.addrPoint.lng;
        this.form.lat = this.form.addrPoint.lat;
        let that = this;
        this.$refs['form'].validate(valid => {
          if (valid) {
            console.log(that.form)
            that.form.sysUser = {
              userName : that.form.userName,
              nickName : that.form.nickName,
              phonenumber : that.form.phonenumber
            }
              addArea(that.form).then(response=>{
                that.$modal.msgSuccess("新增成功");
                that.loadParseList();
                that.cancel();
              })
          }
        })

      },
      loadParseList(){
        this.$emit('afterAdd')
      },
      cancel() {
        this.$emit('update:open',false)
      },
      handleAvatarSuccess(response, file, fileList, prop) {
        this.form[prop] = response.url
        this.$forceUpdate()
      },
    }
  }
</script>

<style scoped>
  .txt-label {
    padding: 10px 0px;
    font-size: 14px;
    color: #13ce66;
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
