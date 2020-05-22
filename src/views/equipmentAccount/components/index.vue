<template>
  <div class="app-container">
    <el-row :gutter="20" class="comheight dragbox" ref="dragbox">
      <el-col :xs="{span: 24}" class="treebox comheight dragleft">
        <div style="background:#fff;height:100%">
          <el-scrollbar>
            <el-tree :data="treeData" node-key="id" :props="defaultProps" class="comheight" @node-click="handleNodeClick" :default-expand-all="true" :expand-on-click-node="false"></el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col class="dragresize">
        <span class="iconslider">
          <svg-icon icon-class="ic_drag" style="font-size:26px;margin-left:-8px;" />
          <i class="el-icon-arrow-left" style="font-size:12px;margin-left:-2px;" />
        </span>
      </el-col>
      <el-col :xs="{span: 24}" class="comheight dragright">
        <slot />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getTrees } from "@/api/org";
export default {
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "childs",
        label: "text"
      }
    };
  },
  mounted() {
    this.dragControllerDiv();
  },
  created() {
    this.getTreeData();
  },
  methods: {
    renderContent(h, { node, data, store }) {
      console.log(node);
      return (
        <span class={data.type > 3 ? "custom-tree-node" : ""}>
          <span>{data}</span>
        </span>
      );
    },

    // 获取设备关系树状图
    getTreeData() {
      getTrees().then(response => {
        this.treeData = response.data;
        this.$emit("getInfo", this.treeData[0]);
      });
    },
    handleNodeClick(obj, event) {
      const id = obj.id;
      const type = obj.type;
      this.$emit("getInfo", { id, type });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/tree.scss";
</style>