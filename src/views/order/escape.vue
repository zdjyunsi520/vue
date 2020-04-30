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
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryParams.taskTypeId">
          <el-option label="任务类型" value="" />
          <el-option
            :key="item.taskName"
            :label="item.taskName"
            :value="item.id"
            v-for="item in orderList"
          />
        </el-select>
      </el-form-item> -->

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
                <el-input placeholder="买手ID" v-model="queryParams.buyerId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="接单账号" v-model="queryParams.buyerAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="真实姓名" v-model="queryParams.buyerRealName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <!-- <el-form-item>
        <el-select v-model="queryParams.orderStatus">
          <el-option label="订单状态" value="" />
          <el-option
            :key="item.value"
            :label="item.value"
            :value="item.key"
            v-for="item in mallOrderType"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker :editable="false"
          placeholder="创建时间"
          v-model="queryParams.createDate"
          align="right"
          type="date"
        ></el-date-picker>
      </el-form-item> -->
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
                <el-button :loading="loading" v-hasPermi="['system:escape_single:exprot']" type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="postList" border>
            <el-table-column label="所属站点" align="center" prop="deptId" />
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

            <el-table-column label="买手ID" align="center" prop="buyerId">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleOpenDetail(row.buyerId)">{{row.buyerId}}</span>
                </template>
            </el-table-column>
            <el-table-column label="买手姓名" align="center" prop="buyerRealName" />
            <el-table-column label="接单账号" align="center" prop="buyerAccount" />
            <el-table-column label="备注" align="center" prop="note" />
            <el-table-column label="接单时间" align="center" prop="receiptTime" />
            <el-table-column label="逃单时间" align="center" prop="creatTime" />
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <orderDetail ref="orderDetail"></orderDetail>
        <taskDetail ref="taskDetail"></taskDetail>
        <detail ref="detail"></detail>
        <merDetail ref="merDetail"></merDetail>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { fetchList, exportExcel } from "@/api/order/escape";
import { dateFortmat } from "@/utils";
import orderDetail from "./detail";
import taskDetail from "../task/detail";
import detail from "../buyer/detail";
import merDetail from "../seller/detail";
export default {
    name: "逃单记录",
    components: { orderDetail, taskDetail, detail, merDetail },
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
                merId: "",
                orderNo: "",
                taskNo: "",
                buyerAccount: "",
                buyerRealName: "",
                deptId: "",
                createTimeBegin: "",
                createTimeEnd: ""
            }
        };
    },
    created() {
        if (this.$route.query.taskNo) {
            this.queryParams.taskNo = this.$route.query.taskNo;
        }
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
        handleOpenMerDetail(id) {
            this.$refs.merDetail.visible = true;
            this.$refs.merDetail.tabindex = 0;
            this.common.merId = "";
            setTimeout(() => {
                this.common.merId = id;
            }, 0);
        },
        handleOpenDetail(id) {
            this.$refs.detail.visible = true;
            this.$refs.detail.tabindex = 0;
            this.common.buyerId = "";
            setTimeout(() => {
                this.common.buyerId = id;
            }, 0);
        },
        handleOpenOrder(row) {
            this.$refs.orderDetail.visible = true;
            this.$refs.orderDetail.tabindex = 0;
            this.common.merId = "";
            this.common.taskNo = "";
            this.common.orderNo = "";
            setTimeout(() => {
                this.common.merId = row.merId;
                this.common.taskNo = row.taskNo;
                this.common.orderNo = row.orderNo;
            }, 0);
        },
        handleOpenTask(row) {
            this.$refs.taskDetail.visible = true;
            this.$refs.taskDetail.tabindex = 0;
            this.common.merId = "";
            this.common.taskNo = "";
            this.common.orderNo = "";
            setTimeout(() => {
                this.common.merId = row.merId;
                this.common.taskNo = row.taskNo;
                this.common.orderNo = row.orderNo;
            }, 0);
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
