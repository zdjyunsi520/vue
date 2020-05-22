<template>
  <div class="app-container wrapperbox">

    <el-row :gutter="10">
      <el-col :xs="{span: 24}" :span="6" class="treebox">
        <common-tree />
      </el-col>
      <el-col :xs="{span: 24}" :span="18">
        <router-view />
        <div class="bg-white comheight">
          <el-form :inline="true">
            <el-form-item>
              <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
              <el-button type="primary" @click="handleUpdate">
                <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>修改
              </el-button>
              <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
            </el-form-item>
          </el-form>

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getTrees } from "@/api/org";
import { getServer, getServers } from "@/api/dev";
import commonTree from "@/views/equipmentAccount/components";
export default {
  components: { commonTree },
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

  created() {},
  methods: {
    handleAdd() {},
    handleUpdate() {},
    handleDelete() {},

    handleNodeClick(obj, event) {
      console.log(obj, event);
      this.operateId = obj.id;
      if (obj.type == 4) {
        //主机
        this.getServer();
      }
    }
  }
};
</script>

<style lang="scss">
</style>