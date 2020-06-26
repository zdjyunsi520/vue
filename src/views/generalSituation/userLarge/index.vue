
<template>
  <div class="app-container screenbg userwarp mobilewrapper">
    <el-scrollbar ref="elScrollbar" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" element-loading-spinner="el-icon-loading" class="marginright-fx">
      <el-row class="tophead">
        <img src="@/assets/image/userscreen/img_title_bj.png" class="img_title_bj">
        <div class="cnt">
          <span class="left commonchart">智能运维 为客户创造价值</span>
          <img src="@/assets/image/userscreen/img_text.png" class="img_title">
          <span class="right commonchart">
            <Systime /></span>
        </div>
      </el-row>
      <el-row :gutter="20">
        <div style="width:80%;margin:auto">
          <el-col :span='8' :xs='24' class='count-box'>
            <p>变压器</p>
            <div class="dataCount">
              <div>
                <img src="../../../assets/image/userscreen/ic_number_bj.png" alt="" :key="index" v-for="(item,index) in (maintenanceCenter+'').length" />
                <countTo :startVal='startVal' :endVal='maintenanceCenter' :duration='3000' separator=''></countTo>
              </div>
            </div>
          </el-col>
          <el-col :span='8' :xs='24' class='count-box'>
            <p>运行容量(kVA)</p>
            <div class="dataCount">
              <div>
                <img src="../../../assets/image/userscreen/ic_number_bj.png" alt="" :key="index" v-for="(item,index) in (totalCapacity+'').length" />
                <countTo :startVal='startVal' :endVal='totalCapacity' :duration='3000' separator=''></countTo>
              </div>
            </div>
          </el-col>
          <el-col :span='8' :xs='24' class='count-box'>
            <p>配电房</p>
            <div class="dataCount">
              <div>
                <img src="../../../assets/image/userscreen/ic_number_bj.png" alt="" :key="index" v-for="(item,index) in (powerRoom+'').length" />
                <countTo :startVal='startVal' :endVal='powerRoom' :duration='3000' separator=''></countTo>
              </div>
            </div>
          </el-col>

        </div>
      </el-row>
      <el-row :gutter='20' class='maincontent'>
        <el-col :span='7' :xs='24'>
          <el-row>
            <h6>本月费用占比</h6>
            <div class="chartbox boxheight1">
              <powerTypePieChart ref='powerTypePie' :chartData='powerTypeData' />
            </div>
            <div class="bottomtext">
              <span>电费占比(本月)</span>
            </div>
          </el-row>
          <el-row>
            <h6>电费情况</h6>
            <div class="chartbox boxheight2">
              <el-row class="legendbox lx">
                <el-col :span="12">
                  <p>本月电费(元))<span>{{dataInfo.FeeThisMonth.TotalFee}}</span></p>
                </el-col>
                <el-col :span="12">
                  <p>上月电费(元)<span>{{dataInfo.FeeLastMonth.TotalFee}}</span></p>
                </el-col>
              </el-row>
              <BarChart ref='barChart' :barchartData="barChartData" />
            </div>

          </el-row>
        </el-col>
        <el-col :span='10' :xs='24' class='commonchart'>
          <el-row>
            <div class="chartbox mapbox boxheight5">
              <img src='@/assets/image/earth.gif' />
              <!-- <div id="zh_globe_container" class='zh_globe_container' style=""></div> -->
            </div>
          </el-row>
          <el-row style='padding:0 20px;'>
            <h6 class="longbg">用电负荷</h6>
            <div class="chartbox boxheight4">
              <LineChart ref='loadLineChart' :linechartData='lineChartData' :width='"78%"' style='display:inline-block' />
              <div class="ledgeright">
                <p>本日最高(kW)<span>{{dataInfo.ElectricLoad.TodayHighest}}</span></p>
                <p>昨日最高(kW)<span>{{dataInfo.ElectricLoad.YesterdayHighest}}</span></p>
                <p>本月最高(kW)<span>{{dataInfo.ElectricLoad.ThisMonthHighest}}</span></p>
                <p>上月最高(kW)<span>{{dataInfo.ElectricLoad.LastMonthHighest}}</span></p>
              </div>
            </div>
          </el-row>
        </el-col>
        <el-col :span='7' :xs='24'>
          <el-row>
            <h6>功率因素</h6>
            <div class="chartbox boxheight1 smboxheight3">
              <div class="circlebox">
                <div>
                  <canvas class="js-rotate-01" width="130" height="130"></canvas>
                  <span>{{dataInfo.PowerFactorSituation.ReactivePower}}</span>
                </div>
                <div>
                  <canvas class="js-rotate-02" width="130" height="130"></canvas>
                  <span>{{dataInfo.PowerFactorSituation.LastMonthAverage}}</span>
                </div>
                <div>
                  <canvas class="js-rotate-03" width="130" height="130"></canvas>
                  <span>{{dataInfo.PowerFactorSituation.ThisMonthAverage}}</span>
                </div>
              </div>
            </div>
            <div class="bottomtext">
              <span>无功电量(kVA)</span>
              <span>本月平均</span>
              <span>上月平均</span>
            </div>
          </el-row>
          <el-row>
            <h6>用电情况</h6>
            <div class="chartbox boxheight2">
              <GainPieChart ref='gainPie' :piechartData='gainPieChartData' :width='"75%"' style='display:inline-block' />
              <div class="ledgeright ledgeright1">
                <p>本月(kWh)<span>{{electricSituation.ThisMonthAddUp}}</span></p>
                <p>上月(kWh)<span>{{electricSituation.LastMonthAddUp}}</span></p>
                <p>本年累计(kWh)<span>{{electricSituation.YearAddUp}}</span></p>
              </div>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
