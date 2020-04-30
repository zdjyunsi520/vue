<template>
    <div class="app-container">

        <el-table v-loading="listLoading" :data="postList" border>
            <el-table-column label="所属站点" align="center" prop="deptName" />

            <el-table-column label="今日垫付单数" align="center" prop="today.advanceOrderQuantity" />
            <el-table-column label="今日浏览单数" align="center" prop="today.browseOrderQuantity" />
            <el-table-column label="今日淘宝垫付单数" align="center" prop="today.tbAdvanceOrderQuantity" />
            <el-table-column label="今日淘宝浏览单数" align="center" prop="today.tbBrowseOrderQuantity" />
            <el-table-column label="今日京东订单数" align="center" prop="today.jdOrderQuantity" />
            <el-table-column label="今日拼多多订单数" align="center" prop="today.pddOrderQuantity" />

            <el-table-column label="7日垫付单数" align="center" prop="sevendays.advanceOrderQuantity" />
            <el-table-column label="7日浏览单数" align="center" prop="sevendays.browseOrderQuantity" />
            <el-table-column label="7日淘宝垫付单数" align="center" prop="sevendays.tbAdvanceOrderQuantity" />
            <el-table-column label="7日淘宝浏览单数" align="center" prop="sevendays.tbBrowseOrderQuantity" />
            <el-table-column label="7日京东订单数" align="center" prop="sevendays.jdOrderQuantity" />
            <el-table-column label="7日拼多多订单数" align="center" prop="sevendays.pddOrderQuantity" />
        </el-table>

    </div>
</template>

<script>
import { orderList as fetchList } from "@/api/order/analysis";

export default {
    data() {
        return {
            // 遮罩层
            listLoading: false,
            // 岗位表格数据
            postList: []
        };
    },
    created() {
        this.getList();
    },

    watch: {},
    methods: {
        /** 查询岗位列表 */
        getList() {
            this.listLoading = true;
            fetchList(this.queryParams)
                .then(response => {
                    this.postList = response.data;
                })
                .finally(e => {
                    this.listLoading = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
/deep/.cell {
    text-align: center;
}
</style>
