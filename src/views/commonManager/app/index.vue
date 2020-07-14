<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-querybox" :rules="rules">
        <el-form-item label="关键词：" prop="multiword">
          <el-input v-model="queryParams.multiword" placeholder="应用名称/版本号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>

        <!-- <el-form-item label="应用名称：" prop="versionname">
          <el-input v-model="queryParams.versionname" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="版本号：" prop="versioncode">
          <el-input v-model="queryParams.versioncode" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox" style="margin-bottom: 0;">
      <el-row class="table-btns">
        <el-button type="primary" @click="handleAdd">
          <svg-icon icon-class='ic_add' class="tablesvgicon"></svg-icon>新增
        </el-button>
        <el-button icon="el-icon-delete" @click="handleDelete(null)" :disabled="multiple">删除
        </el-button>
      </el-row>
      <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" :data="dataList" @selection-change="handleSelectionChange" border :height="tableHeight"  @row-dblclick="dbhandleUpdate">
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column type="selection" fixed="left" width="50" />
        <el-table-column label="应用名称" min-width="150" prop="TypeName" />
        <el-table-column label="版本名称" min-width="180" prop="VersionName" />
        <el-table-column label="更新时间" width="200" prop="CreateTime">
          <template slot-scope="{row}">
            <i class="el-icon-time"></i>&nbsp;{{row.CreateTime}}
          </template>
        </el-table-column>
        <el-table-column label="版本号" width="120" prop="VersionCode" />
        <el-table-column label="是否强制更新" width="130" prop="ForcedUpdate" :formatter="filterCancel" />
        <el-table-column label="APK文件" min-width="200" prop="FileUrl">
          <template slot-scope="{row}">
            <el-link type="primary" :href="'http://apitoolt.xtioe.com'+row.FileUrl">{{row.VersionName}}</el-link>
            <!-- <el-link type="primary" :href="'http://apitoolt.xtioe.com'+row.FileUrl.substring(0, row.FileUrl.indexOf('?'))">{{row.VersionName}}</el-link> -->
          </template>
        </el-table-column>
        <el-table-column label="更新说明" min-width="200" prop="UpdateDescription" />
        <el-table-column label="状态" width="100" prop="IsLock">
          <template slot-scope="{row}">
            <el-switch v-model="row.Status" class="switchStyle" :active-value="1" :inactive-value="0" active-color="#56a7ff" inactive-color="#dddfe5" active-text="上架" inactive-text="下架" @change="handleUpdateStatus(row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" :fixed="device!='mobile'?'right':false" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleUpdate(scope.row)">
              <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
            </el-button>
            <el-button type="primary" plain size="mini" @click="handleDelete(scope.row)">
              <svg-icon icon-class='ic_delete' class="tablesvgicon"></svg-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList, deleted, updateStatus } from "@/api/commonManager/app";

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
        multiword: "",
        versioncode: "",
        versionname: ""
      }
    };
  },

  computed: {
    ...mapGetters(["device"])
  },
  created() {
    this.getList();
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
        name: "/commonManager/app/components/add",
        params: { data: {}, title }
      });
    },
    dbhandleUpdate(row) {
      this.handleUpdate(row);
    },

    /** 编辑按钮操作 */
    handleUpdate(data) {
      // const id = row.Id;
      // const username = row.UserName;
      // const name = row.Name;
      // const mobilephone = row.MobilePhone;
      // const data = { id, username, name, mobilephone };

      const title = "编辑";
      this.$router.push({
        name: "/commonManager/app/components/add",
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
      let ids = row ? [row.Id] : this.ids.map(v => v.Id);
      this.$confirm("是否确认删除选中的APP?", "警告", {
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
      var id = row.Id;
      var status = row.Status;
      var type = 1;
      updateStatus({ id, status, type })
        .then(r => {
          this.$message.success("已更新状态！");
        })
        .finally(r => this.getList());
    }
  }
};
</script>
<style lang="scss">
</style>
