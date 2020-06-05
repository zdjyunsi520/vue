<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactperson">
          <el-input v-model="queryParams.contactperson" placeholder="请输入联系人" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobilephone">
          <el-input v-model="queryParams.mobilephone" placeholder="请输入联系人手机" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item>
            <el-select v-model="queryParams.type" clearable >
              <el-option label="设备类型" value="" />
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in equipmentType" />
            </el-select>
          </el-form-item> -->
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          <!-- <el-button type="success" icon="el-icon-edit-outline"  :disabled="single" @click="handleUpdate"">编辑</el-button>
                        <el-button type="warning" icon="el-icon-download"  @click="handleExport"">导出</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-row class="table-btns">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
        <el-button type="primary" plain icon="el-icon-unlock" @click="handleDisabled(null,false)" :disabled="multiple">启用</el-button>
        <el-button type="info" plain icon="el-icon-lock" @click="handleDisabled(null,true)" :disabled="multiple">禁用</el-button>
      </el-row>

      <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border :height="tableHeight">

        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column label="名称" min-width="250" prop="Name" />
        <!-- <el-table-column label="设备检验码"   prop="nickName" /> -->
        <el-table-column label="附加属性" sortable width="120" prop="Attribute" />
        <el-table-column label="行业类别" sortable min-width="120" prop="IndustryName" />
        <el-table-column label="行业分类" sortable min-width="120" prop="PrincipleActivityName" />
        <el-table-column label="联系人" width="140" prop="ContactPerson" />
        <el-table-column label="联系人手机" width="140" prop="MobilePhone" />
        <el-table-column label="联系电话" width="140" prop="PhoneNo" />
        <el-table-column label="状态" sortable width="100" prop="IsEnable">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.IsEnable" class="switchStyle" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="启用" inactive-text="禁用" @change="handleDisabled(scope.row,!scope.row.IsEnable)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)">
              <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
            </el-button>
            <!-- <el-button size="mini" type="text" @click="handleDisabled(scope.row,scope.row.IsEnable)">{{showEnable(scope.row)}}</el-button> -->
            <el-button size="mini" type="text" @click="handleUpdateRole(scope.row)">
              <svg-icon icon-class='ic_jurisdiction' class="tablesvgicon"></svg-icon>权限编辑
            </el-button>
            <!-- <el-button size="mini" type="text" @click="handleLogin(scope.row)">模拟登陆</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>

    <create ref="create" @getList="getList"></create>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  fetchList,
  disabled as locklock
} from "@/api/systemManager/organization";

import create from "./components/create";
export default {
  name: "",
  components: { create },
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
      tableHeight: "calc(100% - 125px)",

      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        contactperson: "",
        mobilephone: "",
        name: ""
      },
      rules: {}
    };
  },
  computed: {
    // 根据名称筛选分站树
    ...mapGetters({
      equipmentKV: "status/equipmentKV",
      equipmentType: "status/equipmentType"
    })
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    // filterEnable(row) {
    //   return row.IsEnable ? "正常" : "禁用";
    // },
    // showEnable(row) {
    //   return row.IsEnable ? "禁用" : "启用";
    // },
    /** 搜索用户列表 */
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
    /** 搜索角色列表 */
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
      let Ids = row
        ? (Ids = [row.Id])
        : this.ids.filter(v => v.IsEnable == lock).map(v => v.Id);
      if (Ids.length) {
        const isenable = !lock;
        // Ids = Ids.join(",");
        locklock({ Ids, isenable }).then(r => {
          this.$message.success(!lock ? "已启用！" : "已禁用！");
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
      this.$router.push({
        name: "/systemManager/organization/components/add",
        params: {}
      });
      // const target = this.$refs.add;
      // target.handleOpen();
      // target.title = "添加";
    },
    handleCreateUser() {
      const target = this.$refs.create;
      target.handleOpen();
      target.title = "创建账号";
    },
    handleUpdateRole(row) {
      const tenantId = row.Id;
      const data = { tenantId };
      const title = "权限编辑";
      this.$router.push({
        name: "/systemManager/organization/components/role",
        params: { data }
      });
    },
    /** 编辑按钮操作 */
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

      this.$router.push({
        name: "/systemManager/organization/components/add",
        params: {
          data: {
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
          }
        }
      });
      return;
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
      target.title = "编辑信息";
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
              .then(r => this.$message.success("删除成功！"))
              .finally(v => {
                compelete++;
                if (compelete >= l) {
                  // return new Promise();
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
</style>
