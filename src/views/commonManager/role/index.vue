<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
        <el-form-item label="关键词：" prop="multiword" label-width="68px">
          <el-input v-model="queryParams.multiword" placeholder="名称/角色标识" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="名称：" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item> </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-row class="table-btns">
        <el-button type="primary" @click="handleAdd">
          <svg-icon icon-class='ic_add' class="tablesvgicon"></svg-icon>新增
        </el-button>
      </el-row>
      <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" :data="dataList" border class="commtable" :height="dataList?tableHeight:'0'" @row-dblclick="dbhandleUpdate">
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column label="名称" prop="Name" :show-overflow-tooltip="true" />
        <el-table-column label="角色标识" prop="Key" :show-overflow-tooltip="true" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleUpdate(scope.row)">
              <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
            </el-button>
            <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:role:remove']">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
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
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        multiword: "",
        name: ""
      },
      rules: {},
      tableHeight: "calc(100% - 115px)",
      dataList: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 搜索角色列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data;
          this.total = response.total;
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
    dbhandleUpdate(row) {
      this.handleUpdate(row);
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      const target = this.$refs.update;
      const id = row.Id;
      const key = row.Key;
      const sortindex = row.SortIndex;
      const name = row.Name;
      const data = { id, key, sortindex, name };
      const title = "编辑角色";
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