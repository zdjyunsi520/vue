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
          <svg-icon icon-class="ic_drag" style="font-size:26px;margin-left:-8px;" />
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
                  <h5>电压(V)</h5>
                  <p @click="handleClick('UA')"><label>A相</label><span>{{info.UA}}</span></p>
                  <p @click="handleClick('UB')"><label>B相</label><span>{{info.UB}}</span></p>
                  <p @click="handleClick('UC')"><label>C相</label><span>{{info.UC}}</span></p>
                </el-col>
                <el-col :span='4' :xs='12'>
                  <h5>电流(A)</h5>
                  <p @click="handleClick('IA')"><label>A相</label><span>{{info.IA}}</span></p>
                  <p @click="handleClick('IB')"><label>B相</label><span>{{info.IB}}</span></p>
                  <p @click="handleClick('IC')"><label>C相</label><span>{{info.IC}}</span></p>
                </el-col>

                <el-col :span='4' :xs='24'>
                  <h5 class="smtitleh5 ">总视在功率(kVA)<b @click="handleClick('S')">{{info.S}}</b></h5>
                  <p @click="handleClick('SA')"><label>A相</label><span>{{info.SA}}</span></p>
                  <p @click="handleClick('SB')"><label>B相</label><span>{{info.SB}}</span></p>
                  <p @click="handleClick('SC')"><label>C相</label><span>{{info.SC}}</span></p>
                </el-col>
                <el-col :span='4' :xs='12'>
                  <h5 class="smtitleh5">总有功功率(kW)<b @click="handleClick('P')">{{info.P}}</b></h5>
                  <p @click="handleClick('PA')"><label>A相</label><span>{{info.PA}}</span></p>
                  <p @click="handleClick('PB')"><label>B相</label><span>{{info.PB}}</span></p>
                  <p @click="handleClick('PC')"><label>C相</label><span>{{info.PC}}</span></p>
                </el-col>
                <el-col :span='6' :xs='12'>
                  <h5 class="smtitleh5">总功率因素<b @click="handleClick('PF')">{{info.PF}}</b></h5>
                  <p @click="handleClick('PFA')"><label>A相</label><span>{{info.PFA}}</span></p>
                  <p @click="handleClick('PFB')"><label>B相</label><span>{{info.PFB}}</span></p>
                  <p @click="handleClick('PFC')"><label>C相</label><span>{{info.PFC}}</span></p>
                </el-col>
              </el-row>
            </div>
            <div style="margin-top:40px">
              <div class="form-smtitle marginBottom30">其他参数 </div>
              <p class="tips" v-if="!otherData||otherData.length==0">暂无其他参数</p>
              <el-row class="cellinfo noborder databox-lx" v-else>
                <el-col :span='5' :xs='12' v-for="item in otherData">
                  <p @click="handleClick(item.Type)"><label>{{item.Name}}({{item.Unit}})</label><span>{{item.Value}}</span></p>
                </el-col>

              </el-row>
            </div>
          </div>
          <div class="bg-white datainfo " style="margin-top:15px;">
            <div class="form-smtitle marginBottom30" style="position:relative">历史曲线

              <div class="rightradiobox">
                <b>{{labelName}}</b>&nbsp;&nbsp;
                <label>日期：</label>
                <el-date-picker v-model="time" v-if="form.cycleType==1" type="datetimerange" size="small" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:350px">
                </el-date-picker>

                <el-date-picker v-model="day" v-else :type="form.cycleType==2?'date':'month'" size="small" placeholder="选择时间"></el-date-picker>
                <el-radio-group v-model="form.cycleType" size="mini">
                  <el-radio-button :label="1">15分钟</el-radio-button>
                  <el-radio-button :label="2">日</el-radio-button>
                  <el-radio-button :label="3">月</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <!-- <el-row>
              <el-col :span="3"> {{labelName}}</el-col>
              <el-col :span="3">周期 
                <el-select v-model="form.cycleType">
                  <el-option label="月" :value="3" />
                  <el-option label="日" :value="2" />
                  <el-option label="15分钟" :value="1" />
                </el-select>
              </el-col>
              <el-col :span="3"> 日期<el-date-picker v-model="form.beginTime" type="date" placeholder="选择日期"></el-date-picker>
              </el-col>
            </el-row> -->
            <div class="chart-wrapper">
              <LineChart ref="chart" :chartData='lineChartData' />
              <!-- <p class="tips" style="padding-top:13%">暂无数据</p> -->
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
    xAxisData: [
      "08:00",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01"
    ],
    actualData: [
      120,
      82,
      91,
      154,
      162,
      140,
      145,
      120,
      82,
      91,
      154,
      162,
      91,
      154,
      162
    ]
  },
  {
    xAxisData: [
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01"
    ],
    actualData: [
      180,
      160,
      151,
      106,
      145,
      150,
      130,
      151,
      106,
      145,
      150,
      130,
      180,
      160,
      151,
      106,
      145,
      150,
      130,
      151,
      106,
      145,
      150,
      130
    ]
  },
  {
    xAxisData: [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12"
    ],
    actualData: [180, 560, 151, 146, 145, 180, 560, 151, 146, 145, 30, 130]
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
      baseData: [],
      id: null,
      weight: 0,
      radioType: 0,
      labelName: "",
      form: {
        intervalId: "",
        type: "UA",
        cycleType: 1,
        beginTime: "",
        endTime: ""
      },
      time: [],
      day: "",
      month: "",
      interval: null,
      //  lineChartData: {xAxisData:[],actualData:[]},
      info: {},
      otherData: [],
      historyData: []
    };
  },
  created() {
    // this.getList();
    this.getTreeData();
  },
  computed: {
    lineChartData() {
      const xAxisData = [];
      const actualData = [];
      this.historyData
        .map(v => {
          const data = v.CreateTime.split(" ");
          let value;
          if (this.form.cycleType == 1) {
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

      return { xAxisData, actualData };
    }
  },
  mounted() {
    this.dragControllerDiv();
  },
  watch: {
    "form.intervalId"() {
      this.getMeasureData();
    },
    "form.type"() {
      this.getMeasureData();
    },
    "form.cycleType"() {
      this.getMeasureData();
    },
    time() {
      this.getMeasureData();
    },
    day() {
      this.getMeasureData();
    }
  },
  beforeDestroy() {
    this.$nextTick(() => clearInterval(this.interval));
  },
  methods: {
    handleClick(data) {
      console.log(data);
      this.form.type = data;
      this.labelName = data.Name;
    },
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
        this.findFistInterval(response.data);
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
              this.$refs.tree.setCurrentKey(v.id);
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
      this.info = {};
      this.otherData = [];
      getMeasureData(this.form).then(res => {
        let list = res.data;
        this.info = res.data.CommonData;
        this.otherData = res.data.OtherData;
      });
      this.getMeasureDataHistory();
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      this.interval = setInterval(() => {
        this.getMeasureDataHistory();
      }, 15 * 1000);
    },
    getMeasureDataHistory() {
      const now = Date.now();
      if (this.form.cycleType == 1) {
        this.form.beginTime = this.time[0];
        this.form.endTime = this.time[1];
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
      display: inline-block;
    }
    span {
      color: #333;
      display: inline-block;
      margin-left: 20px;
      min-width: 50px;
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
  padding: 0 30px;
  p {
    padding: 0 10px;
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
  right: 20px;
  color: #313033;
  & > b {
    font-size: 16px;
    margin-right: 10px;
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
</style>