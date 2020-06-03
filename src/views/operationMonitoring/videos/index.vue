<template>
  <div class="app-container">

    <el-row :gutter="20" class="containerbox dragbox" ref="dragbox">
      <el-col :xs="{span: 24}" class="treebox comheight dragleft">
        <div style="background:#fff;height:100%">
          <el-scrollbar>
            <el-tree v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" :data="treeData" :props="defaultProps" ref="tree" :highlight-current="true" @node-click="handleNodeClick" default-expand-all node-key="id" :expand-on-click-node="false">
              <template class="custom-tree-node" slot-scope="{ node, data }">
                <span :class='data.type == 8 ? "custom-node" : ""' draggable="true" @dragstart="dragStart(data)">
                  <span>{{node.label}}</span>
                </span>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col class="dragresize">
        <span class="iconslider">
          <svg-icon icon-class="ic_drag" style="font-size:26px;margin-left:-8px;" />
          <i class="el-icon-arrow-left" style="font-size:12px;margin-left:-2px;" />
        </span>
      </el-col>
      <el-col :xs="{span: 24}" class="comheight mxright  dragright">
        <el-scrollbar>
          <div class="bg-white datainfo ">
            <div class="form-smtitle">实况预览 </div>
            <div class="tabcount">
              <span v-for="item in tabbtns" @click="changetTab(item)" :class="current==item.val?'on':''">
                <svg-icon :icon-class="item.icon"></svg-icon>
              </span>
            </div>
          </div>
          <div class="" style="margin-top:15px;padding: 0;">
            <div class="videolist">
              <el-row :gutter="15">

                <el-col v-for="(item,index) in current" :span="current==1?24:(current==4?12:8)" :key='index'>
                  <div class='videobox' @dragover="handleAllowDrag" @drop="handleDrop(index)">
                    <iframe v-if='playList[index]&&playList[index].hasVideo' :src="'https://open.ys7.com/ezopen/h5/iframe?url='+playList[index].videoUrl+'&autoplay=1&accessToken='+playList[index].accessToken" width="100%" height="600px" id="ysOpenDevice" allowfullscreen>
                    </iframe>

                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getPlayUrl } from "@/api/dev";
import { getMonitor } from "@/api/org";
export default {
  name: "components",
  data() {
    return {
      // 遮罩层
      loading: true,
      treeData: [],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      id: null,
      tabbtns: [
        {
          val: 1,
          icon: "ic_tab1",
          isSelect: false
        },
        {
          val: 4,
          icon: "ic_tab4",
          isSelect: false
        },
        {
          val: 9,
          icon: "ic_tab9",
          isSelect: false
        }
      ],
      current: 9,
      interval: null,
      accessToken: "",
      videoUrl: "",
      hasVideo: false,
      dragTarget: {},
      playList: []
    };
  },
  created() {
    this.getMonitor();
  },
  mounted() {
    this.dragControllerDiv();
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        // 间隔 加class
        <span
          class={data.type == 8 ? "custom-node" : ""}
          draggable="true"
          ondragstart="alert(1)"
        >
          <span>{data}</span>
        </span>
      );
    },

    getMonitor() {
      getMonitor({}).then(res => {
        console.log(res);
        let list = res.data;
        this.treeData = res.data;
        this.loading = false;
      });
    },
    changetTab(item) {
      item.isSelect = !item.isSelect;
      this.current = item.val;
      this.playList = [];
    },

    handleNodeClick(obj, event) {
      // const id = obj.id;
      // const type = obj.type;
      // if (type == 8) {
      //   //摄像头
      //   this.id = obj.id;
      //   this.getPlayUrl(this.id);
      // }
    },

    getPlayUrl(id, index) {
      this.playList[index] = {
        hasVideo: false,
        accessToken: "",
        videoUrl: ""
      };
      getPlayUrl({ id }).then(res => {
        if (res.data) {
          this.playList[index].hasVideo = true;
          this.playList[index].accessToken = res.data.MonitorUrl.accesstoken;
          this.playList[index].videoUrl = res.data.MonitorUrl.hd;
        }
      });
    },
    dragStart(data) {
      this.dragTarget = data;
    },
    handleAllowDrag(e) {
      e.preventDefault();
    },
    handleDrop(index) {
      //  e.preventDefault();
      this.getPlayUrl(this.dragTarget.id, index);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/tree.scss";
/deep/.el-tree {
  color: #999 !important;
  font-size: 14px;
  .custom-node {
    color: #333 !important;
  }
}
/deep/.form-smtitle {
  margin: 0;
}
.tabcount {
  width: 118px;
  height: 31px;
  position: absolute;
  right: 20px;
  top: 10px;
  background-color: #f7f8fa;
  border-radius: 15px;
  text-align: center;
  line-height: 31px;
  span {
    display: inline-block;
    cursor: pointer;
    margin: 0 6px;
    font-size: 18px;
    .svg-icon {
      color: #d5d8e0;
    }
    &.on {
      .svg-icon {
        color: #37394a;
      }
    }
  }
}
.videolist {
  .el-col > div {
    border: solid 2px #f6f7fa;
    background: #cccccc;
    height: 280px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 15px;
    display: inline-block;
    &:hover {
      border: solid 2px #558cf7;
    }
  }
}
</style>