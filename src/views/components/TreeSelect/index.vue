<template>
    <div>
        <el-button :disabled="disabled" placeholder="" @click="showTree">{{this.$refs.tree&&this.$refs.tree.getCheckedNodes(this.getCheckedNodes).map(v => v[this.showText]).join(',')}}</el-button>
        <el-drawer :wrapperClosable="false" :modal-append-to-body='true' :title="title" direction="rtl" :visible.sync="drawperdialogVisible" :show-close='false' center :size="size">
            <el-scrollbar style="height: 86vh;" class="marginright-fx">
                <el-tree :default-checked-keys="checkedKeys" ref="tree" :node-key="nodeKey" :default-expand-all="false" :props="props" :data="data" show-checkbox :check-strictly="!mutiple" @check-change="handleCheckChange"></el-tree>
            </el-scrollbar>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">
                    <svg-icon icon-class='ic_save' class='tablesvgicon'></svg-icon>保 存
                </el-button>
                <el-button @click="handleCancel">取 消</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
export default {
    props: {
        //数据源
        data: {
            type: Array
        },
        title: {
            type: String,
            default: "请选择"
        },
        props: {
            type: Object,
            default() {
                return {
                    label: "text",
                    children: "childs"
                };
            }
        },
        nodeKey: {
            type: String,
            default: "id"
        },
        //多选
        mutiple: {
            type: Boolean,
            default: true
        },
        checkedKeys: {
            type: Array,
            default() {
                return [];
            }
        },
        showText: {
            type: String,
            default: "text"
        },
        disabled: {
            type: Boolean,
            default: false
        },
        getCheckedNodes: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            drawperdialogVisible: true,
            size: "0",
            oldKey: []
        };
    },
    mounted() {
        this.drawperdialogVisible = false;
        setTimeout(() => {
            this.size = "300px";
        }, 1000);
    },
    methods: {
        showTree() {
            this.drawperdialogVisible = true;
            this.oldKey = this.$refs.tree
                .getCheckedNodes(this.getCheckedNodes)
                .map(v => v);
        },
        handleCheckChange(node, select) {
            if (!this.mutiple && select) {
                this.$refs.tree.setCheckedKeys([node.id]);
            }
            console.log(
                this.$refs.tree.getCheckedNodes(
                    this.getCheckedNodes,
                    !this.getCheckedNodes
                )
            );
            this.$emit(
                "change",
                this.$refs.tree.getCheckedNodes(
                    this.getCheckedNodes,
                    !this.getCheckedNodes
                )
            );
        },
        handleClose() {
            this.$refs.tree.setCheckedKeys(this.oldKey.map(v => v.id));
            this.$emit("change", this.oldKey);
            this.drawperdialogVisible = false;
        },
        handleConfirm() {
            this.oldKey = this.$refs.tree.getCheckedNodes(
                this.getCheckedNodes,
                !this.getCheckedNodes
            );
            this.handleClose();
        },
        handleCancel() {
            this.handleClose();
        }
    }
};
</script>

<style lang="scss" scoped>
.el-form-item__content {
    .el-button {
        width: 100%;
        text-align: left;
    }
}
</style>