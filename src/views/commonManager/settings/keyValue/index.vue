<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-querybox" :rules="rules">
        <el-form-item label="关键词：" prop="name" label-width="61px">
          <el-input v-model="queryParams.name" placeholder="名称/代码" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!--         
        <el-form-item label="名称：" prop="Name">
          <el-input v-model="queryParams.Name" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="代码：" prop="key">
          <el-input v-model="queryParams.key" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>  </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox" style="margin-bottom: 0;">
      <el-row class="table-btns">
        <el-button type="primary" @click="handleAdd">
          <svg-icon icon-class='ic_add' class="tablesvgicon"></svg-icon>新增
        </el-button>
        <el-button icon="el-icon-delete" plain @click="handleDelete(null)" :disabled="multiple">删除</el-button>
        <el-button @click="handleBack">
          <svg-icon icon-class='ic_goback' class='tablesvgicon'></svg-icon>返 回
        </el-button>
      </el-row>
      <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" :data="dataList" @selection-change="handleSelectionChange" border :height="tableHeight"  @row-dblclick="dbhandleUpdate">
        <template slot="empty">
          <div class="nodata-box">
            <img src="@/assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column type="selection" fixed="left" width="50" />
        <el-table-column label="名称" width='150' prop="Name" />
        <el-table-column label="代码" min-width='150' prop="Key" />
        <el-table-column label="值" min-width='160' prop="Value" />
        <el-table-column label="描述" min-width='200' prop="Description" />
        <el-table-column label="状态" min-width='100' prop="IsLock" v-if="showSwitch">
          <template slot-scope="{row}">
            <el-switch v-model="row.IsEnable" class="switchStyle" active-color="#56a7ff" inactive-color="#dddfe5" active-text="启用" inactive-text="禁用" @change="handleUpdateStatus(row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
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
import {
  fetchList,
  deleted,
  update
} from "@/api/commonManager/settings/keyValue";

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
        Name: "",
        key: "",
        SettingId: "",
        Type: 1
      }
    };
  },

  created() {
    const { data } = this.$route.params;
    if (data && data.Id) {
      this.queryParams.SettingId = data.Id;
      this.queryParams.Type = data.Type;
      this.getList();
    }
  },
  computed: {
    showSwitch() {
      return this.queryParams.Type == 2;
    }
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
      const SettingId = this.queryParams.SettingId;
      const Type = this.queryParams.Type == 1 ? 1 : 3; //	1-字符串2-文件项3-枚举
      const data = { SettingId, Type };

      if(Type==3){
          this.$router.push({
            name: "/commonManager/settings/keyValue/addMj",
            params: { data: data, title }
          });
      }else{
        this.$router.push({
          name: "/commonManager/settings/keyValue/add",
          params: { data: data, title }
        });
      }

    },
    dbhandleUpdate(row) {
      this.handleUpdate(row);
    },

    /** 编辑按钮操作 */
    handleUpdate(data) {
      const title = "编辑";
      
      if(data.Type!=3){
        this.$router.push({
          name: "/commonManager/settings/keyValue/add",
          params: { data, title }
          
        });
      }else{
        this.$router.push({
          name: "/commonManager/settings/keyValue/addMj",
          params: { data: data, title }
        });
      }

    },
    handleBack() {
      this.$router.push({
        name: "/commonManager/settings/index"
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids = row ? [row.Id] : this.ids.map(v => v.Id);
      this.$confirm("是否确认删除选中的数据?", "警告", {
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
      update(row).then(r => {
        this.$message.success("状态已更新！");
        this.getList();
      });
    },

   
  }
};
</script>
<style lang="scss">
</style>
