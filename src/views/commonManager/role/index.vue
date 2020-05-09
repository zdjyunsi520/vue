<template>
  <div class="app-container">
     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
       </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="dataList" border class="commtable">
      <el-table-column label="角色名称" align="center" prop="Name" :show-overflow-tooltip="true" />
      <el-table-column label="权限字符" align="center" prop="Key" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:role:remove']">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    <update ref="update" @getList="getList"></update>
  </div>
</template>

<script>
import { fetchList } from "@/api/commonManager/role";
import update from "./components/update";
export default {
  components: { update },
  data() {
    return {
      // 遮罩层
      listLoading: false,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageno: 1,
        pagesize: 9999
      },
      dataList: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data;
        })
        .finally(r => (this.listLoading = false));
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageno = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 新增按钮操作 */
    handleAdd() {
      const target = this.$refs.update;
      target.handleOpen();
      target.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const target = this.$refs.update;
      const id = row.Id;
      const key = row.Key;
      const sortindex = row.SortIndex;
      const name = row.Name;
      target.handleOpen({ id, key, sortindex, name });
      target.title = "修改";
    }
  }
};
</script>
<style lang="scss" >
.commtable .el-table__header th{padding:8px 0 !important;}
</style>