<template>
    <div class="app-container">
        <el-form class="xl-query xl-el-select" :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
            <el-form-item prop="status">
                <el-select v-model="queryParams.deptId" clearable size="small">
                    <el-option label="所属站点" value />
                    <el-option :key="item.deptName" :label="item.deptName" :value="item.deptId" v-for="item in deptType" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item>
        <el-select v-model="queryParams.mallType">
          <el-option label="订单平台" value="" />
          <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in simpleRechargeType" />
        </el-select>
            </el-form-item>-->
            <el-form-item>
                <el-select v-model="queryParams.taskTypeId">
                    <el-option label="任务类型" value />
                    <el-option :key="item.taskName" :label="item.taskName" :value="item.id" v-for="item in orderList" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.mallType">
                    <el-option label="电商类型" value />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in platformType" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.orderStatus">
                    <el-option label="订单状态" value />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in mallOrderType" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.hasSpreadAmount">
                    <el-option label="是否有差价" value />
                    <el-option label="有差价" :value="1" />
                    <el-option label="没有差价" :value="2" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.appendedPraiseStatus">
                    <el-option label="追评状态" value />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in addEvaluationType" />
                </el-select>
            </el-form-item>

            <el-form-item prop="postCode">
                <el-input placeholder="电商订单" v-model="queryParams.mallOrderNo" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="订单编号" v-model="queryParams.orderNo" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="任务编号" v-model="queryParams.taskNo" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="商家ID" v-model="queryParams.merId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="店铺ID" v-model="queryParams.storeId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="买手ID" v-model="queryParams.buyerId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="买手账号" v-model="queryParams.buyerAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item>
                <el-date-picker :editable="false" placeholder="创建时间开始" v-model="queryParams.createTimeBegin" default-time="00:00:00" align="right" type="datetime"></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-date-picker :editable="false" placeholder="创建时间结束" v-model="queryParams.createTimeEnd" default-time="23:59:59" align="right" type="datetime"></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:orders:export']" type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" icon="el-icon-search" size="mini" @click="handleRevoke(null)" v-hasPermi="['system:orders:cancel']">批量撤销</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" icon="el-icon-search" size="mini" @click="handleComplete(null)" v-hasPermi="['system:orders:finish']">批量强制完成</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="postList" border @selection-change="handleSelection">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="任务类型" align="center" prop="taskTypeName" />
            <el-table-column label="所属站点" align="center" prop="deptName" />
            <el-table-column label="订单编号" align="center" prop="orderNo" width="95px">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleOpenOrder(row)">{{row.orderNo}}</span>
                </template>
            </el-table-column>
            <el-table-column label="任务编号" align="center" prop="taskNo" width="100px">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleOpenTask(row)">{{row.taskNo}}</span>
                </template>
            </el-table-column>
            <el-table-column width="60px" label="商家ID" align="center" prop="merId">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleOpenMerDetail(row.merId)">{{row.merId}}</span>
                </template>
            </el-table-column>
            <el-table-column label="接单时间" align="center" prop="receiptTime" width="95px" />

            <el-table-column label="买手ID" align="center" prop="buyerId">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleOpenDetail(row.buyerId)">{{row.buyerId}}</span>
                </template>
            </el-table-column>
            <el-table-column label="买手姓名" align="center" prop="buyerRealName" />
            <el-table-column label="接单账号" align="center" prop="buyerAccount" />
            <el-table-column label="旺旺号" align="center" prop="buyerTaobaoChatAccount" />
            <el-table-column label="买手付款" align="center" prop="buyerActualPayment" />
            <el-table-column label="商家返款" align="center" prop="rebateAmount" />
            <el-table-column label="垫付资金" align="center" prop="advanceDeposit" />
            <el-table-column label="淘宝单号" align="center" prop="mallOrderNo" />
            <el-table-column label="订单状态" align="center" prop="orderStatus" :formatter="filterMallOrder" />
            <el-table-column label="空包服务" align="center" prop="isBuyEmptyParcel" :formatter="filterEmptyParcel" />
            <el-table-column label="商品名称" align="center" prop="taskGoodsInfoList.goodsName">
                <template slot-scope="{ row }">
                    <el-button size="mini" type="danger" @click="$event => handleClipboard.call(this, row.taskGoodsInfoList[0].goodsUrl, $event)">复制链接</el-button>
                    <span class="link-type"> {{ row.taskGoodsInfoList[0].goodsName }}</span>
                </template>
            </el-table-column>
            <el-table-column width="80px" label="操作" align="center">
                <template slot-scope="{ row, $index }">
                    <el-row>
                        <el-button type="danger" :loading="loading" size="mini" v-hasPermi="['system:order:refund']" @click="handleOpen('refunds', $index, 0)">退钱</el-button>
                    </el-row>
                    <el-row>
                        <el-button type="primary" :loading="loading" size="mini" :disabled="row.orderStatus == 8" @click="handleRevoke(row.orderNo)" v-hasPermi="['system:orders:cancel']">撤单</el-button>
                    </el-row>
                    <el-row>
                        <el-button type="warning" :loading="loading" size="mini" :disabled="row.orderStatus<3" @click="handleEscape(row)" v-hasPermi="['system:escape_single:add']">逃单</el-button>
                    </el-row>
                    <!-- <el-button
            type="primary"
            :loading="loading"
            size="mini"
            @click="handleOpen('refunds', $index, 0)"
            >撤追评</el-button
                    >-->
                </template>
            </el-table-column>
        </el-table>
        <refunds ref="refunds" @getList="getList"></refunds>
        <revoke ref="revoke" @getList="getList"></revoke>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <orderDetail ref="orderDetail"></orderDetail>
        <taskDetail ref="taskDetail"></taskDetail>
        <detail ref="detail"></detail>
        <merDetail ref="merDetail"></merDetail>
        <escape ref="escape"></escape>
        <complete ref="complete" @getList="getList"></complete>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { fetchList, exportExcel } from "@/api/order/order";
