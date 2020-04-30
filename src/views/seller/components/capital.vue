<template>
    <el-row>
        <el-form ref="queryForm" :inline="true" label-width="120px" class="xl-query">

            <el-form-item>
                <el-date-picker :editable="false" default-time="00:00:00" v-model="queryParams.startingTime" align="right" type="datetime" placeholder="搜索起始日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" default-time="23:59:59" v-model="queryParams.endTime" align="right" type="datetime" placeholder="搜索结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="任务编号" v-model="queryParams.taskId" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="订单编号" v-model="queryParams.orderId" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" border>
            <el-table-column prop="transactionTime" label="交易时间" />
            <el-table-column prop="taskId" label="任务编号" />
            <el-table-column prop="orderId" label="订单编号" />
            <el-table-column prop="transactionType" label="佣金类型" />
            <el-table-column prop="originalMoney" label="原余额" />
            <el-table-column prop="transactionMoney" label="交易金额">
                <template slot-scope="{row}">
                    {{row.transactionInOut==1?'+':'-'}}{{row.transactionMoney}}
                </template>
            </el-table-column>
            <el-table-column prop="newMoney" label="现余额" />
            <el-table-column prop="note" label="备注" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-row>
</template>

<script>
import { fetchCapital as fetchInfo } from "@/api/seller";
import { mapState, mapGetters } from "vuex";
import { dateFortmat } from "@/utils";
export default {
    data() {
        return {
            tableData: null,
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                merId: "",
                endTime: "",
                startingTime: "",
                orderId: "",
                taskId: ""
            },
            total: 0
        };
    },

    computed: {
        ...mapState(["common"]),
        ...mapGetters({ sellerKV: "status/mallOrderKV" })
    },

    methods: {
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        filterSeller(row) {
            return this.sellerKV[row.orderStatus];
        },
        getList() {
            this.queryParams.merId = this.common.merId;
            this.filterTime();
            fetchInfo(this.queryParams).then(({ data }) => {
                this.tableData = data.list;
                this.total = data.total;
            });
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
        }
    }
};
</script>

<style lang="scss" scoped>
.el-row {
    font-size: 14px;
}
.xl-main-pic {
    img {
        width: 100%;
        height: 100%;
    }
}
.xl-mian-header-top {
    & > .el-col {
        background: #d8dde5;
        color: #040404;
        padding: 10px 20px;
    }
}
.xl-main-center {
    text-align: center;
}
.xl-mian-header {
    & > .el-col {
        margin-top: 60px;
        text-align: center;
    }
    .xl-main-first {
        margin-top: 0;
        text-align: left;
    }
}
.xl-main-link {
    overflow: hidden;
    height: 100%;
    white-space: nowrap;
    word-break: break-word;
}
.xl-main-text {
    .el-row {
        margin: 5% 10px;
    }
}
span {
    color: #0098e1;
}
.xl-task-row {
    padding-left: 20px;
    height: 50px;
    line-height: 50px;
}
.xl-img-row {
    margin: 20px;
}
.xl-no-wrap {
    overflow: hidden;
    white-space: nowrap;
    word-break: break-word;
}
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
</style>