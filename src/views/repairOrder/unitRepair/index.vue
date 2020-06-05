<template>
  <div class="app-container">
    <div class="search-box marginbottom15">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按年度统计" name="0"></el-tab-pane>
        <el-tab-pane label="按巡视性质统计" name="1"></el-tab-pane>
        <el-tab-pane label="按完成情况统计" name="2"></el-tab-pane>
      </el-tabs>
      <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-query">
        <el-form-item label="巡视单位" prop='tenantId'>
          <el-select v-model="queryParams.tenantId" clearable placeholder="请选择">
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年度" v-show="activeName=='0'" prop='patrolYear'>
          <el-date-picker v-model="patrolYear" clearable type="year" placeholder="请选择年" value-format="yyyy"> </el-date-picker>
        </el-form-item>
        <el-form-item label="巡视日期" v-show="activeName!='0'" prop='timeBegin'>
          <el-date-picker v-model="timeBegin" type="date" placeholder="请选择日期" clearable style='width:47%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          至
          <el-date-picker v-model="timeEnd" type="date" placeholder="请选择日期" clearable style='width:47%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item label="巡视性质" v-show="activeName!='1'" prop='ptrolnature'>
          <el-select v-model="queryParams.ptrolnature" clearable placeholder="请选择">
            <el-option v-for="(item,index) in ptrolnatures" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" v-show="activeName!='2'" prop='isexecute'>
          <el-select v-model="queryParams.isexecute" clearable placeholder="请选择">
            <el-option v-for="(item,index) in isexecutes" :key="index" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          <el-button icon="el-icon-download" :loading="downloadLoading" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox marginbottom15" ref="containerbox">
      <el-table v-loading="listLoading" element-loading-text="Loading" :data="dataList" ref='table' :height="dataList?tableHeight:'0'" @row-click='handleRowInfo' :row-class-name='totalstyle' border style='margin-top:15px'>

        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column label="巡视单位" fixed="left" min-width="120" align='center' prop="Name"></el-table-column>
        <el-table-column v-for="(item,index) in columns" :key="props[index]" :prop="props[index]" align='center' :label="item"></el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
    <div class="bg-white containerbox  chart-wrapper">
      <BarChart ref="chart" :chartData='chartData' v-if="dataList&&dataList.length>0" />
      <p v-else class="tips" style="padding-top:13%">暂无数据</p>
    </div>

  </div>
</template>

<script>
import {
  userReportByYear,
  userReportByNature,
  userReportByExecute
} from "@/api/patrol";
import BarChart from "@/views/patrol/components/BarChart";
import { getChildrenList } from "@/api/org";
export default {
  components: {
    BarChart
  },
  data() {
    return {
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        patrolusername: "",
        patroltimeend: "",
        patroltimebegin: "",
        ptrolnature: "",
        isexecute: ""
      },
      patrolYear: "",
      timeBegin: "",
      timeEnd: "",
      downloadLoading: false,
      dataList: null,
      total: 0,
      rules: {},
      TenantIds: [],
      activeName: "0",
      nowDoc: {},
      tableHeight: "calc(100% - 80px)",
      listLoading: true,
      ptrolnatures: [
        { name: "定期巡视", id: "1" },
        { name: "临时巡视", id: "2" }
      ],
      isexecutes: [
        { name: "已执行", type: true },
        { name: "未执行", type: false }
      ],
      columns: [],
      columns1: [
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
      columns2: ["总巡视数", "临时巡视", "定期巡视"],
      columns3: ["总巡视数", "已执行", "未执行"],
      props: [],
      prop1: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ],
      prop2: ["TotalCount", "TemporaryCount", "RegularCount"],
      prop3: ["TotalCount", "ExecuteCount", "UnexecuteCount"],
      chartData: {}
    };
  },

  created() {
    this.getList(this.activeName);
    this.getTenants();
  },
 
  methods: {
   
    handleClick(tab, event) {
      this.resetQuery();
      this.patrolYear = "";
      this.timeBegin = "";
      this.timeEnd = "";
      this.queryParams.patroltimebegin = "";
      this.queryParams.patroltimeend = "";
      this.getList(this.activeName);
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.queryParams.patroltimebegin = this.getBeginTime();
      this.queryParams.patroltimeend = this.getEndTime();
      this.getList(this.activeName);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.patrolYear = "";
      this.timeBegin = "";
      this.timeEnd = "";
      this.queryParams.patroltimebegin = "";
      this.queryParams.patroltimeend = "";
      this.handleQuery();
    },
    // 获取开始时间
    getBeginTime(time) {
      let begin = "";
      if (this.activeName == 0) {
        if (this.patrolYear != "") {
          begin = this.patrolYear + "-01-01 00:00:00";
        }
      } else {
        if (this.timeBegin != "") {
          begin = this.timeBegin + " 00:00:00";
        }
      }
      return begin;
    },
    // 获取结束时间
    getEndTime() {
      let end = "";
      if (this.activeName == 0) {
        if (this.patrolYear != "") {
          end = this.patrolYear + "-12-31 23:59:59";
        }
      } else {
        if (this.timeEnd != "") {
          end = this.timeEnd + " 23:59:59";
        }
      }
      return end;
    },
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
    getList(activeName, row) {
      const data = {
        type: 2,
        tenantId: this.queryParams.tenantId,
        patroltimebegin: this.getBeginTime(),
        patroltimeend: this.getEndTime()
      };
      let smtitle = "";

      let fn;
      switch (activeName) {
        case "0":
          data.ptrolnature = this.queryParams.ptrolnature;
          data.isexecute = this.queryParams.isexecute;
          fn = userReportByYear;
          this.columns = this.columns1.slice(0);
          this.props = this.prop1.slice(0);
          smtitle = "-按年度统计";
          break;
        case "1":
          data.isexecute = this.queryParams.isexecute;
          fn = userReportByNature;
          this.columns = this.columns2.slice(0);
          this.props = this.prop2.slice(0);
          smtitle = "-按巡视性质统计";
          break;
        case "2":
          data.ptrolnature = this.queryParams.ptrolnature;
          fn = userReportByExecute;
          this.columns = this.columns3.slice(0);
          this.props = this.prop3.slice(0);
          smtitle = "-按完成情况统计";
          break;
        default:
          break;
      }
      fn(data)
        .then(res => {
          if (res.data.length == 0) {
            this.dataList = [];
            return;
          }
          this.dataList = res.data;
          this.total = res.total;
          let arr = [];
          if (!row) {
            arr = this.dataList[this.dataList.length - 1];
          } else {
            arr = row;
          }
          this.chartData.listData = this.props.map(v => arr[v]);
          this.chartData.xAxisData = this.columns;
          this.chartData.title = arr.Name + smtitle;

          this.$nextTick(() => {
            this.$refs.chart.initChart();
            this.$refs.table.doLayout();
          });
        })
        .finally(r => {
          this.listLoading = false;
        });
    },
    // 点击行
    handleRowInfo(row) {
      this.getList(this.activeName, row);
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
        const list = this.dataList;
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

<style lang="scss">
</style>