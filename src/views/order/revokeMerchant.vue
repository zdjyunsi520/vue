<template>
    <div class="app-container">
        <el-table v-loading="loading" :data="postList" border @selection-change="handleSelection">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="订单类型" align="center" prop="taskTypeName" />
            <el-table-column label="归属网站" align="center" prop="deptName" />
            <el-table-column label="任务编号" align="center" prop="orderNo" />
            <el-table-column label="订单编号" align="center" prop="taskNo" />
            <el-table-column label="商家ID" align="center" prop="merId" />
            <el-table-column label="接单时间" align="center" prop="receiptTime" width="95px" />

            <el-table-column label="买手ID" align="center" prop="buyerId" />
            <el-table-column label="买手姓名" align="center" prop="buyerRealName" />
            <el-table-column label="接单账号" align="center" prop="buyerAccount" />

            <el-table-column label="垫付资金" align="center" prop="advanceDeposit" />
            <!-- <el-table-column label="淘宝单号" align="center" prop="mallOrderNo" /> -->

            <el-table-column label="商品名称" align="center" prop="taskGoodsInfoList.goodsName">
                <template slot-scope="{ row }">
                    <el-button size="mini" type="danger" @click="$event => handleClipboard.call(this, row.taskGoodsInfoList[0].goodsUrl, $event)">复制链接</el-button>
                    <span class="link-type">{{ row.taskGoodsInfoList[0].goodsName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="撤销时间" align="center" prop="cancelTime" width="95px" />
            <el-table-column label="撤销原因" align="center" prop="cancelReason" />
        </el-table>
        <refunds ref="refunds" @getList="getList"></refunds>
        <revoke ref="revoke" @getList="getList"></revoke>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList } from "@/api/order/revokeMerchant";
import { dateFortmat } from "@/utils";
import refunds from "./components/refunds";
import revoke from "./components/revoke";
import handleClipboard from "@/utils/clipboard";
export default {
    name: "商家/平台撤销",
    components: { refunds, revoke },
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
                buyerAccount: "",
                buyerRealName: "",
                cancelDateBegin: "",
                cancelDateEnd: "",
                deptId: "",
                merId: "",
                orderNo: "",
                taskNo: "",
                taskTypeId: ""
            }
        };
    },
    created() {
        this.getList();
    },
    computed: {
        ...mapGetters({
            deptType: "status/deptType",
            orderType: "status/orderType",
            mallOrderType: "status/mallOrderType",
            mallOrderKV: "status/mallOrderKV",
            platformType: "status/platformType"
        }),
        orderList() {
            return this.orderType
                ? this.orderType.filter(v => v.fId > 0)
                : null;
        },
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
        handleClipboard,
        handleOpenUrl(url) {},
        handleSelection(list) {
            this.dataList = list
                .filter(v => v.orderStatus != 8)
                .map(v => v.orderNo);
        },
        filterEmptyParcel(row) {
            return row.isBuyEmptyParcel ? "有" : "无";
        },
        filterDept(row) {
            return this.deptKV[row.deptId];
        },
        filterMallOrder(row) {
            return this.mallOrderKV[row.orderStatus];
        },
        filterMoney(id) {
            return this.moneyKV[id];
        },
        filterTime() {
            if (
                this.queryParams.cancelDateBegin &&
                this.queryParams.cancelDateBegin.length != 10
            ) {
                this.queryParams.cancelDateBegin = dateFortmat(
                    this.queryParams.cancelDateBegin,
                    "yyyy-MM-dd"
                );
            }
            if (
                this.queryParams.cancelDateEnd &&
                this.queryParams.cancelDateEnd.length != 10
            ) {
                this.queryParams.cancelDateEnd = dateFortmat(
                    this.queryParams.cancelDateEnd,
                    "yyyy-MM-dd"
                );
            }
        },
        handleRevoke(data) {
            var list = [];
            if (data) {
                list = [data];
            } else {
                if (this.dataList.length == 0) {
                    this.$message.error("请先选择需要撤销的订单");
                    return;
                }
                list = this.dataList;
            }
            this.$refs.revoke.form.orderNos = list;
            this.$refs.revoke.dialogVisible = true;
        },

        handleOpen(refName, index) {
            var target = this.$refs[refName];
            const f = this.postList[index];
            target.buyerActualPayment = f.buyerActualPayment || 0;
            target.rebateAmount = f.rebateAmount || 0;
            target.buyerSuppliedMarginAmout = f.buyerSuppliedMarginAmout || 0;
            target.merchantSuppliedMarginAmout =
                f.merchantSuppliedMarginAmout || 0;
            target.form.orderNo = f.orderNo;
            const principal =
                target.buyerActualPayment -
                target.rebateAmount -
                target.buyerSuppliedMarginAmout;
            target.form.principal = principal < 0 ? "" : principal;
            target.dialogVisible = true;
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
.link-type {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>
