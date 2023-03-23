<template>
	<div class="app-container">
		<el-row :gutter="10">
			<el-form size="small" :inline="true">
				<el-form-item>
					<el-button v-hasPermi="['system:carType:create']" type="primary" size="mini" icon="el-icon-plus"
						plain @click="handleAdd">新增</el-button>
					<el-button type="info" size="mini" icon="el-icon-sort" plain @click="toggleExpandAll">展开/折叠
					</el-button>
				</el-form-item>
			</el-form>
		</el-row>

		<el-row :gutter="15">
			<el-table v-if="refreshTable" v-loading="loading" :data="list" @selection-change="handleSelectionChange"
				row-key="id" border :default-expand-all="isExpandAll" :tree-props="{ children: 'children'}">
				<el-table-column label="类型名称" prop="typeName">
				</el-table-column>
				<el-table-column label="操作" >
					<template slot-scope="scope">
						<el-button v-if="scope.row.level!=2" size="mini" type="text" icon="el-icon-plus"
							@click="handleAdd(scope.row)" v-hasPermi="['system:carType:create']">添加子类型</el-button>
						<el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
							v-hasPermi="['system:carType:update']">编辑</el-button>

						<el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
							v-hasPermi="['system:carType:delete']">删除</el-button>
					</template>
				</el-table-column>

			</el-table>
		</el-row>

		<el-dialog :title="title" width="500px" :visible.sync="open" append-to-body>
			<el-form ref="form" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="上级类型">
					<treeselect v-model="form.parentId" :options="menuOptions" :normalizer="normalizer"
						:show-count="true" placeholder="选择上级类型" />
				</el-form-item>
				<el-form-item label="类型名称" prop="typeName">
					<el-input v-model="form.typeName" placeholder="请输入设备类型名称" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import control from "./control.js";
	export default control;
</script>

<style></style>
