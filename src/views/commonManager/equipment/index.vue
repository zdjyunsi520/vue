<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
        <el-form-item label="设备编号" prop="serialcode">
          <el-input v-model="queryParams.serialcode" placeholder="请输入设备编号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-select v-model="queryParams.type" clearable>
            <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in equipmentType" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>

          <!-- <el-button type="success" icon="el-icon-edit-outline" :disabled="single" @click="handleUpdate"">修改</el-button>
              <el-button type="warning" icon="el-icon-download" @click="handleExport"">导出</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-row class="table-btns">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
        <el-button type="info" icon="el-icon-delete" plain :disabled="multiple" @click="handleDelete">删除</el-button>
        <!-- <el-button type="primary" icon="el-icon-lock" @click="handleSync(null)" :disabled="multiple">一键同步</el-button>
              <el-button type="primary" icon="el-icon-unlock" @click="handleSync(null)" :disabled="multiple">取消同步</el-button> -->
      </el-row>
      <el-table @cell-click="handleRowClick" v-loading="listLoading" element-loading-text="Loading"  :data="dataList" :height="dataList?tableHeight:'0'" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55"  fixed="left" />
        <el-table-column label="设备编码" min-width="200"  prop="SerialCode" />
        <!-- <el-table-column label="设备检验码"  prop="nickName" /> -->
        <el-table-column label="设备类型" sortable min-width="100"  prop="Type" />
        <el-table-column label="添加人员" min-width="100"  prop="CreateUser" />
        <el-table-column label="添加时间" sortable min-width="155"  prop="CreateTime" >
            <template slot-scope="{row}">
              <i class="el-icon-time" style="margin-right:10px"/>{{row.CreateTime}}
          </template>
        </el-table-column>
        <el-table-column label="同步平台" min-width="100" >
          <template slot-scope="{row}">
            <el-row v-if="row.Type=='烟感'||row.Type=='摄像头'">
              <el-switch v-model="row.active"  active-color="#56a7ff" inactive-color="#f3f6fc" @change="handleSync(row)" />
            </el-row>
            <el-row v-else>
              ----
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="同步结果" min-width="120"  prop="result" />
        <el-table-column label="备注" min-width="200" fixed="right"  prop="Remark">
          <template slot-scope="{row}">
            <el-row v-if="row.edit">
              <el-input v-model="row.Remark" @blur="handleBlur(row)" />
            </el-row>
            <el-row v-else>
              {{row.Remark}}
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  fetchList,
  deleted,
  syncEquipment,
  cancelEquipment,
  updateRemark
} from "@/api/commonManager/equipment";

export default {
  name: "",
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
      rules: {},
      tableHeight: "0",
      // 查询参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        type: "",
        serialcode: ""
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
  mounted() {
    let _this = this;
    window.onresize = function() {
      _this.setTableHeight();
    };
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    handleBlur(row) {
      const id = row.Id;
      const remark = row.Remark;
      updateRemark({ id, remark }).then(r => {
        this.$message.success(r.msg);
        row.edit = false;
      });
    },
    handleRowClick(row, col, cell) {
      if (col.property == "Remark") {
        row.edit = true;
      }
    },
    setTableHeight() {
      this.tableHeight = this.$refs.containerbox.offsetHeight - 115;
    },
    /** 查询用户列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data.map(v => {
            v.result = "";
            v.active = false;
            v.edit = false;
            return v;
          });
          this.total = response.total;
        })
        .finally(r => {
          this.listLoading = false;
          this.setTableHeight();
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      const title = "新增设备";
      this.$router.push({
        name: "/commonManager/equipment/components/add",
        params: { data: {}, title }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const title = "修改设备";
      const data = row;
      this.$router.push({
        name: "/commonManager/equipment/components/add",
        params: { data, title }
      });
    },
    /** 重置密码按钮操作 */
    handleSync(row) {
      let ids =
        (row && ((row.active = !row.active), (ids = [row]))) || this.ids;

      ids
        .filter(v => v.Type == "摄像头" || v.Type == "烟感")
        .forEach(row => {
          const fn = row.active ? cancelEquipment : syncEquipment;
          const id = row.Id;
          fn({ id })
            .then(r => {
              row.result = r.msg;
            })
            .catch(r => {
              row.result = r.msg;
              row.active = false;
            });
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
</style>
