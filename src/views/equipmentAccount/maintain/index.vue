<template>
  <div class="app-container wrapperbox">
    <el-row :gutter="10">
      <el-col :xs="{span: 24}" :span="6" class="treebox">
        <el-tree :data="treeData" :props="defaultProps" class="comheight"  @node-click="handleNodeClick" :default-expand-all='true'></el-tree>
      </el-col>
      <el-col :xs="{span: 24}" :span="18">
          <div class="bg-white comheight">
              
          </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getTrees } from "@/api/org";
export default {
  data() {
    return {
      treeData:[],
      defaultProps: {
        children: "childs",
        label: "text"
      },
    }
  },

  created() {
    this.getTreeData();
  },
  methods: {
    // 获取设备关系树状图
    getTreeData(){
      getTrees().then(response => {
         this.treeData=response.data;
      }).catch(error => {
        console.log(error); 
      });
    },
    handleNodeClick(tab, event) {

    },
 
  }
}
</script>

<style lang="scss">
.comheight{height:calc(100vh - 124px);padding: 15px 10px;box-sizing: border-box}

</style>