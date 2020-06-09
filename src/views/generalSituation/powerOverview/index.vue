
<template>
  <div class="app-container ">
    <el-row :gutter="20" class="comheight dragbox" ref="dragbox">
      <el-col :xs="{span: 24}" class="treebox comheight dragleft">
        <div style="background:#fff;height:100%">
          <el-scrollbar v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
            <el-tree :data="treeData" :props="defaultProps" class="comheight" :highlight-current="true" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false"></el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col class="dragresize">
        <span class="iconslider">
          <svg-icon icon-class="ic_drag" style="font-size:26px;margin-left:-8px;" />
          <i class="el-icon-arrow-left" style="font-size:12px;margin-left:-2px;" />
        </span>
      </el-col>
      <el-col :xs="{span: 24}" class="app-container dragright mxright" style="padding-top:0;padding-bottom:0;">
        <div style="height:100%;">
          <el-scrollbar v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
            <div>
              <el-row :gutter="20">
                <el-col :span="8" :xs="24">
                  <div class="smdatabox bluebg">
                    <el-row>
                      <el-col :span="18">
                        <span>
                          运行容量(kVA)<b>{{dataInfo.TotalContractCapacity}}</b>
                        </span>
                      </el-col>
                      <el-col :span="6">
                        <i>
                          <svg-icon icon-class="ic_project" /></i>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="8" :xs="24">
                  <div class="smdatabox b-bluebg">
                    <el-row>
                      <el-col :span="18">
                        <span>
                          配电房(个)<b>{{dataInfo.SwitchingRoomCount}}</b>
                        </span>
                      </el-col>
                      <el-col :span="6">
                        <i>
                          <svg-icon icon-class="ic_project" /></i>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="8" :xs="24">
                  <div class="smdatabox orangebg">
                    <el-row>
                      <el-col :span="18">
                        <span>
                          变压器(台)<b>{{dataInfo.TransformCount}}</b>
                        </span>
                      </el-col>
                      <el-col :span="6">
                        <i>
                          <svg-icon icon-class="ic_project" /></i>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8" :xs="24">
                  <div class="bg-white" style="position:relative">
                    <div class="form-smtitle ">
                      电费
                    </div>
                    <el-row :gutter="40" class="legendbox" style="padding:0 30px">
                      <el-col :span="8" :push="4">
                        <p>本月电费(元)<span>{{dataInfo.FeeThisMonth.TotalFee}}</span></p>
                      </el-col>
                      <el-col :span="8" :push="4">
                        <p>上月电费(元)<span>{{dataInfo.FeeLastMonth.TotalFee}}</span></p>
                      </el-col>
                    </el-row>
                    <BarChart ref='barChart' :barchartData='typeChartData' />
                  </div>
                </el-col>
                <el-col :span="16" :xs="24">
                  <div class="bg-white" style="position:relative">
                    <div class="form-smtitle ">
                      功率因素
                    </div>
                    <el-row :gutter="10" class="legendbox">
                      <el-col :span="8" :xs="24" style="padding-top: 2%;">
                        <el-col :span="24" :xs="12">
                          <p>无功电量(kVarh)<span>{{dataInfo.PowerFactorSituation.ReactivePower}}</span></p>
                        </el-col>
                        <el-col :span="24" :xs="12">
                          <p>占比<span>{{dataInfo.PowerFactorSituation.Rate}}%</span></p>
                        </el-col>
                      </el-col>
                      <el-col :span="8" :xs="24">
                        <GaugeChart ref='gaugeChart1' :chartData='lastMonthAverage' />
                      </el-col>
                      <el-col :span="8" :xs="24">
                        <GaugeChart ref='gaugeChart2' :chartData='thisMonthAverage' />
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-top:20px;">
                <el-col :span="24">
                  <div class="bg-white" style="position:relative">
                    <div class="form-smtitle ">
                      负荷
                    </div>
                    <el-row :gutter="20">
                      <el-col :span="6" :xs="24">
                        <div class="chart-wrapper">
                          <GaugeLoadChart :chartData='loadChartData' />
                        </div>
                      </el-col>
                      <el-col :span="18" :xs="24">
                        <div class="chart-wrapper">
                          <el-row class="legendbox lx">
                            <el-col :span="6">
                              <p>今日最高(KW)<span>{{electricLoad.TodayHighest}}</span></p>
                            </el-col>
                            <el-col :span="6">
                              <p>昨日最高(KW)<span>{{electricLoad.YesterdayHighest}}</span></p>
                            </el-col>
                            <el-col :span="6">
                              <p>本月最高(KW)<span>{{electricLoad.ThisMonthHighest}}</span></p>
                            </el-col>
                            <el-col :span="6">
                              <p>上月最高(KW)<span>{{electricLoad.LastMonthHighest}}</span></p>
                            </el-col>
                          </el-row>
                          <div class="rightradiobox">
                            <el-radio-group v-model="radioType" @change=handleSetLineChartData size="mini">
                              <el-radio-button :label="0">日</el-radio-button>
                              <el-radio-button :label="1">月</el-radio-button>
                            </el-radio-group>
                          </div>
                          <line-chart ref='lineChart' :linechartData="lineChartData" />
                        </div>
                      </el-col>
                    </el-row>

                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="20" style="margin-top:20px;">
                <el-col :span="16">
                  <div class="bg-white" style="position:relative">
                    <div class="form-smtitle ">
                      用电情况
                    </div>
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <div class="chart-wrapper">
                          <el-row class="legendbox lx" style="margin:auto;">
                            <el-col :span="8">
                              <p>本月最高(KW)<span>{{electricQuantity.ThisMonthHighest}}</span></p>
                            </el-col>
                            <el-col :span="8">
                              <p>上月最高(KW)<span>{{electricQuantity.LastMonthHighest}}</span></p>
                            </el-col>
                            <el-col :span="8">
                              <p>本年最高(KW)<span>{{electricQuantity.ThisYearHighest}}</span></p>
                            </el-col>
                          </el-row>
                          <PowerBarchart ref='PowerBarchart' :barchartData="powerbarChartData" />
                        </div>
                      </el-col>
                    </el-row>

                  </div>
                </el-col>
                <el-col :span="8" :xs="24">
                  <div class="bg-white">
                    <div class="form-smtitle ">
                      电量构成
                    </div>
                    <div class="chart-wrapper">
                      <PieChart ref="pieChart" :chartData='pieChartData' />
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
import { fetchTree } from "@/api/systemManager/organization";
import {
  getBaseInfo,
  getElectricLoad,
  getElectricQuantity,
  getElectricSituation
} from "@/api/report";

