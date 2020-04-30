<template>
    <div class="app-container">
        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
            <el-form-item prop="status">
                <el-select v-model="queryParams.deptId" clearable size="small">
                    <el-option label="所属站点" value="" />
                    <el-option :key="item.deptName" :label="item.deptName" :value="item.deptId" v-for="item in deptType" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item>
        <el-select v-model="queryParams.mallType">
          <el-option label="订单平台" value="" />
          <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in simpleRechargeType" />
        </el-select>
      </el-form-item> -->
            <el-form-item>
                <el-select v-model="queryParams.taskTypeId">
                    <el-option label="任务类型" value="" />
                    <el-option :key="item.taskName" :label="item.taskName" :value="item.id" v-for="item in orderList" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.mallType">
                    <el-option label="电商类型" value="" />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in platformType" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-select v-model="queryParams.taskStatus">
                    <el-option label="任务状态" value="" />
                    <el-option :label="item.value" :value="item.key" v-for="item in taskType" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-select v-model="queryParams.needSuperLabel">
                    <el-option label="是否打标" value="" />
                    <el-option label="是" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="发布时间开始" v-model="queryParams.releaseTimeBegin" default-time="00:00:00" align="right" type="datetime"></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-date-picker :editable="false" placeholder="发布时间结束" v-model="queryParams.releaseTimeEnd" default-time="23:59:59" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="任务编号" v-model="queryParams.taskNo" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="商家ID" v-model="queryParams.merId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="商家账号" v-model="queryParams.merAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="店铺名称" v-model="queryParams.storeName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:merchant:tasks:export']" type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="postList" border @selection-change="handleSelection">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="任务类型" align="center" prop="taskTypeName" />
            <el-table-column label="所属站点" align="center" prop="deptName" />
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
            <el-table-column label="店铺名称" align="center" prop="storeName" />
            <el-table-column label="加赏佣金" align="center" prop="appreciationCommission" />
            <el-table-column label="佣金合计" align="center" prop="totalCommission" />
            <el-table-column label="本金合计" align="center" prop="totalPrincipal" />
            <el-table-column label="总花费" align="center" prop="totalCost" />
            <el-table-column label="总单数" align="center" prop="totalOrderQuantity" />
            <el-table-column label="购买数量" align="center" prop="goodsTotalQuantity" />
            <el-table-column label="成交价" align="center" prop="finalPrice" />
            <el-table-column label="任务状态" align="center" prop="taskStatus" :formatter="filterMallOrder" />
            <el-table-column label="商品名称" align="center" prop="taskGoodsInfoList.goodsName">
                <template slot-scope="{ row }">
                    <el-button size="mini" type="danger" @click="$event => handleClipboard.call(this, row.taskGoodsInfoList[0].goodsUrl, $event)">复制链接</el-button>
                    {{ row.taskGoodsInfoList[0].goodsName }}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="95px" />
            <el-table-column label="操作" align="center">
                <template slot-scope="{ row, $index }">

                    <el-button type="warning" :loading="loading" size="mini" @click="handleRevoke(row.taskNo)">撤单</el-button>
                    <!-- <el-button
            type="primary"
            :loading="loading"
            size="mini"
            @click="handleOpen('refunds', $index, 0)"
            >撤追评</el-button
          > -->
                </template>
            </el-table-column>
        </el-table>
        <!-- <refunds ref="refunds" @getList="getList"></refunds> -->
        <!-- <revoke ref="revoke" @getList="getList"></revoke> -->
        <taskDetail ref="taskDetail"></taskDetail>
        <merDetail ref="merDetail"></merDetail>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { fetchList, exportExcel } from "@/api/task";
import { dateFortmat } from "@/utils";
import taskDetail from "./detail";
import merDetail from "../seller/detail";
import handleClipboard from "@/utils/clipboard";
// import refunds from "./components/refunds";
//import revoke from "./components/revoke";
export default {
    name: "任务列表",
    components: {
        taskDetail,
        merDetail
        //refunds, revoke
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
                deptId: "",
                mallType: "",
                needSuperLabel: "",
                releaseTimeBegin: "",
                releaseTimeEnd: "",
                taskNo: "",
                taskStatus: "",
                taskTypeId: "",
                merAccount: "",
                merId: "",
                storeId: "",
                storeName: ""
            }
        };
    },
    created() {
        this.getList();
    },
    computed: {
        ...mapState(["common"]),
        ...mapGetters({
            deptType: "status/deptType",
            orderType: "status/orderType",
            mallOrderType: "status/mallOrderType",
            mallOrderKV: "status/orderKV",
            platformType: "status/platformType",
            taskType: "status/taskType",
            taskKV: "status/taskKV"
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
        handleOpenMerDetail(id) {
            let target = this.$refs.merDetail;
            this.common.merId = id;
            target.visible = true;
            target.initOne({ index: "0" });
        },
        handleOpenTask(row) {
            let target = this.$refs.taskDetail;
            this.common.taskNo = row.taskNo;
            this.common.merId = row.merId;
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
            return this.taskKV[row.taskStatus];
        },
        filterMoney(id) {
            return this.moneyKV[id];
        },
        filterTime() {
            if (
                this.queryParams.releaseTimeBegin &&
                this.queryParams.releaseTimeBegin.length != 19
            ) {
                this.queryParams.releaseTimeBegin = dateFortmat(
                    this.queryParams.releaseTimeBegin,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
            if (
                this.queryParams.releaseTimeEnd &&
                this.queryParams.releaseTimeEnd.length != 19
            ) {
                this.queryParams.releaseTimeEnd = dateFortmat(
                    this.queryParams.releaseTimeEnd,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
        },
        handleRevoke(taskNo) {
            this.$router.push({ path: "/order/order", query: { taskNo } });
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
