<template>

  <div class="app-container">

    <el-row :gutter="20" class="comheight">
      <el-col :span="left" :xs="{span: 24}" class="treebox comheight">
        <el-scrollbar>
          <el-tree :data="treeData" :props="defaultProps" class="comheight" @node-click="handleNodeClick" :default-expand-all='true'></el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="middle"> <span @click="handleSlider">{{left}}点我</span> </el-col>
      <el-col :xs="{span: 24}" :span="right">
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
      },
      left: 6,
      middle: 1
    };
  },

  created() {
    this.getTreeData();
  },
  computed: {
    right() {
      return 24 - this.left - this.middle;
    }
  },
  methods: {
    handleSlider() {
      this.left = this.left ? 0 : 6;
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

<style lang="scss">
</style>