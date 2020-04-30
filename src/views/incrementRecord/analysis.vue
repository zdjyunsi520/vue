<template>
    <div class="app-container">
        <el-button type="primary" @click="getList">刷新</el-button>
        <el-table v-loading="listLoading" :data="postList" border>
            <el-table-column label="所属站点" align="center" prop="deptName" />
            <el-table-column label="今日空包次数" align="center" prop="today.emptyParcelTimes" />
            <el-table-column label="今日信封次数" align="center" prop="today.envelopTimes" />
            <el-table-column label="今日照妖镜次数" align="center" prop="today.mirrorTimes" />
            <el-table-column label="今日打标签次数" align="center" prop="today.labelTimes" />

            <el-table-column label="7日空包次数" align="center" prop="sevendays.emptyParcelTimes" />
            <el-table-column label="7日信封次数" align="center" prop="sevendays.envelopTimes" />
            <el-table-column label="7日照妖镜次数" align="center" prop="sevendays.mirrorTimes" />
            <el-table-column label="7日打标签次数" align="center" prop="sevendays.labelTimes" />
        </el-table>

    </div>
</template>

<script>
import { thirdServiceList as fetchList } from "@/api/order/analysis";

export default {
    name: "服务次数统计",
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
