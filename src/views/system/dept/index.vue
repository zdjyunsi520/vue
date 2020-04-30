<template>
  <el-row class="xl-margin-bottom">
    <el-tabs
      type="border-card"
      :active="tabsIndex"
      class="xl-container"
      @tab-click="handleClickTabs"
    >
      <el-tab-pane label="管理后台"> </el-tab-pane>
      <el-tab-pane label="商家端"> </el-tab-pane>
      <el-tab-pane label="推广端"> </el-tab-pane>
      <el-tab-pane label="佣金配置"> </el-tab-pane>
    </el-tabs>

    <component :is="componentId" ref="comp"></component>
  </el-row>
</template>

<script>
import station from "./station";
import merchain from "./merchain";
import promotor from "./promotor";
import brokerage from "./brokerage";
export default {
  components: {},
  data() {
    return {
      tabsIndex: 0,
      queryParams: {}
    };
  },
  methods: {
    handleClickTabs({ index }) {
      this.tabsIndex = index;
    }
  },
  computed: {
    componentId() {
      // setTimeout(() => this.$refs.comp.getList(), 0);
      if (this.tabsIndex == 0) {
        return station;
      } else if (this.tabsIndex == 1) {
        return merchain;
      } else if (this.tabsIndex == 2) {
        return promotor;
      } else {
        return brokerage;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.xl-container {
  margin: 10px 20px;
}
.xl-order-num {
  padding: 20px 20px 10px;
  font-size: 14px;
  color: rgb(102, 102, 102);
}
.xl-margin-bottom {
  margin-bottom: 50px;
}
/deep/.el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
.xl-margin-left {
  margin-left: 20px;

  /deep/.el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-input__inner {
    width: 130px;
  }
  /deep/.el-date-editor.el-input {
    width: 200px;

    .el-input__inner {
      width: 200px;
    }
  }
}
/deep/.el-table th.gutter {
  display: table-cell !important;
}
.xl-text-align {
  margin-left: 20px;
}

/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
}
</style>
