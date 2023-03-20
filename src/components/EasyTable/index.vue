<template>
        <el-table :data="tableData" size="medium" v-loading="loading"
                  ref="multipleTable" border
                  :row-class-name="rowClassName"
                  @sort-change="handleSort"
                  @filter-change="filterHandler"
                  @selection-change="handleSelectionChange"
                  @row-dblclick="handleDbClick"
                  @row-click="handleRowClick">
          <el-table-column type="selection" width="55" align="center" v-if="selection"/>
          <el-table-column v-for="(th, key) in tableHeader" v-if="!th.hidden"
                           :key="key"
                           :prop="th.prop"
                           :label="th.label"
                           :fixed="th.fixed"
                           :sortable="th.sortable?'custom':false"
                           :filters="th.filters"
                           :column-key="th.columnKey"
                           :show-overflow-tooltip="th.overflow"
                           :filtered-value="th.filteredValue"
                           :filter-multiple="th.filterMultiple"
                           :min-width="th.minWidth" align="center">
            <template slot-scope="scope">
              <span v-if="th.type&&th.type ==='badge'">
                {{ scope.row[th.prop]  }}
                <el-badge :value="th.badge" class="item" v-if="th.badgeShow(scope.row)">
                </el-badge>
              </span>
              <span v-else-if="th.type && th.type === 'switch'">
                  <el-switch  v-model="scope.row[th.prop]"  :active-text="th.active"  :inactive-text="th.inactive"
                              :active-value="th.activeValue" :inactive-value="th.inactiveValue" @change="(val)=>switchChanage(val,th.prop,scope.row)"></el-switch>
              </span>
              <span v-else-if="th.type&&th.type==='date'">
                  {{ parseTime(scope.row[th.prop],th.format) }}
              </span>
              <span v-else-if="th.type === 'image'">
                  <ImagePreview   :src="scope.row[th.prop]" v-if="scope.row[th.prop]"  width="30px" height="50px"/>
              </span>
              <span v-else-if="th.type === 'images'">
                  <ImagePreview v-for="img in (scope.row.imgArray)"  :src="img"  width="30px" height="50px"/>
              </span>
              <span v-else>
                <ex-slot v-if="th.render" :render="th.render" :row="scope.row" :index="scope.$index" :column="th"/>
                 <span v-else>{{ scope.row[th.prop]  }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="operaterData.length>0" :width="operateWith">
            <template slot-scope="scope">
              <el-button
                v-for="but in operaterData"
                :size="but.size"
                :type="but.type"
                :icon="but.icon"
                @click="but.fn(scope.row)"
                v-if="(!but.permi||auth.hasPermi(but.permi))&&(but.showFn&&but.showFn(scope.row))"
              >{{but.label}}
              </el-button>
            </template>
          </el-table-column>

        </el-table>
</template>

<script>
  import auth from '@/plugins/auth'

  var exSlot = {
    functional: true,
    props: {
      row: Object,
      render: Function,
      index: Number,
      column: {
        type: Object,
        default: null
      },
    },
    render: (h, data) => {
      const params = {
        row: data.props.row,
        index: data.props.index
      }
      if (data.props.column) params.column = data.props.column
      return data.props.render(h, params)
    }
  }

  export default {
    name: "EasyTable",
    components: {exSlot},
    props: {
      // 表格数据
      tableData: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 表头数据
      tableHeader: {
        type: Array,
        default: function () {
          return []
        }
      },
      operaterData: {
        type: Array,
        default: function () {
          return []
        }
      },
      selection: {
        type: Boolean,
        default: false
      },
      showLabel:{
        type: Boolean,
        default: true
      },
      loading:{
        type:Boolean,
        default:false
      },
      operateWith:{
        type:Number|null,
        default: 250
      }
    },
    data() {
      return {
        auth: auth
      }
    },
    methods: {
      rowClassName({row, rowIndex}){
        let data = '';
       this.$emit('rowClassName', row,rowIndex,roll =>{
         data =roll;
        })
       return data;
      },
      // 排序事件
      handleSort(sort) {
        this.$emit('sort-events', sort)
      },
      // 筛选事件
      filterHandler(filters) {
        this.$emit('filter-events', filters)
      },
      // 某一行被点击
      handleRowClick(row) {
        this.$emit('click-events', row)
      },
      handleSelectionChange(row) {
        this.$emit('selectionChange', row)
      },
      switchChanage(val,prop,row) {
        this.$emit('switchChanage', val,prop,row)
      },
      handleDbClick(row){
        this.$emit('dbClick',row)
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-calendar__title {
    padding: 0px 10px 10px 10px;

    .title {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 700;
      color: #56585c;
    }
  }

  .el-divider--horizontal {
    margin: 0px 0px 24px 0 !important;
  }
</style>

