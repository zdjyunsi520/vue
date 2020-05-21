<template>
  <div class="app-container">
    <div class="search-box" style="border-bottom:none">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按岗位展示" name="0"></el-tab-pane>
        <el-tab-pane label="按人员展示" name="1"></el-tab-pane>
      </el-tabs>
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
        <el-form-item label="值班班组" prop="dutyId">
          <el-select v-model="queryParams.dutyId" clearable placeholder="请选择值班班组">
            <el-option v-for="(item,index) in dutyIds" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年月" prop="time">
          <el-date-picker v-model="queryParams.time" type="month" placeholder="请选择年月" value-format="yyyy-MM" format="yyyy-MM"> </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-row class="table-btns">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增值班</el-button>
        <el-dropdown @command="handleCommand">
          <el-button type="primary" icon=" el-icon-circle-plus-outline">
            设置<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="/runningDuty/dutyConfiguration/group/index">设置班组</el-dropdown-item>
            <el-dropdown-item command="/runningDuty/dutyConfiguration/classTime/index">设置班次</el-dropdown-item>
            <el-dropdown-item command="/runningDuty/dutyConfiguration/role/index">设置角色</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="timetips">
          <label>值班班次</label>
          <p>
            <span>白班<b>08:00:00-20:00:00</b></span>
            <span>晚班<b>20:00:00-08:00:00</b></span>
          </p>
        </div>
      </el-row>
      <div class="scheduletitle">- 班组二 2020年04月排班表 -</div>
      <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border :height="dataList?tableHeight:'0'" @sort-change="handleSortChange">
        <!-- <el-table-column type="selection" fixed="left" width="55" align="center" /> -->
        <el-table-column label="值班班组" align="center" prop="TeamName" />
        <el-table-column label="值班人员" align="center" prop="EmployeeNames" />
        <el-table-column label="班次类型" align="center" prop="ShiftTypeName" />
        <el-table-column label="班次" align="center" prop="ShiftNames" />
        <el-table-column label="角色类型" align="center" prop="CharaTypeName" />
        <el-table-column label="角色" align="center" prop="Characters" />
        <el-table-column label="岗位" align="center" prop="Positions" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" icon="el-icon-key" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>

  </div>
</template>

<script>
import { fetchList } from "@/api/runningDuty/sortManager";

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
      tableHeight: "0",
      rules: {},
      activeName: "0",
      // 查询参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        dutyId: "",
        time: ""
      },
      dutyIds: [
        {
          id: 1,
          name: "班组一"
        },
        {
          id: 2,
          name: "班组二"
        }
      ]
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
    handleClick(tab, event) {
      // this.resetQuery("queryForm");
      // this.queryParams.patroltimeend = "";
      // this.getList(this.activeName);
    },

    handleCommand(commond) {
      this.$router.push({
        name: commond,
        params: {}
      });
    },
    setTableHeight() {
      this.tableHeight = this.$refs.containerbox.offsetHeight - 130;
    },
    filterCancel(row) {
      return row.IsCancel ? "已注销" : "正常";
    },
    handleSortChange(row) {
      this.queryParams.orderby = `${row.prop} ${
        row.order == "ascending" ? "asc" : "desc"
      }`;
      this.getList();
    },
    /** 查询用户列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data;
          this.total = response.total;
        })
        .finally(r => {
          this.listLoading = false;
          this.setTableHeight();
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.Id;
      const username = row.UserName;
      const name = row.Name;
      const mobilephone = row.MobilePhone;
      const data = { id, username, name, mobilephone };
      const title = "修改用户";
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
      const title = "修改密码";
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
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
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
          this.msgSuccess("删除成功");
        })
        .catch(function() {
          this.msgSuccess("操作失败");
        });
    },
    handleLock(row, lock) {
      let ids = row
        ? (ids = [row.Id])
        : this.ids.filter(v => v.IsLock == lock).map(v => v.Id);
      if (ids.length) {
        const islock = !lock;
        ids = ids.join(",");
        locklock({ ids, islock }).then(r => {
          this.$message.success(r.msg);
          this.getList();
        });
      }
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
<style lang="scss" >
.timetips {
  position: absolute;
  right: 15px;
  top: -10px;
  color: #313033;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  label {
    display: block;
    font-weight: normal;
    margin-right: 20px;
  }
  p {
    span {
      display: block;
      padding: 5px 0;
      font-weight: normal;
      b {
        margin-left: 10px;
        font-weight: normal;
      }
      &::before {
        content: "";
        margin-right: 10px;
        display: inline-block;
        vertical-align: middle;
        color: #909399;
        border-radius: 100%;
        width: 6px;
        height: 6px;
        background-color: #7098ff;
      }
    }
  }
}
.scheduletitle {
  text-align: center;
  font-size: 20px;
  padding: 30px 0 60px;
  font-weight: bold;
  color: #333333;
}
</style>
