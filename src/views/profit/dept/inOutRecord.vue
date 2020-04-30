a<template>
    <div class="app-container">
        <el-row>
            <el-col>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="fetchData">刷新平台财务情况</el-button>
            </el-col>
            <el-col v-loading="loading">
                <div class="chart-wrapper">
                    <bar-chart ref="barChart" />
                </div>
            </el-col>
        </el-row>
        <el-row>
            已完成的订单数：{{data.totalOrderQuantityFinished}}
        </el-row>
        <el-row>
            未完结的订单数：{{data.totalOrderQuantityUndone}}
        </el-row>
        </el-col>
        </el-row>

        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true">
            <el-form-item>
                <el-date-picker :editable="false" placeholder="起始时间" v-model="queryParams.beginDate" align="right" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="结束时间" v-model="queryParams.endDate" align="right" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button :loading="listLoading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
            <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
        </el-form>

        <el-table border v-loading="listLoading" :data="postList">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="日期" align="center" prop="profitDate" />
            <el-table-column label="垫付任务利润" align="center" prop="advanceProfit" />
            <el-table-column label="浏览任务利润" align="center" prop="browseProfit" />
            <el-table-column label="淘宝任务利润" align="center" prop="tbProfit" />
            <el-table-column label="京东任务利润" align="center" prop="jdProfit" />
            <el-table-column label="拼多多任务利润" align="center" prop="pddProfit" />
            <el-table-column label="平台服务费利润" align="center" prop="serviceFeeProfit" />
            <el-table-column label="佣金利润" align="center" prop="commissionProfit" />
            <el-table-column label="逃单金额" align="center" prop="escapeAmount" />
            <el-table-column label="其他扣除金额" align="center" prop="deductionAmount" />
            <el-table-column label="总利润" align="center" prop="totalProfit" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import { deptCondition, deptIn as fetchList } from "@/api/profit/station";
import { mapGetters } from "vuex";
import { dateFortmat } from "@/utils";

import BarChart from "./components/BarChart";

const barChantName = [
    "平台资金池",
    "平台总收益",
    "商家总本金",
    "商家总佣金",
    "买手总本金",
    "买手总佣金",
    "推广员总余额",
    "分站总余额",
    "逃单总金额"
];
export default {
    components: { BarChart },
    data() {
        return {
            // 遮罩层
            loading: false,
            listLoading: false,
            // 总条数
            total: 0,
            // 岗位表格数据
            postList: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                beginDate: "",
                endDate: ""
            },
            data: {
                fundPool: 0,
                platformTotalProfit: 0,
                merTotalPrincipal: 0,
                merTotalCommission: 0,
                buyerTotalPrincipal: 0,
                buyerTotalCommission: 0,
                promoterTotalBalance: 0,
                deptTotalBalance: 0,
                totalOrderQuantityFinished: 0,
                totalOrderQuantityUndone: 0
            }
        };
    },
    computed: {
        ...mapGetters({
            mallOrderType: "status/mallOrderType",
            mallOrderKV: "status/mallOrderKV"
        })
    },
    created() {
        this.fetchData();
        this.getList();
    },
    methods: {
        filterMoney(row) {
            return this.mallOrderKV[row.orderStatus];
        },
        filterTime() {
            if (
                this.queryParams.beginDate &&
                this.queryParams.beginDate.length != 10
            ) {
                this.queryParams.beginDate = dateFortmat(
                    this.queryParams.beginDate,
                    "yyyy-MM-dd"
                );
            }
            if (
                this.queryParams.endDate &&
                this.queryParams.endDate.length != 10
            ) {
                this.queryParams.endDate = dateFortmat(
                    this.queryParams.endDate,
                    "yyyy-MM-dd"
                );
            }
        },

        /** 查询岗位列表 */
        getList() {
            this.listLoading = true;
            this.filterTime();
            fetchList(this.queryParams)
                .then(response => {
                    this.postList = response.data.list;
                    this.total = response.data.total;
                })
                .finally(e => {
                    this.listLoading = false;
                });
        },
        fetchData() {
            this.laoding = true;
            deptCondition(this.queryParams)
                .then(({ data }) => {
                    this.data = data;
                    const list = [
                        data.fundPool,
                        data.platformTotalProfit,
                        data.merTotalPrincipal,
                        data.merTotalCommission,
                        data.buyerTotalPrincipal,
                        data.buyerTotalCommission,
                        data.promoterTotalBalance,
                        data.deptTotalBalance,
                        data.escapeAmount
                    ];
                    var target = this.$refs.barChart;
                    const animationDuration = 500;
                    target.destroy();
                    const series = [
                        {
                            name: "",
                            type: "bar",
                            stack: "vistors",
                            barWidth: "60%",
                            data: list,
                            animationDuration,
                            label: {
                                show: true,
                                position: "inside"
                            }
                        }
                    ];
                    target.initChart(barChantName, series);
                })
                .finally(e => {
                    this.laoding = false;
                });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        }
    }
};
</script>
<style lang="scss" scoped>
.xl-query {
    /deep/.el-form-item {
        margin-bottom: 0;
    }
    /deep/ .el-input__inner {
        width: 130px;
    }
    /deep/.el-date-editor.el-input {
        width: 200px;

        .el-input__inner {
            width: 200px;
        }
    }
}
/deep/.cell {
    text-align: center;
    .el-row {
        margin-bottom: 2px;
    }
    .el-input__inner {
        width: 88px;
    }
}
/deep/.el-table th.gutter {
    display: table-cell !important;
}
/deep/.el-select-dropdown__list {
    width: 180px;
}
</style>