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
        <div style="height:100%">
          <el-scrollbar v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
            <div>
              <el-row :gutter="20">
                <el-col :span="8" :xs="24">
                  <div class="smdatabox bluebg">
                    <h6>
                      <i>
                        <svg-icon icon-class="ic_project" /></i> 概况
                    </h6>
                    <el-row>
                      <el-col :span="6">
                        <p>
                          <span>
                            总用户数(户)<br /><b>2</b>
                          </span>
                        </p>
                      </el-col>
                      <el-col :span="6">
                        <p>
                          <span>
                            总容量(kVA)<br /><b>20,000</b>
                          </span>
                        </p>
                      </el-col>
                      <el-col :span="6">
                        <p>
                          <span>配电房(个)<br /><b>20</b></span>
                        </p>
                      </el-col>
                      <el-col :span="6">
                        <p>
                          <span>安全运行(天)<br /><b>21,900</b></span>
                        </p>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="8" :xs="24">
                  <div class="smdatabox b-bluebg">
                    <h6>
                      <i>
                        <svg-icon icon-class="ic_project" /></i> 运维规模
                    </h6>
                    <el-row>
                      <el-col :span="8">
                        <p>
                          <span>运维城市(个)<br /><b>2</b></span>
                        </p>
                      </el-col>
                      <el-col :span="8">
                        <p>
                          <span>运维中心(个)<br /><b>21,000</b></span>
                        </p>
                      </el-col>
                      <el-col :span="8">
                        <p>
                          <span>运维人员(个)<br /><b>2</b></span>
                        </p>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="8" :xs="24">
                  <div class="smdatabox orangebg">
                    <h6>
                      <i>
                        <svg-icon icon-class="ic_project" /></i> 运维成果
                    </h6>
                    <el-row>
                      <el-col :span="8">
                        <p>
                          <span>总巡检(次)<br /><b>27</b></span>
                        </p>
                      </el-col>
                      <el-col :span="8">
                        <p>
                          <span>总预警(次)<br /><b>27,009</b></span>
                        </p>
                      </el-col>
                      <el-col :span="8">
                        <p>
                          <span>总抢修(次)<br /><b>27</b></span>
                        </p>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <div class="bg-white" style="position:relative">
                    <div class="form-smtitle ">
                      用电负荷
                    </div>
                    <div class="chart-wrapper">
                      <el-row class="legendbox lx" v-if="radioType==0">
                        <el-col :span="8">
                          <p>今日最高(KW)<span>800</span></p>
                        </el-col>
                        <el-col :span="8">
                          <p>昨日最高(KW)<span>700</span></p>
                        </el-col>
                        <el-col :span="8">
                          <p>日平均(KW)<span>760</span></p>
                        </el-col>
                      </el-row>
                      <el-row :gutter="10" class="legendbox" v-else>
                        <el-col :span="8">
                          <p>本月最高(KW)<span>800</span></p>
                        </el-col>
                        <el-col :span="8">
                          <p>上月最高(KW)<span>700</span></p>
                        </el-col>
                        <el-col :span="8">
                          <p>月平均(KW)<span>760</span></p>
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
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-top:20px;">
                <el-col :span="8" :xs="24">
                  <div class="bg-white">
                    <div class="form-smtitle ">
                      抢修情况
                    </div>
                    <el-row :gutter="5" class="legendbox">
                      <el-col :span="12" :xs="24">
                        <el-row :gutter="10">
                          <el-col :span="12">
                            <p>累计报修(次)<span>45</span></p>
                          </el-col>
                          <el-col :span="12">
                            <p>累计抢修(次)<span>23</span></p>
                          </el-col>
                        </el-row>
                        <el-row :gutter="10">
                          <el-col :span="12">
                            <p>已完成(次)<span>50</span></p>
                          </el-col>
                          <el-col :span="12">
                            <p>未完成(次)<span>45</span></p>
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col :span="12" :xs="24">
                        <PieChart :chartData='repairPieChartData' />
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="8" :xs="24">
                  <div class="bg-white">
                    <div class="form-smtitle ">
                      巡视情况
                    </div>
                    <el-row :gutter="10" class="legendbox">
                      <el-col :span="8" :xs="24">
                        <el-col :span="24" :xs="12">
                          <p>本月计划巡检(次)<span>100</span></p>
                        </el-col>
                        <el-col :span="24" :xs="12">
                          <p>本月实际巡检(次)<span>89</span></p>
                        </el-col>
                      </el-col>
                      <el-col :span="16" :xs="24">
                        <PieChart :chartData='patrolPieChartData' />
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="8" :xs="24">
                  <div class="bg-white">
                    <div class="form-smtitle ">
                      采集情况
                    </div>
                    <el-row :gutter="10" class="legendbox">
                      <el-col :span="8" :xs="24">
                        <el-col :span="24" :xs="12">
                          <p>采集器(个)<span>100</span></p>
                        </el-col>
                        <el-col :span="24" :xs="12">
                          <p>表计(个)<span>89</span></p>
                        </el-col>
                      </el-col>
                      <el-col :span="16" :xs="24">
                        <PieChart :chartData='collectionPieChartData' />
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-top:20px;">
                <el-col :span="8" :xs="24">
                  <div class="bg-white">
                    <div class="form-smtitle ">
                      告警情况
                    </div>

                    <el-row :gutter="10" class="legendbox">
                      <el-col :span="6">
                        <p>本月累计<span>31次</span></p>
                      </el-col>
                      <el-col :span="6">
                        <p>本月新增<span>23次</span></p>
                      </el-col>
                      <el-col :span="6">
                        <p>上月累计<span>34次</span></p>
                      </el-col>
                      <el-col :span="6">
                        <p>未处理<span>0个</span></p>
                      </el-col>
                    </el-row>
                    <AlarmPieChart />
                  </div>
                </el-col>
                <el-col :span="8" :xs="24">
                  <div class="bg-white">
                    <div class="form-smtitle ">
                      用电情况
                    </div>

                    <el-row :gutter="20" class="legendbox">
                      <el-col :span="8">
                        <p>本月(kWh)<span>80012</span></p>
                      </el-col>
                      <el-col :span="8">
                        <p>上月(kWh)<span>83012</span></p>
                      </el-col>
                      <el-col :span="8">
                        <p>月平均(kWh)<span>280012</span></p>
                      </el-col>
                    </el-row>
                    <BarChart :barchartData='structureChartData' />
                  </div>
                </el-col>
                <el-col :span="8" :xs="24">
                  <div class="bg-white">
                    <div class="form-smtitle ">
                      用电类型统计
                    </div>
                    <el-row :gutter="20" class="legendbox">
                      <el-col :span="8">
                        <p>商业(户)<span>50</span></p>
                      </el-col>
                      <el-col :span="8">
                        <p>工业(户)<span>1</span></p>
                      </el-col>
                      <el-col :span="8">
                        <p>居民(户)<span>340</span></p>
                      </el-col>
                    </el-row>
                    <BarChart :barchartData='typeChartData' />
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

