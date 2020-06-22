<template>
  <div class="comheight comflexbox">
    <div class="search-box xl-querybox marginbottom15">
      <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-query">
        <el-form-item label="用电单位：" prop='tenantid'>
          <el-select v-model="queryParams.tenantid" clearable placeholder="请选择">
            <el-option value="" label="全部"></el-option>
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="抢修日期：" prop='startdate'>
          <el-date-picker v-model="startdate" type="date" placeholder="请选择日期" clearable style='width:46%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          &nbsp;至&nbsp;
          <el-date-picker v-model="enddate" type="date" placeholder="请选择日期" clearable style='width:46%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>

        <el-form-item label="状态：" prop='status' label-width="50px">
          <el-select v-model="queryParams.status" clearable placeholder="请选择">
            <el-option v-for="(item,index) in isexecutes" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>

        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox  chart-wrapper marginbottom15">
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
      <div>
        <p class="form-smtitle tb-smtitle">抢修业务类型统计 </p>
        <el-popover placement="bottom-end" :loading="downloadLoading" @click="handleExport" class="floatright " popper-class='downloadpop' width="50px" trigger="hover" content="导出">
          <el-button slot="reference" class="downloadbtn">
            <svg-icon icon-class='ic_export' class="tablesvgicon"></svg-icon>
          </el-button>
        </el-popover>
      </div>
      <el-table v-loading="listLoading" element-loading-text="Loading" class="middletable" :data="dataList" ref='table' :height="tableHeight" :row-class-name='totalstyle' @row-click='handleRowInfo' border>
        <template slot="empty">
          <div class="nodata-box">
            <img src="@/assets/image/nodata.png" class="smimg" style='width:130px' />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column label="抢修人员" fixed="left" min-width="200" prop="Name"></el-table-column>
        <el-table-column align="center" label="用户报修">
          <el-table-column align="center" prop="UserFatal" label="紧急"></el-table-column>
          <el-table-column align="center" prop="UserEmergency" label="重要"></el-table-column>
          <el-table-column align="center" prop="UserNormal" label="一般"></el-table-column>
          <el-table-column align="center" prop="UserTotal" label="小计"></el-table-column>
        </el-table-column>
        <el-table-column align="center" label="故障报警">
          <el-table-column align="center" prop="AssetsFatal" label="紧急"></el-table-column>
          <el-table-column align="center" prop="AssetsEmergency" label="重要"></el-table-column>
          <el-table-column align="center" prop="AssetsNormal" label="一般"></el-table-column>
          <el-table-column align="center" prop="AssetsTotal" label="小计"></el-table-column>
        </el-table-column>

        <el-table-column align="center" fixed='right' label="总计" prop="Total" width="200" />
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { userReportByNature as userReportByYear } from "@/api/repairOrder/personalCount";
import BarChart from "./sourceBarChart";
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
        tenantid: "",
        startdate: "",
        enddate: "",
        status: "",
        type: 2
      },
      patrolYear: "",
      startdate: "",
      enddate: "",
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
      columns: ["紧急", "重要", "一般"],
      props: ["UserFatal", "UserEmergency", "UserNormal"],
      props1: ["AssetsFatal", "AssetsEmergency", "AssetsNormal"],
      chartData: {},
      chartDataInit: {
        series: [
          {
            name: "故障报警",
            type: "bar",
            // stack: 'vistors',
            barWidth: "30%",
            barMaxWidth: 50,
            data: [0, 0, 0, 0]
          },
          {
            name: "用户报修",
            type: "bar",
            // stack: 'vistors',
            barWidth: "30%",
            barMaxWidth: 50,
            data: [0, 0, 0, 0]
          }
        ],
        xAxisData: this.columns,
        title: "总计-抢修业务类型统计图"
      }
    };
  },

  created() {
    this.getList();
    this.getTenants();
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageno = 1;
      this.queryParams.startdate = this.getBeginTime();
      this.queryParams.enddate = this.getEndTime();
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.patrolYear = "";
      this.startdate = "";
      this.enddate = "";
      this.queryParams.startdate = "";
      this.queryParams.enddate = "";
      this.handleQuery();
    },
    // 获取开始时间
    getBeginTime(time) {
      let begin = "";
      if (this.startdate != "") {
        begin = this.startdate + " 00:00:00";
      }
      return begin;
    },
    // 获取结束时间
    getEndTime() {
      let end = "";
      if (this.enddate != "") {
        end = this.enddate + " 23:59:59";
      }
      return end;
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
          this.total = res.total;
          let arr = this.dataList[this.dataList.length - 1];

          this.chartData.series[0].data = this.props.map(v => arr[v]);
          this.chartData.series[1].data = this.props1.map(v => arr[v]);
          this.chartData.xAxisData = this.columns;
          this.chartData.title = arr.Name + "-抢修业务类型统计图";
        })
        .finally(r => {
          this.listLoading = false;
        });
    },
    // 点击行
    handleRowInfo(arr) {
      this.chartData.series[0].data = this.props.map(v => arr[v]);
      this.chartData.series[1].data = this.props1.map(v => arr[v]);
      this.chartData.title = arr.Name + "-抢修业务类型统计图";
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
/deep/.el-table th {
  height: 35px !important;
}
</style>