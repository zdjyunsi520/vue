<template>
  <div class="app-container">

    <el-row :gutter="20" class="containerbox dragbox" ref="dragbox">
      <el-col :xs="{span: 24}" class="treebox comheight dragleft">
        <div style="background:#fff;height:100%;padding:0 10px;">
          <el-scrollbar>
            <el-tree v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" :data="treeData" :props="defaultProps" ref="tree" :highlight-current="true" @node-click="handleNodeClick" :default-expand-all='false' node-key="id" :expand-on-click-node="false">
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
                <span :class='data.type == 8 ? "custom-node" : ""' :draggable="playList.findIndex(v=>{
                                  if(v)
                                 return v.id==data.id
                                  else return false
                                  })==-1" @dragstart="dragStart(data)">
                  <span>{{node.label}}</span>
                </span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col class="dragresize">
        <span class="iconslider">
          <svg-icon icon-class="ic_drag" style="font-size:26px;margin-left:-9px;" />
          <i class="el-icon-arrow-left" style="font-size:12px;margin-left:-2px;" />
        </span>
      </el-col>
      <el-col :xs="{span: 24}" class="comheight mxright  dragright">
        <div class="bg-white datainfo " style="position:relative">
          <div class="form-smtitle">实况预览 </div>
          <div class="tabcount">
            <span v-for="item in tabbtns" @click="changetTab(item)" :class="current==item.val?'on':''">
              <svg-icon :icon-class="item.icon"></svg-icon>
            </span>
          </div>
        </div>
        <div class="" style="margin-top:7px;padding: 0;">
          <el-scrollbar>
            <div class="videolist">
              <el-row :gutter="15">

                <el-col v-for="(item,index) in current" :span="current==1?24:(current==4?12:8)" :key='index'>
                  <div :class='isDrop&&dragCurr==index?"videobox on":"videobox"' ref='videobox' :style="'height:'+boxheight+'px'" @dragover="handleAllowDrag(index,$event)" @dragleave="handleDragdragleave(index)" @drop="handleDrop(index)">
                    <iframe v-if='playList[index]&&playList[index].hasVideo' :src="'https://open.ys7.com/ezopen/h5/iframe?url='+playList[index].videoUrl+'&autoplay=1&accessToken='+playList[index].accessToken" width="100%" :height="boxheight+'px'" id="ysOpenDevice" allowfullscreen>
                    </iframe>
                    <div class="removeicon" v-if='playList[index]&&playList[index].hasVideo' @click="handleDelete(index)">
                      <svg-icon icon-class='ic_delete_lx' class="svgicon"></svg-icon>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getPlayUrl, getMonitor } from "@/api/report";
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
      isDrop: false,
      dragCurr: "",
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
      playList: [],
      boxheight: ""
    };
  },
  created() {
    this.getMonitor();
  },
  mounted() {
    this.dragControllerDiv();
    this.boxheight = this.$refs.videobox[0].offsetWidth / 1.9;
  },

  methods: {
    // renderContent(h, { node, data, store }) {
    //   return (
    //     // 间隔 加class
    //     <span
    //       class={data.type == 8 ? "custom-node" : ""}
    //       draggable="true"
    //       ondragstart="alert(1)"
    //     >
    //       <span>{data}</span>
    //     </span>
    //   );
    // },

    getMonitor() {
      getMonitor({}).then(res => {
        let list = res.data;
        this.treeData = res.data;
        this.loading = false;
      });
    },
    changetTab(item) {
      item.isSelect = !item.isSelect;
      this.current = item.val;
      //this.playList = [];
      this.$nextTick(() => {
        this.boxheight = this.$refs.videobox[0].offsetWidth / 1.9;
      });
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
      // this.playList[index] = {
      //   hasVideo: false,
      //   accessToken: "",
      //   videoUrl: ""
      // };
      getPlayUrl({ id }).then(res => {
        if (res.data) {
          const hasVideo = true;
          const accessToken = res.data.MonitorUrl.accesstoken;
          const videoUrl = res.data.MonitorUrl.hd;

          this.$set(this.playList, index, {
            hasVideo,
            accessToken,
            videoUrl,
            id
          });
          //this.playList.push({hasVideo:true,accessToken:res.data.MonitorUrl.accesstoken,videoUrl:res.data.MonitorUrl.hd})
        }
      });
    },
    handleDelete(index) {
      this.$set(this.playList, index, null);
    },
    dragStart(data) {
      this.dragTarget = data;
    },
    handleAllowDrag(index, e) {
      this.dragCurr = index;
      this.isDrop = true;
      e.preventDefault();
    },
    handleDragdragleave(index) {
      this.dragCurr = index;
      this.isDrop = false;
      // e.preventDefault();
    },
    handleDrop(index) {
      // this.dragCurr = index;
      // this.isDrop = true;
      //  e.preventDefault();
      this.getPlayUrl(this.dragTarget.id, index);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/treeEquipment.scss";
.dragbox .dragleft {
  width: 280px;
}
.dragbox .dragright.mxright {
  width: calc(100% - 294px);
}
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
  position: absolute;
  right: 10px;
  top: 7px;
  padding: 2px 18px;
  background-color: #f7f8fa;
  border-radius: 51px;
  text-align: center;
  span {
    display: inline-block;
    cursor: pointer;
    margin: 0 4px;
    font-size: 26px;
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
  font-size: 0;
  .el-col > div {
    border: solid 2px #f6f7fa;
    background: url(../../../assets/image/img_monitor_bj.jpg) no-repeat;
    background-size: 100% 100%;
    height: 280px;
    width: 100%;
    box-sizing: border-box;
    margin: 8px 0 7px;
    display: inline-block;
    position: relative;
    &:hover,
    &.on {
      border: solid 2px #558cf7;
    }
    .removeicon {
      position: absolute;
      bottom: 0;
      right: 48px;
      cursor: pointer;
      .svgicon {
        font-size: 48px;
      }
    }
  }
}
/deep/.dragright .el-scrollbar__bar.is-horizontal {
  display: none;
}
</style>