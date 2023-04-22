<template>
  <div class="hn-jiedanzx-main">
    <div class="hn-jdzxm-head">
      <div class="hn-jdzxmh-left">
        <img src="../../assets/img/defAvatar.png" class="hn-jdzxmhl-img">
        <div class="hn-jdzxmhl-text">
          <div class="hn-jdzxmhlt-name">你好，账号</div>
          <div class="hn-jdzxmhlt-time">欢迎回来！现在是：2022-03-19 56:55:44</div>
        </div>
      </div>
      <div class="hn-jdzxmh-center">
        <el-switch
          v-model="value"
          active-text="开启接单"
          inactive-text="停止接单">
        </el-switch>
      </div>
      <div class="hn-jdzxmh-right">
        <div class="hn-jdzxmhr-item">
          <div class="hn-jdzxmhri-text">30日客户数</div>
          <div class="hn-jdzxmhri-num">934</div>
        </div>
        <div class="hn-jdzxmhr-line"></div>
        <div class="hn-jdzxmhr-item">
          <div class="hn-jdzxmhri-text">30日回访量</div>
          <div class="hn-jdzxmhri-num">7126/0</div>
        </div>
        <div class="hn-jdzxmhr-line"></div>
        <div class="hn-jdzxmhr-item">
          <div class="hn-jdzxmhri-text">30日派单量</div>
          <div class="hn-jdzxmhri-num">921</div>
        </div>
      </div>
    </div>
    <!-- 数据统计 -->
    <div class="hn-jdzxm-dcont">
      <div class="hn-jdzxmd-item">
        <div class="hn-jdzxmdi-left jdzxmdil-bg1">
          <i class="el-icon-customer"></i>
        </div>
        <div class="hn-jdzxmdi-right">
          <div class="hn-jdzxmdir-num">11</div>
          <div class="hn-jdzxmdir-text">今日新增客户</div>
        </div>
      </div>
      <div class="hn-jdzxmd-item">
        <div class="hn-jdzxmdi-left jdzxmdil-bg2">
          <i class="el-icon-phone"></i>
        </div>
        <div class="hn-jdzxmdi-right">
          <div class="hn-jdzxmdir-num">0</div>
          <div class="hn-jdzxmdir-text">今日计划回访</div>
        </div>
      </div>
      <div class="hn-jdzxmd-item">
        <div class="hn-jdzxmdi-left jdzxmdil-bg3">
          <i class="el-icon-phone-outline"></i>
        </div>
        <div class="hn-jdzxmdi-right">
          <div class="hn-jdzxmdir-num">107</div>
          <div class="hn-jdzxmdir-text">今日完成回访</div>
        </div>
      </div>
      <div class="hn-jdzxmd-item">
        <div class="hn-jdzxmdi-left jdzxmdil-bg4">
          <i class="el-icon-jiudian"></i>
        </div>
        <div class="hn-jdzxmdi-right">
          <div class="hn-jdzxmdir-num">8</div>
          <div class="hn-jdzxmdir-text">今日派单量</div>
        </div>
      </div>
    </div>
    <!-- 主要内容 -->
    <div class="hn-jdzxm-mwrap">
      <div class="hn-jdzxmm-left">
        <div class="hn-custimc-bottom">
          <div class="hn-custimcm-head">
            <div class="hn-custimcmh-left">
              <i class="el-icon-user-solid"></i>
              <span class="hn-custimlth-text">今日新增客户</span>
              <span class="hn-custimlth-text2">-双击查看详情</span>
            </div>
            <i class="el-icon-dibudaohanglan-"></i>
          </div>
          <div class="hn-custm-warp">
            <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection"  width="40"> </el-table-column>
              <el-table-column prop="dictName" label="电话">
              </el-table-column>
              <el-table-column prop="dictUse" label="所在地区">
                <!-- <template slot-scope="scope">
                  <span>{{ scope.row.dictUse ? '使用中' : '未使用' }}</span>
                </template> -->
              </el-table-column>
              <el-table-column prop="edit" label="回访">
                <!-- <template slot-scope="scope">
                  <el-button type="warning" icon="el-icon-delete">释放客户</el-button>
                </template> -->
              </el-table-column>
              <el-table-column prop="edit" label="派单">
                <!-- <template slot-scope="scope">
                  <el-button type="warning" icon="el-icon-delete">释放客户</el-button>
                </template> -->
              </el-table-column>
              <el-table-column prop="edit" label="预约">
                <!-- <template slot-scope="scope">
                  <el-button type="warning" icon="el-icon-delete">释放客户</el-button>
                </template> -->
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="hn-jdzxmm-center">
        <div class="hn-custimc-bottom">
          <div class="hn-custimcm-head">
            <div class="hn-custimcmh-left">
              <i class="el-icon-user-solid"></i>
              <span class="hn-custimlth-text">今日回访任务</span>
              <span class="hn-custimlth-text2">-双击查看详情</span>
            </div>
            <i class="el-icon-dibudaohanglan-"></i>
          </div>
          <div class="hn-custm-warp">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="dictName" label="电话">
              </el-table-column>
              <el-table-column prop="dictUse" label="回访">
                <!-- <template slot-scope="scope">
                  <span>{{ scope.row.dictUse ? '使用中' : '未使用' }}</span>
                </template> -->
              </el-table-column>
              <el-table-column prop="edit" label="预约日期">
                <!-- <template slot-scope="scope">
                  <el-button type="warning" icon="el-icon-delete">释放客户</el-button>
                </template> -->
              </el-table-column>
              <el-table-column prop="edit" label="支付日期">
                <!-- <template slot-scope="scope">
                  <el-button type="warning" icon="el-icon-delete">释放客户</el-button>
                </template> -->
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="hn-jdzxmm-right">
        <div class="hn-custimc-bottom">
          <div class="hn-custimcm-head">
            <div class="hn-custimcmh-left">
              <i class="el-icon-user-solid"></i>
              <span class="hn-custimlth-text">预约今日就诊</span>
              <span class="hn-custimlth-text2">-双击查看详情</span>
            </div>
            <i class="el-icon-dibudaohanglan-"></i>
          </div>
          <div class="hn-custm-warp">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="dictName" label="电话">
              </el-table-column>
              <el-table-column prop="dictUse" label="就诊">
                <!-- <template slot-scope="scope">
                  <span>{{ scope.row.dictUse ? '使用中' : '未使用' }}</span>
                </template> -->
              </el-table-column>
            </el-table>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value:'',
      tableData:[],
    }
  },
  mounted() {

  },
  methods: {
    // 今日新增客户表格选择数据
    handleSelectionChange(e){
      console.log(e,"新增客户表格")
    },
  }
}
</script>

<style scoped lang="scss">
.hn-jdzxmh-center{
  ::v-deep .el-switch__label *{
    font-size: 18px !important;
  }
}

</style>