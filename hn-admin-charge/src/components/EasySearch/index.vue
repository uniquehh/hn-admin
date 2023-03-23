<template>
  <div style="border-bottom: 1px #ddd dashed">
    <el-row :gutter="20">
     <!-- <el-col class="el-calendar__title">
        <label class="title">数据筛选</label>  :label-width="`${lblWidth}px`"
      </el-col>-->
      <el-col>
        <el-form :model="modelForm" ref="form" size="small" :inline="true" v-show="showSearch" label-width="auto"  >
          <el-form-item
            v-for="params in queryParams" v-if="!params.hidden"
            :label="params.label" :prop="params.prop">
            <el-input
              v-if="params.type === 'input'"
              v-model="form[params.prop]"
              :style="params.style"
              :placeholder="params.placeholder"
              clearable
              @keyup.enter.native="handleQuery"
            />
            <el-input
              v-if="params.type === 'number'"
              type="number"
              v-model="form[params.prop]"
              :style="params.style"
              :placeholder="params.placeholder"
              clearable
              @keyup.enter.native="handleQuery"
            />
            <div v-if="params.type === 'rangeNumber'">
              <el-input
                type="number"
                v-model="form['min']"
                :style="params.style"
                placeholder="起始值"
                clearable
                @keyup.enter.native="handleQuery"
              /> -
              <el-input
              type="number"
              v-model="form['max']"
              :style="params.style"
              placeholder="结束值"
              clearable
              @keyup.enter.native="handleQuery"
            />
            </div>
            <el-select
              v-if="params.type=='select'"
              v-model="form[params.prop]"
              :placeholder="params.placeholder"
              :filterable="params.search"
              :style="params.style"
              clearable
            >
              <el-option
                v-for="dict  in (typeof params.selection === 'function' ? asyncOptions[params.prop] : params.selection)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            <treeselect
              v-if="params.type=='treeSelect'"
              v-model="form[params.prop]"
              :searchable="params.search"
              :style="params.style"
              :options="typeof params.selection === 'function' ? asyncOptions[params.prop] : params.selection"
              :normalizer="typeof params.normalizer === 'function'?params.normalizer:defalutNormalizer"
              placeholder="选择分类" />
            <el-date-picker
              v-if="params.type=='date'"
              style="width: 220px"
              :value-format="params.format"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              v-model="form[params.prop]"
              :placeholder="params.placeholder">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  export default {
    name: "easySearch",
    components: { Treeselect },
    props: {
      showSearch: {
        type: Boolean,
        default: true
      },
      labelWidth: {
        type: Number,
        default: 68
      },
      queryParams: {
        type: Array,
        default: function () {
          return [];
        }
      },
      modelForm:{
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    computed: {
      lblWidth() {
        return this.labelWidth || 68
      }
    },
    mounted() {
     Promise.resolve(1).then(() => {
        this.$refs.form.clearValidate()
      })
    },
    created() {
      if (this.queryParams) {
        const len = this.queryParams ? this.queryParams.length : 0
        for (let i = 0; i < len; i++) {
          const item = this.queryParams[i]
          // 处理需要异步获取的数据（如单选框、复选框、下拉选择等组件）
          if (typeof item.selection === 'function') {
            this.asyncOptions[item.prop] = []
            item.selection((data) => {
              this.asyncOptions[item.prop] = data
              this.$forceUpdate()
            })
          }
        }
      }
    },
    data(){
      return{
        form:{},
        asyncOptions: {},
      }
    },
    methods: {
      handleQuery() {
        console.log(this.form)
        this.$emit('handleQuery', this.form)
      },
      resetQuery() {
        this.form = {}
        this.$emit('resetQuery', this.form)
      },
      defalutNormalizer(node) {
        console.log('>>>>>',node)
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.name,
          children: node.children
        };
      },
    }
  }
</script>

<style scoped  lang="scss">
  .el-calendar__title {
    padding:0px 10px 10px 10px;
  .title{
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 700;
    color: #56585c;
  }
  }
  .el-divider--horizontal{
    margin:0px 0px 24px 0!important;
  }
</style>
