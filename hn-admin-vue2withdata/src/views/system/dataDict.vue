<template>
  <div class="hn-dtdict-main">
    <el-tabs v-model="activeName" @tab-click="tabsChange">
      <div class="hn-dict-search">
        <div class="hn-dicts-left">
          <div class="hn-dictsl-text">字典名称：</div>
          <el-input @keyup.enter.native="inputSearch" placeholder="请输入字典名称" v-model="dictType[currDTInd].list._params.dictName" class="hn-dictsl-inp"></el-input>
        </div>
        <div class="hn-dicts-right">
          <el-button @click="resetBtnEvent">重置</el-button>
          <el-button @click="inputSearch" type="primary">搜索</el-button>
        </div>
      </div>
      <div class="hn-dtdictt-head">
        <div class="hn-dicts-left">
          <div class="hn-dictsl-text">{{ dictType[currDTInd].label }}</div>
        </div>
        <div class="hn-dicts-right">
          <el-button type="primary" @click="openADDialog">添加数据字典</el-button>
        </div>
      </div>
      <el-tab-pane v-for="(item) in dictType" :key="item.dictType" :label="item.label" :name="item.dictType">
        <dictTable 
          v-if="activeName == item.dictType" 
          :key="activeName" 
          :data="item.list._list" 
          :dictType="dictType"
          @editDictRow="emitDictRow"
        ></dictTable>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页器 -->
    <pagination v-show="dictType[currDTInd].list._total>0" :total="dictType[currDTInd].list._total" 
      :page="dictType[currDTInd].list._page" 
      @pagination="pagingChange"
      :limit="dictType[currDTInd].list._limit" 
    />
    <!-- 添加数据字典 -->
    <el-dialog :title="dicDilogTitle" width="400px" :visible.sync="showDIDialog">
      <el-form :model="addDictForm"  :rules="addDictFormRules" ref="addDictForm">
        <el-form-item label="字典名称" prop="dictName" required>
          <el-input v-model="addDictForm.dictName" placeholder="请输入字典名称" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="showDIDialog = false">取 消</el-button>
        <el-button  type="primary" @click="dictDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dictTable from '@/components/dictTable.vue'
import { Paging } from '@/util/paging'
export default {
  components: { dictTable },
  data() {
    return {
      dictType: [ //字典类型
        {
          dictType: "CUSTOMER_SOURCE",
          label: "客户来源",
          list: new Paging('/dict/getDictPage', { dictName: "",order:"id DESC" },'post'),//字典数据
        },
      ],
      activeName: 'CUSTOMER_SOURCE',
      // 添加数据字典的表单
      addDictForm: {
        dictType:"",
        dictName:"",
      },
      addDictFormRules: {
        dictName: [
          { required: true, message: '请输入字典名称', trigger: 'blur' },
        ],
      },
      dicDilogTitle:"",//数据字典弹窗标题
      showDIDialog:false,//是否显示数据字典弹窗
      currDictId:"",//当前操作的字典id
    }
  },
  computed: {
    currDTInd() {
      return this.dictType.findIndex(item=> item.dictType == this.activeName)
    }
  },
  created() {
    this.getDictData()
  },
  mounted() {

  },
  methods: {
    // 添加字典数据
    addDict(){
      this.addDictForm.dictType = this.dictType[this.currDTInd].dictType
      this.request('/dict/addDict', this.addDictForm, "post").then((res) => {
        if (res.code == 0) {
          this.showDIDialog = false
          this.getDictData()
          this.hnMsg()
        }
      })
    },
    // 修改字典数据
    editDict(){
      this.addDictForm.dictType = this.dictType[this.currDTInd].dictType
      this.request('/dict/updateDict', {
        dictName:this.addDictForm.dictName,
        id:this.currDictId
      }, "put").then((res) => {
        if (res.code == 0) {
          this.showDIDialog = false
          this.getDictData()
          this.hnMsg()
        }
      })
    },
    // 数据字典弹窗确认
    dictDialogConfirm(){
      this.$refs.addDictForm.validate((valid) => {
        if (valid) {
          this.dicDilogTitle=='添加数据字典'?this.addDict():this.editDict()
        } else {
          return false;
        }
      })
    },
    // 打开编辑/删除字典弹窗
    emitDictRow(scope) {
      console.log(scope,85)
      this.currDictId = scope.row.id
      if(scope.row.editType=='edit'){
        this.showDIDialog = true
        this.dicDilogTitle = "编辑数据字典"
        this.addDictForm.dictName = scope.row.dictName
      }else{
        this.hnMsgBox().then(()=>{
          this.request('/dict/deleteDict', {
            dictId: this.currDictId,
          }, 'delete').then((res) => {
            if (res.code == 0) {
              this.getDictData()
              this.hnMsg()
            }
          })
        })
      }
      
    },
    // 打开添加字典弹窗
    openADDialog() {
      this.addDictForm.dictName = ''
      this.showDIDialog = true
      this.dicDilogTitle = "添加数据字典"
      this.$nextTick(() => { //打开弹窗后移除其表单验证，防止先点击编辑再点击添加自动触发验证
        this.$refs.addDictForm.clearValidate()
      })
    },
    // 关键词搜索
    inputSearch(){
      this.resetPaging()
      this.getDictData()
    },
    // 获取数据字典数据
    getDictData() {
      this.dictType[this.currDTInd].list._params.dictType = this.activeName
      this.dictType[this.currDTInd].list.exec()
    },
    // 初始化分页、关键词数据
    resetPaging() {
      this.dictType[this.currDTInd].list._page = 1
      this.dictType[this.currDTInd].list._limit = 20
    },
    // 重置按钮
    resetBtnEvent() {
      this.dictType[this.currDTInd].list._params.dictName = ''
      this.resetPaging()
      this.getDictData()
    },
    // 分页器页码、显示条数改变
    pagingChange(e) {
      console.log(e)
      this.dictType[this.currDTInd].list._page = e.page
      this.dictType[this.currDTInd].list._limit = e.limit
      this.getDictData()
    },
    tabsChange(tab) {
      this.resetPaging()
      this.getDictData()
      // console.log(this.activeName)
      // console.log(tab.index, tab.name)
    }
  }
}
</script>

<style scoped lang="scss">
.hn-dict-search{
  margin-bottom: 20px;
}
</style>