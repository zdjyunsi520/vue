<template>
  <div class="comheight comflexbox">
    <div class="search-box xl-querybox marginbottom15">
      <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-query">
        <el-form-item label="用电单位：" prop='tenantId'>
          <el-select v-model="queryParams.tenantId" clearable placeholder="请选择">
            <el-option value="" label="全部"></el-option>
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年度：" prop='startdate' label-width="50px">
          <el-date-picker v-model="queryParams.startdate" clearable type="year" placeholder="请选择年" value-format="yyyy"> </el-date-picker>
        </el-form-item>

        <el-form-item label="业务来源：" prop='repairsource'>
          <el-select v-model="queryParams.repairsource" clearable placeholder="请选择">
            <el-option v-for="(item,index) in sources" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop='status' label-width="50px">
          <el-select v-model="queryParams.status" clearable placeholder="请选择">
            <el-option v-for="(item,index) in isexecutes" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          <el-button :loading="downloadLoading" @click="handleExport">
            <svg-icon icon-class='ic_export' class="tablesvgicon"></svg-icon>
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="bg-white containerbox  chart-wrapper marginbottom15" v-if="chartData">
      <p class="form-smtitle tb-smtitle">{{chartData.title}} </p>
      <div class='smchartbox' v-if="dataList&&dataList.length>0">
        <BarChart ref="chart" :chartData='chartData' />
      </div>
      <div class="nodata-box" v-else>
        <img src="@/assets/image/nodata.png" class='smimg' />
        <p>暂时还没有数据</p>
      </div>
    </div>
    <div class="bg-white containerbox " ref="containerbox">
      <p class="form-smtitle tb-smtitle">抢修年度统计 </p>
      <el-table v-loading="listLoading" element-loading-text="Loading" class="middletable" :data="dataList" ref='table' :height="tableHeight" :row-class-name='totalstyle' @row-click='handleRowInfo' border>

        <template slot="empty">
          <div class="nodata-box">
            <img src="@/assets/image/nodata.png" class="smimg" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column label="抢修人员" fixed="left" min-width="120" prop="Name"></el-table-column>
        <el-table-column v-for="(item,index) in prop1" :key="index" :label="columns[index]" :prop="item" />

      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import {
  userReportByYear,
  userReportByNature,
  userReportByExecute
} from "@/api/repairOrder/personalCount";
import BarChart from "./yearBarChart";
import { getChildrenList } from "@/api/org";
export default {
  components: {
    BarChart
  },
  data() {
    return {
      downloadLoading: false,
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        startdate: "",
        repairsource: "",
        status: "",
        type: 2
      },
      patrolYear: "",
      timeBegin: "",
      timeEnd: "",
      dataList: null,
      total: 0,
      rules: {},
      TenantIds: [],
      activeName: "0",
      nowDoc: {},
      tableHeight: "calc(100% - 110px)",
      listLoading: true,
      sources: [
        { name: "全部", id: "" },
        { name: "用户报修", id: "1" },
        { name: "故障报警", id: "2" }
      ],
      isexecutes: [
        { name: "全部", id: "" },
        { name: "未完成", id: "1" },
        { name: "已完成", id: "4" }
      ],
      columns: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
      ],
      props: [],
      prop1: [
        "JanUser",
        "FebUser",
        "MarUser",
        "AprUser",
        "MayUser",
        "JunUser",
        "JulUser",
        "AugUser",
        "SeptUser",
        "OctUser",
        "NovUser",
        "DecUser"
      ],
      prop2: [
        "JanAssets",
        "FebAssets",
        "MarAssets",
        "AprAssets",
        "MayAssets",
        "JunAssets",
        "JulAssets",
        "AugAssets",
        "SeptAssets",
        "OctAssets",
        "NovAssets",
        "DecAssets"
      ],
      prop2: ["TotalCount", "TemporaryCount", "RegularCount"],
      prop3: ["TotalCount", "ExecuteCount", "UnexecuteCount"],
      chartDataInit: {
        series: [
          {
            name: "故障报警",
            type: "bar",
            stack: "vistors",
            barWidth: "40%",
            barMaxWidth: 50,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: "用户报修",
            type: "bar",
            stack: "vistors",
            barWidth: "40%",
            barMaxWidth: 50,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        ],
        xAxisData: this.columns,
        title: "总计-抢修年度统计图"
      },
      chartData: {}
    };
  },

  created() {
    this.getTenants();
    this.getList();
  },
  methods: {
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

    // 巡视单位列表
    getTenants() {
      getChildrenList().then(response => {
        this.TenantIds = response.data;
      });
    },
    getList() {
      this.chartData = Object.assign({}, this.chartDataInit);
      userReportByYear(this.queryParams)
        .then(res => {
          if (!res.data) {
            this.dataList = [];
            return;
          }
          this.dataList = res.data;
          let row = res.data[res.data.length - 1];
          this.chartData.series[0].data = this.prop1.map(v => row[v]);
          this.chartData.series[1].data = this.prop2.map(v => row[v]);
          this.chartData.title = row.Name + "-抢修年度统计图";
          this.chartData.xAxisData = this.columns;
          this.total = res.total;
        })
        .finally(r => {
          this.listLoading = false;
        });
    },
    // 点击行
    handleRowInfo(arr) {
      this.chartData.series[0].data = this.prop1.map(v => arr[v]);
      this.chartData.title = arr.Name + "-抢修年度统计图";
    },
    totalstyle({ row, rowIndex }) {
      if (row.Name === "合计" || row.Name === "总计") {
        return "total-font";
      }
      return "";
    },
    // 导出
    handleExport() {
      this.$confirm("是否确认导出表格吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.download();
      });
    },
    download() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = this.columns.slice(0);
        const list = this.dataList.slice(0);
        const data = this.formatJson(this.columns, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.chartData.title,
          autoWidth: true,
          bookType: "xlsx"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    }
  }
};
</script>

<style lang="scss" scoped>
</style>