<template>
  <div class="app-container">
    <div class="search-box xl-querybox marginbottom15">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按年度统计" name="0"></el-tab-pane>
        <el-tab-pane label="按巡视性质统计" name="1"></el-tab-pane>
        <el-tab-pane label="按完成情况统计" name="2"></el-tab-pane>
      </el-tabs>
      <div class='sm-searchbox'>
      <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-querybox"  :style="isOpen?'height:'+baseformHeight+'px;overflow: hidden;padding-right: 62px;':'padding-right: 62px;'" >
        <el-form-item label="巡视单位：" prop='tenantId'>
          <el-select v-model="queryParams.tenantId" clearable placeholder="请选择">
            <el-option  label="全部" value=""></el-option>
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年度：" v-show="activeName=='0'" prop='patrolYear' label-width="50px">
          <el-date-picker v-model="patrolYear" clearable type="year" placeholder="请选择年" value-format="yyyy"> </el-date-picker>
        </el-form-item>
        <el-form-item label="巡视日期：" v-show="activeName!='0'" prop='timeRange'>
           <el-date-picker  v-model="timeRange" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期"   end-placeholder="结束日期"  value-format="yyyy-MM-dd" style='width:230px'></el-date-picker>
          <!-- <el-date-picker v-model="timeBegin" type="date" placeholder="请选择日期" clearable style='width:46%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          &nbsp;至&nbsp;
          <el-date-picker v-model="timeEnd" type="date" placeholder="请选择日期" clearable style='width:46%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker> -->
        </el-form-item>
        <el-form-item label="巡视性质：" v-show="activeName!='1'" prop='ptrolnature'>
          <el-select v-model="queryParams.ptrolnature" clearable placeholder="请选择">
            <el-option v-for="(item,index) in ptrolnatures" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" v-show="activeName!='2'" prop='isexecute' label-width="50px">
          <el-select v-model="queryParams.isexecute" clearable placeholder="请选择">
            <el-option v-for="(item,index) in isexecutes" :key="index" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>

        </el-form-item>
      </el-form>
      <el-button type="text" @click="handleHighSearch" v-show='isOpenbtn' class="hightsearchbtn">高级筛选<i :class="isOpen?'el-icon-arrow-down':'el-icon-arrow-up'" /></el-button>
    </div>
    </div>
    <div class="bg-white chart-wrapper marginbottom15">
      <p class="form-smtitle tb-smtitle">{{chartData.title}} </p>
      <div class='smchartbox' v-if="dataList&&dataList.length>0">
        <BarChart ref="chart" :chartData='chartData' />
      </div>
      <div class="nodata-box" v-else>
        <img src="../../../assets/image/nodata.png" class='smimg' />
        <p>暂时还没有数据</p>
      </div>
    </div>

    <div class="bg-white containerbox " ref="containerbox">
      <div>
        <p class="form-smtitle tb-smtitle">
          <span v-if="activeName=='0'">单位巡视年度统计</span>
          <span v-if="activeName=='1'">单位巡视性质统计</span>
          <span v-if="activeName=='2'">单位巡视完成情况统计</span>
        </p>
        <el-popover placement="bottom-end" :loading="downloadLoading" class="floatright " popper-class='downloadpop' width="50px" trigger="hover" content="导出">
          <el-button slot="reference" class="downloadbtn" @click="handleExport">
            <svg-icon icon-class='ic_export' class="tablesvgicon"></svg-icon>
          </el-button>
        </el-popover>
      </div>

      <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" class="middletable" :data="dataList" ref='table' show-summary :summary-method="getSummaries" :height="tableHeight" @row-click='handleRowInfo' :row-class-name='totalstyle' border>
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" class="smimg" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column label="巡视单位" fixed="left" min-width="180" prop="Name"></el-table-column>
        <el-table-column v-for="(item,index) in columns" :key="props[index]" min-width="60" :prop="props[index]" :label="item"></el-table-column>
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
} from "@/api/patrol";
import BarChart from "../components/BarChart";
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
      patrolYear: new Date(),
      timeRange:[],
      downloadLoading: false,
      dataList: null,
      total: 0,
      rules: {},
      TenantIds: [],
      activeName: "0",
      nowDoc: {},
      tableHeight: "calc(100% - 110px)",
      listLoading: true,
      xsdataList: [],
      ptrolnatures: [
        { name: "全部", id: "" },
        { name: "定期巡视", id: "1" },
        { name: "临时巡视", id: "2" }
      ],
      isexecutes: [
        { name: "全部", type: "" },
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
      totalrow: {},
      propTotal: [],
      propTotal1: [
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
      propTotal2: ["TotalCount", "TemporaryCount", "RegularCount"],
      propTotal3: ["TotalCount", "ExecuteCount", "UnexecuteCount"],
      chartData: {},
      isOpen: false,
      formHeight: "",
      baseformHeight: 47,
      isOpenbtn:false,
    };
  },

  created() {
    this.getList(this.activeName);
    this.getTenants();
  },

  mounted() {
    this.formHeight = this.$refs.queryForm.$el.clientHeight;
    this.isOpenbtn=this.formHeight > this.baseformHeight?true:false;
    window.onresize = () => {
        return (() => {
            this.formHeight = this.$refs.queryForm.$el.clientHeight;
            this.isOpenbtn=this.formHeight > this.baseformHeight?true:false;
        })()
    }
    // 点击总计行显示图表数据
    let self = this;
    let table = document.querySelector(".el-table__footer-wrapper>table");
    this.$nextTick(() => {
      table.rows[0].onclick = function() {
        self.handleRowInfo(self.totalrow);
      };
      let table1 = document.querySelector(
        ".el-table__fixed>.el-table__fixed-footer-wrapper>table"
      );
      table1.rows[0].onclick = function() {
        self.handleRowInfo(self.totalrow);
      };
    });
  },

  watch:{
      'formHeight': function(newVal){
          this.$nextTick(()=>{
            var newheight = this.$refs.queryForm.$el.clientHeight;
            this.isOpen=newheight > this.baseformHeight?true:false;
          })
      },
  },
  methods: {
     // 高级筛选
    handleHighSearch() {
      this.isOpen = !this.isOpen;
    },
    getSummaries() {
      let data;
      if (this.xsdataList && this.xsdataList.length) {
        data = this.xsdataList[this.xsdataList.length - 1];
      }
      if (data) return ["总计", ...this.propTotal.map(v => data[v])];
      else return ["总计", ...this.propTotal.map(v => 0)];
    },

    handleClick(tab, event) {
      this.resetQuery();
      this.patrolYear = new Date();
      this.timeRange = "";
      this.queryParams.patroltimebegin = "";
      this.queryParams.patroltimeend = "";
      this.getList(this.activeName);
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageno = 1;
      this.queryParams.patroltimebegin = this.getBeginTime();
      this.queryParams.patroltimeend = this.getEndTime();
      this.getList(this.activeName);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.patrolYear = new Date();
      this.timeRange = "";
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
        if (this.timeRange[0] != "") {
          begin = this.timeRange[0] + " 00:00:00";
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
        if (this.timeRange[1] != "") {
          end = this.timeRange[1] + " 23:59:59";
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
        pageno: 1,
        pagesize: 30,
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
          this.propTotal = this.propTotal1.slice(0);
          smtitle = "-年度统计图";
          break;
        case "1":
          data.isexecute = this.queryParams.isexecute;
          fn = userReportByNature;
          this.columns = this.columns2.slice(0);
          this.props = this.prop2.slice(0);
          this.propTotal = this.propTotal2.slice(0);
          smtitle = "-巡视性质统计图";
          break;
        case "2":
          data.ptrolnature = this.queryParams.ptrolnature;
          fn = userReportByExecute;
          this.columns = this.columns3.slice(0);
          this.props = this.prop3.slice(0);
          this.propTotal = this.propTotal3.slice(0);
          smtitle = "-完成情况统计图";
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
          this.xsdataList = res.data;
          this.totalrow = this.xsdataList[this.xsdataList.length - 1];
          this.dataList = res.data.slice(0, res.data.length - 1);

          this.total = res.total;
          let arr = [];
          if (!row) {
            arr = this.xsdataList[this.xsdataList.length - 1];
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
        const tHeader = ["巡视人员", ...this.columns];
        const list = this.xsdataList;
        const data = this.formatJson(["Name", ...this.props], list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename:
            this.activeName == "0"
              ? "单位巡视年度统计"
              : this.activeName == "1"
              ? "单位巡视性质统计"
              : "单位巡视完成情况统计",
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