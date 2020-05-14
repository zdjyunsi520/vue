<template>

  <div class="app-container">

    <el-row :gutter="20" class="comheight">
      <el-col :span="left" :xs="{span: 24}" class="treebox comheight" :style="'position:relative;width:'+leftwidth" >
        <el-scrollbar>
          <el-tree :data="treeData" :props="defaultProps" class="comheight" @node-click="handleNodeClick" :default-expand-all='true'></el-tree>
        </el-scrollbar>
         <span @click="handleSlider" style="position:absolute;right:0px;width:8px;background:#f0f2f6;top: 0; height: 100%;text-align:center">
            <svg-icon icon-class="ic_drag" style="font-size:16px;margin-top:40vh;margin-left:-5px;"/>
            <i :class="!ishidden?'el-icon-arrow-left':'el-icon-arrow-right'" style="font-size:12px;margin-left:-2px;" />
        </span>
      </el-col>
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
      middle: 1,
      ishidden:false,
      leftwidth:''
    };
  },

  created() {
    this.getTreeData();
  },
  computed: {
    right() {
      return 24 - this.left;
    }
  },
  methods: {
    handleSlider() {
      this.left = this.left == 6 ? 1 : 6;
      this.leftwidth = this.left == 1 ? '40px' : 'auto';
      this.ishidden = !this.ishidden;
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