a<template>
    <div class="app-container">
        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
            <el-form-item>
                <el-date-picker :editable="false" placeholder="盘点起始日期" v-model="queryParams.collectionDateBegin" align="right" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="盘点结束日期" v-model="queryParams.collectionDateEnd" align="right" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:platform:fund:collection:export']" type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table border v-loading="loading" :data="postList">
            <el-table-column label="盘点日期" align="center" prop="collectionDate" />
            <el-table-column label="商家账户总余额" align="center" prop="merTotalBalance" />
            <el-table-column label="买手账户总余额" align="center" prop="buyerTotalBalance" />
            <el-table-column label="推广员账户总余额" align="center" prop="promoterTotalBalance" />
            <el-table-column label="分站账户总余额" align="center" prop="deptTotalBalance" />
            <el-table-column label="平台可用总利润" align="center" prop="platformBalance" />
            <el-table-column label="商家提现中总金额" align="center" prop="merWithdrawAmount" />
            <el-table-column label="买手提现中总金额" align="center" prop="buyerWithdrawAmount" />
            <el-table-column label="推广员提现中总金额" align="center" prop="promoterWithdrawAmount" />
            <el-table-column label="分站提现中总金额" align="center" prop="deptWithdrawAmount" />
            <el-table-column label="进行中订单总金额" align="center" prop="processingAmount" />
            <el-table-column label="资金池总金额" align="center" prop="bankTotalBalance" />
            <el-table-column label="结余" align="center" prop="surplus" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { dateFortmat } from "@/utils";
import { fetchList, exportExcel } from "@/api/profit/capital.js";

export default {
    name: "资金盘点",
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
                collectionDateBegin: "",
                collectionDateEnd: ""
            }
        };
    },

    created() {
        this.getList();
    },
    methods: {
        filterTime() {
            if (
                this.queryParams.collectionDateBegin &&
                this.queryParams.collectionDateBegin.length != 10
            ) {
                this.queryParams.collectionDateBegin = dateFortmat(
                    this.queryParams.collectionDateBegin,
                    "yyyy-MM-dd"
                );
            }

            if (
                this.queryParams.collectionDateEnd &&
                this.queryParams.collectionDateEnd.length != 10
            ) {
                this.queryParams.collectionDateEnd = dateFortmat(
                    this.queryParams.collectionDateEnd,
                    "yyyy-MM-dd"
                );
            }
        },
        handleOpen(row) {
            var target = this.$refs.detail;
            target.loading = true;
            target.form.orderNo = row.orderNo;
            target.getList();
            target.dialogVisible = true;
        },
        /** 查询岗位列表 */
        getList() {
            this.listLoading = true;
            this.filterTime();
            fetchList(this.queryParams)
                .then(response => {
                    this.postList = response.data.list.map(v => {
                        v.collectionDate = v.collectionDate.substr(0, 10);
                        return v;
                    });
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