import { dateFortmat } from "@/utils";
import refunds from "./components/refunds";
import revoke from "./components/revoke";
import orderDetail from "./detail";
import taskDetail from "../task/detail";
import detail from "../buyer/detail";
import merDetail from "../seller/detail";
import escape from "./components/escape";
import complete from "./components/complete";
import handleClipboard from "@/utils/clipboard";
export default {
    name: "订单明细",
    components: {
        refunds,
        revoke,
        orderDetail,
        taskDetail,
        detail,
        merDetail,
        escape,
        complete
    },
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
                buyerId: "",
                buyerEndId: "",
                createTimeBegin: "",
                createTimeEnd: "",
                deptId: "",
                mallOrderNo: "",
                mallType: "",
                merId: "",
                orderNo: "",
                buyerId: "",
                orderStatus: "",
                taskNo: "",
                taskTypeId: "",
                buyerAccount: "",
                hasSpreadAmount: "",
                storeId: "",
                appendedPraiseStatus: ""
            }
        };
    },
    created() {
        this.getList();
    },
    activated() {
        if (this.$route.query.taskNo) {
            this.queryParams.taskNo = this.$route.query.taskNo;
            this.getList();
        }
    },
    computed: {
        ...mapGetters({
            deptType: "status/deptType",
            orderType: "status/orderType",
            mallOrderType: "status/mallOrderType",
            mallOrderKV: "status/mallOrderKV",
            platformType: "status/platformType",
            addEvaluationType: "status/addEvaluationType"
        }),
        ...mapState(["common"]),
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
        handleOpenMerDetail(id) {
            let target = this.$refs.merDetail;
            this.common.merId = id;
            target.visible = true;
            target.initOne({ index: "0" });
        },
        handleOpenDetail(id) {
            let target = this.$refs.detail;
            this.common.buyerId = id;
            target.visible = true;
            target.initOne({ index: "0" });
        },
        handleOpenOrder(row) {
            let target = this.$refs.orderDetail;
            this.common.merId = row.merId;
            this.common.taskNo = row.taskNo;
            this.common.orderNo = row.orderNo;
            target.visible = true;
            target.initOne({ index: "0" });
        },
        handleOpenTask(row) {
            let target = this.$refs.taskDetail;
            this.common.merId = row.merId;
            this.common.taskNo = row.taskNo;
            target.visible = true;
            target.initOne({ index: "0" });
        },
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
                this.queryParams.createTimeBegin &&
                this.queryParams.createTimeBegin.length != 19
            ) {
                this.queryParams.createTimeBegin = dateFortmat(
                    this.queryParams.createTimeBegin,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
            if (
                this.queryParams.createTimeEnd &&
                this.queryParams.createTimeEnd.length != 19
            ) {
                this.queryParams.createTimeEnd = dateFortmat(
                    this.queryParams.createTimeEnd,
                    "yyyy-MM-dd hh:mm:ss"
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
        handleComplete(data) {
            var list = [];
            if (data) {
                list = [data];
            } else {
                console.log(this.dataList);
                if (this.dataList.length == 0) {
                    this.$message.error("请先选择需要强制完成的订单");
                    return;
                }
                list = this.dataList;
            }
            this.$refs.complete.form.orderNos = list;
            this.$refs.complete.dialogVisible = true;
        },
        handleEscape(row) {
            this.$refs.escape.form = row;
            this.$refs.escape.dialogVisible = true;
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
            target.radio = 0;
            target.form.reason = "";
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
    .el-button {
        width: 100%;
        margin-top: 4px;
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

<style lang="scss">
.xl-el-select {
    .el-select-dropdown {
        .el-scrollbar__wrap {
            border: 1px solid #f00;
            max-height: unset;
        }
    }
}
</style>