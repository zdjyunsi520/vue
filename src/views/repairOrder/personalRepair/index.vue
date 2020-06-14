<template>
    <div class="app-container">
        <div class="search-box xl-querybox marginbottom15">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="按年度统计" name="0"></el-tab-pane>
                <el-tab-pane label="按业务来源统计" name="1"></el-tab-pane>
                <el-tab-pane label="按完成情况统计" name="2"></el-tab-pane>
            </el-tabs>
            <year v-if="activeName==0"></year>
            <bysource v-if="activeName==1"></bysource>
            <bycomplete v-if="activeName==2"></bycomplete>
        </div>
    </div>
</template>

<script>
import year from "./components/year";
import bysource from "./components/bysource";
import bycomplete from "./components/bycomplete";
import { getChildrenList } from "@/api/org";
export default {
    components: {
        year,
        bysource,
        bycomplete
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
                repairsource: "",
                status: ""
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
            tableHeight: "calc(100% - 80px)",
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
        this.getTenants();
    },
    methods: {
        handleClick(tab, event) {},

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
                type: 1,
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
                    if (!res.data) {
                        this.dataList = [];
                        return;
                    }

                    this.dataList = res.data.reverse();
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

<style lang="scss">
</style>