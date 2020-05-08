<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['system:menu:query']">搜索</el-button> -->
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:menu:add']">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="dataList" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" default-expand-all>
      <el-table-column prop="text" label="菜单名称" :show-overflow-tooltip="true" width="130px"></el-table-column>
      <el-table-column prop="key" label="图标" width="180px"></el-table-column>
      <el-table-column prop="path" label="组件路径" width="180px"></el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.lvl">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)">新增</el-button>
          <el-button v-if="scope.row.parentId != 0" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:menu:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <update ref="update" @getList="getList"></update>
  </div>
</template>

<script>
import { fetchList, details } from "@/api/commonManager/module";
// import Treeselect from "@riophae/vue-treeselect";
// import "@riophae/vue-treeselect/dist/vue-treeselect.css";
// import IconSelect from "@/components/IconSelect";
import update from "./components/update";
export default {
  name: "菜单管理",
  components: { update },
  data() {
    return {
      // 遮罩层
      loading: true,
      dataList: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      }
    };
  },
  created() {
    this.getList();
  },

  methods: {
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams).then(response => {
        this.dataList = response.data.map(v => {
          v.children = v.childs;
          v.lvl = true;
          return v;
        });
        console.log(this.dataList);
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      const target = this.$refs.update;
      const data = {};
      if (row) {
        data.parentId = row.id;
      }
      target.handleOpen(data);
      target.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const target = this.$refs.update;
      target.handleOpen(row);
      target.title = "修改";
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除名称为"' + row.menuName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delMenu(row.menuId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    }
  }
};
</script>