<template>
  <div class="app-container">
    <div class="search-box xl-querybox">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="queryParams.name" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="班次：" prop="ShiftId">
          <el-select v-model="queryParams.ShiftId">
            <el-option label="全部" value=""></el-option>
            <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in shiftTypeList" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色：" prop="CharacterId">
          <el-select v-model="queryParams.CharacterId">
            <el-option label="全部" value=""></el-option>
            <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in charactorTypeList" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
        <!-- <el-button type="success" icon="el-icon-edit-outline" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:user:edit']">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">删除</el-button>
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>-->
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox" style="margin-bottom: 0;">
      <el-row class="table-btns">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
        <el-button type="info"  plain icon="el-icon-delete" @click="handleDelete(null)" :disabled="multiple">删除</el-button>
        <el-button icon="el-icon-arrow-left" @click="handleBack">返 回</el-button>
      </el-row>
      <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border :height="tableHeight" @row-dblclick="dbhandleUpdate">
        <template slot="empty">
          <div class="nodata-box">
            <img src="@/assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column type="selection" fixed="left" width="50" />
        <el-table-column label="岗位名称" min-width="150" prop="Name" />
        <el-table-column label="班次" min-width="150" prop="ShiftName" />
        <el-table-column label="角色" min-width="180" prop="CharacterName" />
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.row)">
              <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
            </el-button>
            <el-button type="text" size="mini" @click="handleDelete(scope.row)">
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
import { fetchJobList, deleted } from "@/api/runningDuty/dutyConfiguration/job";

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
        ShiftId: "",
        CharacterId: "",
        name: "",
        dutyId: ""
      },
      shiftTypeList: [],
      charactorTypeList: []
    };
  },

  created() {
    const { shiftTypeList, charactorTypeList, dutyId } = this.$route.params;
    this.shiftTypeList = shiftTypeList || [];
    this.charactorTypeList = charactorTypeList || [];
    this.queryParams.dutyId = dutyId || "";
    this.getList();
  },
  methods: {
    /** 搜索用户列表 */
    getList() {
      this.listLoading = true;
      fetchJobList(this.queryParams)
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

    handleBack() {
      this.$router.push({ name: "/runningDuty/dutyConfiguration/index" });
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
      const shiftTypeList = this.shiftTypeList;
      const charactorTypeList = this.charactorTypeList;
      this.$router.push({
        name: "/runningDuty/dutyConfiguration/job/components/add",
        params: {
          data: { DutyId: this.queryParams.dutyId },
          title,
          shiftTypeList,
          charactorTypeList
        }
      });
    },
    dbhandleUpdate(row) {
      this.handleUpdate(row);
    },
    /** 编辑按钮操作 */
    handleUpdate(data) {
      const title = "编辑";
      const shiftTypeList = this.shiftTypeList;
      const charactorTypeList = this.charactorTypeList;
      this.$router.push({
        name: "/runningDuty/dutyConfiguration/job/components/add",
        params: { data, title, shiftTypeList, charactorTypeList }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      let ids = row ? [row.Id] : this.ids.map(v => v.Id);
      this.$confirm("是否确认删除选中的数据？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleted({ ids }).finally(r => {
          this.msgSuccess("删除成功！");
          this.getList();
        });
      });
    }
  }
};
</script>
<style lang="scss">
</style>
