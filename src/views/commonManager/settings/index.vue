<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-querybox" :rules="rules">
        <el-form-item label="关键词：" prop="multiword">
          <el-input v-model="queryParams.multiword" placeholder="名称/代码" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>

        <!-- <el-form-item label="名称：" prop="name">
          <el-input v-model="queryParams.name" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="代码：" prop="key">
          <el-input v-model="queryParams.key" placeholder="" clearable @keyup.enter.native="handleQuery" />
        </el-form-item> -->
        <el-form-item label="类型：" prop="type">
          <el-select v-model="queryParams.type">
            <el-option label="全部" value=""></el-option>
            <el-option label="键值" :value="1" />
            <el-option label="枚举" :value="2" />
          </el-select>
        </el-form-item>
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
        <el-button type="info" icon="el-icon-delete" plain @click="handleDelete(null)" :disabled="multiple">删除</el-button>
      </el-row>
      <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" :data="dataList" @selection-change="handleSelectionChange" border :height="tableHeight"  @row-dblclick="dbhandleUpdate">
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column type="selection" fixed="left" width="50" />
        <el-table-column label="名称" min-width="110" prop="Name" />
        <el-table-column label="代码" min-width="150" prop="Key" />
        <el-table-column label="类型" width="100" prop="Type" :formatter="filterCancel" />
        <el-table-column label="描述" min-width="250" prop="Description" />
        <el-table-column label="操作" :fixed="device!='mobile'?'right':false" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleUpdate(scope.row)">
              <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
            </el-button>
            <el-button size="mini" type="primary" plain @click="handleSubSettings(scope.row)">
              <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>配置项
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
import { fetchList, deleted, updateStatus } from "@/api/commonManager/settings";

import { fetchList as keyfetchList } from "@/api/commonManager/settings/keyValue";
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
        key: "",
        name: "",
        type: ""
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
      return row.Type == 1 ? "键值" : "枚举";
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
        name: "/commonManager/settings/components/add",
        params: { data: {}, title }
      });
    },
    dbhandleUpdate(row) {
      this.handleUpdate(row);
    },

    /** 编辑按钮操作 */
    handleUpdate(data) {
      const title = "编辑";
      this.$router.push({
        name: "/commonManager/settings/components/add",
        params: { data, title }
      });
    },
    /** 编辑按钮操作 */
    handleSubSettings(data) {
      const title = "编辑子项";
      this.$router.push({
        name: "/commonManager/settings/keyValue/index",
        params: { data, title }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let ids = row ? [row.Id] : this.ids.map(v => v.Id);
      var keyParms = {
        pageno: 1,
        pagesize: 9999,
        name: "",
        key: "",
        SettingId: row.Id,
        Type: 1
      };
      keyfetchList(keyParms).then(res => {
        if (res.total > 0) {
          this.$message.error("请删除该配置项下的内容！");
          return false;
        } else {
          this.$confirm("是否确认删除选中的配置?", "警告", {
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
        }
      });
    }
  }
};
</script>
<style lang="scss">
</style>
