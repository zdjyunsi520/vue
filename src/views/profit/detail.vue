a<template>
    <div class="app-container">
        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
            <el-form-item>
                <el-select v-model="queryParams.deptId">
                    <el-option label="所属站点" value="" />
                    <el-option v-for="item in deptType" :label="item.deptName" :value="item.deptId" />
                </el-select>
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="订单编号" v-model="queryParams.orderId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item>
                <el-date-picker :editable="false" default-time="00:00:00" placeholder="起始时间" v-model="queryParams.startTime" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" default-time="23:59:59" placeholder="结束时间" v-model="queryParams.endTime" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
            <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:profitDetail:export']" type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table border v-loading="loading" :data="postList">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="分站名称" align="center" prop="deptName" />
            <el-table-column label="任务编号" align="center" prop="taskNumber" />
            <el-table-column label="订单编号" align="center" prop="orderNumber" />
            <el-table-column label="收益时间" align="center" prop="profitTime" width="95px" />
            <el-table-column label="收益金额" align="center" prop="profitAmount" />
            <el-table-column label="当前账号余额" align="center" prop="amount" />
            <el-table-column label="类型" align="center" prop="type" />
            <el-table-column label="支付时间" align="center" prop="payTime" width="95px" />
            <el-table-column label="完成订单时间" align="center" prop="createTime" width="95px" />
            <el-table-column label="备注" align="center" prop="note" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import { fetchAllDetail as fetchList, exportExcel } from "@/api/profit/station";
import { mapGetters } from "vuex";
import { dateFortmat } from "@/utils";
import detail from "./components/detail";
export default {
    name: "利润明细",
    components: { detail },
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
                endTime: "",
                orderId: "",
                startTime: "",
                deptId: ""
            }
        };
    },
    computed: {
        ...mapGetters({
            mallOrderType: "status/mallOrderType",
            mallOrderKV: "status/mallOrderKV",
            deptType: "status/deptType"
        })
    },
    created() {
        this.getList();
    },
    methods: {
        filterMoney(row) {
            return this.mallOrderKV[row.orderStatus];
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
        handleOpen(row) {
            var target = this.$refs.detail;
            target.loading = true;
            target.form.orderNo = row.orderNo;
            target.getList();
            tagret.dialogVisible = true;
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
</style>