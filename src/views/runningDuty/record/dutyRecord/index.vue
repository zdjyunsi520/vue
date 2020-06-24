<template>
  <div class="comheight comflexbox">
    <div class="search-box xl-querybox" style="padding: 15px 0 0;">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">

        <el-form-item label="用电单位：" prop="tenantId">

          <el-select v-model="queryParams.tenantId">
            <el-option label="全部" value></el-option>
            <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
          </el-select>

        </el-form-item>
        <el-form-item label="记事类型：" prop="type">
          <el-select v-model="queryParams.type">
            <el-option label="全部" value=""></el-option>
            <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in recordType" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词：" prop="keyword" label-width="61px">
          <el-input v-model="queryParams.keyword" placeholder="联系人/记事内容" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="联系人：" prop="contactperson">
          <el-input v-model="queryParams.contactperson" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="记事内容：" prop="recordcontent">
          <el-input v-model="queryParams.recordcontent" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item> -->
        <el-form-item label="记事日期：" prop="starttime">
          <el-date-picker v-model="queryParams.starttime" style='width: 47%;' type="date" placeholder="请选择日期" clearable></el-date-picker>
          至
          <el-date-picker v-model="queryParams.endtime" style='width: 47%;' type="date" placeholder="请选择日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox " ref="containerbox" style="padding:0;">
      <el-row class="table-btns">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
        <el-button type="primary" plain @click="handleUpdate" :disabled="single">
          <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
        </el-button>
        <el-button type="info" plain icon="el-icon-delete" @click="handleDelete" :disabled="multiple">删除</el-button>
      </el-row>

      <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border :height="height" @sort-change="handleSortChange">

        <template slot="empty">
          <div class="nodata-box">
            <img src="@/assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column type="selection" fixed="left" width="50" />
        <el-table-column label="起始时间" width='180' prop="StartTime" />
        <el-table-column label="完成时间" width='180' prop="EndTime" />
        <el-table-column label="用电单位" min-width='230' prop="TenantName" />
        <el-table-column label="联系人" width='120' prop="ContactPerson" />
        <el-table-column label="联系电话" width='140' prop="PhoneNo" />
        <el-table-column label="记事类型" width='130' prop="Type" :formatter="filterType" />
        <el-table-column label="记事内容" min-width='140' prop="RecordContent" />
        <el-table-column label="记事时间" width='180' prop="UpdateTime" />
        <el-table-column label="导入下一班" width='120' prop="IsSucceed" :formatter="filterIsSucceed" />
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
    <add ref="add" @getList="getList" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList, deleted } from "@/api/runningDuty/record/dutyRecord";
import add from "./components/add";
export default {
  name: "user",
  components: { add },
  data() {
    return {
      // 遮罩层
      listLoading: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      height: "calc(100% - 125px)",
      rules: {},
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        keyword:"",
        contactperson: "",
        recordcontent: "",
        starttime: "",
        endtime: "",
        type: ""
      }
    };
  },

  created() {},
  computed: {
    ...mapGetters({
      companyType: "status/companyType",
      recordType: "status/recordType",
      recordKV: "status/recordKV"
    }),
    single() {
      return this.ids.length != 1;
    },
    multiple() {
      return this.ids.length == 0;
    }
  },
  methods: {
    filterType(row) {
      return this.recordKV[row.Type];
    },
    filterIsSucceed(row) {
      return row.IsSucceed ? "是" : "否";
    },
    handleCommand(commond) {
      this.$router.push({
        name: commond,
        params: {}
      });
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
    },
    /** 新增按钮操作 */
    handleAdd() {
      const target = this.$refs.add;
      target.handleOpen();
    },
    /** 编辑按钮操作 */
    handleUpdate() {
      const target = this.$refs.add;
      const data = this.ids[0];
      target.handleOpen(data);
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
      this.$confirm("确定要删除选中的数据吗？")
        .then(r => {
          const Ids = this.ids.map(v => v.Id);
          deleted({ Ids }).then(r => {
            this.getList();
            this.$message.success("删除成功！");
          });
        })
        .catch(e => {});
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
<style lang="scss" scoped>
/deep/.search-box {
  padding: 15px 0 0;
}
</style>
