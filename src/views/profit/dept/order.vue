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
            <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
        </el-form>

        <el-table border v-loading="listLoading" :data="postList">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="日期" align="center" prop="statisticsDate" width="95px" />
            <el-table-column label="总垫付单数" align="center" prop="advanceOrderQuantityTotal" />
            <el-table-column label="总浏览单数" align="center" prop="browseOrderQuantityTotal" />
            <el-table-column label="总淘宝垫付单数" align="center" prop="tbAdvanceOrderQuantityTotal" />
            <el-table-column label="总淘宝浏览单数" align="center" prop="tbBrowseOrderQuantityTotal" />
            <el-table-column label="总京东订单数" align="center" prop="jdOrderQuantityTotal" />
            <el-table-column label="总拼多多订单数" align="center" prop="pddOrderQuantityTotal" />
            <el-table-column label="已完成垫付单数" align="center" prop="advanceOrderQuantityFinish" />
            <el-table-column label="已完成浏览单数" align="center" prop="browseOrderQuantityFinish" />
            <el-table-column label="已完成淘宝垫付单数" align="center" prop="tbAdvanceOrderQuantityFinish" />
            <el-table-column label="已完成京东订单数" align="center" prop="jdOrderQuantityFinish" />
            <el-table-column label="已完成拼多多订单数" align="center" prop="pddOrderQuantityFinish" />
            <el-table-column label="已完成追评订单数" align="center" prop="appendedPraiseQuantityFinish" />
            <el-table-column label="礼品包次数" align="center" prop="giftTimes" />
            <el-table-column label="空包次数" align="center" prop="emptyParcelTimes" />
            <el-table-column label="信封次数" align="center" prop="envelopTimes" />
            <el-table-column label="分站照妖镜次数" align="center" prop="mirrorTimesDept" />
            <el-table-column label="总站照妖镜次数" align="center" prop="mirrorTimesHead" />
            <el-table-column label="打标签次数" align="center" prop="labelTimes" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import { deptOrder as fetchList } from "@/api/profit/station";
import { mapGetters } from "vuex";
import { dateFortmat } from "@/utils";
export default {
    name: "平台订单汇总",
    components: {},
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
    computed: {
        ...mapGetters({
            mallOrderType: "status/mallOrderType",
            mallOrderKV: "status/mallOrderKV"
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