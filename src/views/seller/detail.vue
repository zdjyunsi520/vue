<template>
    <el-dialog title="商家详情" :visible.sync="visible" width="85%" top="5vh" center>
        <el-tabs type="border-card" class="xl-container" v-model="tabindex" @tab-click="initOne">
            <el-tab-pane label="商家详情" name="0">
            </el-tab-pane>
            <el-tab-pane label="绑定店铺" name="1">
            </el-tab-pane>
            <el-tab-pane label="充值记录" name="2">
            </el-tab-pane>
            <el-tab-pane label="待接订单" name="3">
            </el-tab-pane>
            <el-tab-pane label="进行中订单" name="4">
            </el-tab-pane>
            <el-tab-pane label="已完成订单" name="5">
            </el-tab-pane>
            <el-tab-pane label="撤销订单" name="6">
            </el-tab-pane>
            <el-tab-pane label="资金日志" name="7">
            </el-tab-pane>
            <!-- <el-tab-pane label="追加评价订单"> </el-tab-pane> -->
            <info ref="c0" v-show="tabindex==0"></info>
            <shop ref="c1" v-show="tabindex==1"></shop>
            <recharge ref="c2" v-show="tabindex==2"></recharge>
            <waiting ref="c3" v-show="tabindex==3"></waiting>
            <pending ref="c4" v-show="tabindex==4"></pending>
            <finished ref="c5" v-show="tabindex==5"></finished>
            <revoke ref="c6" v-show="tabindex==6"></revoke>
            <capital ref="c7" v-show="tabindex==7"></capital>

        </el-tabs>

    </el-dialog>
</template>

<script>
import info from "./components/info";
import shop from "./components/shop";
import recharge from "./components/recharge";
import waiting from "./components/waiting";
import pending from "./components/pending";
import finished from "./components/finished";
import revoke from "./components/revoke";
import capital from "./components/capital";
export default {
    components: {
        info,
        shop,
        recharge,
        waiting,
        pending,
        finished,
        revoke,
        capital
    },
    data() {
        return {
            visible: false,
            tabindex: "0"
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
.xl-order-num {
    padding: 20px 20px 10px;
    font-size: 14px;
    color: rgb(102, 102, 102);
}
.xl-margin-bottom {
    margin-bottom: 50px;
}
/deep/.el-tabs--border-card > .el-tabs__content {
    padding: 0;
}
.xl-margin-left {
    margin-left: 20px;

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
/deep/.el-table th.gutter {
    display: table-cell !important;
}
.xl-text-align {
    margin-left: 20px;
}

/deep/.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .avatar {
        width: 50px;
        height: 50px;
        display: block;
    }
}
</style>
