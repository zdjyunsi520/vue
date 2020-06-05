<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-query">
        <el-form-item label="巡视单位" prop="tenantId">
          <el-select v-model="queryParams.tenantId" placeholder="请选择巡视单位">
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡视人员" prop="patrolusername">
          <el-input v-model="queryParams.patrolusername" clearable></el-input>
        </el-form-item>
        <el-form-item label="巡视周期" prop="cycleday">
          <el-input v-model="queryParams.cycleday" clearable style="width:80px"></el-input>&nbsp;天
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-row class="table-btns">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
      </el-row>
      <el-table v-loading="listLoading" :height="tableHeight" border :data="dataList" element-loading-text="Loading">
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column label="巡视单位" sortable min-width="250" prop="TenantName" />
        <el-table-column label="巡视内容" min-width="250" prop="PatrolScope" />
        <el-table-column label="巡视人员" sortable min-width="150" prop="PatrolUserName" />
        <el-table-column label="巡视成员" sortable min-width="150" prop="PatrolMemberNames" />
        <el-table-column label="巡视周期" sortable min-width="150" prop="CycleDay">
          <template slot-scope="scope">
            {{scope.row.CycleDay}}天
          </template>
        </el-table-column>
        <el-table-column label="开始时间" sortable min-width="120" prop="StartTime">
          <template slot-scope="scope">
            {{scope.row.StartTime.substring(0,10)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="230" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleUpdate(scope.row)">
              <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
            </el-button>
            <el-button type="text" size="mini" @click="handleDelete(scope.row)">
              <svg-icon icon-class='ic_delete' class="tablesvgicon"></svg-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination  :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { fetchList, deleted } from "@/api/patrol";
import { getChildrenList } from "@/api/org";

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
      tableHeight: "calc(100% - 125px)",
      TenantIds: [],

      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        patrolusername: "",
        cycleday: ""
      }
    };
  },
  computed: {},
  created() {
    this.getList();
    this.getTenants();
  },
  methods: {
    // 巡视单位列表
    getTenants() {
      getChildrenList()
        .then(response => {
          this.TenantIds = response.data;
        })
        .catch(error => {
          console.log(error);
        });
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
      const title = "新增巡视周期";
      const TenantIds = this.TenantIds;
      this.$router.push({
        name: "/patrol/PatrolCycle/components/add",
        params: { data: {}, title, TenantIds }
      });
    },
    /** 编辑按钮操作 */
    handleUpdate(row) {
      const id = row.Id;
      const tenantid = row.TenantId;
      const cycleday = row.CycleDay;
      const starttime = row.StartTime;
      const patroluserid = row.PatrolUserId;
      const patrolmemberids = row.PatrolMemberIds;
      const patrolscope = row.PatrolScope;
      const data = {
        id,
        tenantid,
        cycleday,
        starttime,
        patroluserid,
        patrolmemberids,
        patrolscope
      };
      const title = "编辑巡视周期";
      const TenantIds = this.TenantIds;
      this.$router.push({
        name: "/patrol/PatrolCycle/components/add",
        params: { data, title, TenantIds }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row);
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(v => {
        const id = row.Id;
        deleted({ id }).then(r => {
          this.$message.success("成功删除！");
          this.getList();
        });
      });
    }
  }
};
</script>
<style lang="scss">
</style>
