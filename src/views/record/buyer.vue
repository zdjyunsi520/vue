a<template>
    <div class="app-container">
        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
            <el-form-item>
                <el-select v-model="queryParams.transactionType">
                    <el-option label="佣金类型" value />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in moneyType" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.source">
                    <el-option label="资金来源" value />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in buyerRecordSourceType" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-date-picker :editable="false" placeholder="交易开始时间" v-model="queryParams.startingTime" default-time="00:00:00" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="交易结束时间" v-model="queryParams.endTime" default-time="23:59:59" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="任务编号" v-model="queryParams.taskNo" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="订单编号" v-model="queryParams.orderNo" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="手机号码" v-model="queryParams.phone" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="交易最小金额" v-model="queryParams.startingNumber" clearable size="small" />
            </el-form-item>

            <el-form-item prop="postCode">
                <el-input placeholder="交易最大金额" v-model="queryParams.endNumber" clearable size="small" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
            <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:buyer:fund:export']" type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table border v-loading="loading" :data="postList" :row-class-name="rowClassName">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="手机号码" align="center" width="110px" prop="buyerAccount" />
            <el-table-column label="佣金类型" align="center" width="80px" prop="transactionType" :formatter="filterMoney" />
            <el-table-column label="原余额" align="center" prop="originalMoney" />
            <el-table-column label="交易金额" align="center" prop="transactionMoney" :formatter="filterTransaction" />
            <el-table-column label="现余额" align="center" prop="newMoney" />
            <el-table-column label="资金来源" align="center" prop="source" :formatter="filterSource" />
            <el-table-column label="交易时间" align="center" width="95px" prop="transactionTime" />
            <el-table-column label="交易地址" align="center" prop="transactionIp" />
            <el-table-column label="订单编号" align="center" prop="orderNo" />
            <el-table-column label="说明" align="center" prop="note" />
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import { fetchList, exportExcel } from "@/api/record/buyer";
import { mapGetters } from "vuex";
import { dateFortmat } from "@/utils";

export default {
    name: "买手交易记录",
    components: {},
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
                phone: "",
                transactionType: "",
                startingTime: "",
                endTime: "",
                startingNumber: "",
                endNumber: "",
                orderNo: "",
                taskNo: "",
                source: ""
            }
        };
    },
    computed: {
        ...mapGetters({
            moneyType: "status/moneyType",
            buyerRecordSourceType: "status/buyerRecordSourceType",
            buyerRecordSourceKV: "status/buyerRecordSourceKV"
        }),
        moneyTypeKV() {
            return this.moneyType.reduce((l, v) => {
                l[v.key] = v.value;
                return l;
            }, {});
        }
    },
    created() {
        this.getList();
    },
    methods: {
        filterMoney(row) {
            return this.moneyTypeKV[row.transactionType];
        },
        filterTransaction(row) {
            return (
                (row.transactionInOut == "1" ? "+" : "-") + row.transactionMoney
            );
        },
        filterSource(row) {
            return this.buyerRecordSourceKV[row.source];
        },
        filterTime() {
            if (
                this.queryParams.startingTime &&
                this.queryParams.startingTime.length != 19
            ) {
                this.queryParams.startingTime = dateFortmat(
                    this.queryParams.startingTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }

            if (
                this.queryParams.endTime &&
                this.queryParams.endTime.length != 19
            ) {
                this.queryParams.endTime = dateFortmat(
                    this.queryParams.endTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
        },
        rowClassName({ row }) {
            if (row.source == 2) return "row-red";
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

        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出数据?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.loading = true;
                exportExcel(this.queryParams)
                    .then(r => {
                        this.download(r.data.data);
                        this.$message.success(r.data.msg);
                    })
                    .finally(e => {
                        this.loading = false;
                    });
            });
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
/deep/.row-red {
    color: #f00;
}
</style>