<template>
  <el-tree :data="treeData" :props="defaultProps" class="comheight" @node-click="handleNodeClick" :default-expand-all='true'></el-tree>
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
      operateId: "",
      operateType: "",
      infoData: {}
    };
  },

  created() {
    this.getTreeData().then(() => {
      this.operateId = this.treeData[0].id;
      this.operateType = this.treeData[0].type;
      this.getServer();
    });
  },
  methods: {
    // 获取设备关系树状图
    getTreeData() {
      return new Promise((resolve, reject) => {
        getTrees()
          .then(response => {
            this.treeData = response.data;
          })
          .catch(error => {
            console.log(error);
          });
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
.comheight {
  height: calc(100vh - 164px);
  padding: 15px 10px;
  box-sizing: border-box;
}
</style>