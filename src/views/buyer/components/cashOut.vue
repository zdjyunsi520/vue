<template>
    <div>
        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true">

            <el-form-item>
                <el-date-picker :editable="false" placeholder="起始提现日期" v-model="queryParams.withdrawStartTime" default-time="00:00:00" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="终止提现日期" v-model="queryParams.withdrawEndTime" default-time="00:00:00" align="right" type="datetime"></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>

        </el-form>
        <el-table v-loading="listLoading" :data="postList" border>

            <el-table-column label="提现日期" width="95px" align="center" prop="withdrawTime" />
            <el-table-column label="提现方式" width="130px" align="center" prop="withdrawType">
                <template slot-scope="{row}">
                    <el-row>{{row.bankAccountName}}</el-row>
                    <el-row>{{row.bankName}}</el-row>
                    <el-row>{{row.bankCardNumber}}</el-row>
                </template>
            </el-table-column>
            <el-table-column label="提现金额" align="center" prop="withdrawMoney">
                <template slot-scope="{row}">
                    <!-- <el-row>{{filterMoney(row.withdrawType)}}</el-row> -->
                    <el-row>￥{{row.withdrawMoney}}</el-row>
                </template>
            </el-table-column>
            <el-table-column label="操作员/操作时间" align="center" prop="status">
                <template slot-scope="{row}">
                    <el-row>{{row.auditName}}</el-row>
                    <el-row>{{row.auditTime}}</el-row>
                </template>
            </el-table-column>
            <el-table-column label="操作员备注" align="center" prop="note" success />
            <el-table-column label="状态" align="center" prop="auditState" :formatter="filterRecharge" />

        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { fetchList } from "@/api/cashOut/buyer";
import { dateFortmat } from "@/utils";

export default {
    data() {
        return {
            // 遮罩层
            loading: false,
            listLoading: false,
            deptList: null,
            // 总条数
            total: 0,
            // 岗位表格数据
            postList: [],
            dataList: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                buyerStartId: "",
                buyerEndId: "",
                auditState: "",
                withdrawType: "",
                withdrawStartTime: "",
                withdrawEndTime: "",
                auditTime: "",
                auditName: "",
                buyerId: "",
                buyerAccount: "",
                deptId: ""
            }
        };
    },

    computed: {
        ...mapGetters({
            //  deptType: 'status/deptType',
            simpleRechargeType: "status/simpleRechargeType",
            moneyType: "status/moneyType",
            simpleRechargeKV: "status/simpleRechargeKV"
        }),
        ...mapState(["common"]),

        rechargeKV() {
            return this.rechargeType.reduce((l, v) => {
                l[v.key] = v.value;
                return l;
            }, {});
        },
        moneyKV() {
            return this.moneyType.reduce((l, v) => {
                l[v.key] = v.value;
                return l;
            }, {});
        }
    },

    methods: {
        filterRecharge(row) {
            return this.simpleRechargeKV[row.auditState];
        },
        filterMoney(id) {
            return this.moneyKV[id];
        },
        filterTime() {
            if (
                this.queryParams.withdrawStartTime &&
                this.queryParams.withdrawStartTime.length != 19
            ) {
                this.queryParams.withdrawStartTime = dateFortmat(
                    this.queryParams.withdrawStartTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
            if (
                this.queryParams.withdrawEndTime &&
                this.queryParams.withdrawEndTime.length != 19
            ) {
                this.queryParams.withdrawEndTime = dateFortmat(
                    this.queryParams.withdrawEndTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
        },

        /** 查询岗位列表 */
        getList() {
            this.queryParams.buyerId = this.common.buyerId;
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
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
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