<template>
    <el-row>
        <el-form ref="queryForm" :inline="true">
            <el-form-item>
                <el-select v-model="queryParams.source">
                    <el-option label="资金来源" value />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in buyerRecordSourceType" />
                </el-select>
            </el-form-item>
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
        <el-table :data="tableData" border :row-class-name="rowClassName">
            <el-table-column prop="transactionTaskDictValue" label="任务类型" />
            <el-table-column prop="orderNo" label="订单编号" />
            <el-table-column prop="taskNo" label="任务编号" />
            <el-table-column prop="transactionType" label="交易类型" :formatter="filterSeller" />
            <el-table-column prop="originalMoney" label="原余额" />
            <el-table-column prop="transactionMoney" label="金额" />
            <el-table-column prop="newMoney" label="现余额" />
            <el-table-column label="资金来源" align="center" prop="source" :formatter="filterSource" />
            <el-table-column prop="transactionTime" label="交易时间" />
            <el-table-column prop="transactionIp" label="交易地址" />
            <el-table-column prop="note" label="备注" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </el-row>
</template>

<script>
import { buyerRecharge as fetchInfo } from "@/api/buyer/info";
import { mapState, mapGetters } from "vuex";
import { dateFortmat } from "@/utils";
export default {
    data() {
        return {
            tableData: null,
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                buyerId: "",
                endTime: "",
                startingTime: "",
                orderId: "",
                taskId: "",
                source: ""
            },
            total: 0
        };
    },

    computed: {
        ...mapState(["common"]),
        ...mapGetters({
            sellerKV: "status/moneyKV",
            buyerRecordSourceType: "status/buyerRecordSourceType",
            buyerRecordSourceKV: "status/buyerRecordSourceKV"
        })
    },

    methods: {
        filterSeller(row) {
            return this.sellerKV[row.transactionType];
        },
        getList() {
            this.queryParams.buyerId = this.common.buyerId;
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
        },
        filterSource(row) {
            return this.buyerRecordSourceKV[row.source];
        },
        rowClassName({ row }) {
            if (row.source == 2) return "row-red";
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
/deep/.row-red {
    color: #f00;
}
</style>