import AlarmPieChart from "./components/AlarmPieChart";
import BarChart from "./components/BarChart";
const repairPieChartData = {
  title: "抢修情况",
  text: "抢修完成率",
  colors: ["#558cf7", "#e3ebff"],
  listData: [
    {
      value: 11,
      name: "已完成"
    },
    {
      value: 32,
      name: "未完成"
    }
  ]
};
const patrolPieChartData = {
  title: "巡视情况",
  text: "巡视完成率",
  colors: ["#81c7f9", "#daf0ff"],
  listData: [
    {
      value: 11,
      name: "本月计划巡检"
    },
    {
      value: 32,
      name: "本月实际巡检"
    }
  ]
};
const collectionPieChartData = {
  title: "采集情况",
  text: "在线率",
  colors: ["#f4a248", "#ffedda"],
  listData: [
    {
      value: 11,
      name: "本月计划巡检"
    },
    {
      value: 32,
      name: "本月实际巡检"
    }
  ]
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
const structureChartData = {
  ytext: "单位(kWh)",
  xAxisData: ["尖峰", "高峰", "平时", "低谷"],
  listData: [
    {
      name: "尖峰",
      value: 56,
      itemStyle: {
        color: "#f4a248"
      }
    },
    {
      name: "高峰",
      value: 12,
      itemStyle: {
        color: "#f6cf71"
      }
    },
    {
      name: "平时",
      value: 34,
      itemStyle: {
        color: "#558cf7"
      }
    },
    {
      name: "低谷",
      value: 5,
      itemStyle: {
        color: "#81c7f9"
      }
    }
  ]
};
const typeChartData = {
  ytext: "单位(kWh)",
  xAxisData: ["商业", "工业", "居民"],
  listData: [
    {
      name: "商业",
      value: 56,
      itemStyle: {
        color: "#f4a248"
      }
    },
    {
      name: "工业",
      value: 12,
      itemStyle: {
        color: "#558cf7"
      }
    },
    {
      name: "居民",
      value: 34,
      itemStyle: {
        color: "#81c7f9"
      }
    }
  ]
};
export default {
  name: "baseData",
  components: {
    PieChart,
    LineChart,
    AlarmPieChart,
    BarChart
  },

  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      lineChartData: lineChartData[0],
      radioType: 0,
      loading: false,
      structureChartData: structureChartData,
      typeChartData: typeChartData,
      repairPieChartData: repairPieChartData,
      patrolPieChartData: patrolPieChartData,
      collectionPieChartData: collectionPieChartData
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
.app-container {
  font-size: 14px;
}
h6 {
  margin: 0;
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
    width: 60%;
    padding-top: 0;
    margin-left: 20% !important;
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
.smtitle1 {
  text-align: center;
  padding: 30px 30px 15px;
  margin: 0;
  font-size: 14px;
  font-weight: normal;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 0 8px;
  }
}
</style>
