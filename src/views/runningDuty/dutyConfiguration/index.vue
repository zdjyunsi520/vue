<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
        <el-form-item label="值班班组" prop="teamId">
          <el-select v-model="queryParams.teamId">
            <el-option label="全部" value=""></el-option>
            <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in teamList" />
          </el-select>
        </el-form-item>
        <el-form-item label="班次类型" prop="shifttypeId">
          <el-select v-model="queryParams.shifttypeId">
            <el-option label="全部" value=""></el-option>
            <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in shiftTypeList" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色类型" prop="charatypeId">
          <el-select v-model="queryParams.charatypeId">
            <el-option label="全部" value=""></el-option>
            <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in charactorTypeList" />
          </el-select>
        </el-form-item>
        <el-form-item label="班组人员" prop="employeename">
          <el-input v-model="queryParams.employeename" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
        <!-- <el-button type="success" icon="el-icon-edit-outline" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:user:edit']">修改</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">删除</el-button>
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>-->
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
      </el-row>
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
            <el-button type="text" size="mini" @click="handleUpdate(scope.row)">
              <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
            </el-button>
            <el-button type="text" size="mini" @click="handleDelete(scope.row)">
              <svg-icon icon-class='ic_delete' class="tablesvgicon"></svg-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>

  </div>
</template>

<script>
import {
  fetchList,
  fetchTeam,
  fetchShiftType,
  fetchCharactorType
} from "@/api/runningDuty/dutyConfiguration";

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
      // 查询参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        teamId: "",
        shifttypeId: "",
        charatypeId: "",
        employeename: ""
      },
      teamList: [],
      charactorTypeList: [],
      shiftTypeList: []
    };
  },

  created() {
    this.getList();
    this.getTeam();
    this.getShiftType();
    this.getCharactorType();
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
    getTeam() {
      fetchTeam({}).then(r => {
        this.teamList = r.data;
      });
    },
    getShiftType() {
      fetchShiftType({}).then(r => {
        this.shiftTypeList = r.data;
      });
    },
    getCharactorType() {
      fetchCharactorType({}).then(r => {
        this.charactorTypeList = r.data;
      });
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
<style lang="scss">
</style>
