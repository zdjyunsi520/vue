<template>
  <div style='height:36px;position:relative'>

    <el-button :disabled="disabled" @click="showTree" :style="this.$refs.tree&&this.$refs.tree.getCheckedNodes(this.getCheckedNodes).map(v => v[this.showText]).join(',')==''?'color:#c0c4cc':''">{{this.$refs.tree&&this.$refs.tree.getCheckedNodes(this.getCheckedNodes).map(v => v[this.showText]).join(',')==''?placeholder:this.$refs.tree&&this.$refs.tree.getCheckedNodes(this.getCheckedNodes).map(v => v[this.showText]).join(',')}}</el-button>
    <el-drawer :wrapperClosable="false" :modal-append-to-body='true' :title="title" direction="rtl" :visible.sync="drawperdialogVisible" :show-close='false' center :size="size">
      <el-scrollbar style="height: 86vh;" class="marginright-fx">
        <el-tree :default-checked-keys="checkedKeys" ref="tree" :node-key="nodeKey" :default-expand-all="false" :props="props" :data="data" show-checkbox :check-strictly="!mutiple" @check-change="handleCheckChange"></el-tree>
      </el-scrollbar>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">
          <svg-icon icon-class='ic_save' class='tablesvgicon savesvgicon'></svg-icon>保 存
        </el-button>
        <el-button @click="handleCancel">
          <svg-icon icon-class='ic_cancel' class='cancelsvgicon'></svg-icon>取 消
        </el-button>
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
    placeholder: {
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
        let list;

        if (node.type) {
          list = [node].filter(v => v.type > 1).map(v => v.id);
          if (list.length == 0) {
            list = this.$refs.tree
              .getCheckedNodes(this.getCheckedNodes, !this.getCheckedNodes)
              .filter(v => v.node > 1)
              .map(v => v.id);
          }
        } else {
          list = [node.id];
        }
        this.$refs.tree.setCheckedKeys(list);
      }

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
/deep/.el-button--medium {
  padding: 0 10px;
}
</style>