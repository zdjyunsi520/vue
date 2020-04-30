<template>
    <div class="app-container" v-loading="listLoading">
        <el-form>

            <el-form-item>
                {{data.markingKey}}
            </el-form-item>
            <el-form-item>
                {{data.cardHoneKey}}
            </el-form-item>
            <el-form-item>
                {{data.informationKey}}
            </el-form-item>
            <el-form-item>
                {{data.decentralizationKey}}
            </el-form-item>
            <el-form-item>
                {{data.reputationIntervalKey}}
            </el-form-item>

            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">刷新</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {
    leftCount as fetchList,
    expressCount as fetchList1
} from "@/api/incrementRecord";

export default {
    name: "照妖镜余量",
    data() {
        return {
            // 遮罩层
            listLoading: false,
            loading: false,
            // 总条数
            data: {
                markingKey: "查询打标剩余: ",
                cardHoneKey: "卡首页剩余：",
                informationKey: "查询基本信息剩余: ",
                decentralizationKey: "查询降权剩余: ",
                reputationIntervalKey: "查询信誉区间剩余: "
            }
        };
    },

    created() {
        this.getList();
    },
    methods: {
        /** 查询岗位列表 */
        getList() {
            this.listLoading = true;
            fetchList()
                .then(response => {
                    this.data = response.data;
                })
                .finally(e => {
                    this.listLoading = false;
                });

            // fetchList1()
            // .then(response => {
            //   this.data = response.data
            // })
            // .finally(e => {
            //   this.listLoading = false;
            // });
        },

        /** 搜索按钮操作 */
        handleQuery() {
            this.getList();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
