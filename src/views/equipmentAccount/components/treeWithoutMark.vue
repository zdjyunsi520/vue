<template>
  <div class="app-container">
    <el-row :gutter="20" class="comheight dragbox" ref="dragbox">
      <el-col :xs="{ span: 24 }" class="treebox comheight dragleft">
        <div style="background:#fff;height:100%;padding-left:10px;">
          <el-scrollbar ref="elScrollbar" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" element-loading-spinner="el-icon-loading">
            <div style="padding-right:10px">

              <el-tree ref="tree" :filter-node-method="filterNodeMethod" :current-node-key="currentNode[nodeKey]" :node-key="nodeKey" :data="treeData" :props="defaultProps" class="comheight" @node-click="handleNodeClick" :highlight-current="true" :default-expand-all="false" :expand-on-click-node="false" :default-expanded-keys="expandedKeys">
                <span class="el-tree-node__label" slot-scope="{ node, data }">
                  <svg-icon :icon-class="
                      data.type == 1
                        ? 'gongsi'
                        : data.type == 2
                        ? 'peidianshi'
                        : data.type == 3
                        ? 'pinggui'
                        : data.type == 4
                        ? 'tongxunzhuji'
                        : data.type == 5
                        ? 'dianlibiaoji'
                        : data.type == 6
                        ? 'wenkong'
                        : data.type == 7
                        ? 'yangan'
                        : data.type == 8
                        ? 'shexiangtou'
                        : data.type == 9
                        ? 'jilianggui'
                        : data.type == 10
                        ? 'bianyaqi'
                        : data.type == 11
                        ? 'jiange'
                        : ''
                  " class="tablesvgicon"></svg-icon>
                  <!-- <span :class="data.type == 2 ? 'icon-ic_capacity' : ''"></span -->
                  {{ data.text }}
                </span>
              </el-tree>
            </div>

          </el-scrollbar>
        </div>
      </el-col>
      <el-col class="dragresize">
        <span class="iconslider">
          <svg-icon icon-class="ic_drag" style="font-size:26px;margin-left:-9px;" />
          <i class="el-icon-arrow-left" style="font-size:12px;margin-left:-2px;" />
        </span>
      </el-col>
      <el-col :xs="{ span: 24 }" class="comheight dragright">
        <slot />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getTrees } from "@/api/org";
export default {
  props: {
    // expandedKeys: {
    //   type: Array,
    //   default() {
    //     return [];
    //   }
    // },
    nodeKey: {
      type: String,
      default: "id"
    },
    currentNode: {
      type: Object,
      default() {
        return {};
      }
    },
    needToScroll: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      dataArray: [],
      count: 0,
      loading: false,
      expandedKeys: []
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
      return (
        <span class={data.type > 1 ? "custom-tree-node" : ""}>
          <span>
            {data}
            {data.type}
          </span>
        </span>
      );
    },

    // 获取设备关系树状图
    getTreeData() {
      this.count = 0;
      this.loading = true;
      getTrees()
        .then(response => {
          this.treeData = response.data;
          this.dataArray = [];
          if (this.treeData && this.treeData.length) {
            this.$emit("getInfo", this.treeData[0]);
            this.treeData.forEach(v => {
              this.dataArray.push(v[this.nodeKey]);
              if (v.childs) {
                v.childs.forEach(v => {
                  this.dataArray.push(v[this.nodeKey]);
                  if (v.childs) {
                    v.childs.forEach(v => {
                      this.dataArray.push(v[this.nodeKey]);
                      if (v.childs) {
                        v.childs.forEach(v => {
                          this.dataArray.push(v[this.nodeKey]);
                          if (v.childs) {
                            v.childs.forEach(v => {
                              this.dataArray.push(v[this.nodeKey]);
                              if (v.childs) {
                                v.childs.forEach(v => {
                                  this.dataArray.push(v[this.nodeKey]);
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });

            if (!this.currentNode[this.nodeKey]) {
              this.handleNodeClick(this.treeData[0]);
            } else {
              this.handleNodeClick(this.currentNode);
            }

            if (this.count++ < this.needToScroll) {
              this.$nextTick(() => {
                // const scrollTop =
                //   ((this.$refs.elScrollbar.$refs.wrap.offsetWidth - 20) / 32) *
                //   this.dataArray.findIndex(v => v == this.currentNode.id);
                let targetValue = this.currentNode[this.nodeKey];

                const nowIndex =
                  this.dataArray.findIndex(v => v == targetValue) - 3;
                const scrollTop = 32 * nowIndex;
                // console.log(nowIndex);
                this.$refs.elScrollbar.$refs.wrap.scrollTop = scrollTop;
              });
            }
          }
          this.$nextTick(() => this.$refs.tree.filter("123"));
        })
        .finally(() => (this.loading = false));
    },
    handleNodeClick(node, event) {
      if (node[this.nodeKey]) {
        this.$nextTick(() => {
          let id = node[this.nodeKey] || node.Id;
          this.$refs.tree.setCurrentKey(id);
          this.expandedKeys = [];
          this.expandedKeys.push(id);
        });
        const id = node.id;
        const type = node.type;
        console.log(id);
        this.$emit("getInfo", { id, type });
      }
    },
    filterNodeMethod(value, data) {
      if (data && data.type == 5) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/treeEquipment.scss";
.dragbox .dragleft {
  width: 324px;
}
</style>
