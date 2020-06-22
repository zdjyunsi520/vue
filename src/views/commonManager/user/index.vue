<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
        <el-form-item label="关键词：" prop="username" label-width="61px">
          <el-input v-model="queryParams.username" placeholder="用户名/姓名/手机号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="用户名：" prop="username">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="手机号：" prop="mobilephone">
          <el-input v-model="queryParams.mobilephone" placeholder="请输入手机号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
        <!-- <el-button type="success" icon="el-icon-edit-outline" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:user:edit']">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">删除</el-button>
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>-->
      </el-form>
    </div>
    <div class="bg-white containerbox comheight" ref="containerbox" style="margin-bottom: 0;">
      <el-row class="table-btns">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
        <el-button type="primary" plain icon="el-icon-lock" @click="handleLock(null,false)" :disabled="multiple">锁定</el-button>
        <el-button type="info" plain icon="el-icon-unlock" @click="handleLock(null,true)" :disabled="multiple">解锁</el-button>
      </el-row>
      <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border :height="tableHeight" @sort-change="handleSortChange"  @row-dblclick="dbhandleUpdate">
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column type="selection" fixed="left" width="50" />
        <el-table-column label="用户名" min-width="150" prop="UserName" />
        <el-table-column label="姓名" min-width="150" prop="Name" />
        <el-table-column label="手机号" width="130" prop="MobilePhone" />
        <el-table-column label="添加时间" width="190" prop="CreateTime" sortable="custom">
          <template slot-scope="{row}">
            <i class="el-icon-time"></i>&nbsp;{{row.CreateTime}}
          </template>
        </el-table-column>
        <el-table-column label="最后登录时间" width="190" prop="LoginTime" sortable="custom">
          <template slot-scope="{row}">
            <i v-if="row.LoginTime" class="el-icon-time"></i>&nbsp;{{row.LoginTime}}
          </template>
        </el-table-column>

        <el-table-column label="是否锁定" width="118" prop="IsLock" sortable="custom">
          <template slot-scope="{row}">
            <!-- active-text="是"  inactive-text="否" -->
            <el-switch v-model="row.IsLock" class="switchStyle" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="锁定" inactive-text="解锁" @change="handleLock(row,!row.IsLock)"> </el-switch>
            <!-- <el-button
              :type="row.IsLock?'warning':'primary'"
              size="mini"
              @click="handleLock(row,row.IsLock)"
            >{{row.IsLock?'解锁':'锁定'}}</el-button> -->
          </template>
        </el-table-column>
        <el-table-column label="注销状态" width="100" prop="IsCancel" :formatter="filterCancel" />
        <el-table-column label="操作" fixed="right" width="230">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleUpdate(scope.row)">
              <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
            </el-button>
            <el-button size="mini" type="primary" plain @click="handleResetPwd(scope.row)">
              <svg-icon icon-class='ic_password' class="tablesvgicon"></svg-icon>密码
            </el-button>
            <el-button size="mini" type="primary" plain @click="handleUpdateRole(scope.row)">
              <svg-icon icon-class='ic_jurisdiction' class="tablesvgicon"></svg-icon>权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>

  </div>
</template>

<script>
import { fetchList, locklock } from "@/api/commonManager/user";

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
      tableHeight: "calc(100% - 125px)",
      rules: {},
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        username: "",
        name: "",
        mobilephone: "",
        orderby: ""
      }
    };
  },

  created() {
    this.getList();
  },
  methods: {
    filterCancel(row) {
      return row.IsCancel ? "已注销" : "正常";
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
          // this.tableHeight = "calc(100% - 125px)";
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
      const title = "添加用户";
      this.$router.push({
        name: "/commonManager/user/components/add",
        params: { data: {}, title }
      });
    },
    dbhandleUpdate(row) {
      this.handleUpdate(row);
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
          this.msgSuccess("删除成功！");
        })
        .catch(function() {
          this.msgSuccess("操作失败！");
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
          this.$message.success(!lock ? "已解锁" : "已锁定");
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
