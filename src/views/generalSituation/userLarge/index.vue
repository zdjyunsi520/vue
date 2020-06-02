
<template>
  <div class="app-container screenbg userwarp mobilewrapper">
    <el-scrollbar ref="elScrollbar" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
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
                {{maintenanceCenter}}
                <countTo :startVal='startVal' :endVal='maintenanceCenter' :duration='3000' separator=''></countTo>
              </div>
            </div>
          </el-col>
          <el-col :span='8' :xs='24' class='count-box'>
            <p>运行容量(kVA)</p>
            <div class="dataCount">
              <div>
                {{totalCapacity}}
                <countTo :startVal='startVal' :endVal='totalCapacity' :duration='3000' separator=''></countTo>
              </div>
            </div>
          </el-col>
          <el-col :span='8' :xs='24' class='count-box'>
            <p>配电房</p>
            <div class="dataCount">
              <div>
                {{powerRoom}}
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
              <powerTypePieChart :chartData='powerTypeData' />
            </div>
            <div class="bottomtext">
              <span>电费占比(本月)</span>
            </div>
          </el-row>
          <el-row>
            <h6>电费情况</h6>
            <div class="chartbox boxheight2">
              <el-row class="legendbox lx" v-if="radioType==0">
                <el-col :span="12">
                  <p>本月电费(元))<span>800</span></p>
                </el-col>
                <el-col :span="12">
                  <p>上月电费(元)<span>700</span></p>
                </el-col>
              </el-row>
              <BarChart :barchartData="barChartData" />
            </div>

          </el-row>
        </el-col>
        <el-col :span='10' :xs='24' class='commonchart'>
          <el-row>
            <div class="chartbox mapbox boxheight5">
              <img src='@/assets/image/earth.gif'/>
              <!-- <div id="zh_globe_container" class='zh_globe_container' style=""></div> -->
            </div>
          </el-row>
          <el-row style='padding:0 20px;'>
            <h6 class="longbg">用电负荷</h6>
            <div class="chartbox boxheight4">
              <LineChart :linechartData='lineChartData' :width='"75%"' style='display:inline-block' />
              <div class="ledgeright">
                <p>本日最高(kW)<span>2252</span></p>
                <p>昨日最高(kW)<span>2252</span></p>
                <p>本月最高(kW)<span>2252</span></p>
                <p>上月最高(kW)<span>2252</span></p>
              </div>
            </div>
          </el-row>
        </el-col>
        <el-col :span='7' :xs='24'>
          <el-row>
            <h6>功率因素</h6>
            <div class="chartbox boxheight3 smboxheight3">
              <div class="circlebox">
                <div>
                  <canvas class="js-rotate-01" width="100" height="100"></canvas>
                  <span>187</span>
                </div>
                <div>
                  <canvas class="js-rotate-02" width="100" height="100"></canvas>
                  <span>443</span>
                </div>
                <div>
                  <canvas class="js-rotate-03" width="100" height="100"></canvas>
                  <span>123</span>
                </div>
              </div>
            </div>
            <div class="bottomtext">
              <span>无功电量(kVA)</span>
              <span>本月平均</span>
              <span>上月平均</span>
            </div>
          </el-row>
          <el-row style='margin-top: 2vh;'>
            <h6>用电情况</h6>
            <div class="chartbox boxheight2">
              <GainPieChart :piechartData='gainPieChartData' :width='"75%"' style='display:inline-block' />
              <div class="ledgeright ledgeright1">
                <p>本月(kWh)<span>2252</span></p>
                <p>上月(kWh)<span>2252</span></p>
                <p>本年累计(kWh)<span>2252</span></p>
              </div>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
