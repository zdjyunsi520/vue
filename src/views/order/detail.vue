<template>
    <el-dialog title="订单详情" :visible.sync="visible" width="85%" center top="5vh">
        <el-tabs type="border-card" class="xl-container" v-model="tabindex" @tab-click="initOne">
            <el-tab-pane label="订单详情" name="0">
            </el-tab-pane>
            <el-tab-pane label="任务详情" name="1">
            </el-tab-pane>
            <el-tab-pane label="商家详情" name="2">
            </el-tab-pane>

        </el-tabs>
        <info ref="c0" v-show="tabindex==0"></info>
        <taskInfo ref="c1" v-show="tabindex==1"></taskInfo>
        <sellerInfo ref="c2" v-show="tabindex==2"></sellerInfo>
    </el-dialog>
</template>

<script>
import info from "./components/info";
import sellerInfo from "../seller/components/info";
import taskInfo from "../task/components/info";
export default {
    components: { info, sellerInfo, taskInfo },
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
