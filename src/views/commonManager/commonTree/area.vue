<template>

  <el-row :gutter="20" class="containerbox dragbox" ref="dragbox">
    <el-col :xs="{span: 24}" class="treebox comheight dragleft">
      <div style="background:#fff;height:100%;padding:0 10px;">
        <el-scrollbar ref="elScrollbar" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
          <el-tree :default-expanded-keys="expandKeys"  :accordion='true' :current-node-key="currentNode[nodeKey]" :data="dataList" :props="defaultProps" ref="tree" :highlight-current="true" @node-click="handleNodeClick" :default-expand-all="expandAll" :node-key="nodeKey" :expand-on-click-node="false"></el-tree>
        </el-scrollbar>
      </div>
    </el-col>
    <el-col class="dragresize">
      <span class="iconslider">
        <svg-icon icon-class="ic_drag" style="font-size:26px;margin-left:-8px;" />
        <i class="el-icon-arrow-left" style="font-size:12px;margin-left:-2px;" />
      </span>
    </el-col>
    <el-col :xs="{span: 24}" style="width:554px" class="comheight dragright">
      <div class="bg-white  infobox">
        <el-scrollbar>
          <slot />
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>

</template>

<script>
import { fetchList, getInfo, deleted } from "@/api/commonManager/module";
// import update from "./components/update";
// import add from "./components/add";
export default {
  // components: { update, add },
  props: {
    expandKeys: {
      type: Array,
      default() {
        return [];
      }
    },
    dataList: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    currentNode: {
      type: Object,
      default() {
        return {};
      }
    },
    loading: {
      type: Boolean,
      default: true
    },
    defaultProps: {
      type: Object,
      default() {
        return { children: "childs", label: "text" };
      }
    },

    nodeKey: {
      type: String,
      default: "id"
    },
    needToScroll: {
      type: Number,
      default: 1
    },
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataArray: [],
      count: 0
    };
  },
  mounted() {
    this.dragControllerDiv();
  },
  watch: {
    dataList: {
      deep: true,
      handler(data) {
        if (data) {
          this.dataArray = [];
          data.forEach(v => {
            this.dataArray.push(v[this.nodeKey]);
            if (this.nodeKey != "key" && v.childs) {
              v.childs.forEach(v => {
                this.dataArray.push(v[this.nodeKey]);
              });
            }
          });
          // console.log(this.dataArray);
        }
        if (!this.currentNode[this.nodeKey] && this.dataList.length) {
          this.handleNodeClick(this.dataList[0]);
        }
        if (this.count++ < this.needToScroll) {
          this.$nextTick(() => {
            // const scrollTop =
            //   ((this.$refs.elScrollbar.$refs.wrap.offsetWidth - 20) / 32) *
            //   this.dataArray.findIndex(v => v == this.currentNode.id);
            let targetValue = this.currentNode[this.nodeKey];
            if (this.nodeKey == "key") {
              targetValue = targetValue.substr(0, 2) + "0000";
            }

            const nowIndex =
              this.dataArray.findIndex(v => v == targetValue) - 3;
            const scrollTop = 32 * nowIndex;
            // console.log(nowIndex);
            this.$refs.elScrollbar.$refs.wrap.scrollTop = scrollTop;
          });
        }
      }
    },
    currentNode: {
      deep: true,
      immediate: true,
      handler(node) {
        this.handleNodeClick(node);
      }
    }
  },
  methods: {
    handleNodeClick(node) {
      if (node[this.nodeKey]) {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(node[this.nodeKey]);
        });
        this.$emit("getInfo", node);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/tree.scss";
</style>