import Systime from "../components/systime.vue";
import countTo from "vue-count-to";
import { fetchTree } from "@/api/systemManager/organization";
// import PieChart from "./components/PieChart";
import powerTypePieChart from "./components/powerTypePieChart";
import LineChart from "./components/LineChart";
import GainPieChart from "./components/GainPieChart";
import BarChart from "./components/BarChart";
import * as THREE from "three";
import img from "@/assets/image/map.png";
const powerTypeData = {
  legendData: ["基本电商", "电度电费", "力调电费"],
  listData: [
    { value: 30, name: "基本电商" },
    { value: 60, name: "电度电费" },
    { value: 10, name: "力调电费" }
  ]
};
const lineChartData = {
  legendData: ["最高负荷", "平均负荷", "最低负荷"],
  highData: [100, 120, 161, 134, 105, 160, 165],
  averageData: [42, 435, 23, 122, 445, 545, 54],
  lowData: [120, 82, 91, 154, 162, 140, 145]
};
const barChartData = {
  title: "最低负荷",
  xAxisData: ["01/01", "01/02", "01/03", "01/04", "01/05", "01/06", "01/07"],
  listData: [120, 82, 91, 154, 162, 140, 145]
};
const gainPieChartData = [
  {
    name: "尖峰",
    value: 554
  },
  {
    name: "高峰",
    value: 311
  },
  {
    name: "平时",
    value: 200
  },
  {
    name: "低谷",
    value: 100
  }
];

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
      radioType: 0,
      loading: false,
      powerTypeData: powerTypeData,
      lineChartData: lineChartData,
      barChartData: barChartData,
      gainPieChartData: gainPieChartData,
      startVal: 0,
      maintenanceCenter: 3,
      totalUsers: 234,
      totalCapacity: 23333,
      powerRoom: 56,
      safeRunning: 2311,
      circles: []
    };
  },
  created() {
    this.getTree();
  },
  mounted() {
    this.dragControllerDiv();
    this.circleCanves();
    this.renderLoop();

    function render() {
      group.rotation.y -= 0.0035;
      renderer.render(scene, camera);
    }
    function animate() {
      requestAnimationFrame(animate);
      render();
    }
    let container = document.getElementById("zh_globe_container");
    container.style.height = container.clientWidth + "px";
    var renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    // 设置光线
    scene.add(new THREE.HemisphereLight("#4eb7ff", "#4eb7ff",1));
    var camera = new THREE.PerspectiveCamera(
      45,
       container.clientWidth / container.clientWidth,
      // 1,
      1,
      500
    );
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);
    var globeTextureLoader = new THREE.TextureLoader();

    globeTextureLoader.load(img, function(texture) {
      var globeGgeometry = new THREE.SphereGeometry(5, 32, 32);
      var globeMaterial = new THREE.MeshStandardMaterial({ map: texture });
      var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
      group.add(globeMesh);
      // group.rotation.x = THREE.Math.degToRad(15);
      group.rotation.y = THREE.Math.degToRad(170);
    });
    animate();
  },
  methods: {
    getTree() {
      fetchTree({}).then(r => {
        this.treeData = r.data;
        if (r.data.length) this.handleNodeClick(r.data[0]);
      });
    },
    handleNodeClick(data) {
      // this.queryParams.tenantId = data.id;
      // this.queryParams.text = data.text;
      // this.getList();
    },
    // 用电负荷 日/月切换
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },

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

      this.circles = [
        new RotatingCircle(document.querySelector(".js-rotate-01"), {
          radius: 49,
          lineWidth: 9,
          strokeStyle: "#d2feff",
          degreeStart: -90,
          degreeEnd: 180,
          stepStart: 3,
          stepEnd: 1
        }),
        new RotatingCircle(document.querySelector(".js-rotate-02"), {
          radius: 49,
          lineWidth: 9,
          strokeStyle: "#07fdff",
          degreeStart: -50,
          degreeEnd: 270,
          stepStart: 3,
          stepEnd: 1
        }),
        new RotatingCircle(document.querySelector(".js-rotate-03"), {
          radius: 49,
          lineWidth: 9,
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
    }
  }
};
</script>
<style lang="scss" scoped>
.screenbg {
  background: url(../../../assets/image/userscreen/img_user_bj.jpg) no-repeat;
  background-size: 100% 100%;
  padding: 0 15px;
}
.tophead {
  position: relative;
  padding: 0px 0px 20px;

  .img_title_bj {
    width: 100%;
  }
  .cnt {
    position: absolute;
    left: 0;
    top: 10px;
    text-align: center;
    right: 0;
    bottom: 0;
    font-size: 18px;
    color: #9ef4ff;
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
  font-size: 16px;
  color: #68b6ef;
  p {
    &:before {
      content: "";
      width: 40px;
      vertical-align: super;
      height: 2px;
      margin-right: 5px;
      display: inline-block;
      background-image: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0) 0%,
        #68b6ef 100%
      );
    }
    &:after {
      content: "";
      width: 40px;
      vertical-align: super;
      height: 2px;
      margin-left: 5px;
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
    background: url("../../../assets/image/userscreen/ic_number_bj.png")
      repeat-x;
    background-size: calc(3103px / 100) 100%;
    font-size: 36px;
    font-weight: bold;
    letter-spacing: 11px;
    color: transparent;
    span {
      position: absolute;
      left: calc(11px / 2);
      color: #fff;
    }
  }
}
.maincontent {
  padding: 0 30px;
  h6 {
    font-size: 16px;
    margin: 0;
    color: #68b6ef;
    margin: 20px 0 15px;
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
      height: 10px;
      margin-left: 20px;
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
    font-size: 20px;
  }
}

.legendbox {
  padding: 15px 10% 10px;
  p {
    color: #1fade3;
    font-size: 12px;
    text-align: center;
    padding-bottom: 0;
    span {
      display: block;
      padding-top: 10px;
      color: #ffffff;
      font-size: 24px;
    }
  }
}
.circlebox {
  padding: 10% 10% 2%;
}
.boxheight1 {
  height: 28vh;
}
.boxheight2 {
  height: 34vh;
}
.boxheight3 {
  height: 26vh;
}
.boxheight4 {
  height: 24vh;
}

.boxheight5 {
  height: 46vh;
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
    font-size: 12px;
    width: 33%;
    color: #fefefe;
    text-align: center;
    display: inline-block;
  }
}
.ledgeright {
  display: inline-block;
  width: 24%;
  color: #fff;
  text-align: center;
  margin-top: -20px;
  vertical-align: top;
  p {
    color: #1fade3;
    font-size: 12px;
    margin-bottom: 15px;
    span {
      color: #ffffff;
      font-size: 20px;
      line-height: 1.5;
      display: block;
    }
  }
}
.ledgeright1 {
  padding-top: 11%;
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
