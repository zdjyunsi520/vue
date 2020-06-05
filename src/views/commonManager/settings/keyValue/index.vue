<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="代码" prop="key">
          <el-input v-model="queryParams.key" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
        <!-- <el-button type="success" icon="el-icon-edit-outline" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:user:edit']">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">删除</el-button>
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>-->
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox" style="margin-bottom: 0;">
      <el-row class="table-btns">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
        <el-button type="primary" icon="el-icon-remove-outline" @click="handleDelete(null)" :disabled="multiple">删除</el-button>
        <el-button type="primary" icon="el-icon-remove-outline" @click="handleBack">返回</el-button>
      </el-row>
      <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border :height="dataList?tableHeight:'0'">
        <el-table-column type="selection" fixed="left" width="55" />
        <el-table-column label="名称" prop="Name" />
        <el-table-column label="代码" prop="Key" />
        <el-table-column label="值" prop="Value" />
        <el-table-column label="描述" prop="Description" />
        <el-table-column label="状态" prop="IsLock" v-if="showSwitch">
          <template slot-scope="{row}">
            <el-switch v-model="row.IsEnable" class="switchStyle" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="启用" inactive-text="禁用" @change="handleUpdateStatus(row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>

  </div>
</template>

<script>
import {
  fetchList,
  deleted,
  update
} from "@/api/commonManager/settings/keyValue";

export default {
  name: "user",
  data() {
    return {
      // 遮罩层
      listLoading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      tableHeight: "calc(100% - 125px)",
      rules: {},
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        name: "",
        key: "",
        SettingId: "",
        Type: 1
      }
    };
  },

  created() {
    const { data } = this.$route.params;
    if (data && data.Id) {
      this.queryParams.SettingId = data.Id;
      this.queryParams.Type = data.Type;
      this.getList();
    }
  },
  computed: {
    showSwitch() {
      return this.queryParams.Type == 2;
    }
  },
  methods: {
    filterCancel(row) {
      return row.ForcedUpdate ? "是" : "否";
    },
    handleSortChange(row) {
      this.queryParams.orderby = `${row.prop} ${
        row.order == "ascending" ? "asc" : "desc"
      }`;
      this.getList();
    },
    /** 搜索用户列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data;
          this.total = response.total;
        })
        .catch(response => {
          this.dataList = response.data;
          this.total = response.total;
        })
        .finally(r => {
          this.listLoading = false;
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageno = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      const title = "新增";
      this.$router.push({
        name: "/commonManager/settings/keyValue/add",
        params: { data: this.queryParams, title }
      });
    },
    /** 编辑按钮操作 */
    handleUpdate(data) {
      const title = "编辑";
      this.$router.push({
        name: "/commonManager/settings/keyValue/add",
        params: { data, title }
      });
    },
    handleBack() {
      this.$router.push({
        name: "/commonManager/settings/index"
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids = row ? [row.Id] : this.ids.map(v => v.Id);
      this.$confirm("是否确认删除选中的数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return deleted({ ids });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功！");
        })
        .catch(function() {
          this.msgSuccess("操作失败！");
        });
    },
    handleUpdateStatus(row) {
      update(row).then(r => {
        this.$message.success("状态已更新！");
        this.getList();
      });
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportUser(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
<style lang="scss">
</style>
