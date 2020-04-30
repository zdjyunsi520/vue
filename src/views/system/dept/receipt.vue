<template>
  <div class="app-container">
    <el-row class="xl-text-align">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd"
        v-hasPermi="['system:withdraw:centre:addBank']"
        >新增</el-button
      >
    </el-row>
    <el-table
      border
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      default-expand-all
    >
      <el-table-column prop="deptId" align="center" label="分站id" />
      <el-table-column prop="deptName" align="center" label="分站名称" />
      <el-table-column prop="name" align="center" label="管理员姓名" />
      <el-table-column prop="phone" align="center"   label="联系电话" />
      <el-table-column prop="bankName" align="center"   label="开户行" />
      <el-table-column prop="bankNumber" align="center"   label="卡号" />
      <el-table-column prop="bindBankName" align="center"   label="开户人" />
      <el-table-column prop="createTime" align="center"   label="创建时间" />
      <el-table-column prop="updateTime" align="center"   label="修改时间" />
      <el-table-column label="操作" align="center" width="160px">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="warning" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:edit']">修改</el-button> -->
          <el-button
            v-hasPermi="['system:withdraw:centre:updateBank']"
            size="mini"
            type="warning"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <!-- <el-button
            v-hasPermi="['system:dept:edit']"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
            >删除</el-button
          > -->
          <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
    <add ref="add" @getList="handleQuery"></add>
  </div>
</template>

<script>
import {
  fetchCashOutList as fetchList,deleteCashOutInfo
} from "@/api/system/dept";
import add from "./components/updateReceipt";
import { mapGetters } from "vuex";
export default {
  components: {  add },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      deptList: [],
      // 分站树选项
      deptOptions: undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {},
      // 表单参数
      form: {},
      process: "?x-oss-process=image/resize,h_50"
    };
  },
  computed: {
    ...mapGetters({ path: "imgOSS/path" ,genderKV:'status/genderKV'})
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询分站列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams).then(response => {
        this.deptList = response.data;
        this.loading = false;
      });
    },
    filterCashOut(row){
      return row.isWithdraw?'是':'否'
    },
    filterGender(row){
      return this.genderKV[row.sex]    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      var target = this.$refs.add;
      target.reset();
      target.open = true;
      target.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      var target = this.$refs.add;
      target.reset();
      Object.assign(target.form, row);
      target.open = true;
      target.title = "修改";
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除登录账号为"' + row.loginName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          const id = row.id
          return deleteManagerInfo({id});
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    }
  }
};
</script>
