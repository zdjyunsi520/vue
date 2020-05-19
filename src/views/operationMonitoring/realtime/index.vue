<template>
  <div class="app-container">

    <el-row :gutter="20" class="containerbox dragbox" ref="dragbox">
      <el-col :xs="{span: 24}" class="treebox comheight dragleft">
        <div style="background:#fff;height:100%">
          <el-scrollbar v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
            <el-tree :data="treeData" :render-content="renderContent" :props="defaultProps" ref="tree" :highlight-current="true" @node-click="handleNodeClick" default-expand-all node-key="id" :expand-on-click-node="false"></el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col class="dragresize">
        <span class="iconslider">
          <svg-icon icon-class="ic_drag" style="font-size:16px;margin-left:-5px;" />
          <i class="el-icon-arrow-left" style="font-size:12px;margin-left:-2px;" />
        </span>
      </el-col>
      <el-col :xs="{span: 24}" class="comheight mxright  dragright">
        <el-scrollbar>
          <div class="bg-white datainfo ">
            <div>
              <div class="form-smtitle marginBottom30">实时信息 </div>
              <el-row :gutter="40" class="cellinfo">
                <el-col :span='6' :xs='12'>
                  <!-- <h5>电压(baseData.UA.Unit)</h5>
                  <p>A相<span>{{baseData.UA.Value}}</span></p>
                  <p>B相<span>{{baseData.UB.Value}}</span></p>
                  <p>C相<span>{{baseData.UC.Value}}</span></p> -->
                </el-col>
                <el-col :span='4' :xs='12'>
                  <h5>电流(V)</h5>
                  <p>A相<span>0.89</span></p>
                  <p>A相<span>0.89</span></p>
                  <p>A相<span>0.89</span></p>
                </el-col>
                <el-col :span='4' :xs='24'>
                  <h5 class="smtitleh5 blue">总视在功率(kVA)<b>10.99</b></h5>
                  <p>A相<span>0.89</span></p>
                  <p>A相<span>0.89</span></p>
                  <p>A相<span>0.89</span></p>
                </el-col>
                <el-col :span='4' :xs='12'>
                  <h5 class="smtitleh5">总有功功率(kVA)<b>10.99</b></h5>
                  <p>A相<span>0.89</span></p>
                  <p>A相<span>0.89</span></p>
                  <p>A相<span>0.89</span></p>
                </el-col>
                <el-col :span='6' :xs='12'>
                  <h5 class="smtitleh5">总功率因素<b>10.99</b></h5>
                  <p>A相<span>0.89</span></p>
                  <p>A相<span>0.89</span></p>
                  <p>A相<span>0.89</span></p>
                </el-col>
              </el-row>
            </div>
            <div style="margin-top:30px">
              <div class="form-smtitle marginBottom30">其他参数 </div>
              <el-row :gutter="20" class="cellinfo noborder">
                <el-col :span='5' :xs='12'>
                  <p class="on">反向无功电度(kVarh)<span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh)<span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="bg-white datainfo " style="margin-top:15px;">
            <div class="form-smtitle marginBottom30">历史曲线 </div>
            <div class="  chart-wrapper">
              <LineChart ref="chart" :chartData='chartData' />
              <!-- <p class="tips" style="padding-top:13%">暂无数据</p> -->
            </div>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getMeasureData } from "@/api/report";
import { getTrees } from "@/api/org";
import LineChart from "./components/LineChart";
const chartData = {
  expectedData: [100, 120, 161, 134, 105, 160, 165],
  actualData: [120, 82, 91, 154, 162, 140, 145]
};
export default {
  name: "components",
  components: {
    LineChart
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      chartData: chartData,
      treeData: [],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      baseData: {}
    };
  },
  created() {
    // this.getList();
    this.getTreeData();
  },

  mounted() {
    this.dragControllerDiv();
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        // 间隔 加class
        <span class={data.type == 11 ? "custom-node" : ""}>
          <span>{data}</span>
        </span>
      );
    },

    // 获取设备关系树状图
    getTreeData() {
      getTrees().then(response => {
        this.loading = false;
        this.treeData = response.data;
        // this.$emit("getInfo", this.treeData[0]);
      });
    },
    getMeasureData(id) {
      const intervalId = id;
      getMeasureData({ intervalId }).then(res => {
        console.log(res);
        let list = res.data;
        list.map(v => {
          this.getBaseData(v);
        });
        console.log(this.baseData.UA.Unit);
      });
    },
    getBaseData(v) {
      this.baseData[v.Type] = v;
    },
    handleNodeClick(obj, event) {
      const id = obj.id;
      const type = obj.type;
      console.log(obj);
      if (type == 11) {
        //间隔
        this.getMeasureData(obj.id);
      }
      // this.$emit("getInfo", { id, type });
    }

    /** 查询菜单列表 */
    // getList() {
    //   this.loading = true;
    //   fetchList(this.queryParams)
    //     .then(response => {
    //       this.dataList = response.data.map(v => {
    //         // v.children = v.childs;
    //         v.lvl = true;
    //         return v;
    //       });
    //       this.dataList = response.data;

    //       this.$refs.tree.setCurrentKey(this.dataList[0].id);
    //       this.handleNodeClick(this.dataList[0]);
    //       this.loading = false;
    //       this.dataList.length && this.handleNodeClick(this.dataList[0]);
    //     })
    //     .finally(v => (this.loading = false));
    // },
    // getInfo() {
    //   const id = this.operateId;
    //   id &&
    //     getInfo({ id }).then(r => {
    //       this.data = Object.assign({}, r.data);
    //       this.smform = Object.assign({}, r.data);
    //       this.smform.Type =
    //         this.smform.Type == 1
    //           ? "分类"
    //           : this.smform.Type == 2
    //           ? "应用"
    //           : "权限";
    //     });
    // },
    // getList123() {
    //   this.getList();
    //   this.getInfo();
    // },
    // handleNodeClick({ id, lvl }) {
    //   if (lvl) {
    //     this.addId = id;
    //   } else {
    //     this.addId = "";
    //   }
    //   this.operateId = id;
    //   this.getInfo();
    // },
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
.datainfo {
  .cellinfo {
    text-align: center;
    .el-col {
      width: 19%;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        background-color: #ebeef5;
        width: 1px;
        height: 130px;
        right: 0;
        top: 10%;
      }
      &:last-child:after {
        content: "";
        width: 0;
      }
    }
    &.noborder {
      .el-col:after {
        width: 0;
      }
    }
  }
  h5 {
    font-size: 18px;
    color: #313033;
    height: 62px;
    font-weight: normal;
    display: flex;
    justify-content: center;
    margin: 0 0 5px;
    flex-direction: column;
    padding: 10px 15px 10px;
    &.smtitleh5 {
      font-size: 14px;

      color: #999999;
      b {
        font-size: 18px;
        padding-top: 5px;
        font-weight: normal;
        color: #333333;
        display: block;
      }
      &.blue {
        background-color: #edf4ff;
        border-radius: 2px;
        color: #558cf7;
        b {
          color: #558cf7;
        }
      }
    }
  }
  p {
    color: #999999;
    font-size: 14px;
    margin: 0;
    line-height: 30px;
    span {
      color: #333;
      display: inline-block;
      margin-left: 20px;
    }
    &.on {
      background-color: #edf4ff;
      border-radius: 2px;
      color: #558cf7;
      span {
        color: #558cf7;
      }
    }
  }
}
</style>