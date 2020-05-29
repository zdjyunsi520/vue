<template>
  <el-col>
    <el-button :disabled="disabled" placeholder="" @click="showTree">{{this.$refs.tree&&this.$refs.tree
          .getCheckedNodes(true)
          .map(v => v[this.showText]).join(',')}}</el-button>
    <el-drawer :wrapperClosable="false" :modal="modal" :title="title" direction="rtl" :visible.sync="dialogVisible" :show-close='false' center :size="size">
      <el-scrollbar style="height: 86vh;">
        <el-tree :default-checked-keys="checkedKeys" ref="tree" :node-key="nodeKey" :default-expand-all="true" :props="props" :data="data" show-checkbox :check-strictly="!mutiple" @check-change="handleCheckChange"></el-tree>
      </el-scrollbar>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-drawer>
  </el-col>
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
    }
  },
  data() {
    return {
      dialogVisible: true,
      modal: false,
      size: "0",
      oldKey: []
    };
  },
  mounted() {
    this.dialogVisible = false;
    this.modal = true;
    setTimeout(() => {
      this.size = "300px";
    }, 1000);
  },
  methods: {
    showTree() {
      this.dialogVisible = true;
      this.oldKey = this.$refs.tree.getCheckedNodes(true).map(v => v);
    },
    handleCheckChange(node, select) {
      if (!this.mutiple && select) {
        this.$refs.tree.setCheckedKeys([node.id]);
      }
    },
    handleClose() {
      this.$refs.tree.setCheckedKeys(this.oldKey.map(v => v.id));
      this.$emit("change", this.oldKey);
      this.dialogVisible = false;
    },
    handleConfirm() {
      this.oldKey = this.$refs.tree.getCheckedNodes(true);
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