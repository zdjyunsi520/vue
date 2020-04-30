a<template>
    <div class="app-container">
        <el-row>
            <el-col>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="fetchData">刷新今日平台资金交易统计</el-button>
            </el-col>
            <el-col v-loading="loading">
                <div class="chart-wrapper">
                    <bar-chart ref="barChart" />
                </div>
            </el-col>
        </el-row>

        </el-col>
        </el-row>

        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
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
            <el-table-column label="日期" width="95px" align="center" prop="statisticsDate" />
            <el-table-column label="商家申请充值金额" align="center" prop="rechargeAmountApply" />
            <el-table-column label="商家已充值金额" align="center" prop="rechargeAmountAudited" />
            <el-table-column label="商家申请提现金额" align="center" prop="merWithdrawApply" />
            <el-table-column label="商家已提现金额" align="center" prop="merWithdrawAudited" />
            <el-table-column label="银行卡充值金额" align="center" prop="bankRechargeAmount" />
            <el-table-column label="买手申请提现金额" align="center" prop="buyerWithdrawApply" />
            <el-table-column label="买手已提现金额" align="center" prop="buyerWithdrawAudited" />
            <el-table-column label="推广员申请提现金额" align="center" prop="exWithdrawApply" />
            <el-table-column label="推广员已提现金额" align="center" prop="exWithdrawAudited" />
            <el-table-column label="分站申请提现金额" align="center" prop="deptWithdrawApply" />
            <el-table-column label="分站已提现金额" align="center" prop="deptWithdrawAudited" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import {
    deptTodayHistory,
    deptCapitalHistory as fetchList
} from "@/api/profit/station";
import { mapGetters } from "vuex";
import { dateFortmat } from "@/utils";

import BarChart from "@/views/profit/dept/components/BarChart";

const barChantName = [
    "商家充值",
    "商家提现",
    "银行卡充值",
    "买手提现",
    "推广员提现",
    "分站提现"
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
                deptTotalBalance: 0
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
            deptTodayHistory(this.queryParams)
                .then(({ data }) => {
                    this.data = data;
                    const list = [
                        data.rechargeAmountApply,
                        data.merWithdrawApply,
                        null,
                        data.buyerWithdrawApply,
                        data.exWithdrawApply,
                        data.deptWithdrawApply
                    ];
                    const list1 = [
                        data.rechargeAmountAudited,
                        data.merWithdrawAudited,
                        data.bankRechargeAmount,
                        data.buyerWithdrawAudited,
                        data.exWithdrawAudited,
                        data.deptWithdrawAudited
                    ];
                    var target = this.$refs.barChart;
                    const animationDuration = 500;
                    target.destroy();
                    const series = [
                        {
                            name: "提交申请",
                            type: "bar",
                            stack: "vistors",
                            barWidth: "60%",
                            data: list,
                            animationDuration,
                            label: {
                                show: true,
                                position: "inside"
                            }
                        },
                        {
                            name: "已完成",
                            type: "bar",
                            stack: "vistors",
                            barWidth: "60%",
                            data: list1,
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
        margin-bottom: 6px;
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