<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-querybox" :rules="rules">
        <el-form-item label="设备编号：" prop="serialcode">
          <el-input v-model="queryParams.serialcode" placeholder="请输入设备编号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="设备类型：" prop="type">
          <el-select v-model="queryParams.type" clearable>
            <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in equipmentType" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
  </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-row class="table-btns">
        <el-button type="primary" @click="handleAdd">
          <svg-icon icon-class='ic_add' class="tablesvgicon"></svg-icon>新增
          <i class="el-icon-arrow-down"></i>
        </el-button>

        <el-button type="info" icon="el-icon-delete" plain :disabled="multiple" @click="handleDelete">删除</el-button>
        <!-- <el-button type="primary" icon="el-icon-lock" @click="handleSync(null)" :disabled="multiple">一键同步</el-button>
              <el-button type="primary" icon="el-icon-unlock" @click="handleSync(null)" :disabled="multiple">取消同步</el-button> -->
      </el-row>
      <el-table @cell-click="handleRowClick" v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" :data="dataList" :height="tableHeight" @selection-change="handleSelectionChange" border>
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column type="selection" fixed="left" width="50" />
        <el-table-column label="设备编码" width="200" prop="SerialCode" />
        <!-- <el-table-column label="设备检验码"  prop="nickName" /> -->
        <el-table-column label="设备类型" sortable width="150" prop="Type" />
        <el-table-column label="添加人员" width="130" prop="CreateUser" />
        <el-table-column label="添加时间" sortable width="200" prop="CreateTime">
          <template slot-scope="{row}">
            <i class="el-icon-time" style="margin-right:10px" />{{row.CreateTime}}
          </template>
        </el-table-column>
        <el-table-column label="同步平台" width="120" prop="IsSyncCloud">
          <template slot-scope="scope">
            <el-row v-if="scope.row.Type=='烟感'||scope.row.Type=='摄像头'">
              <el-switch v-model="scope.row.IsSyncCloud" class="switchStyle" active-color="#56a7ff" inactive-color="#dddfe5" active-text="开启" inactive-text="关闭" @change="handleSync(scope.row)" />
            </el-row>
            <el-row v-else>
              ----
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="同步结果" width="140" prop="SyncResult" />
        <el-table-column label="备注" min-width="200" prop="Remark">
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
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
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
      tableHeight: "calc(100% - 125px)",
      // 搜索参数
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
  methods: {
    handleBlur(row) {
      const id = row.Id;
      const remark = row.Remark;
      updateRemark({ id, remark }).then(r => {
        this.$message.success("已保存！");
        row.edit = false;
      });
    },
    handleRowClick(row, col, cell) {
      if (col.property == "Remark") {
        row.edit = true;
      }
    },
    /** 搜索用户列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data.map(v => {
            // v.SyncResult = "";
            // v.IsSyncCloud = false;
            v.edit = false;
            return v;
          });
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
      const title = "新增设备";
      this.$router.push({
        name: "/commonManager/equipment/components/add",
        params: { data: {}, title }
      });
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      const title = "编辑设备";
      const data = row;
      this.$router.push({
        name: "/commonManager/equipment/components/add",
        params: { data, title }
      });
    },
    /** 同步按钮操作 */
    handleSync(row) {
      let ids =
        (row && ((row.IsSyncCloud = !row.IsSyncCloud), (ids = [row]))) ||
        this.ids;
      ids
        .filter(v => v.Type == "摄像头" || v.Type == "烟感")
        .forEach(row => {
          const fn = row.IsSyncCloud ? cancelEquipment : syncEquipment;
          const id = row.Id;
          fn({ id })
            .then(r => {
              // this.$message.success(!lock ? "已启用！" : "已禁用！");
              this.getList();

              // row.SyncResult = r.msg;
            })
            .catch(r => {
              row.SyncResult = r.msg;
              row.IsSyncCloud = false;
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
    }
   
  }
};
</script>
<style lang="scss" scoped>
</style>
