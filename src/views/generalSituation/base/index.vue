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
          <svg-icon icon-class="ic_drag" style="font-size:16px;margin-left:-5px;" />
          <i class="el-icon-arrow-left" style="font-size:12px;margin-left:-2px;" />
        </span>
      </el-col>
      <el-col :xs="{span: 24}" class="app-container dragright mxright" style="padding-top:0;padding-bottom:0;">
        <div style="background:#fff;height:100%">
          <el-scrollbar v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">

            <el-row :gutter="20">
              <el-col :span="8" :xs="24">
                <div class="smdatabox bluebg">
                  <h6>
                    <i class="el-icon-money"></i> 概况
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
                    <i class="el-icon-money"></i> 运维规模
                  </h6>
                  <el-row>
                    <el-col :span="8">
                      <p>
                        <span>
                          <b>2</b>个
                        </span>
                        <br />运维城市
                      </p>
                    </el-col>
                    <el-col :span="8">
                      <p>
                        <span>
                          <b>1</b>
                        </span>
                        <br />运维中心
                      </p>
                    </el-col>
                    <el-col :span="8">
                      <p>
                        <span>
                          <b>6</b>
                        </span>
                        <br />运维人员
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="8" :xs="24">
                <div class="smdatabox orangebg">
                  <h6>
                    <i class="el-icon-money"></i> 运维成果
                  </h6>
                  <el-row>
                    <el-col :span="8">
                      <p>
                        <span>
                          <b>2</b>次
                        </span>
                        <br />总巡检（年）
                      </p>
                    </el-col>
                    <el-col :span="8">
                      <p>
                        <span>
                          <b>15</b>次
                        </span>
                        <br />总预警
                      </p>
                    </el-col>
                    <el-col :span="8">
                      <p>
                        <span>
                          <b>69</b>次
                        </span>
                        <br />总抢修
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8" :xs="24">
                <div class="bg-white">
                  <h6>
                    <i class="el-icon-money"></i> 用电类型统计
                  </h6>
                  <div class="chart-wrapper">
                    <el-row :gutter="10" class="legendbox">
                      <el-col :span="8">
                        <p>商业<span>50户</span></p>
                      </el-col>
                      <el-col :span="8">
                        <p>工业<span>10户</span></p>
                      </el-col>
                      <el-col :span="8">
                        <p>居民<span>340户</span></p>
                      </el-col>
                    </el-row>
                    <pie-chart />
                  </div>
                </div>
              </el-col>
              <el-col :span="16" :xs="24">
                <div class="bg-white">
                  <h6>
                    <i class="el-icon-money"></i> 用电负荷
                  </h6>
                  <div class="chart-wrapper">
                    <el-row :gutter="10" class="legendbox">
                      <el-col :span="8">
                        <p>今日最高<span>800KW</span></p>
                      </el-col>
                      <el-col :span="8">
                        <p>昨日最高<span>700KW</span></p>
                      </el-col>
                      <el-col :span="8">
                        <p>日平均<span>760KW</span></p>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10" class="legendbox">
                      <el-col :span="8">
                        <p>本月最高<span>800KW</span></p>
                      </el-col>
                      <el-col :span="8">
                        <p>上月最高<span>700KW</span></p>
                      </el-col>
                      <el-col :span="8">
                        <p>月平均<span>760KW</span></p>
                      </el-col>
                    </el-row>
                    <div style="text-align:right;padding:10px 0">
                      <el-radio-group v-model="radioType" @change=handleSetLineChartData size="mini">
                        <el-radio-button :label="0">日</el-radio-button>
                        <el-radio-button :label="1">月</el-radio-button>
                      </el-radio-group>
                    </div>
                    <line-chart :chart-data="lineChartData" />
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12" :xs="24">
                <div class="bg-white">
                  <h6>
                    <i class="el-icon-money"></i> 用电情况
                  </h6>
                  <h5 class="smtitle">用电分析</h5>
                  <el-row :gutter="10" class="legendbox">
                    <el-col :span="8">
                      <p>本月<span>80012kWh</span></p>
                    </el-col>
                    <el-col :span="8">
                      <p>上月<span>83012kWh</span></p>
                    </el-col>
                    <el-col :span="8">
                      <p>累计(年)<span>280012kWh</span></p>
                    </el-col>
                  </el-row>
                  <h5 class="smtitle">用电结构</h5>
                  <el-row :gutter="10" class="legendbox">
                    <el-col :span="8" :xs="24" class="v-center">
                      <p>尖峰<span>677kWh</span></p>
                      <p>高峰<span>566kWh</span></p>
                      <p>平均<span>342kWh</span></p>
                      <p>低谷<span>412kWh</span></p>
                    </el-col>
                    <el-col :span="16" :xs="24">
                      <Structure-PieChart />
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="12" :xs="24">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <div class="bg-white">
                      <h6>
                        <i class="el-icon-money"></i> 巡视情况
                      </h6>
                      <el-row :gutter="10" class="legendbox">
                        <el-col :span="8" :xs="12" class="v-center">
                          <p>本月计划巡检<span>100次</span></p>
                        </el-col>
                        <el-col :span="8" :xs="12" class="v-center">
                          <p>本月实际巡检<span>89次</span></p>
                        </el-col>
                        <el-col :span="8" :xs="24">
                          <Patrol-PieChart />
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="24">
                    <div class="bg-white">
                      <h6>
                        <i class="el-icon-money"></i> 抢修情况
                      </h6>
                      <el-row :gutter="10" class="legendbox">
                        <el-col :span="16" :xs="24" class="v-center">
                          <el-row :gutter="10">
                            <el-col :span="8">
                              <p>本月(总)<span>50次</span></p>
                            </el-col>
                            <el-col :span="8">
                              <p>报修<span>45次</span></p>
                            </el-col>
                            <el-col :span="8">
                              <p>抢修<span>23次</span></p>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="8">
                              <p>已完成<span>50次</span></p>
                            </el-col>
                            <el-col :span="8">
                              <p>未完成<span>45次</span></p>
                            </el-col>
                            <el-col :span="8">
                              <p>完成率<span>100%</span></p>
                            </el-col>
                          </el-row>
                        </el-col>
                        <el-col :span="8" :xs="24">
                          <RepairPieChart />
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12" :xs="24">
                <div class="bg-white">
                  <h6>
                    <i class="el-icon-money"></i> 采集情况
                  </h6>
                  <div class="chart-wrapper">
                    <el-row :gutter="10" class="legendbox">
                      <el-col :span="8">
                        <p>采集器<span>100个</span></p>
                      </el-col>
                      <el-col :span="8">
                        <p>表计<span>500个</span></p>
                      </el-col>
                      <el-col :span="8">
                        <p>在线率<span>78%</span></p>
                      </el-col>
                    </el-row>
                    <CollectionPieChart />
                  </div>
                </div>
              </el-col>
              <el-col :span="12" :xs="24">
                <div class="bg-white">
                  <h6>
                    <i class="el-icon-money"></i> 告警情况
                  </h6>
                  <div class="chart-wrapper">
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
                </div>
              </el-col>
            </el-row>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchTree } from "@/api/systemManager/organization";

import PieChart from "./components/PieChart";
import StructurePieChart from "./components/StructurePieChart";
import LineChart from "./components/LineChart";
import PatrolPieChart from "./components/PatrolPieChart";
import CollectionPieChart from "./components/CollectionPieChart";
import RepairPieChart from "./components/RepairPieChart";
import AlarmPieChart from "./components/AlarmPieChart";

// import { listUser as fetchList } from "@/api/system/user";

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
export default {
  name: "baseData",
  components: {
    PieChart,
    LineChart,
    StructurePieChart,
    PatrolPieChart,
    CollectionPieChart,
    RepairPieChart,
    AlarmPieChart
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
      loading: false
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

.v-center {
  padding-top: 5%;
}
.legendbox p {
  color: #333;
  font-size: 12px;
  padding-bottom: 0;
  span {
    display: inline-block;
    margin-left: 5px;
    font-size: 12px;
  }
}
.chart-wrapper {
  background: #fff;
  padding: 0 16px;
}
.smtitle {
  text-align: center;
  padding: 10px 0;
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
