<template>
  <div class="hn-dtdict-main">
    <div class="hn-dict-search">
      <div class="hn-dicts-left">
        <div class="hn-dictsl-text">小组名称：</div>
        <el-input @keyup.enter.native="inputSearch" v-model="groupData._params.groupName" class="hn-groupsl-inp"></el-input>
      </div>
      <div class="hn-dicts-right">
        <el-button @click="resetBtnEvent">重置</el-button>
        <el-button @click="inputSearch" type="primary">搜索</el-button>
      </div>
    </div>
    <div class="hn-dtdictt-head">
      <div class="hn-dicts-right">
        <el-button type="primary" @click="openADDialog">添加小组管理</el-button>
      </div>
    </div>
    <el-table :data="groupData._list" style="width: 100%">
      <el-table-column prop="id" label="id">
      </el-table-column>
      <el-table-column prop="groupName" label="小组名称">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column prop="edit" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editGroupRow(scope,'delete')">删除</el-button>
          <el-button type="text" @click="editGroupRow(scope,'edit')">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination v-show="groupData._total>0" :total="groupData._total" 
      :page="groupData._page" 
      @pagination="pagingChange"
      :limit="groupData._limit" 
    />
    <!-- 添加小组 -->
    <el-dialog :title="dicDilogTitle" width="400px" :visible.sync="showDIDialog">
      <el-form :model="addGroupForm"  :rules="addGroupFormRules" ref="addGroupForm">
        <el-form-item label="小组名称" prop="groupName" required>
          <el-input v-model="addGroupForm.groupName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="showDIDialog = false">取 消</el-button>
        <el-button  type="primary" @click="groupDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import groupTable from '@/components/dictTable.vue'
import { Paging } from '@/util/paging'
export default {
  components: { groupTable },
  data() {
    return {
      groupData: new Paging('/group/getGroupPage', { groupName: "",order:"id DESC" },'post'),//小组数据
      // 添加小组管理的表单
      addGroupForm: {
        groupName:"",
      },
      addGroupFormRules: {
        groupName: [
          { required: true, message: '请输入小组名称', trigger: 'blur' },
        ],
      },
      dicDilogTitle:"",//小组管理弹窗标题
      showDIDialog:false,//是否显示小组管理弹窗
      currGroupId:"",//当前操作的小组id
    }
  },
  computed: {
    currDTInd() {
      return 0
    }
  },
  created() {
    this.getGroupData()
  },
  mounted() {

  },
  methods: {
    // 添加小组数据
    addGroup(){
      this.request('/group/saveGroup', this.addGroupForm, "post").then((res) => {
        if (res.code == 0) {
          this.showDIDialog = false
          this.getGroupData()
          this.hnMsg()
        }
      })
    },
    // 修改小组数据
    editGroup(){
      this.request('/group/updateGroup', {
        groupName:this.addGroupForm.groupName,
        id:this.currGroupId
      }, "put").then((res) => {
        if (res.code == 0) {
          this.showDIDialog = false
          this.getGroupData()
          this.hnMsg()
        }
      })
    },
    // 小组弹窗确认
    groupDialogConfirm(){
      this.$refs.addGroupForm.validate((valid) => {
        if (valid) {
          this.dicDilogTitle=='添加小组'?this.addGroup():this.editGroup()
        } else {
          return false;
        }
      })
    },
    // 打开编辑/删除小组弹窗
    editGroupRow(scope,type) {
      this.currGroupId = scope.row.id
      if(type=='edit'){
        this.showDIDialog = true
        this.dicDilogTitle = "编辑小组"
        this.addGroupForm.groupName = scope.row.groupName
      }else{
        this.hnMsgBox().then(()=>{
          this.request('/group/deleteGroup', {
            groupIdList: this.currGroupId,
          }, 'put','form').then((res) => {
            if (res.code == 0) {
              this.getGroupData()
              this.hnMsg()
            }
          })
        })
      }
      
    },
    // 打开添加小组弹窗
    openADDialog() {
      this.addGroupForm.groupName = ''
      this.showDIDialog = true
      this.dicDilogTitle = "添加小组"
      this.$nextTick(() => { //打开弹窗后移除其表单验证，防止先点击编辑再点击添加自动触发验证
        this.$refs.addGroupForm.clearValidate()
      })
    },
    // 关键词搜索
    inputSearch(){
      this.resetPaging()
      this.getGroupData()
    },
    // 获取小组管理数据
    getGroupData() {
      this.groupData.exec()
    },
    // 初始化分页、关键词数据
    resetPaging() {
      this.groupData._page = 1
      this.groupData._limit = 20
    },
    // 重置按钮
    resetBtnEvent() {
      this.groupData._params.groupName = ''
      this.resetPaging()
      this.getGroupData()
    },
    // 分页器页码、显示条数改变
    pagingChange(e) {
      console.log(e)
      this.groupData._page = e.page
      this.groupData._limit = e.limit
      this.getGroupData()
    },
  }
}
</script>

<style scoped lang="scss">
.hn-dict-search{
  margin-bottom: 20px;
}
</style>