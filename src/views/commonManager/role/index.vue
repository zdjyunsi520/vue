<template>
  <div class="app-container">
    <div class="bg-white containerbox" ref="containerbox">
      <el-row class="table-btns">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
      </el-row>
      <el-table v-loading="listLoading" :data="dataList" border class="commtable" :height="dataList?tableHeight:'0'">
        <el-table-column label="名称" prop="Name" :show-overflow-tooltip="true" />
        <el-table-column label="角色标识" prop="Key" :show-overflow-tooltip="true" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
            <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:role:remove']">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { fetchList } from "@/api/commonManager/role";
export default {
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
      tableHeight: "",
      dataList: null
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    let _this = this;
    window.onresize = () => {
      _this.setTableHeight();
    };
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    setTableHeight() {
      this.tableHeight = this.$refs.containerbox.offsetHeight - 120;
    },
    /** 查询角色列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data;
          this.total = response.total;
          this.setTableHeight();
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
      const title = "新增角色";
      this.$router.push({
        name: "/commonManager/role/components/update",
        params: { data: {}, title }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const target = this.$refs.update;
      const id = row.Id;
      const key = row.Key;
      const sortindex = row.SortIndex;
      const name = row.Name;
      const data = { id, key, sortindex, name };
      const title = "修改角色";
      this.$router.push({
        name: "/commonManager/role/components/update",
        params: { data, title }
      });
    }
  }
};
</script>
<style lang="scss" >
.commtable .el-table__header th {
  padding: 8px 0 !important;
}
</style>