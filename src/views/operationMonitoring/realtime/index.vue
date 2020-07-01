<template>
  <div class="app-container">
    <el-row :gutter="20" class="containerbox dragbox" ref="dragbox">
      <el-col :xs="{span: 24}" class="treebox comheight dragleft">
        <div style="background:#fff;height:100%;padding-left:10px;">
          <el-scrollbar v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading">
            <el-tree :data="treeData" :props="defaultProps" ref="tree" :highlight-current="true" @node-click="handleNodeClick" :default-expand-all='false' node-key="id" :expand-on-click-node="false" :default-expanded-keys="expandedKeys">
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
                {{ data.text }}
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
        <el-scrollbar>
          <div class="app-container" style="padding:0">
            <div class="bg-white datainfo ">
              <div>
                <div class="form-smtitle marginBottom30">实时信息 </div>
                <el-row :gutter="30" class="cellinfo">
                  <el-col :span='5' :xs='12'>
                    <h5>电压(V)</h5>
                    <p>-</p>
                    <p @click="handleClick('UA','A相电压','V')"><label>A相</label><span>{{info.UA}}</span></p>
                    <p @click="handleClick('UB','B相电压','V')"><label>B相</label><span>{{info.UB}}</span></p>
                    <p @click="handleClick('UC','C相电压','V')"><label>C相</label><span>{{info.UC}}</span></p>
                  </el-col>
                  <el-col :span='5' :xs='12'>
                    <h5>电流(A)</h5>
                    <p>-</p>
                    <p @click="handleClick('IA','A相电流','A')"><label>A相</label><span>{{info.IA}}</span></p>
                    <p @click="handleClick('IB','B相电流','A')"><label>B相</label><span>{{info.IB}}</span></p>
                    <p @click="handleClick('IC','C相电流','A')"><label>C相</label><span>{{info.IC}}</span></p>
                  </el-col>

                  <el-col :span='4' :xs='12'>
                    <h5>视在功率(kVA)</h5>
                    <p @click="handleClick('S','总视在功率','kVA')"><label>总</label><span>{{info.S}}</span></p>
                    <p @click="handleClick('SA','A相视在功率','kVA')"><label>A相</label><span>{{info.SA}}</span></p>
                    <p @click="handleClick('SB','B相视在功率','kVA')"><label>B相</label><span>{{info.SB}}</span></p>
                    <p @click="handleClick('SC','C相视在功率','kVA')"><label>C相</label><span>{{info.SC}}</span></p>
                  </el-col>
                  <el-col :span='5' :xs='12'>
                    <h5>有功功率(kW)</h5>
                    <p @click="handleClick('P','总有功功率','kW')"><label>总</label><span>{{info.P}}</span></p>
                    <p @click="handleClick('PA','A相有功功率','kW')"><label>A相</label><span>{{info.PA}}</span></p>
                    <p @click="handleClick('PB','B相有功功率','kW')"><label>B相</label><span>{{info.PB}}</span></p>
                    <p @click="handleClick('PC','C相有功功率','kW')"><label>C相</label><span>{{info.PC}}</span></p>
                  </el-col>
                  <el-col :span='5' :xs='12'>
                    <h5>功率因素</h5>
                    <p @click="handleClick('PF','总功率因素','')"><label>总</label><span>{{info.PF}}</span></p>
                    <p @click="handleClick('PFA','A相功率因素','')"><label>A相</label><span>{{info.PFA}}</span></p>
                    <p @click="handleClick('PFB','B相功率因素','')"><label>B相</label><span>{{info.PFB}}</span></p>
                    <p @click="handleClick('PFC','C相功率因素','')"><label>C相</label><span>{{info.PFC}}</span></p>
                  </el-col>
                </el-row>
              </div>
              <div style="margin-top:40px">
                <div class="form-smtitle marginBottom30">其他参数 </div>
                <p class="tips" v-if="!otherData||otherData.length==0">暂无其他参数</p>
                <el-row class="cellinfo noborder databox-lx" v-else>
                  <el-col :span='6' :xs='24' v-for="(item,index) in otherData" :key='index'>
                    <p @click="handleClick(item.Type,item.Name,item.Unit)"><label>{{item.Name}}({{item.Unit}})</label><span>{{item.Value}}</span></p>
                  </el-col>

                </el-row>
              </div>
            </div>
            <div class="bg-white datainfo containerbox " style="margin-top:15px;padding:15px 20px 0">
              <div class="form-smtitle marginBottom30" style="position:relative">历史曲线-{{labelName}}
                <div class="rightradiobox">
                  <label>日期：</label>
                  <el-date-picker v-model="time" v-if="form.cycleType==1" type="datetime" size="small" placeholder="选择时间"></el-date-picker> <span v-if="form.cycleType==1">至</span>
                  <el-date-picker v-model="time1" v-if="form.cycleType==1" type="datetime" size="small" placeholder="选择时间"></el-date-picker>
                  <el-date-picker v-model="day" v-show="form.cycleType!=1" :type="form.cycleType==2?'date':'month'" size="small" placeholder="选择时间"></el-date-picker>
                  <el-radio-group v-model="form.cycleType" size="mini">
                    <el-radio-button :label="1">15分钟</el-radio-button>
                    <el-radio-button :label="2">日</el-radio-button>
                    <el-radio-button :label="3">月</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              <div class="chart-wrapper" style="height: auto;">
                <LineChart ref="chart" :chartData='lineChartData' />
                <!-- <p class="tips" style="padding-top:13%">暂无数据</p> -->
              </div>
            </div>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getMeasureData, getMeasureDataHistory } from "@/api/report";
