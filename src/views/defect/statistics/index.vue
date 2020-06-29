<template>
    <div class="app-container">
        <div class="search-box xl-querybox marginbottom15" style='padding-top:15px'>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="按年度统计" name="0"></el-tab-pane>
                <el-tab-pane label="按缺陷等级统计" name="1"></el-tab-pane>
                <el-tab-pane label="按消缺率统计" name="2"></el-tab-pane>
            </el-tabs>
            <div class='sm-searchbox'>
                <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-querybox" :style="isOpen?'height:'+baseformHeight+'px;overflow: hidden;padding-right: 62px;':'padding-right: 62px;'" >
                    <el-form-item label="用电单位：" prop='tenantId'>
                        <el-select v-model="queryParams.tenantId" clearable placeholder="请选择">
                            <el-option  label="全部" value></el-option>
                            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年度：" v-show="activeName=='0'" prop='patrolYear' label-width="50px">
                        <el-date-picker v-model="patrolYear" clearable type="year" placeholder="请选择年" value-format="yyyy" format="yyyy"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="年月：" v-show="activeName!='0'" prop='patrolMonth' label-width="50px">
                        <el-date-picker v-model="patrolMonth" clearable type="month" placeholder="请选择年月" value-format="yyyy-MM" format="yyyy-MM"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="缺陷等级：" v-show="activeName=='0'" prop='rank'>
                        <el-select v-model="queryParams.rank" clearable placeholder="请选择">
                            <el-option v-for="(item,index) in ranks" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态：" prop='status' label-width="50px">
                        <el-select v-model="queryParams.status" clearable placeholder="请选择">
                            <el-option v-for="(item,index) in statuss" :key="index" :label="item.name" :value="item.id"></el-option>
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
                    <span v-if="activeName=='0'">缺陷年度统计</span>
                    <span v-if="activeName=='1'">缺陷等级统计</span>
                    <span v-if="activeName=='2'">消缺率统计</span>
                </p>
                <el-popover placement="bottom-end" :loading="downloadLoading" class="floatright " popper-class='downloadpop' width="50px" trigger="hover" content="导出">
                    <el-button slot="reference" class="downloadbtn" @click="handleExport">
                        <svg-icon icon-class='ic_export' class="tablesvgicon"></svg-icon>
                    </el-button>
                </el-popover>
            </div>

            <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" class="middletable" :data="dataList" ref='table' show-summary :summary-method="getSummaries" :height="tableHeight" @row-click='handleRowInfo' border :row-class-name='totalstyle'>
                <template slot="empty">
                    <div class="nodata-box">
                        <img src="../../../assets/image/nodata.png" class='smimg' />
                        <p>暂时还没有数据</p>
                    </div>
                </template>
                <el-table-column :label="activeName!=2?'用电单位':'缺陷等级'" fixed="left" min-width="210" prop="Name"></el-table-column>
                <el-table-column v-for="(item,index) in columns" :key="props[index]" :prop="props[index]" :label="item"></el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
        </div>

    </div>
</template>

<script>
import { bugReportByYear, bugReportByRank, bugReportByRate } from "@/api/biz";
import BarChart from "./components/BarChart";
import { getChildrenList } from "@/api/org";
const myYear = new Date();
const nowYear = myYear.getFullYear();
var mth = myYear.getMonth()+1;
if (mth.toString().length == 1)
  mth= "0" +mth;
