<template>
  <div class="app-container">
    <div class="search-box xl-querybox marginbottom15">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按人员统计" name="1"></el-tab-pane>
        <el-tab-pane label="按值班统计" name="2"></el-tab-pane>
      </el-tabs>
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-querybox" :rules="rules">
        <el-form-item label="用电单位：" prop="tenantId">
          <el-select v-model="queryParams.tenantId">
            <el-option label="全部" value></el-option>
            <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
          </el-select>
        </el-form-item>
        <el-form-item label="年度：" prop="patrolYear" label-width="50px">
          <el-date-picker v-model="patrolYear" clearable type="year" placeholder="请选择年" value-format="yyyy"> </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>

        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white   chart-wrapper marginbottom15">
      <p class="form-smtitle tb-smtitle">{{chartData.title}}-值班统计图 </p>
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
          <span v-if="activeName=='1'">人员统计</span>
          <span v-if="activeName=='2'">值班统计</span>
        </p>
        <el-popover placement="bottom-end" class="floatright " popper-class='downloadpop' width="50px" trigger="hover" content="导出">
          <el-button slot="reference" class="downloadbtn" @click="handleExport">
            <svg-icon icon-class='ic_export' class="tablesvgicon"></svg-icon>
          </el-button>
        </el-popover>
      </div>

      <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" :data="dataList" border :height="tableHeight" class="middletable" show-summary :summary-method="getSummaries" ref='table' :row-class-name='totalstyle' @row-click='handleRowInfo'>
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" class="smimg" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column :label="activeName=='1'?'值班人员':'用电单位'" prop="Name" min-width="210" />
        <el-table-column v-for="(item,index) in columns" :key="props[index]" :prop="props[index]" :label="item" min-width="75" />
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
  </div>

</template>

<script>
import { mapGetters } from "vuex";
import { getDutyScheduleReport } from "@/api/report";
import BarChart from "./components/BarChart";
export default {
  name: "user",
  components: { BarChart },
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
      xsdataList: null,
      totalrow: {},
      rules: {},
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        type: 1,
        tenantId: "",
        starttime: "",
        endtime: ""
      },
      patrolYear: this.getNowYear(),
      activeName: "1",
      chartData: {},
      tableHeight: "calc(100% - 110px)",
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
      props: [
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
      propTotal: [
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
      ]
    };
  },

  created() {
    this.getList(this.activeName);
  },
  computed: {
    ...mapGetters({
      companyType: "status/companyType"
    })
  },
  mounted() {
    let self = this;
    let table = document.querySelector(".el-table__footer-wrapper>table");
    let table1 = document.querySelector(
      ".el-table__fixed-footer-wrapper>table"
    );
    this.$nextTick(() => {
      table.rows[0].onclick = function() {
        self.handleRowInfo(self.totalrow);
      };
      if (table1) {
        table1.rows[0].onclick = function() {
          self.handleRowInfo(self.totalrow);
        };
      }
    });
  },

  methods: {
    getSummaries() {
      let data;
      if (this.xsdataList && this.xsdataList.length) {
        data = this.xsdataList[this.xsdataList.length - 1];
      }
      if (data) return ["总计", ...this.propTotal.map(v => data[v])];
      else return ["总计", ...this.propTotal.map(v => 0)];
    },
    handleClick(tab, event) {
      this.resetQuery("queryForm");
      this.patrolYear = this.getNowYear();
      this.queryParams.starttime = "";
      this.queryParams.endtime = "";
      this.queryParams.type = parseInt(this.activeName);
      this.getList(this.activeName);
    },

    /** 搜索用户列表 */
    getList(activeName, row) {
      this.listLoading = true;
      getDutyScheduleReport(this.queryParams)
        .then(response => {
          this.xsdataList = response.data;
          this.totalrow = this.xsdataList[this.xsdataList.length - 1];
          this.dataList = response.data.slice(0, response.data.length - 1);

          this.total = response.total;
          let arr = [];
          if (!row) {
            arr = this.xsdataList[this.xsdataList.length - 1];
          } else {
            arr = row;
          }
          this.chartData.listData = this.props.map(v => arr[v]);
          this.chartData.xAxisData = this.columns;
          this.chartData.title = arr.Name;

          this.$nextTick(() => {
            this.$refs.chart.initChart();
            this.$refs.table.doLayout();
          });
        })
        .finally(r => {
          this.listLoading = false;
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageno = 1;
      this.queryParams.starttime = this.getBeginTime();
      this.queryParams.endtime = this.getEndTime();
      this.getList(this.activeName);
    },
    // 获取开始时间
    getBeginTime(time) {
      let begin = "";
      if (this.patrolYear != "") {
        begin = this.patrolYear + "-01-01 00:00:00";
      }
      return begin;
    },
    // 获取结束时间
    getEndTime() {
      let end = "";
      if (this.patrolYear != "") {
        end = this.patrolYear + "-12-31 23:59:59";
      }
      return end;
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.patrolYear = this.getNowYear();
      this.queryParams.starttime = "";
      this.queryParams.endtime = "";
      this.handleQuery();
    },
    getNowYear() {
      var myYear = new Date();
      var nowYear = myYear.getFullYear();
      return nowYear + "";
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
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          this.activeName == "1" ? "值班人员" : "用电单位",
          ...this.columns
        ];
        const list = this.xsdataList.slice(0);
        const data = this.formatJson(["Name", ...this.propTotal], list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename:
            "值班统计-按" + (this.activeName == "1" ? "人员" : "值班") + "统计",
          autoWidth: true,
          bookType: "xlsx"
        });
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