import { getStopIntervalTrees as getTrees } from "@/api/org";
import LineChart from "./components/LineChart";

const lineChartData = [
  {
    xAxisData: [],
    actualData: []
  },
  {
    xAxisData: [],
    actualData: []
  },
  {
    xAxisData: [],
    actualData: []
  }
];
export default {
  name: "components",
  components: {
    LineChart
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      treeData: [],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      expandedKeys: [],
      baseData: [],
      id: null,
      weight: 0,
      radioType: 0,
      labelName: "A相电压",
      form: {
        intervalId: "",
        type: "UA",
        cycleType: 1,
        beginTime: "",
        endTime: ""
      },
      time: "",
      time1: "",
      day: "",
      month: "",
      interval: false,
      timeout: null,
      //  lineChartData: {xAxisData:[],actualData:[]},
      info: {},
      otherData: [],
      historyData: [],
      labelunit: "A"
    };
  },
  created() {
    const { intervalId } = this.$route.params;
    if (intervalId) this.form.intervalId = intervalId;
    this.getTreeData();
  },
  computed: {
    lineChartData() {
      const xAxisData = [];
      const actualData = [];
      const labelunit = this.labelunit;
      this.historyData
        .map(v => {
          const data = v.CreateTime.split(" ");
          let value;
          if (this.form.cycleType != 3) {
            value = data[1];
          } else {
            value = data[0];
          }
          return { value, value1: v.Value };
        })
        .forEach(v => {
          xAxisData.push(v.value);
          actualData.push(v.value1);
        });

      return { xAxisData, actualData, labelunit };
    }
  },
  mounted() {
    this.dragControllerDiv();
  },
  watch: {
    "form.intervalId"() {
      this.getMeasureData();
      this.getMeasureData1();
    },
    "form.type"() {
      this.getMeasureData1();
    },
    "form.cycleType"() {
      this.getMeasureData1();
    },
    time() {
      this.getMeasureData1();
    },
    time1() {
      this.getMeasureData1();
    },
    day() {
      this.getMeasureData1();
    }
  },
  beforeDestroy() {
    this.interval = false;
  },
  methods: {
    handleClick(type, labelName, labelunit) {
      this.form.type = type;
      this.labelName = labelName;
      this.labelunit = labelunit;
    },
    renderContent(h, { node, data, store }) {
      return (
        // 间隔 加class
        <span
          class={
            data.type == 11
              ? "el-tree-node__label custom-node"
              : "el-tree-node__label"
          }
        >
          <span>{data}</span>
        </span>
      );
    },

    // 获取设备关系树状图
    getTreeData() {
      getTrees().then(response => {
        this.loading = false;
        this.treeData = response.data;

        if (this.form.intervalId) {
          this.expandedKeys = [];
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.form.intervalId);
            this.expandedKeys.push(this.form.intervalId);
          });
        } else this.findFistInterval(response.data);
        // this.$emit("getInfo", this.treeData[0]);
      });
    },
    findFistInterval(list) {
      if (list) {
        list.forEach(v => {
          this.findFistInterval(v.childs);
          if (this.form.intervalId) return;
          if (v.type == 11) {
            this.form.intervalId = v.id;
            this.$nextTick(() => {
              this.expandedKeys = [];
              this.$refs.tree.setCurrentKey(v.id);
              this.expandedKeys.push(v.id);
            });
          }
        });
      }
      // list.forEach((v, i) => {
      //   if (v.type == 11 && weight + i > this.weight) {
      //     this.weight = weight + i;
      //     this.id = v.id;
      //   } else {
      //     this.findFistInterval(v.childs, weight * 100);
      //   }
      // });
    },
    // 15分钟/日/月切换
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
    getMeasureData() {
      this.interval = true;
      clearTimeout(this.timeout);
      this.info = {};
      this.otherData = [];
      this.labelName = "A相电流";
      this.type = "UA";
      this.getMeasureDataInterval();
    },
    getMeasureDataInterval() {
      getMeasureData(this.form).then(res => {
        let list = res.data;
        this.info = res.data.CommonData;
        this.otherData = res.data.OtherData;
      });
      // this.getMeasureDataHistory();我把这里注释了
      if (this.interval) {
        this.timeout = setTimeout(this.getMeasureDataInterval, 15000);
      }
    },
    getMeasureData1() {
      // this.interval = true;
      // clearTimeout(this.timeout);
      this.getMeasureDataHistory();
    },
    getMeasureDataHistory() {
      const now = Date.now();
      if (this.form.cycleType == 1) {
        this.form.beginTime = this.time;
        this.form.endTime = this.time1;
      } else if (this.form.cycleType == 2) {
        let day = this.day || now;
        day = this.parseTime(day, "{y}-{m}-{d}");
        this.form.beginTime = day + " 00:00:00";
        this.form.endTime = day + " 23:59:59";
      } else {
        let day = this.day || now;
        day = this.parseTime(day, "{y}-{m}-");
        this.form.beginTime = day + "01 00:00:00";
        this.form.endTime = day + "31 23:59:59";
      }

      if (!this.form.beginTime) {
        this.form.beginTime = new Date(now - 24 * 60 * 60 * 1000);
      }
      if (!this.form.endTime) {
        this.form.endTime = new Date(now);
      }
      getMeasureDataHistory(this.form).then(r => {
        this.historyData = r.data;
      });
      // if (this.interval) {
      //   this.timeout = setTimeout(this.getMeasureDataHistory, 15000);
      // }
    },

    handleNodeClick(obj, event) {
      const id = obj.id;
      const type = obj.type;
      if (type == 11) {
        this.baseData = [];
        this.form.intervalId = obj.id;
      }
      // this.$emit("getInfo", { id, type });
    }

    /** 搜索菜单列表 */
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
@import "../../../styles/treeEquipment.scss";
.dragbox .dragleft {
  width: 324px;
}
.dragbox .dragright.mxright {
  width: calc(100% - 334px);
}

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
      &:hover {
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
    label {
      font-weight: normal;
      min-width: 50px;
      white-space: nowrap;
      display: inline-block;
    }
    span {
      color: #558cf7;
      display: inline-block;
      margin-left: 20px;
      min-width: 40px;
    }
    &.on,
    &:hover {
      background-color: #edf4ff;
      border-radius: 2px;
      color: #558cf7;

      span {
        color: #558cf7;
      }
    }
  }
}
.databox-lx {
  padding: 0 15px;
  p {
    padding: 0 3%;
    display: flex;
    justify-content: space-between;
  }
}
.tips {
  height: 60px;
  line-height: 60px;
  padding: 0;
}
.rightradiobox {
  position: absolute;
  top: 0px;
  right: 10px;
  color: #313033;
  & > b {
    font-size: 16px;
    margin-right: 10px;
    font-weight: normal;
  }
  & > label {
    display: inline-block;
    margin-right: 10px;
    font-size: 14px;
    font-weight: normal;
  }
  .el-radio-button--mini .el-radio-button__inner {
    padding: 9px 15px !important;
  }
}
.rightradiobox .el-radio-group {
  vertical-align: top;
}
@media screen and (max-width: 768px) {
  .rightradiobox {
    position: relative;
    text-align: right;
    right: 0;
    & > b {
      display: block;
      margin-bottom: 15px;
    }
    & > span {
      display: block;
      text-align: right;
      padding: 10px 0;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 60%;
    }
    .el-radio-group {
      display: block;
      margin-top: 15px;
    }
  }
}

@media (max-width: 1366px) {
  .dragbox .dragleft {
    width: 230px;
  }
  .dragbox .dragright.mxright {
    width: calc(100% - 240px);
  }
}
</style>