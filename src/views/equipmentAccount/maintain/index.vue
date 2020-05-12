<template>
  <div class="app-container wrapperbox">

    <el-row :gutter="10">
      <el-col :xs="{span: 24}" :span="6" class="treebox">
        <common-tree @getInfo="getInfo" />
      </el-col>
      <el-col :xs="{span: 24}" :span="18">
        <div class="bg-white comheight">
          <el-row class="equipInfobox">
            <el-form :inline="true" size="mini">
              <el-form-item>
                <el-dropdown @command="handleCommand">
                  <el-button type="primary" size="mini" icon=" el-icon-circle-plus-outline">
                    新增
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="a">配电室</el-dropdown-item>

                  </el-dropdown-menu>
                </el-dropdown>
                <!-- <el-button type="primary" icon="el-icon-edit" @click="handleUpdate">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button> -->
              </el-form-item>
            </el-form>
          </el-row>
          <el-row :gutter="20" class="equipInfobox">

            <baseProp />
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import commonTree from "@/views/equipmentAccount/components";
import baseProp from "./baseProp";
export default {
  components: { commonTree, baseProp },
  data() {
    return {
      operateId: "",
      infoData: {},
      component: null
    };
  },

  created() {},
  methods: {
    getInfo(data) {
      console.log(data);
      this.data = data;
      if (data.type == 1) {
        this.component = baseProp;
        this.$nextTick(() => {
          console.log(this.$refs.component);
        });
      }
    },
    handleCommand(commond) {
      if (commond == "a") {
        this.$router.push({ path: "", params: {} });
      }
    },
    handleAdd() {},
    handleUpdate() {},
    handleDelete() {},
    getServer() {
      const id = this.operateId;
      return new Promise((resolve, reject) => {
        getServer({ id }).then(r => {
          this.infoData = Object.assign({}, r.data);
        });
      });
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