a<template>
    <div class="app-container">

        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true">
            <el-form-item>
                <el-date-picker :editable="false" placeholder="起始时间" v-model="queryParams.beginDate" align="right" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="结束时间" v-model="queryParams.endDate" align="right" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button :loading="listLoading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:buyer:info:updateWithdrawPassword']" type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-form-item>
            <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
        </el-form>

        <el-table border v-loading="listLoading" :data="postList">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="日期" align="center" prop="profitDate" />
            <el-table-column label="礼品包利润" align="center" prop="giftProfit" />
            <el-table-column label="空包利润" align="center" prop="emptyProfit" />
            <el-table-column label="信封利润" align="center" prop="envelopProfit" />
            <el-table-column label="照妖镜利润" align="center" prop="mirrorProfit" />
            <el-table-column label="打标签利润" align="center" prop="labelProfit" />
            <el-table-column label="当天总利润" align="center" prop="totalProfit" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import {
    incrementEarn as fetchList,
    exportIncrementEarn as exportExcel
} from "@/api/incrementRecord";
import { mapGetters } from "vuex";
import { dateFortmat } from "@/utils";

export default {
    name: "增值利润统计",
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
                beginDate: "",
                endDate: ""
            }
        };
    },
    computed: {},
    created() {
        this.getList();
    },
    methods: {
        filterTime() {
            if (
                this.queryParams.beginDate &&
                this.queryParams.beginDate.length != 10
            ) {
                this.queryParams.beginDate = dateFortmat(
                    this.queryParams.beginDate,
                    "yyyy-MM-dd"
                );
            }
            if (
                this.queryParams.endDate &&
                this.queryParams.endDate.length != 10
            ) {
                this.queryParams.endDate = dateFortmat(
                    this.queryParams.endDate,
                    "yyyy-MM-dd"
                );
            }
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