const nowMonth = nowYear+'-'+mth;
console.log(nowMonth)
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
                patroltimeend: "",
                patroltimebegin: "",
                rank: "",
                status: ""
            },
            patrolYear: '',
            patrolMonth: '',
            downloadLoading: false,
            dataList: null,
            xsdataList: null,
            totalrow: {},
            total: 0,
            rules: {},
            TenantIds: [],
            activeName: "0",
            nowDoc: {},
            tableHeight: "calc(100% - 110px)",
            listLoading: true,
            ranks: [
                { name: "全部", id: "" },
                { name: "一般缺陷", id: 1 },
                { name: "紧急缺陷", id: 2 },
                { name: "严重缺陷", id: 3 }
            ],
            solves: [
                { name: "全部", id: "" },
                { name: "未消缺", id: "0" },
                { name: "已消缺", id: "1" }
            ],
            statuss: [
                { name: "全部", id: "" },
                { name: "登记", id: "1" },
                { name: "消缺", id: "2" },
                { name: "验收", id: "3" },
                { name: "完成", id: "4" }
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
            columns2: ["一般缺陷", "紧急缺陷", "严重缺陷"],
            columns3: ["缺陷数", "未消缺", "已消缺", "消缺率"],
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
            prop2: ["Normal", "Emergency", "Fatal"],
            prop3: [
                "TotalEliminated",
                "NotEliminated",
                "Eliminated",
                "RateEliminated"
            ],
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
            propTotal2: ["Normal", "Emergency", "Fatal"],
            propTotal3: [
                "TotalEliminated",
                "NotEliminated",
                "Eliminated",
                "RateEliminated"
            ],

            chartData: {},
            isOpen: false,
            baseformHeight: 47,
            formHeight: "",
            isOpenbtn:false,
        };
    },

    created() {
        this.getList(this.activeName);
        this.getTenants();
      this.patrolYear = nowYear+'';
      this.patrolMonth = nowMonth+'';
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
        let self = this;
        let table = document.querySelector(".el-table__footer-wrapper>table");
        this.$nextTick(() => {
            table.rows[0].onclick = function() {
                self.handleRowInfo(self.totalrow);
            };
            let table1 = document.querySelector(".el-table__fixed-footer-wrapper>table");
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
                this.isOpenbtn=newheight > this.baseformHeight?true:false
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
            this.resetQuery("queryForm");
            this.patrolYear = nowYear+'';
            this.patrolMonth = nowMonth+'';
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
        // 获取开始时间
        getBeginTime(time) {
            let begin = "";
            if (this.activeName == 0) {
                if (this.patrolYear != "") {
                    begin = this.patrolYear + "-01-01 00:00:00";
                }
            } else {
                if (this.patrolMonth != "") {
                    begin = this.patrolMonth + "-01 00:00:00";
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
                if (this.patrolMonth != "") {
                    end =
                        this.patrolMonth +
                        "-" +
                        this.getMonthDate(this.patrolMonth) +
                        " 23:59:59";
                }
            }
            return end;
        },
        // 获取月份的天数
        getMonthDate(time) {
            var date = new Date(time);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var d = new Date(year, month, 0);
            return d.getDate();
        },

        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.patrolYear = nowYear+'';
            this.patrolMonth = nowMonth+'';
            this.queryParams.patroltimebegin = "";
            this.queryParams.patroltimeend = "";
            this.handleQuery();
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
            this.listLoading = true;
            const data = {
                pageno: 1,
                pagesize: 30,
                tenantId: this.queryParams.tenantId,
                patroltimebegin: this.getBeginTime(),
                patroltimeend: this.getEndTime()
            };
            let smtitle = "";
            let fn = "";
            switch (activeName) {
                case "0":
                    data.rank = this.queryParams.rank;
                    data.status = this.queryParams.status;
                    fn = bugReportByYear;
                    this.columns = this.columns1.slice(0);
                    this.props = this.prop1.slice(0);
                    this.propTotal = this.propTotal1.slice(0);
                    smtitle = "-年度统计图";
                    break;
                case "1":
                    data.status = this.queryParams.status;
                    fn = bugReportByRank;
                    this.columns = this.columns2.slice(0);
                    this.columns.push("总计");
                    this.props = this.prop2.slice(0);
                    this.propTotal = this.propTotal2.slice(0);
                    this.props.push("Total");
                    smtitle = "-缺陷等级统计图";
                    break;
                case "2":
                    data.status = this.queryParams.status;
                    fn = bugReportByRate;
                    this.columns = this.columns3.slice(0);
                    this.props = this.prop3.slice(0);
                    this.propTotal = this.propTotal3.slice(0);
                    smtitle = "-消缺率统计图";
                    break;
                default:
                    break;
            }
            fn(data)
                .then(res => {
                    switch (this.activeName) {
                        case "0":
                            if (!res.data || res.data.length == 0) {
                                this.dataList = [];
                                return;
                            }
                            this.xsdataList = res.data;
                            this.totalrow = this.xsdataList[
                                this.xsdataList.length - 1
                            ];
                            this.dataList = res.data.slice(
                                0,
                                res.data.length - 1
                            );
                            break;
                        case "1":
                            if (
                                !res.data.TenantList ||
                                res.data.TenantList.length == 0
                            ) {
                                this.dataList = [];
                                return;
                            } else {
                                // this.dataList = res.data.TenantList;
                                this.xsdataList = res.data.TenantList;
                                this.totalrow = this.xsdataList[
                                    this.xsdataList.length - 1
                                ];
                                this.dataList = res.data.TenantList.slice(
                                    0,
                                    res.data.TenantList.length - 1
                                );
                            }
                            this.dataList.map(v => {
                                v.Total = v.Emergency + v.Fatal + v.Normal;
                                return v;
                            });
                            break;
                        case "2":
                            if (
                                !res.data.RankList ||
                                res.data.RankList.length == 0
                            ) {
                                this.dataList = [];
                                return;
                            } else {
                                // this.dataList = res.data.RankList;
                                this.xsdataList = res.data.RankList;
                                this.totalrow = this.xsdataList[
                                    this.xsdataList.length - 1
                                ];
                                this.dataList = res.data.RankList.slice(
                                    0,
                                    res.data.RankList.length - 1
                                );
                            }
                            this.dataList.map(v => {
                                v.TotalEliminated =
                                    v.Eliminated + v.NotEliminated;
                                v.RateEliminated =
                                    v.TotalEliminated == 0
                                        ? "0.000%"
                                        : (
                                              (v.Eliminated /
                                                  v.TotalEliminated) *
                                              100
                                          ).toFixed(3, "0") + "%";
                                return v;
                            });
                            break;
                        default:
                            break;
                    }

                    this.total = res.total;
                    let arr = [];
                    if (!row) {
                        arr = this.xsdataList[this.xsdataList.length - 1];
                    } else {
                        arr = row;
                    }

                    if (this.activeName != "0") {
                        var arrprops = this.props.concat();
                        arrprops.pop();
                        this.chartData.listData = arrprops.map(v => arr[v]);
                        var arrcolumns = this.columns.concat();
                        arrcolumns.pop();
                        this.chartData.xAxisData = arrcolumns;
                    } else {
                        this.chartData.listData = this.props.map(v => arr[v]);
                        this.chartData.xAxisData = this.columns;
                    }
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
                if (this.activeName != 2) {
                    tHeader.unshift("用电单位");
                } else {
                    tHeader.unshift("缺陷等级");
                }
                const list = this.xsdataList.slice(0);
                const props = this.props.slice(0);
                props.unshift("Name");
                const data = this.formatJson(props, list);
                console.log(this.xsdataList, this.props);
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename:  this.activeName == "0" ? "缺陷年度统计" : this.activeName == "1" ? "缺陷等级统计" : "消缺率统计",
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