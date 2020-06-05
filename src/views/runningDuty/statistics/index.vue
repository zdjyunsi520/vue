<template>
  <div class="app-container">
    <div class="search-box marginbottom15">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按人员统计" name="0"></el-tab-pane>
        <el-tab-pane label="按值班统计" name="1"></el-tab-pane>
      </el-tabs>
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
        <el-form-item label="用电单位" prop="tenantId">
          <el-select v-model="queryParams.tenantId">
            <el-option label="请选择" value></el-option>
            <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
          </el-select>
        </el-form-item>
        <el-form-item label="年度" prop="teamId">
          <el-input v-model="queryParams.teamId" placeholder="请输入年度" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          <el-button icon="el-icon-download" @click="resetQuery">导出</el-button>
        </el-form-item>
        <!-- <el-button type="success" icon="el-icon-edit-outline" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:user:edit']">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">删除</el-button>
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>-->
      </el-form>
    </div>
    <div class="bg-white containerbox marginbottom15" ref="containerbox">
      <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border :height="tableHeight" @sort-change="handleSortChange" style='margin-top:20px'>
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" class="smimg"/>
            <p>暂时还没有数据</p>
          </div>
        </template><!-- <el-table-column type="selection" fixed="left" width="55"  /> -->
        <el-table-column label="值班人员" prop="TeamName" />
        <el-table-column label="用电单位" prop="EmployeeNames" />
      </el-table>

      <pagination  :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
    <div class="bg-white containerbox  chart-wrapper">
      <BarChart ref="chart" :chartData='chartData' v-if="dataList&&dataList.length>0" />
      <p v-else class="tips" style="padding-top:13%">暂无数据</p>
    </div>
  </div>

</template>

<script>
import { mapGetters } from "vuex";
import { fetchList } from "@/api/runningDuty/search";
import BarChart from "./components/BarChart";
export default {
  name: "user",
  components: { BarChart },
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
      rules: {},
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        teamId: "",
        shifttypeId: "",
        charatypeId: "",
        employeename: ""
      },
      tableHeight: "calc(100% - 80px)"
    };
  },

  created() {
    this.getList();
  },
  computed: {
    ...mapGetters({
      companyType: "status/companyType"
    })
  },
  methods: {
    handleCommand(commond) {
      this.$router.push({
        name: commond,
        params: {}
      });
    },
    filterCancel(row) {
      return row.IsCancel ? "已注销" : "正常";
    },
    handleClick(tab, event) {
      this.resetQuery("queryForm");
      this.getList(this.activeName);
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
        name: "/runningDuty/dutyConfiguration/components/index",
        params: { data: {}, title }
      });
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      const id = row.Id;
      const username = row.UserName;
      const name = row.Name;
      const mobilephone = row.MobilePhone;
      const data = { id, username, name, mobilephone };
      const title = "编辑用户";
      this.$router.push({
        name: "/commonManager/user/components/update",
        params: { data, title }
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      const id = row.Id;
      const username = row.UserName;
      const data = { id, username };
      const title = "编辑密码";
      this.$router.push({
        name: "/commonManager/user/components/password",
        params: { data, title }
      });
    },
    handleUpdateRole(row) {
      const id = row.Id;
      const data = { id };
      const title = "权限设置";
      this.$router.push({
        name: "/commonManager/user/components/role",
        params: { data, title }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项？',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功!");
        })
        .catch(function() {
          this.msgSuccess("操作失败!");
        });
    },
    // handleLock(row, lock) {
    //   let ids = row
    //     ? (ids = [row.Id])
    //     : this.ids.filter(v => v.IsLock == lock).map(v => v.Id);
    //   if (ids.length) {
    //     const islock = !lock;
    //     ids = ids.join(",");
    //     locklock({ ids, islock }).then(r => {
    //       this.$message.success(r.msg);
    //       this.getList();
    //     });
    //   }
    // },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项？", "警告", {
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
