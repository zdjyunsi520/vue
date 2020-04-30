a<template>
    <div class="app-container">
        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true" label-width="120px">

            <el-form-item>
                <el-date-picker :editable="false" placeholder="收益开始时间" v-model="queryParams.startTime" default-time="00:00:00" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="收益结束时间" v-model="queryParams.endTime" default-time="23:59:59" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="推广员id" v-model="queryParams.exId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="订单编号" v-model="queryParams.orderNo" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
            <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['management:Extension:income:export']" type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table border v-loading="loading" :data="postList">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="推广员ID" align="center" width="110px" prop="exId" />
            <el-table-column label="收益编号" align="center" prop="detailNumber" />
            <el-table-column label="任务编号" align="center" prop="taskNo" />
            <el-table-column label="订单编号" align="center" prop="orderId" />
            <el-table-column label="商家ID" align="center" prop="merId" />
            <el-table-column label="商家账号" align="center" prop="merAccount" />
            <el-table-column label="账户余额" align="center" prop="balance" />
            <el-table-column label="收益金额" align="center" prop="taskMoney" />
            <el-table-column label="收益时间" align="center" prop="incomeTime" />
            <el-table-column label="备注" align="center" prop="note" />
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import { fetchList, exportExcel } from "@/api/record/promotor";
import { mapGetters } from "vuex";
import { dateFortmat } from "@/utils";

export default {
    name: "推广员收益明细",
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
                orderId: "",
                exId: "",
                startTime: "",
                endTime: ""
            }
        };
    },
    computed: {
        ...mapGetters({
            moneyType: "status/moneyType"
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
        filterTime() {
            if (
                this.queryParams.startTime &&
                this.queryParams.startTime.length != 19
            ) {
                this.queryParams.startTime = dateFortmat(
                    this.queryParams.startTime,
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
</style>