import {
  getScreenTenant,
  getScreenElectricSituation,
  getTenantElectricLoad,
  getElectricFeeCurve
} from "@/api/report";
import Systime from "../components/systime.vue";
import countTo from "vue-count-to";
import powerTypePieChart from "./components/powerTypePieChart";
import LineChart from "./components/LineChart";
import GainPieChart from "./components/GainPieChart";
import BarChart from "./components/BarChart";
// import * as THREE from "three";
// import img from "@/assets/image/map.png";
const powerTypeData = {
  legendData: ["基本电费", "电度电费", "力调电费"],
  listData: [
    { value: 0, name: "基本电费" },
    { value: 0, name: "电度电费" },
    { value: 0, name: "力调电费" }
  ]
};
const lineChartData = {
  legendData: ["最高负荷", "平均负荷", "最低负荷"],
  xAxisData: [],
  highData: [],
  averageData: [],
  lowData: []
};
const barChartData = {
  title: "最低负荷",
  xAxisData: [],
  listData: []
};
const gainPieChartData = [];

export default {
  name: "baseData",
  components: {
    Systime,
    countTo,
    powerTypePieChart,
    BarChart,
    GainPieChart,
    // PieChart,
    LineChart
  },

  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      loading: false,
      powerTypeData: powerTypeData,
      lineChartData: lineChartData,
      barChartData: barChartData,
      gainPieChartData: gainPieChartData,
      startVal: 0,
      maintenanceCenter: 0,
      totalCapacity: 0,
      powerRoom: 0,
      circles: [],

      dataInfo: {
        FeeThisMonth: {},
        FeeLastMonth: {},
        PowerFactorSituation: {},
        ElectricLoad: {}
      },
      electricSituation: {},
      tenantElectricLoad: {},
      electricFeeCurve: {},
      scale: 1
    };
  },
  created() {},
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

    this.getScreenTenant();
    this.getScreenElectricSituation();
    this.getTenantElectricLoad();
    this.getElectricFeeCurve();

    this.dragControllerDiv();
    this.circleCanves();
    this.renderLoop();

    // function render() {
    //   group.rotation.y -= 0.0035;
    //   renderer.render(scene, camera);
    // }
    // function animate() {
    //   requestAnimationFrame(animate);
    //   render();
    // }
    // let container = document.getElementById("zh_globe_container");
    // container.style.height = container.clientWidth + "px";
    // var renderer = new THREE.WebGLRenderer({
    //   antialias: true,
    //   preserveDrawingBuffer: true,
    //   alpha: true
    // });
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(container.clientWidth, container.clientHeight);
    // container.appendChild(renderer.domElement);

    // var scene = new THREE.Scene();
    // // 设置光线
    // scene.add(new THREE.HemisphereLight("#4eb7ff", "#4eb7ff",1));
    // var camera = new THREE.PerspectiveCamera(
    //   45,
    //    container.clientWidth / container.clientWidth,
    //   // 1,
    //   1,
    //   500
    // );
    // camera.position.set(0, 0, 15);
    // camera.lookAt(0, 0, 0);

    // const group = new THREE.Group();
    // scene.add(group);
    // var globeTextureLoader = new THREE.TextureLoader();

    // globeTextureLoader.load(img, function(texture) {
    //   var globeGgeometry = new THREE.SphereGeometry(5, 32, 32);
    //   var globeMaterial = new THREE.MeshStandardMaterial({ map: texture });
    //   var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
    //   group.add(globeMesh);
    //   // group.rotation.x = THREE.Math.degToRad(15);
    //   group.rotation.y = THREE.Math.degToRad(170);
    // });
    // animate();
  },
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
      document.querySelector(".js-rotate-01").height = 150 * this.scale;
      document.querySelector(".js-rotate-01").width = 150 * this.scale;
      document.querySelector(".js-rotate-02").height = 150 * this.scale;
      document.querySelector(".js-rotate-02").width = 150 * this.scale;
      document.querySelector(".js-rotate-03").height = 150 * this.scale;
      document.querySelector(".js-rotate-03").width = 150 * this.scale;

      this.circles = [
        new RotatingCircle(document.querySelector(".js-rotate-01"), {
          radius: 74 * this.scale,
          lineWidth: 9 * this.scale,
          strokeStyle: "#d2feff",
          degreeStart: -90,
          degreeEnd: 180,
          stepStart: 3,
          stepEnd: 1
        }),
        new RotatingCircle(document.querySelector(".js-rotate-02"), {
          radius: 74 * this.scale,
          lineWidth: 9 * this.scale,
          strokeStyle: "#07fdff",
          degreeStart: -50,
          degreeEnd: 270,
          stepStart: 3,
          stepEnd: 1
        }),
        new RotatingCircle(document.querySelector(".js-rotate-03"), {
          radius: 74 * this.scale,
          lineWidth: 9 * this.scale,
          strokeStyle: "#2178ff",
          degreeStart: -70,
          degreeEnd: 90,
          stepStart: 3,
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
    getScreenTenant() {
      getScreenTenant().then(r => {
        this.dataInfo = r.data;
        this.powerTypeData.listData[0].value = this.dataInfo.FeeThisMonth.BaseFee;
        this.powerTypeData.listData[1].value = this.dataInfo.FeeThisMonth.DegreeFee;
        this.powerTypeData.listData[2].value = this.dataInfo.FeeThisMonth.PowerAdjustmentFee;
        this.$nextTick(() => {
          this.$refs.powerTypePie.initChart();
        });
        this.maintenanceCenter = this.dataInfo.TransformCount;
        this.totalCapacity = this.dataInfo.TotalContractCapacity;
        this.powerRoom = this.dataInfo.SwitchingRoomCount;
      });
    },
    getScreenElectricSituation() {
      getScreenElectricSituation().then(r => {
        this.electricSituation = r.data;
        this.gainPieChartData.push({
          name: "高峰",
          value: this.electricSituation.Sharp
        });
        this.gainPieChartData.push({
          name: "尖峰",
          value: this.electricSituation.Peak
        });
        this.gainPieChartData.push({
          name: "平时",
          value: this.electricSituation.Flat
        });
        this.gainPieChartData.push({
          name: "低谷",
          value: this.electricSituation.Valley
        });
        this.$nextTick(() => {
          this.$refs.gainPie.initChart();
        });
      });
    },
    getTenantElectricLoad() {
      getTenantElectricLoad().then(r => {
        this.tenantElectricLoad = r.data;
        this.lineChartData.xAxisData = this.tenantElectricLoad.XAxis;
        this.lineChartData.highData = this.tenantElectricLoad.Highest;
        this.lineChartData.averageData = this.tenantElectricLoad.Average;
        this.lineChartData.lowData = this.tenantElectricLoad.Lowest;
        this.$nextTick(() => {
          this.$refs.loadLineChart.initChart();
        });
      });
    },
    getElectricFeeCurve() {
      getElectricFeeCurve().then(r => {
        this.electricFeeCurve = r.data;
        this.barChartData.xAxisData = this.electricFeeCurve.XAxis;
        this.barChartData.listData = this.electricFeeCurve.Daily;
        this.$nextTick(() => {
          this.$refs.barChart.initChart();
        });
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
  background: url(../../../assets/image/userscreen/img_user_bj.jpg) no-repeat;
  background-size: 100% 100%;
  padding: 0;
}
.tophead {
  position: relative;
  padding: 0px 0px px2rem(20px);

  .img_title_bj {
    width: 100%;
  }
  .cnt {
    position: absolute;
    left: 0;
    top: px2rem(12px);
    text-align: center;
    right: 0;
    bottom: 0;
    font-size: px2rem(22px);
    color: #9ef4ff;
    .img_title {
      padding-top: px2rem(4px);
      height: px2rem(42px);
    }
    & > span {
      display: inline-block;
      width: 33%;
      vertical-align: top;
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
    //   repeat-x;
    // background-size: calc(3103px / 100) 100%;
    img {
      width: px2rem(36px);
    }
    font-size: px2rem(36px);
    font-weight: bold;
    letter-spacing: px2rem(16px);
    color: transparent;
    span {
      position: absolute;
      // left: calc(11px / 2);
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
        left center no-repeat;
      background-size: 73% 100%;
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
  background: none;
  margin-bottom: 2%;
  text-align: center;
  & > img {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: block;
    width: px2rem(500px);
  }
}
.smbarbox {
  padding: 5% 1% 0;
  .el-col {
    position: relative;
  }
  img.img_energy {
    width: 100%;
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

.legendbox {
  padding: px2rem(15px) 10% px2rem(10px);
  p {
    color: #1fade3;
    font-size: px2rem(12px);
    text-align: center;
    padding-bottom: 0;
    span {
      display: block;
      padding-top: px2rem(10px);
      min-height: px2rem(37px);
      color: #ffffff;
      font-size: px2rem(24px);
    }
  }
}
.circlebox {
  padding: px2rem(60px) 10% 2%;
  div {
    width: px2rem(150px);
    height: px2rem(150px);
    span {
      line-height: px2rem(150px);
    }
  }
  canvas {
    width: px2rem(150px);
    height: px2rem(150px);
  }
}
.boxheight1 {
  height: px2rem(310px);
}
.boxheight2 {
  height: px2rem(400px);
}
.boxheight3 {
  height: px2rem(250px);
}
.boxheight4 {
  height: px2rem(285px);
}

.boxheight5 {
  height: px2rem(500px);
}

/deep/.el-scrollbar__bar.is-horizontal {
  display: none;
}
.bottomtext {
  display: flex;
  justify-content: center;
  padding: 2% 5% 0;
  text-align: center;
  width: 100%;
  span {
    font-size: px2rem(12px);
    width: 33%;
    color: #fefefe;
    text-align: center;
    display: inline-block;
  }
}
.ledgeright {
  display: inline-block;
  width: 20%;
  color: #fff;
  text-align: center;
  margin-top: px2rem(-25px);
  vertical-align: top;
  p {
    color: #1fade3;
    font-size: px2rem(12px);
    margin-bottom: px2rem(15px);
    span {
      color: #ffffff;
      font-size: px2rem(20px);
      line-height: 1.5;
      display: block;
    }
  }
}
.ledgeright1 {
  padding-top: 11%;
  width: 24%;
  margin-left: -9%;
  line-height: 1.8;
}
.zh_globe_container {
  width: 55%;
  height: 100%;
  margin: 0 auto;
  position: absolute;
  bottom: 4%;
  left: 0;
  right: 0;
}
</style>
