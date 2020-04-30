<template>
    <div class="app-container">
        <el-table v-loading="loading" :data="postList" border>
            <!-- <el-table-column type="selection" width="55" align="center"  />  :formatter="" -->
            <el-table-column label="所属站点" align="center" prop="deptName" />
            <el-table-column label="分站总利润" align="center" prop="deptProfit" />
            <el-table-column label="分站垫付单总利润" align="center" prop="deptProfitAdvance" />
            <el-table-column label="分站浏览单总利润" align="center" prop="deptProfitBrowse" />
            <el-table-column label="分站空包总利润" align="center" prop="deptProfitEmpty" />
            <el-table-column label="分站信封总利润" align="center" prop="deptProfitEnvelop" />
            <el-table-column label="分站照妖镜总利润" align="center" prop="deptProfitMirror" />
            <el-table-column label="分站打标签总利润" align="center" prop="deptProfitLabel" />
            <el-table-column label="分站可用的利润" align="center" prop="deptUsableProfit" />
            <el-table-column label="礼品包次数" align="center" prop="giftTimes" />
            <el-table-column label="空包购买次数" align="center" prop="emptyTimes" />
            <el-table-column label="信封购买次数" align="center" prop="envelopTimes" />
            <el-table-column label="照妖镜使用次数" align="center" prop="mirrorTimes" />
            <el-table-column label="打标签次数" align="center" prop="labelTimes" />
            <el-table-column label="总订单量" align="center" prop="deptTotalOrder" />
            <el-table-column label="垫付单总单量" align="center" prop="deptTotalOrderAdvance" />
            <el-table-column label="浏览单总单量" align="center" prop="deptTotalOrderBrowse" />
            <el-table-column label="总任务数" align="center" prop="deptTotalTaskAdvance" />
            <el-table-column label="总浏览任务数" align="center" prop="deptTotalTaskBrowse" />
            <el-table-column label="总已完成订单量" align="center" prop="completeOrder" />
            <el-table-column label="垫付单已完成订单数" align="center" prop="completeOrderAdvance" />
            <el-table-column label="浏览单已完成订单数" align="center" prop="completeOrderBrowse" />
            <el-table-column label="浏览单已完成订单数" align="center" prop="completeOrderBrowse" />
            <el-table-column label="商家总本金" align="center" prop="merTotalPrincipal" />
            <el-table-column label="商家总佣金" align="center" prop="merTotalBrokerage" />
            <el-table-column label="商家提现中" align="center" prop="merWithdraw" />
            <el-table-column label="推广员总余额" align="center" prop="extensionTotal" />
            <el-table-column label="推广员提现中" align="center" prop="extensionWithdraw" />
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList } from "@/api/profit/station";
import { dateFortmat } from "@/utils";
export default {
    components: {},
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
    created() {
        this.getList();
    },
    computed: {
        ...mapGetters({
            deptType: "status/deptType",
            simpleRechargeType: "status/simpleRechargeType",
            moneyType: "status/moneyType",
            simpleRechargeKV: "status/simpleRechargeKV"
        }),
        deptKV() {
            return this.deptType.reduce((l, v) => {
                l[v.deptId] = v.deptName;
                return l;
            }, {});
        },
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
    watch: {},
    methods: {
        filterDept(row) {
            return this.deptKV[row.deptId];
        },
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
            if (
                this.queryParams.auditTime &&
                this.queryParams.auditTime.length != 10
            ) {
                this.queryParams.auditTime = dateFortmat(
                    this.queryParams.auditTime,
                    "yyyy-MM-dd"
                );
            }
        },
        handleOpen(refName, index, sts) {
            var target = this.$refs[refName];
            const f = this.postList[index];
            if (sts == undefined) {
                // Object.assign(target.form, f);
                target.bindAccountId = f.bindAccountId;
                target.platform = f.bindAccountType;
                target.getInfo();
            } else {
                target.controlIndex = sts;
                target.form.note = "";
                target.form.id = f.id;
                target.bindAccountName = f.buyerId;
                target.review = review;
            }
            target.dialogVisible = true;
        },

        handlePass(index) {
            this.loading = true;
            var data = this.postList[index];
            var postData = { id: data.id, auditState: 2, note: "" };
            this.$confirm(
                "确定要进行买手ID " + data.buyerId + " 审核通过 操作吗？"
            )
                .then(() => review(postData))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .catch(() => (this.loading = false))
                .finally(() => (this.loading = false));
        },
        handlePass1(index) {
            this.loading = true;
            var data = this.postList[index];
            var postData = { id: data.id, auditState: 3, note: "" };
            this.$confirm("确定要进行买手ID " + data.buyerId + " 兑现 操作吗？")
                .then(() => review(postData))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .catch(() => (this.loading = false))
                .finally(() => (this.loading = false));
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
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
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
</style>
