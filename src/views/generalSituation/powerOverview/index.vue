
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
                          运行容量(kVA)<b>20,000</b>
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
                          配电房(个)<b>202</b>
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
                          变压器(台)<b>24</b>
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
                    <el-row :gutter="40" class="legendbox">
                      <el-col :span="8" :push="4">
                        <p>本月电费(元)<span>50</span></p>
                      </el-col>
                      <el-col :span="8" :push="4">
                        <p>上月电费(元)<span>1</span></p>
                      </el-col>
                    </el-row>
                    <BarChart :barchartData='typeChartData' />
                  </div>
                </el-col>
                <el-col :span="16" :xs="24">
                  <div class="bg-white" style="position:relative">
                    <div class="form-smtitle ">
                      功率因素
                    </div>
                    <el-row :gutter="10" class="legendbox">
                      <el-col :span="8" :xs="24" style="padding-top: 4%;">
                        <el-col :span="24" :xs="12">
                          <p>无功电量(kVarh)<span>100</span></p>
                        </el-col>
                        <el-col :span="24" :xs="12">
                          <p>占比<span>89%</span></p>
                        </el-col>
                      </el-col>
                      <el-col :span="8" :xs="24">
                        <GaugeChart :chartData='powerChartData_month' />
                      </el-col>
                      <el-col :span="8" :xs="24">
                        <GaugeChart :chartData='powerChartData_day' />
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
                      <el-col :span="8" :xs="24">
                        <div class="chart-wrapper">
                          <GaugeLoadChart :chartData='loadChartData' />
                        </div>
                      </el-col>
                      <el-col :span="16" :xs="24">
                        <div class="chart-wrapper">
                          <el-row class="legendbox lx">
                            <el-col :span="6">
                              <p>今日最高(KW)<span>800</span></p>
                            </el-col>
                            <el-col :span="6">
                              <p>昨日最高(KW)<span>700</span></p>
                            </el-col>
                            <el-col :span="6">
                              <p>本月最高(KW)<span>800</span></p>
                            </el-col>
                            <el-col :span="6">
                              <p>上月最高(KW)<span>700</span></p>
                            </el-col>
                          </el-row>
                          <div class="rightradiobox">
                            <el-radio-group v-model="radioType" @change=handleSetLineChartData size="mini">
                              <el-radio-button :label="0">日</el-radio-button>
                              <el-radio-button :label="1">月</el-radio-button>
                            </el-radio-group>
                          </div>
                          <line-chart ref='chart' :linechartData="lineChartData" />
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
                              <p>本月最高(KW)<span>800</span></p>
                            </el-col>
                            <el-col :span="8">
                              <p>上月最高(KW)<span>700</span></p>
                            </el-col>
                            <el-col :span="8">
                              <p>本年最高(KW)<span>800</span></p>
                            </el-col>
                          </el-row>
                          <PowerBarchart ref='PowerBarchart' :barchartData="PowerbarChartData" />
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
                      <PieChart :chartData='pieChartData' />
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
      value: 56,
      itemStyle: {
        color: "#f4a248"
      }
    },
    {
      name: "基本",
      value: 12,
      itemStyle: {
        color: "#558cf7"
      }
    },
    {
      name: "力调",
      value: 34,
      itemStyle: {
        color: "#81c7f9"
      }
    }
  ]
};
const powerChartData_day = {
  title: "功率因素",
  listData: [{ value: 0.5, name: "本日平均" }]
};

const powerChartData_month = {
  title: "功率因素",
  listData: [{ value: 0.3, name: "本月平均" }]
};
const loadChartData = {
  title: "负荷",
  listData: [{ value: 49, name: "当前负荷" }]
};

const lineChartData = [
  {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  }
];

const PowerbarChartData = {
  xAxisData: ["01", "02", "03"],
  prevlistData: ["100", "133", "233"],
  nowlistData: ["211", "165", "43"]
};

const pieChartData = {
  legendData: ["尖峰", "高峰", "平时", "低谷"],
  listData: [
    { value: 335, name: "尖峰" },
    { value: 310, name: "高峰" },
    { value: 234, name: "平时" },
    { value: 135, name: "低谷" }
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
      powerChartData_month: powerChartData_month,
      powerChartData_day: powerChartData_day,
      loadChartData: loadChartData,
      lineChartData: lineChartData[0],
      PowerbarChartData: PowerbarChartData,
      pieChartData: pieChartData
    };
  },
  mounted() {
    this.dragControllerDiv();
  },
  created() {
    this.getTree();
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/tree.scss";
/deep/.smdatabox {
  padding: 40px 45px;
  b {
    display: block;
    padding-top: 20px;
    font-size: 32px;
  }
  i {
    margin-right: 8px;
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
  padding: 15px 30px 10px;
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
</style>
