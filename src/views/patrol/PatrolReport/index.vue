<template>
  <div class="app-container">
    <div class="search-box xl-querybox">
      <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-query">
        <el-form-item label="巡视单位：" prop="tenantId">
          <el-select v-model="queryParams.tenantId" placeholder="请选择巡视单位">
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡视人员：" prop="patrolusername">
          <el-input v-model="queryParams.patrolusername" clearable></el-input>
        </el-form-item>
        <el-form-item label="巡视日期：">
          <el-date-picker v-model="queryParams.patroltimebegin" type="date" placeholder="请选择日期" style='width:46%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          &nbsp;至&nbsp;
          <el-date-picker v-model="queryParams.patroltimeend" type="date" placeholder="请选择日期" style='width:46%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-table v-loading="listLoading" :data="dataList" :height="tableHeight" border style='margin-top:20px'  @row-dblclick="dbhandleUpdate">
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column label="报告名称" min-width="300" sortable prop="ReportName"></el-table-column>
        <el-table-column label="巡视单位" min-width="250" sortable prop="TenantName"></el-table-column>
        <el-table-column label="巡视日期" width="120" sortable prop="PatrolTime">
          <template slot-scope="scope">
            {{scope.row.PatrolTime.substring(0,10)}}
          </template>
        </el-table-column>
        <el-table-column label="巡视人员" width="120" sortable prop="PatrolUserName"></el-table-column>
        <el-table-column label="确认人" width="130" sortable prop="ConfirmUserName"></el-table-column>
        <el-table-column label="报告时间" width="180" sortable prop="ReportedTime"></el-table-column>
        <el-table-column label="操作" width="130" fixed="right">
          <template slot-scope="scope">
            <div>

              <el-button type="text" size="mini" @click="handleReport(scope.row)">
                <svg-icon icon-class='ic_look' class="tablesvgicon"></svg-icon>查看报告
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { fetchReport } from "@/api/patrol";
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
      tableHeight: "calc(100% - 80px)",
      TenantIds: [],

      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        patrolusername: "",
        patroltimeend: "",
        patroltimebegin: ""
      }
    };
  },
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
      fetchReport(this.queryParams)
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
      this.queryParams.patroltimeend = "";
      this.handleQuery();
    },
    dbhandleUpdate(row) {
      this.handleReport(row);
    },
    // 查看报告
    handleReport(row) {
      const id = row.PatrolJobId;
      let routeData = this.$router.resolve({
        path: "/patrol/components/report",
        query: { jobid: id }
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>
<style lang="scss">
</style>
