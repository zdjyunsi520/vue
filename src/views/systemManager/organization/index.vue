<template>
  <div class="app-container">
    <el-row :gutter="20" class="xl-query">

      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query">
          <el-form-item>
            <el-input v-model="queryParams.name" placeholder="请输入名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParams.contactperson" placeholder="联系人" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParams.mobilephone" placeholder="联系人手机" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <!-- <el-form-item>
            <el-select v-model="queryParams.type" clearable size="small">
              <el-option label="设备类型" value="" />
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in equipmentType" />
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>

            <!-- <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"">修改</el-button>
                        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"">导出</el-button> -->
          </el-form-item>
        </el-form>
        <el-row>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          <el-button type="danger" icon="el-icon-lock" size="mini" @click="handleDisabled(null,false)" :disabled="multiple">禁用</el-button>
          <el-button type="success" icon="el-icon-unlock" size="mini" @click="handleDisabled(null,true)" :disabled="multiple">启用</el-button>
        </el-row>
        <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border>
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="名称" align="center" prop="Name" />
          <!-- <el-table-column label="设备检验码" align="center" prop="nickName" /> -->
          <el-table-column label="附加属性" align="center" prop="Attribute" />
          <el-table-column label="行业类别" align="center" prop="Industry" />
          <el-table-column label="行业分类" align="center" prop="PrincipleActivity" />
          <el-table-column label="联系人" align="center" prop="ContactPerson" />
          <el-table-column label="联系人手机" align="center" prop="MobilePhone" />
          <el-table-column label="联系电话" align="center" prop="PhoneNo" />
          <el-table-column label="状态" align="center" prop="IsEnable" :formatter="filterEnable" />
          <el-table-column label="操作" align="center" min-width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" @click="handleDisabled(scope.row)">{{showEnable(scope.row)}}</el-button>
              <el-button size="mini" type="text" @click="handleUpdateRole(scope.row)">权限编辑</el-button>
              <el-button size="mini" type="text" @click="handleLogin(scope.row)">模拟登陆</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />

    <add ref="add" @getList="getList"></add>
    <role ref="role" @getList="getList"></role>
    <create ref="create" @getList="getList"></create>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  fetchList,
  deleted,
  syncCamera,
  syncSmoke
} from "@/api/systemManager/organization";

import add from "./components/add";
import role from "./components/role";
import create from "./components/create";
export default {
  name: "",
  components: { add, role, create },
  data() {
    return {
      deptType: null,
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
      // 查询参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        contactperson: "",
        mobilephone: "",
        name: ""
      }
    };
  },
  computed: {
    // 根据名称筛选分站树
    ...mapGetters({
      equipmentKV: "status/equipmentKV",
      equipmentType: "status/equipmentType"
    })
  },
  created() {
    this.getList();
  },
  methods: {
    filterEnable(row) {
      return row.IsEnable ? "禁用" : "正常";
    },
    showEnable(row) {
      return row.IsEnable ? "启用" : "禁用";
    },
    /** 查询用户列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data.map(v => {
            v.result = "";
            return v;
          });
          this.total = response.total;
        })
        .finally(r => {
          this.listLoading = false;
        });
    },
    /** 查询角色列表 */
    getRoles() {
      listRole().then(response => {
        this.roleOptions = response.data.filter(v => v.status == 0);
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleDisabled(row, lock) {
      let ids = row
        ? (ids = [row.Id])
        : this.ids.filter(v => v.IsEnable == lock).map(v => v.Id);
      if (ids.length) {
        const islock = !lock;
        ids = ids.join(",");
        locklock({ ids, islock }).then(r => {
          this.$message.success(r.msg);
          this.getList();
        });
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      const target = this.$refs.add;
      target.handleOpen();
      target.title = "添加";
    },
    handleCreateUser() {
      const target = this.$refs.create;
      target.handleOpen();
      target.title = "创建账号";
    },
    handleUpdateRole(row) {
      const target = this.$refs.role;
      const id = row.Id;
      target.getInfo({ id });
      target.handleOpen();
      target.title = "权限编辑";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.Id,
        parentId = row.ParentId,
        name = row.Name,
        artificialperson = row.ArtificialPerson,
        creditcode = row.CreditCode,
        phoneno = row.PhoneNo,
        contactperson = row.ContactPerson,
        mobilephone = row.MobilePhone,
        industry = row.Industry,
        principleactivity = row.PrincipleActivity,
        province = row.Province,
        city = row.City,
        area = row.Area,
        address = row.Address,
        isenable = row.IsEnable,
        longitude = row.Longitude,
        latitude = row.Latitude,
        attribute = row.Attribute,
        starttime = "",
        maintype = "",
        subtype = "",
        contractcapacity = "",
        voltlevel = "",
        operatingcapacity = "";

      const target = this.$refs.add;

      target.handleOpen({
        id,
        parentId,
        name,
        artificialperson,
        creditcode,
        phoneno,
        contactperson,
        mobilephone,
        industry,
        principleactivity,
        province,
        city,
        area,
        address,
        isenable,
        longitude,
        latitude,
        attribute,
        starttime,
        maintype,
        subtype,
        contractcapacity,
        voltlevel,
        operatingcapacity
      });
      target.title = "修改信息";
    },
    /** 重置密码按钮操作 */
    handleSync(row) {
      let ids =
        (row && ((row.active = !row.active), (ids = [row]))) || this.ids;
      ids
        .filter(v => v.Type == "摄像头" || v.Type == "烟感")
        .forEach(row => {
          if (!row.active) {
            const fn = row.Type == "摄像头" ? syncCamera : syncSmoke;
            const id = row.Id;
            fn({ id })
              .then(r => {
                row.result = r.msg;
              })
              .catch(r => {
                row.result = r.msg;
                row.active = false;
              });
          }
        });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("是否确认删除选中的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(v => {
          const l = this.ids.length;
          let compelete = 0;
          this.ids.forEach(v => {
            const id = v.Id;
            deleted({ id })
              .then(r => this.$message.success(r.msg))
              .finally(v => {
                compelete++;
                if (compelete >= l) {
                  return new Promise();
                }
              });
          });
        })
        .then(() => {
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
.xl-query {
  /deep/.el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-input__inner {
    width: 130px;
  }
  /deep/.el-date-editor.el-input {
    width: 200px;

    .el-input__inner {
      width: 200px;
    }
  }
}
</style>
