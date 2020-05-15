<template>

  <div class="app-container">

    <el-row :gutter="20" class="comheight">
      <el-col :span="left" :xs="{span: 24}" class="treebox comheight" :style="'position:relative;width:'+leftwidth">
        <el-scrollbar>
          <el-tree :data="treeData" node-key="id" :props="defaultProps" class="comheight" @node-click="handleNodeClick" :default-expand-all='true'>
          </el-tree>
        </el-scrollbar>
        <span @click="handleSlider" style="position:absolute;right:0px;width:8px;background:#f0f2f6;top: 0; height: 100%;text-align:center">
          <svg-icon icon-class="ic_drag" style="font-size:16px;margin-top:40vh;margin-left:-5px;" />
          <i :class="!ishidden?'el-icon-arrow-left':'el-icon-arrow-right'" style="font-size:12px;margin-left:-2px;" />
        </span>
      </el-col>
      <el-col :xs="{span: 24}" :span="right" class="comheight">
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
      ishidden: false,
      leftwidth: ""
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
    renderContent(h, { node, data, store }) {
      console.log(node);
      return (
        <span class={data.type > 3 ? "custom-tree-node" : ""}>
          <span>{data}</span>
        </span>
      );
    },
    handleSlider() {
      this.left = this.left == 6 ? 1 : 6;
      this.leftwidth = this.left == 1 ? "40px" : "auto";
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

<style lang="scss" scoped>
/deep/.el-tree {
  .el-tree-node__expand-icon {
    &.is-leaf {
      background: #f00;
    }

    border: 1px solid #ccc;
    width: 14px;
    height: 14px;
    margin-right: 8px;
    position: relative;
    text-align: center;
    padding: 0;
    display: block;
    // background: #f00;
    &:before {
      content: "+";
    }
    &.expanded {
      //background: #ff0;
      transform: rotate(0);
      &:before {
        content: "";
        background: #ccc;
        height: 1px;
        top: 50%;
        width: 50%;
        display: block;
        left: 50%;
        transform: translateX(-50%);
        position: absolute;
      }
    }
    &.is-leaf {
    }
  }
  .el-icon-caret-right:before {
  }
  .el-tree-node {
    .custom-tree-node {
      position: relative;
      &:before {
        position: absolute;
        content: "";
        width: 14px;
        height: 14px;
        //这里background替换成图标
        background: #f00;
        left: -20px;
        top: 2px;
      }
    }
    .el-tree-node__content:hover {
      background: none;
    }
    &:last-child {
      position: relative;
      &:before {
        content: "";
        height: 100%;
        background: #fff;
        position: absolute;
        width: 10px;
        left: -6px;
        top: 14px;
      }
    }
    padding: 0;
    margin: 0 5px;
    //  background: url(/assets/images/line.png);

    & > .el-tree-node__children {
      overflow: visible;
      // background: #f00;
      border-left: 1px dashed #ccc;
      margin-left: 7px;
    }
    & > .el-tree-node__children {
      position: relative;
      & > .el-tree-node {
        & > .el-tree-node__content {
          position: relative;
          margin-left: 6px;
          &:before {
            content: "";
            width: 24px;
            position: absolute;
            border-top: 1px dashed #ccc;
            left: -10px;
          }
          & + .el-tree-node__children {
            margin-left: 30px;
            & > .el-tree-node {
              & > .el-tree-node__content {
                position: relative;
                left: -16px;
                &:before {
                  left: 7px;
                }
                & + .el-tree-node__children {
                  margin-left: 32px;
                  & > .el-tree-node {
                    & > .el-tree-node__content {
                      position: relative;
                      left: -36px;
                      &:before {
                        left: 26px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>