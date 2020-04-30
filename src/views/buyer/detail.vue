<template>
    <el-dialog title="买手详情" :visible.sync="visible" width="85%" top="5vh" center>
        <el-tabs type="border-card" class="xl-container" v-model="tabindex" @tab-click="initOne">
            <el-tab-pane label="买手详情" name="0">
            </el-tab-pane>
            <el-tab-pane label="资金明细" name="1">
            </el-tab-pane>
            <el-tab-pane label="订单明细" name="2">
            </el-tab-pane>
            <el-tab-pane label="提现记录" name="3">
            </el-tab-pane>
        </el-tabs>
        <info ref="c0" v-show="tabindex==0"></info>
        <recharge ref="c1" v-show="tabindex==1"></recharge>
        <order ref="c2" v-show="tabindex==2"></order>
        <cashOut ref="c3" v-show="tabindex==3"></cashOut>

    </el-dialog>
</template>

<script>
import info from "./components/info";
import order from "./components/order";
import recharge from "./components/recharge";
import cashOut from "./components/cashOut";
export default {
    components: { info, order, recharge, cashOut },
    data() {
        return {
            visible: false,
            tabindex: 0
        };
    },

    methods: {
        initOne({ index }) {
            this.tabindex = index;
            setTimeout(() => {
                const target = this.$refs["c" + index];
                target && target.getList();
            }, 100);
        }
    }
};
</script>

<style lang="scss" scoped>
.xl-container {
    margin-bottom: 14px;
}
/deep/.el-tabs--border-card > .el-tabs__content {
    padding: 0;
}
/deep/.el-form .el-form-item {
    margin-bottom: 14px;
}
</style>