import PieChart from "./components/PieChart";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import PowerBarchart from "./components/PowerBarchart";
import GaugeChart from "./components/GaugeChart";
import GaugeLoadChart from "./components/GaugeLoadChart";

const typeChartData = {
  title: "电费",
  ytext: "单位(元)",
  xAxisData: ["电度", "基本", "力调"],
  listData: [
    {
      name: "电度",
      value: 0,
      itemStyle: {
        color: "#f4a248"
      }
    },
    {
      name: "基本",
      value: 0,
      itemStyle: {
        color: "#558cf7"
      }
    },
    {
      name: "力调",
      value: 0,
      itemStyle: {
        color: "#81c7f9"
      }
    }
  ]
};
const thisMonthAverage = {
  title: "功率因素",
  listData: [{ value: 0, name: "本月平均" }]
};

const lastMonthAverage = {
  title: "功率因素",
  listData: [{ value: 0, name: "上月平均" }]
};
const loadChartData = {
  currentLoad: 0,
  currentLoadRate: 0
};

const lineChartData = [
  {
    legendData: ["今日负荷", "昨日负荷"],
    xAxisData: ["00:00", "01:30", "3:00"],
    expectedData: [0, 0, 0],
    actualData: [0, 0, 0]
  },
  {
    legendData: ["本月负荷", "上月负荷"],
    xAxisData: ["01/01", "01/02", "01/03"],
    expectedData: [0, 0, 0],
    actualData: [0, 0, 0]
  }
];

const powerbarChartData = {
  xAxisData: ["01", "02", "03"],
  prevlistData: ["100", "133", "233"],
  nowlistData: ["211", "165", "43"]
};

const pieChartData = {
  legendData: ["尖峰", "高峰", "平时", "低谷"],
  listData: [
    { value: 0, name: "尖峰" },
    { value: 0, name: "高峰" },
    { value: 0, name: "平时" },
    { value: 0, name: "低谷" }
  ]
};

