<template>
    <div class="app-container">
        <div class="search-box xl-querybox marginbottom15">

            <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-query">
                <el-form-item label="用电单位：" prop='tenantid'>
                    <el-select v-model="queryParams.tenantid" clearable placeholder="请选择">
                        <el-option value="">全部</el-option>
                        <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年度：" prop='startdate'>
                    <el-date-picker v-model="queryParams.startdate" clearable type="year" placeholder="请选择年" value-format="yyyy"> </el-date-picker>
                </el-form-item>

                <el-form-item label="业务来源：" prop='repairsource'>
                    <el-select v-model="queryParams.repairsource" clearable placeholder="请选择">
                        <el-option value="">全部</el-option>
                        <el-option v-for="(item,index) in sources" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" prop='status'>
                    <el-select v-model="queryParams.status" clearable placeholder="请选择">
                        <el-option value="">全部</el-option>
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
        <div class="bg-white containerbox  chart-wrapper">
            <BarChart ref="chart" :chartData='chartData' />
        </div>
        <div class="bg-white containerbox marginbottom15" ref="containerbox">
            <el-table v-loading="listLoading" element-loading-text="Loading" :data="dataList" ref='table' :height="tableHeight" :row-class-name='totalstyle' @row-click='handleRowInfo' border style='margin-top:20px'>

                <template slot="empty">
                    <div class="nodata-box">
                        <img src="@/assets/image/nodata.png" class="smimg" />
                        <p>暂时还没有数据</p>
                    </div>
                </template>
                <el-table-column label="抢修人员" fixed="left" min-width="120" prop="EmployeeName"></el-table-column>
                <el-table-column v-for="(item,index) in columns" :key="index" :label="item">
                    <template slot-scope="{row}">
                        {{row.CountByMonth[index]}}
                    </template>
                </el-table-column>
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
import BarChart from "../../components/BarChart";
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
                tenantid: "",
                startdate: new Date(),
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
            chartDataInit: {
                listData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                xAxisData: this.columns,
                title: "总计-按年度统计"
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
                    let row = res.data[0];
                    this.chartData.listData = row.CountByMonth;
                    this.chartData.title = row.EmployeeName + "-按年度统计";
                    this.dataList = res.data.reverse();
                    this.total = res.total;
                })
                .finally(r => {
                    this.listLoading = false;
                    this.$nextTick(() => {
                        this.$refs.chart.initChart();
                        this.$refs.table.doLayout();
                    });
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