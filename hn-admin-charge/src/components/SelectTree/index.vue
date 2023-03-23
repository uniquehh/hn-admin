<template>
  <el-select
    ref="selectTree"
    v-model="value"
    :placeholder="placeholder"
    v-bind="$attrs"
    filterable
    clearable
    @remove-tag="removeTag"
  >
    <el-option value="" />
    <el-tree
      ref="treeOption"
      :show-checkbox="this.$attrs.multiple"
      default-expand-all
      highlight-current
      accordion
      node-key="id"
      check-on-click-node
      :data="options"
      :props="defaultProps"
      @check="checkNode"
    />
  </el-select>
</template>

<script>
  export default {
    name: 'TreeSelect',
    props: {
      placeholder: {
        type: String,
        default: () => {
          return '请选择'
        }
      },
      // 节点数据
      options: {
        type: Array, // 必须是树形结构的对象数组
        default: () => {
          return []
        }
      },
      // 设置lable value属性
      defaultProps: {
        type: Object,
        default: () => {
          return {
            value: 'userId', // ID字段名
            label: 'deptName', // 显示名称
            children: 'children' // 子级字段名
          }
        }
      },
      // 默认勾选的节点
      defaultCheckNodes: {
        type: Array, // 已经分配的资源
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        value: []
      }
    },
    methods: {
      // 删除tag时，
      removeTag(val) {
        // 取消勾选
        const treeOption = this.$refs.treeOption
        treeOption.setChecked(val, false, false)

        // 重新给控件赋值
        this.$emit('input', this.value)
      },
      // 勾选节点，
      checkNode(node, treeStatus) {
        console.log(node);
        node.value = node[this.defaultProps.value]
        node.currentLabel = node[this.defaultProps.label]
        // 给selectTree的cachedOptions赋值 设置node.label，使用页面显示label值
        const selectTree = this.$refs.selectTree
        selectTree.cachedOptions.push(node)
        selectTree.handleOptionSelect(node, true)

        this.$emit('input', this.value)
        this.$emit("clickNode",node);
      }
    }
  }
</script>

<style scoped>
  /* 去除tree上面的一行高度 */
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    padding: 0;
  }

</style>
