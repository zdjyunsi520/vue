
<template>
  <div class="app-container screenbg mobilewrapper">
    <el-row class="tophead">
      <img src="@/assets/image/largescreen/img_title_bj_1.png" class="img_title_bj">
      <div class="cnt">
        <span class="left commonchart">智能运维 为客户创造价值</span>
        <img src="@/assets/image/largescreen/img_name.png" class="img_title">
        <span class="right commonchart">
          <Systime /></span>
      </div>
    </el-row>
    <el-row :gutter="20">
      <div class='topdata'>
        <el-col :span='5' :xs='12' class='count-box'>
          <p>运维中心</p>
          <div class="dataCount">
            <div>
              <img src="../../../assets/image/userscreen/ic_number_bj.png" alt="" :key="index" v-for="(item,index) in (maintenanceCenter+'').length" />
              <countTo :startVal='startVal' :endVal='maintenanceCenter' :duration='3000' separator=''></countTo>
            </div>
          </div>
        </el-col>
        <el-col :span='5' :xs='12' class='count-box'>
          <p>总用户</p>
          <div class="dataCount">
            <div>
              <img src="../../../assets/image/userscreen/ic_number_bj.png" alt="" :key="index" v-for="(item,index) in (totalUsers+'').length" />
              <countTo :startVal='startVal' :endVal='totalUsers' :duration='3000' separator=''></countTo>
            </div>
          </div>
        </el-col>
        <el-col :span='4' :xs='24' class='count-box'>
          <p>总容量(kVA)</p>
          <div class="dataCount">
            <div>
              <img src="../../../assets/image/userscreen/ic_number_bj.png" alt="" :key="index" v-for="(item,index) in (totalCapacity+'').length" />
              <countTo :startVal='startVal' :endVal='totalCapacity' :duration='3000' separator=''></countTo>
            </div>
          </div>
        </el-col>
        <el-col :span='5' :xs='12' class='count-box'>
          <p>配电房</p>
          <div class="dataCount">
            <div>
              <img src="../../../assets/image/userscreen/ic_number_bj.png" alt="" :key="index" v-for="(item,index) in (powerRoom+'').length" />
              <countTo :startVal='startVal' :endVal='powerRoom' :duration='3000' separator=''></countTo>
            </div>
          </div>
        </el-col>
        <el-col :span='5' :xs='12' class='count-box'>
          <p>安全运行(天)</p>
          <div class="dataCount">
            <div>
              <img src="../../../assets/image/userscreen/ic_number_bj.png" alt="" :key="index" v-for="(item,index) in (safeRunning+'').length" />
              <countTo :startVal='startVal' :endVal='safeRunning' :duration='3000' separator=''></countTo>
            </div>
          </div>
        </el-col>
      </div>
    </el-row>
    <el-row :gutter='20' class='maincontent'>
      <el-col :span='7' :xs='24'>
        <el-row>
          <h6>用电类型统计</h6>
          <div class="chartbox boxheight1">
            <powerTypePieChart ref="powerTypePieChart" :chartData='powerTypeData' />
          </div>
        </el-row>
        <el-row>
          <h6>用电分析</h6>
          <div class="chartbox boxheight2">
            <el-row class="smbarbox">
              <el-col :span='8'>
                <img src='@/assets/image/largescreen/img_energy.png' class='img_energy'>
                <div class="lightimg">
                  <img src='@/assets/image/largescreen/img_light.png'>
                  <img src='@/assets/image/largescreen/img_light.png'>
                  <img src='@/assets/image/largescreen/img_light.png'>
                  <img src='@/assets/image/largescreen/img_light.png'>
                  <img src='@/assets/image/largescreen/img_light.png'>
                </div>
                <span>{{dataInfo.ThisMonthQuantity}}</span>
              </el-col>
              <el-col :span='8'>
                <img src='@/assets/image/largescreen/img_energy.png' class='img_energy'>
                <div class="lightimg">
                  <img src='@/assets/image/largescreen/img_light.png'>
                  <img src='@/assets/image/largescreen/img_light.png'>
                  <img src='@/assets/image/largescreen/img_light.png'>
                  <img src='@/assets/image/largescreen/img_light.png'>
                  <img src='@/assets/image/largescreen/img_light.png'>
                </div>
                <span>{{dataInfo.LastMonthQuantity}}</span>
              </el-col>
              <el-col :span='8'>
                <img src='@/assets/image/largescreen/img_energy.png' class='img_energy'>
                <div class="lightimg">
                  <img src='@/assets/image/largescreen/img_light.png'>
                  <img src='@/assets/image/largescreen/img_light.png'>
                  <img src='@/assets/image/largescreen/img_light.png'>
                  <img src='@/assets/image/largescreen/img_light.png'>
                  <img src='@/assets/image/largescreen/img_light.png'>
                </div>
                <span>{{dataInfo.ThisYearQuantity}}</span>
              </el-col>
            </el-row>
          </div>
          <div class="bottomtext bottomtext1">
            <span>本月(kWh)</span>
            <span>上月(kWh)</span>
            <span>年累计(kWh)</span>
          </div>

        </el-row>
        <el-row class='commonchart'>
          <h6>用电负荷</h6>
          <div class="chartbox boxheight3">
            <LineChart ref="lineChart" :linechartData='lineChartData' />
          </div>
        </el-row>
      </el-col>
      <el-col :span='10' :xs='24' class='commonchart'>
        <el-row>
          <div class="chartbox mapbox boxheight5">
            <MapChart ref='mapchart' :mapchartData='mapchartData' />
          </div>
        </el-row>
        <el-row class="boxheight4">
          <h6 class="longbg">预警信息</h6>
          <div class="warnlistinfo">
            <div v-for='(item,index) in waringlist' :key='index'>
              <span class="smicon">
                <img v-if='index==0' src="@/assets/image/ic_notice.png" />
                <img v-else src="@/assets/image/ic_tips.png" />
              </span>
              <div>
                <el-col :span="7">
                  {{item.TenantName}}
                </el-col>
                <el-col :span="5">
                  {{item.AssetsName}}
                </el-col>
                <el-col :span="6">
                  {{item.Description}}
                </el-col>
                <el-col :span="6">
                  {{item.Time}}
                </el-col>
              </div>
            </div>
          </div>
        </el-row>
      </el-col>
      <el-col :span='7' :xs='24'>
        <el-row>
          <h6>运维成果</h6>
          <div class="chartbox boxheight1">
            <div class="circlebox circlebox-lx">
              <div class='circle1'>
                <canvas class="js-rotate-04"></canvas>
                <span></span>
              </div>
              <div class='circle2'>
                <canvas class="js-rotate-05"></canvas>
                <span></span>
              </div>
              <div class='circle3'>
                <canvas class="js-rotate-06"></canvas>
                <span></span>
              </div>

            </div>
            <div class="ledgebox">
              <p><i><b class='dot1'></b></i><span>{{dataInfo.OperationSituation.TotalPatrolCount}}<label>总巡检(次)</label></span></p>
              <p><i><b class='dot2'></b></i><span>{{dataInfo.OperationSituation.TotalWarningCount}}<label>总预警(次)</label></span></p>
              <p><i><b class='dot3'></b></i><span>{{dataInfo.OperationSituation.TotalRepairCount}}<label>总抢修(次)</label></span></p>
            </div>
          </div>
        </el-row>
        <el-row>
          <h6>采集情况</h6>
          <div class="chartbox boxheight2">
            <div class="circlebox">
              <div>
                <canvas class="js-rotate-01" width="100" height="100"></canvas>
                <span>{{dataInfo.CollectSituation.DataServerCount}}</span>
              </div>
              <div>
                <canvas class="js-rotate-02" width="100" height="100"></canvas>
                <span>{{dataInfo.CollectSituation.ElectricMeterCount}}</span>
              </div>
              <div>
                <canvas class="js-rotate-03" width="100" height="100"></canvas>
                <span>{{dataInfo.CollectSituation.OnlineRate}}</span>
              </div>
            </div>
          </div>
          <div class="bottomtext">
            <span>采集器(个)</span>
            <span>表计(个)</span>
            <span>在线率</span>
          </div>

        </el-row>
        <el-row class='commonchart'>
          <h6>运维跟踪情况</h6>
          <div class="chartbox boxheight3">
            <LineChart ref="tracklineChart" :linechartData='tracklineChartData' />
          </div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getScreenSystem,
  getScreenElectricLoad,
  getOperationCurve,
  getWarnings
} from "@/api/report";

