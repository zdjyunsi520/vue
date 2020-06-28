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

                <el-form-item label="业务来源：" prop='repairsource'>
                    <el-select v-model="queryParams.repairsource" clearable placeholder="请选择">
                        <el-option v-for="(item,index) in sources" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="bg-white chart-wrapper marginbottom15">
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
                <p class="form-smtitle tb-smtitle">抢修完成类型统计</p>
                <el-popover placement="bottom-end" :loading="downloadLoading" class="floatright " popper-class='downloadpop' width="50px" trigger="hover" content="导出">
                    <el-button slot="reference" class="downloadbtn" @click="handleExport">
                        <svg-icon icon-class='ic_export' class="tablesvgicon"></svg-icon>
                    </el-button>
                </el-popover>
            </div>
            <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" class="middletable" :data="dataList" ref='table' :height="tableHeight" :row-class-name='totalstyle' show-summary :summary-method="getSummaries" @row-click='handleRowInfo' border>
                <template slot="empty">
                    <div class="nodata-box">
                        <img src="@/assets/image/nodata.png" class="smimg" />
                        <p>暂时还没有数据</p>
                    </div>
                </template>
                <el-table-column label="抢修单位" fixed="left" min-width="150" prop="Name"></el-table-column>

                <el-table-column label="完成" prop="Complete" />
                <el-table-column label="未完成" prop="InComplete" />
                <el-table-column fixed='right' label="总计" prop="Total" />
            </el-table>
            <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
        </div>

    </div>
</template>

<script>
import { userReportByExecute as userReportByYear } from "@/api/repairOrder/personalCount";
import BarChart from "./sourceBarChart";
import { getChildrenList } from "@/api/org";
export default {
<<<<<<< HEAD
    components: {
        BarChart
=======
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
        repairsource: "",
        type: 2
      },
      patrolYear: "",
      startdate: "",
      enddate: "",
      dataList: null,
      xsdataList: null,
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
      columns: ["总计", "完成", "未完成"],
      props: ["Total", "Complete", "InComplete"],
      props1: ["CompleteUser", "InCompleteUser", "TotalUser"],
      props2: ["CompleteAssets", "InCompleteAssets", "TotalAssets"],
      propTotal: ["Complete", "InComplete", "Total"],
      chartData: {},
      totalrow: {},
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
        title: "总计-抢修完成类型统计图"
      }
    };
  },

  created() {
    this.getList();
    this.getTenants();
  },
  mounted() {
    let self = this;
    let table = document.querySelector(".el-table__footer-wrapper>table");
    this.$nextTick(() => {
      table.rows[0].onclick = function() {
        self.handleRowInfo(self.totalrow);
      };
      let table1 = document.querySelector(".el-table__fixed>.el-table__fixed-footer-wrapper>table");
      table1.rows[0].onclick = function() {
        self.handleRowInfo(self.totalrow);
      };
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
>>>>>>> ee4cf1ddf75a1b162ea52adad796fb3f1f1c215d
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
                repairsource: "",
                type: 2
            },
            patrolYear: "",
            startdate: "",
            enddate: "",
            dataList: null,
            xsdataList: null,
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
            columns: ["总计", "完成", "未完成"],
            columnsExport: ["完成", "未完成", "总计"],
            props: ["Total", "Complete", "InComplete"],
            props1: ["CompleteUser", "InCompleteUser", "TotalUser"],
            props2: ["CompleteAssets", "InCompleteAssets", "TotalAssets"],
            propTotal: ["Complete", "InComplete", "Total"],
            chartData: {},
            totalrow: {},
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
                title: "总计-抢修完成类型统计图"
            }
        };
    },
<<<<<<< HEAD
=======
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

          this.xsdataList = res.data;
          this.totalrow = this.xsdataList[this.xsdataList.length - 1];
          this.dataList = res.data.slice(0, res.data.length - 1);
          this.total = res.total;
          let arr = this.xsdataList[this.xsdataList.length - 1];
          this.chartData.series[0].data = this.props1.map(v => arr[v]);
          this.chartData.series[1].data = this.props2.map(v => arr[v]);
          this.chartData.xAxisData = this.columns;
          this.chartData.title = arr.Name + "-抢修完成类型统计图";
>>>>>>> ee4cf1ddf75a1b162ea52adad796fb3f1f1c215d

    created() {
        this.getList();
        this.getTenants();
    },
    mounted() {
        let self = this;
        let table = document.querySelector(".el-table__footer-wrapper>table");
        this.$nextTick(() => {
            table.rows[0].onclick = function() {
                self.handleRowInfo(self.totalrow);
            };
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

                    this.xsdataList = res.data;
                    this.totalrow = this.xsdataList[this.xsdataList.length - 1];
                    this.dataList = res.data.slice(0, res.data.length - 1);
                    this.total = res.total;
                    let arr = this.dataList[this.dataList.length - 1];
                    this.chartData.series[0].data = this.props1.map(
                        v => arr[v]
                    );
                    this.chartData.series[1].data = this.props2.map(
                        v => arr[v]
                    );
                    this.chartData.xAxisData = this.columns;
                    this.chartData.title = arr.Name + "-抢修完成类型统计图";

                    this.$nextTick(() => {
                        this.$refs.table.doLayout();
                    });
                })
                .finally(r => {
                    this.listLoading = false;
                });
        },
        // 点击行
        handleRowInfo(arr) {
            console.log(arr);
            this.chartData.series[0].data = this.props.map(v => arr[v]);
            this.chartData.title = arr.Name + "-抢修完成类型统计图";
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
                const tHeader = ["抢修单位", ...this.columnsExport];
                const list = this.dataList.slice(0);
                const data = this.formatJson(["Name", ...this.propTotal], list);
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: "单位抢修-按完成情况统计",
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