export default {
  name: "baseData",
  components: {
    PieChart,
    LineChart,
    BarChart,
    PowerBarchart,
    GaugeChart,
    GaugeLoadChart
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
      typeChartData: typeChartData,
      lastMonthAverage: lastMonthAverage,
      thisMonthAverage: thisMonthAverage,
      loadChartData: loadChartData,
      lineChartData: lineChartData[0],
      powerbarChartData: powerbarChartData,
      pieChartData: pieChartData,

      tenantId: "",
      dataInfo: {
        electricFeeSituation: {},
        FeeThisMonth: {},
        FeeLastMonth: {},
        PowerFactorSituation: {}
      },
      // PowerFactorSituation: {},
      electricQuantity: {},
      electricLoad: {}
    };
  },
  mounted() {
    this.getTree();
    this.dragControllerDiv();
  },
  created() {},
  methods: {
    getTree() {
      fetchTree({}).then(r => {
        this.treeData = r.data;
        if (r.data.length) this.handleNodeClick(r.data[0]);
        this.tenantId = this.treeData[0].id;
        this.getBaseInfo(this.tenantId);
      });
    },
    getBaseInfo(tenantId) {
      var tenantId = tenantId;
      getBaseInfo({ tenantId }).then(r => {
        this.dataInfo = r.data;
        this.typeChartData.listData[0].value = this.dataInfo.FeeThisMonth.DegreeFee;
        this.typeChartData.listData[1].value = this.dataInfo.FeeThisMonth.BaseFee;
        this.typeChartData.listData[2].value = this.dataInfo.FeeThisMonth.PowerAdjustmentFee;

        this.lastMonthAverage.listData[0].value = this.dataInfo.PowerFactorSituation.LastMonthAverage;
        this.thisMonthAverage.listData[0].value = this.dataInfo.PowerFactorSituation.ThisMonthAverage;

        this.getElectricLoad(tenantId);
        this.getElectricQuantity(tenantId);
        this.getElectricSituation(tenantId);
      });
    },
    getElectricLoad(tenantId) {
      var tenantId = tenantId;
      // this.$refs.lineChart.showLoading();
      getElectricLoad({ tenantId }).then(r => {
        this.electricLoad = r.data;
        this.loadChartData.currentLoad = this.electricLoad.CurrentLoad;
        this.loadChartData.currentLoadRate = this.electricLoad.CurrentLoadRate;
        lineChartData[0].xAxisData = this.electricLoad.DayCurve.XAxis;
        lineChartData[0].expectedData = this.electricLoad.DayCurve.Today;
        lineChartData[0].actualData = this.electricLoad.DayCurve.Yesterday;
        lineChartData[1].xAxisData = this.electricLoad.MonthCurve.XAxis;
        lineChartData[1].expectedData = this.electricLoad.MonthCurve.ThisMonth;
        lineChartData[1].actualData = this.electricLoad.MonthCurve.LastMonth;
        // this.$refs.lineChart.hideLoading();
      });
    },
    getElectricQuantity(tenantId) {
      var tenantId = tenantId;
      // this.$refs.PowerBarchart.showLoading();
      getElectricQuantity({ tenantId }).then(r => {
        this.electricQuantity = r.data;
        powerbarChartData.xAxisData = this.electricQuantity.MonthCurveXAxis;
        powerbarChartData.prevlistData = this.electricQuantity.LastMonthCurve;
        powerbarChartData.nowlistData = this.electricQuantity.ThisMonthCurve;
        // this.$refs.PowerBarchart.hideLoading();
      });
    },
    getElectricSituation(tenantId) {
      var tenantId = tenantId;
      // this.$refs.pieChart.showLoading();
      getElectricSituation({ tenantId }).then(r => {
        pieChartData.listData[0].value = r.data.Sharp;
        pieChartData.listData[1].value = r.data.Peak;
        pieChartData.listData[2].value = r.data.Flat;
        pieChartData.listData[3].value = r.data.Valley;
        // this.$refs.pieChart.hideLoading();
      });
    },

    handleNodeClick(data) {
      this.getBaseInfo(data.id);
    },
    // 用电负荷 日/月切换
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/tree.scss";
/deep/.smdatabox {
  padding: 20px 25px;
  b {
    display: block;
    padding-top: 20px;
    font-size: 32px;
  }
  i {
    vertical-align: -0.15em;
    width: 80px;
    height: 80px;
    background: #fff;
    border-radius: 100%;
    line-height: 80px;
    display: inline-block;
    font-size: 80px;
  }
}
/deep/.form-smtitle {
  padding: 20px 20px 0px;
  font-weight: normal;
  font-size: 16px;
  margin: 0;
}

.legendbox {
  padding: 10px 30px 10px;
  &.lx {
    width: 80%;
    padding-top: 0;
  }
  p {
    color: #999;
    font-size: 12px;
    text-align: center;
    padding-bottom: 0;
    span {
      display: block;
      padding-top: 10px;
      min-height: 37px;
      color: #333;
      font-size: 24px;
    }
  }
}
.chart-wrapper {
  background: #fff;
  padding: 0 20px;
  .rightradiobox {
    position: absolute;
    top: 30px;
    right: 30px;
  }
}

/deep/.el-scrollbar__bar.is-horizontal {
  display: none;
}
</style>