import Systime from "../components/systime.vue";
import countTo from "vue-count-to";
import powerTypePieChart from "./components/powerTypePieChart";
import LineChart from "./components/LineChart";
import GainPieChart from "./components/GainPieChart";
import BarChart from "./components/BarChart";
import MapChart from "./components/MapChart";
import "echarts/map/js/china.js";
import "echarts/extension-src/bmap/bmap.js";

const powerTypeData = {
  legendData: [],
  listData: []
};
const lineChartData = {
  legendData: ["最高负荷", "平均负荷", "最低负荷"],
  xAxisData: [],
  highData: [],
  averageData: [],
  lowData: []
};
const tracklineChartData = {
  legendData: ["巡视", "故障维修", "用户报修"],
  xAxisData: [],
  highData: [],
  averageData: [],
  lowData: []
};
const mapchartData = {
  chinaGeoCoordMap: {},
  chinaDatas: [],
  localName: "",
  localCoordinate: []
};

export default {
  name: "baseData",
  components: {
    Systime,
    countTo,
    powerTypePieChart,
    BarChart,
    GainPieChart,
    // PieChart,
    MapChart,
    LineChart
  },

  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      radioType: 0,
      loading: false,
      powerTypeData,
      lineChartData,
      tracklineChartData,
      startVal: 0,
      maintenanceCenter: 0,
      totalUsers: 0,
      totalCapacity: 0,
      powerRoom: 0,
      safeRunning: 0,
      circles: [],
      dataInfo: {
        OperationSituation: {},
        CollectSituation: {}
      },
      mapchartData,
      sysElectricLoad: {},
      operationCurve: {},
      waringlist: [],
      scale: 1
    };
  },
  mounted() {
    window.onresize = () => {
      const oHtml = document.getElementsByTagName("html")[0];
      const width = oHtml.clientHeight;
      this.scale = width / 1080;
      oHtml.style.fontSize = 19.2 * (width / 1080) + "px";
      this.circleCanves();
    };
    const oHtml = document.getElementsByTagName("html")[0];
    const width = oHtml.clientHeight;
    this.scale = width / 1080;
    oHtml.style.fontSize = 19.2 * (width / 1080) + "px";
    this.getScreenSystem();
    this.getScreenElectricLoad();
    this.getOperationCurve();
    this.getWarnings();

    this.dragControllerDiv();
    this.circleCanves();
    this.renderLoop();
    // this.getScreenSystem();
  },
  created() {},
  methods: {
    circleCanves() {
      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      var RotatingCircle = (function() {
        function RotatingCircle(canvas, opts) {
          _classCallCheck(this, RotatingCircle);
          this.ctx = canvas.getContext("2d");
          this.size = Math.min(canvas.clientWidth, canvas.clientHeight);
          this.radius = opts.radius;
          this.lineWidth = opts.lineWidth;
          this.strokeStyle = opts.strokeStyle;
          this.degreeStart = opts.degreeStart;
          this.degreeEnd = opts.degreeEnd;
          this.stepStart = opts.stepStart;
          this.stepEnd = opts.stepEnd;
        }
        _createClass(RotatingCircle, [
          {
            key: "render",
            value: function render() {
              this.degreeStart = this.degreeStart + this.stepStart;
              this.degreeEnd = this.degreeEnd + this.stepEnd;
              if (this.degreeStart - 360 > this.degreeEnd) {
                this.degreeStart -= 720;
              }
              this.ctx.clearRect(0, 0, this.size, this.size);
              this.ctx.lineWidth = this.lineWidth;
              this.ctx.beginPath();
              this.ctx.strokeStyle = this.strokeStyle;
              this.ctx.arc(
                this.size / 2,
                this.size / 2,
                this.radius - this.lineWidth / 2,
                ((this.degreeStart < this.degreeEnd
                  ? this.degreeStart
                  : this.degreeEnd) *
                  Math.PI) /
                  180,
                ((this.degreeStart < this.degreeEnd
                  ? this.degreeEnd
                  : this.degreeStart) *
                  Math.PI) /
                  180,
                false
              );
              this.ctx.stroke();
            }
          }
        ]);
        return RotatingCircle;
      })();
      document.querySelector(".js-rotate-01").height = 100 * this.scale;
      document.querySelector(".js-rotate-01").width = 100 * this.scale;
      document.querySelector(".js-rotate-02").height = 100 * this.scale;
      document.querySelector(".js-rotate-02").width = 100 * this.scale;
      document.querySelector(".js-rotate-03").height = 100 * this.scale;
      document.querySelector(".js-rotate-03").width = 100 * this.scale;

      document.querySelector(".js-rotate-04").height = 140 * this.scale;
      document.querySelector(".js-rotate-04").width = 140 * this.scale;
      document.querySelector(".js-rotate-05").height = 90 * this.scale;
      document.querySelector(".js-rotate-05").width = 90 * this.scale;
      document.querySelector(".js-rotate-06").height = 50 * this.scale;
      document.querySelector(".js-rotate-06").width = 50 * this.scale;
      this.circles = [
        new RotatingCircle(document.querySelector(".js-rotate-01"), {
          radius: 49 * this.scale,
          lineWidth: 9 * this.scale,
          strokeStyle: "#d2feff",
          degreeStart: -90,
          degreeEnd: 180,
          stepStart: 3,
          stepEnd: 1
        }),
        new RotatingCircle(document.querySelector(".js-rotate-02"), {
          radius: 49 * this.scale,
          lineWidth: 9 * this.scale,
          strokeStyle: "#07fdff",
          degreeStart: -50,
          degreeEnd: 270,
          stepStart: 3,
          stepEnd: 1
        }),
        new RotatingCircle(document.querySelector(".js-rotate-03"), {
          radius: 49 * this.scale,
          lineWidth: 9 * this.scale,
          strokeStyle: "#2178ff",
          degreeStart: -70,
          degreeEnd: 90,
          stepStart: 3,
          stepEnd: 2
        }),
        new RotatingCircle(document.querySelector(".js-rotate-04"), {
          radius: 69 * this.scale,
          lineWidth: 10 * this.scale,
          strokeStyle: "#2178ff",
          degreeStart: -70,
          degreeEnd: 90,
          stepStart: 3,
          stepEnd: 2
        }),
        new RotatingCircle(document.querySelector(".js-rotate-05"), {
          radius: 44 * this.scale,
          lineWidth: 10 * this.scale,
          strokeStyle: "#07fdff",
          degreeStart: -20,
          degreeEnd: 120,
          stepStart: 3,
          stepEnd: 1
        }),

        new RotatingCircle(document.querySelector(".js-rotate-06"), {
          radius: 24 * this.scale,
          lineWidth: 10 * this.scale,
          strokeStyle: "#d2feff",
          degreeStart: -90,
          degreeEnd: 150,
          stepStart: 4,
          stepEnd: 2
        })
      ];
    },
    renderLoop() {
      this.circles.map(circle => {
        circle.render();
      });
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    },

    getScreenSystem() {
      getScreenSystem().then(r => {
        this.dataInfo = r.data;
        this.maintenanceCenter = this.dataInfo.OperationSituation.OperationCenterCount;
        this.totalUsers = this.dataInfo.TotalUserCount;
        this.totalCapacity = this.dataInfo.TotalContractCapacity;
        this.powerRoom = this.dataInfo.SwitchingRoomCount;
        this.safeRunning = this.dataInfo.RunningDays;

        this.dataInfo.ElectricTypeStatistic.map((v, i) => {
          this.powerTypeData.legendData.push(v.Text);
          this.powerTypeData.listData.push({
            value: v.Count,
            name: v.Text
          });
          return this.powerTypeData;
        });
        this.$nextTick(() => {
          this.$refs.powerTypePieChart.initChart();
        });
        this.mapchartData = this.dataInfo.ProvinceData;
        this.mapchartData.chinaGeoCoordMap = Object.assign(
          {},
          this.dataInfo.ProvinceData.LatitudeLongitude
        );
        this.mapchartData.chinaDatas = this.dataInfo.ProvinceData.PrvoinceValue.concat();
        // this.mapchartData.localName = this.dataInfo.ProvinceData.Local.Text;
        // this.mapchartData.localCoordinate = this.dataInfo.ProvinceData.Local.Coordinate;
        this.$nextTick(() => {
          this.$refs.mapchart.initChart();
        });
      });
    },
    getScreenElectricLoad() {
      getScreenElectricLoad().then(r => {
        this.sysElectricLoad = r.data;
        this.lineChartData.xAxisData = this.sysElectricLoad.XAxis;
        this.lineChartData.highData = this.sysElectricLoad.Highest;
        this.lineChartData.averageData = this.sysElectricLoad.Average;
        this.lineChartData.lowData = this.sysElectricLoad.Lowest;
        this.$nextTick(() => {
          this.$refs.lineChart.initChart();
        });
      });
    },
    getOperationCurve() {
      getOperationCurve().then(r => {
        this.operationCurve = r.data;
        this.tracklineChartData.xAxisData = this.operationCurve.XAxis;
        this.tracklineChartData.highData = this.operationCurve.Patrol;
        this.tracklineChartData.averageData = this.operationCurve.Bug;
        this.tracklineChartData.lowData = this.operationCurve.Repair;
        this.$nextTick(() => {
          this.$refs.tracklineChart.initChart();
        });
      });
    },
    getWarnings() {
      getWarnings().then(r => {
        this.waringlist = r.data;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@function px2rem($px, $base-font-size: 19.2px) {
  @if (unitless($px)) {
    @warn "Assuming #{$px} to be in pixels, attempting to convert it into pixels for you";
    @return px2rem($px + 0px); // That may fail.
  } @else if (unit($px) == rem) {
    @return $px;
  }
  @return ($px / $base-font-size) * 1rem;
}

.screenbg {
  background: url(../../../assets/image/largescreen/img_big_data_bj.jpg)
    no-repeat;
  background-size: 100% 100%;
}
.tophead {
  position: relative;
  padding: px2rem(25px) 0px px2rem(20px);
  .img_title_bj {
    width: 100%;
  }
  .img_title {
    height: px2rem(95px);
    vertical-align: top;
  }
  .cnt {
    position: absolute;
    left: 0;
    top: px2rem(-10px);
    text-align: center;
    right: 0;
    bottom: 0;
    font-size: px2rem(18px);
    color: #9ef4ff;
    & > span {
      display: inline-block;
      width: 33%;
      padding-top: px2rem(56px);
      &.left {
        text-align: right;
        padding-right: 10%;
      }
      &.right {
        text-align: left;
        padding-left: 10%;
      }
    }
  }
}
.topdata {
  width: 80%;
  margin: auto;
}
.count-box {
  text-align: center;
  font-size: px2rem(16px);
  color: #68b6ef;
  p {
    &:before {
      content: "";
      width: px2rem(40px);
      vertical-align: super;
      height: px2rem(2px);
      margin-right: px2rem(5px);
      display: inline-block;
      background-image: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0) 0%,
        #68b6ef 100%
      );
    }
    &:after {
      content: "";
      width: px2rem(40px);
      vertical-align: super;
      height: px2rem(2px);
      margin-left: px2rem(5px);
      display: inline-block;
      background-image: linear-gradient(
        90deg,
        #68b6ef 0%,
        rgba(0, 0, 0, 0) 100%
      );
    }
  }
}
.dataCount {
  div {
    display: inline-block;
    position: relative;
    // background: url("../../../assets/image/userscreen/ic_number_bj.png")
    //     repeat-x;
    // background-size: calc(36px) 100%;
    img {
      width: px2rem(36px);
    }
    font-size: px2rem(36px);
    font-weight: bold;
    letter-spacing: px2rem(16px);
    color: transparent;
    span {
      position: absolute;
      left: px2rem(18px/2);
      color: #fff;
    }
  }
}
.maincontent {
  padding: 0 px2rem(30px);
  h6 {
    font-size: px2rem(16px);
    margin: 0;
    color: #68b6ef;
    margin: px2rem(20px) 0 px2rem(15px);
    font-weight: normal;
    display: flex;
    align-items: baseline;
    &:after {
      content: "";
      background: url(../../../assets/image/largescreen/img_divisio_minimum.png)
        center no-repeat;
      background-size: 100% 100%;
      width: 70%;
      display: inline-block;
      height: px2rem(10px);
      margin-left: px2rem(20px);
      flex: 1;
    }
    &.longbg:after {
      background: url(../../../assets/image/largescreen/img_divisio_big.png)
        center no-repeat;
      background-size: 100% 100%;
    }
  }
}

.chartbox {
  background: url("../../../assets/image/userscreen/img_suspension_bj.png")
    no-repeat bottom center;
  background-size: 100%;
  margin-bottom: 2%;
}
.mapbox {
  background: url("../../../assets/image/largescreen/img_decorate.png") bottom
    center no-repeat;
  background-size: 60%;
  margin-bottom: 2%;
}
.smbarbox {
  .el-col {
    position: relative;
  }
  img.img_energy {
    width: 100%;
    height: px2rem(120px);
  }
  span {
    color: #62d4eb;
    position: absolute;
    top: 25%;
    left: 0;
    right: 0;
    text-align: center;
    display: block;
    font-size: px2rem(20px);
  }
}

.warnlistinfo {
  > div {
    height: px2rem(36px);
    line-height: px2rem(36px);
    background-color: rgba(6, 253, 255, 0.1);
    border-radius: px2rem(24px);
    display: flex;
    font-size: px2rem(16px);
    margin-bottom: px2rem(15px);
    padding: 0px px2rem(20px);
    .smicon {
      display: inline-block;
      margin-top: px2rem(5px);
      img {
        width: px2rem(22px);
        display: inline-block;
      }
    }
    &:first-child > div {
      color: #fff;
    }
    > div {
      flex: 1;
      color: #68b6ef;
      text-align: center;

      > div {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
.boxheight1 {
  height: px2rem(200px);
}
.boxheight2 {
  height: px2rem(140px);
}
.boxheight3 {
  height: px2rem(290px);
}
.boxheight4 {
  margin-top: px2rem(-60px);
}
.boxheight5 {
  height: px2rem(685px);
}

/deep/.el-scrollbar__bar.is-horizontal {
  display: none;
}
.bottomtext {
  display: flex;
  justify-content: space-between;
  padding: 0 8% 0;
  width: 100%;
  span {
    font-size: px2rem(12px);
    width: px2rem(125px);
    color: #fefefe;
    text-align: center;
    display: block;
  }
}
.bottomtext1 {
  padding: 0;
  span {
    width: 33%;
  }
}
.ledgebox {
  position: absolute;
  right: 20%;
  top: 20%;
  display: inline-block;
  margin-left: 5%;
  font-size: px2rem(24px);
  p {
    margin: 0 0 px2rem(10px);
  }
  span {
    color: #fff;
    margin-left: px2rem(10px);
    display: inline-block;
    vertical-align: middle;
    label {
      font-size: px2rem(12px);
      display: block;
      font-weight: normal;
    }
  }
  i {
    width: px2rem(35px);
    height: px2rem(35px);
    line-height: px2rem(35px);
    border-radius: 100%;
    border: solid px2rem(1px) #3e4674;
    display: inline-block;
    text-align: center;
    b {
      width: px2rem(18px);
      height: px2rem(18px);
      border-radius: 100%;
      display: inline-block;
      &.dot1 {
        background-color: #2178ff;
      }
      &.dot2 {
        background-color: #07fdff;
      }
      &.dot3 {
        background-color: #d2feff;
      }
    }
  }
}
.circlebox {
  display: flex;
  justify-content: space-between;
  padding: 0% 10% 2%;
  div {
    width: px2rem(100px);
    height: px2rem(100px);
    position: relative;
    span {
      position: absolute;
      line-height: px2rem(100px);
      border: px2rem(1px) solid #3e4674;
      border-radius: 100%;
      top: 0;
      bottom: 0;
      margin: auto;
      text-align: center;
      font-size: px2rem(20px);
      left: 0;
      right: 0;
      color: #fff;
      display: block;
    }
    canvas {
      width: px2rem(100px);
      height: px2rem(100px);
      display: inline-block;
    }
  }
}

.circlebox-lx {
  width: px2rem(140px);
  height: px2rem(140px);
  position: relative;
  top: 0%;
  left: 22%;
  font-size: 0;
  > div {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    &.circle1 {
      width: 100%;
      height: 100%;
    }
    &.circle2 {
      width: px2rem(90px);
      height: px2rem(90px);
    }
    &.circle3 {
      width: px2rem(50px);
      height: px2rem(50px);
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
