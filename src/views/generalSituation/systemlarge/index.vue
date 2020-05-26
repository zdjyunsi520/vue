
<template>
  <div class="app-container screenbg">
    <el-row class="tophead">
      <img src="@/assets/image/largescreen/img_title_bj_1.png" class="img_title_bj">
      <div class="cnt">
        <span class="left">智能运维 为客户创造价值</span>
        <img src="@/assets/image/largescreen/img_name.png" class="img_title">
        <span class="right">
          <Systime /></span>
      </div>
    </el-row>
    <el-row :gutter="20">
      <el-col :span='5' :xs='8' class='count-box'>
        <p>运维中心</p>
        <div class="dataCount">
          <countTo :startVal='startVal' :endVal='maintenanceCenter' :duration='3000' separator=''></countTo>
        </div>
      </el-col>
      <el-col :span='5' :xs='8' class='count-box'>
        <p>总用户</p>
        <div class="dataCount">
          <countTo :startVal='startVal' :endVal='totalUsers' :duration='3000' separator=''></countTo>
        </div>
      </el-col>
      <el-col :span='4' :xs='8' class='count-box'>
        <p>总容量(kVA)</p>
        <div class="dataCount">
          <countTo :startVal='startVal' :endVal='totalCapacity' :duration='3000' separator=''></countTo>
        </div>
      </el-col>
      <el-col :span='5' :xs='8' class='count-box'>
        <p>配电房</p>
        <div class="dataCount">
          <countTo :startVal='startVal' :endVal='powerRoom' :duration='3000' separator=''></countTo>
        </div>
      </el-col>
      <el-col :span='5' :xs='8' class='count-box'>
        <p>安全运行(天)</p>
        <div class="dataCount">
          <countTo :startVal='startVal' :endVal='safeRunning' :duration='3000' separator=''></countTo>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter='20' class='maincontent'>
      <el-col :span='7' :xs='24'>
        <el-row>
          <h6>用电类型统计</h6>
          <div class="chartbox">
            <powerTypePieChart :chartData='powerTypeData' />
          </div>
        </el-row>
        <el-row>
          <h6>用电分析</h6>
          <div class="chartbox">
            <el-row :gutter='30' class="smbarbox">
              <el-col :span='8'>
                <img src='@/assets/image/largescreen/img_energy.png'>
                <span>6000</span>
              </el-col>
              <el-col :span='8'>
                <img src='@/assets/image/largescreen/img_energy.png'>
                <span>3000</span>
              </el-col>
              <el-col :span='8'>
                <img src='@/assets/image/largescreen/img_energy.png'>
                <span>60000</span>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <el-row>
          <h6>用电负荷</h6>
          <div class="chartbox">
            <LineChart :linechartData='lineChartData' />
          </div>
        </el-row>
      </el-col>
      <el-col :span='10' :xs='24'>
        <el-row>
          <h6>地图</h6>
          <div class="chartbox">

          </div>
        </el-row>
        <el-row>
          <h6>预警信息</h6>
          <div class="chartbox">

          </div>
        </el-row>
      </el-col>
      <el-col :span='7' :xs='24'>
        <el-row>
          <h6>运维成果</h6>
          <div class="chartbox">
            <BarChart :barchartData='gainChartData' />
          </div>
        </el-row>
        <el-row>
          <h6>采集情况</h6>
          <div class="chartbox">

          </div>
        </el-row>
        <el-row>
          <h6>运维跟踪情况</h6>
          <div class="chartbox">
            <LineChart :linechartData='tracklineChartData' />
          </div>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Systime from "../components/systime.vue";
import countTo from "vue-count-to";
import { fetchTree } from "@/api/systemManager/organization";

import PieChart from "./components/PieChart";
import powerTypePieChart from "./components/powerTypePieChart";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";

import PowerBarchart from "./components/PowerBarchart";
import GaugeChart from "./components/GaugeChart";
import GaugeLoadChart from "./components/GaugeLoadChart";

const powerTypeData = {
  legendData: ["工业", "商业", "居民"],
  listData: [
    { value: 335, name: "工业" },
    { value: 310, name: "商业" },
    { value: 234, name: "居民" }
  ]
};
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

const lineChartData = {
  legendData:['最高负荷','平均负荷','最低负荷'],
  highData: [100, 120, 161, 134, 105, 160, 165],
  averageData: [42, 435, 23, 122, 445, 545, 54],
  lowData: [120, 82, 91, 154, 162, 140, 145]
};
const tracklineChartData = {
  legendData:['巡视','故障维修','用户报修'],
  highData: [100, 120, 161, 134, 105, 160, 165],
  averageData: [42, 435, 23, 122, 445, 545, 54],
  lowData: [120, 82, 91, 154, 162, 140, 145]
};

const gainChartData = {
  xAxisData: ["总巡检", "总预警", "总抢修"],
  listData: [
    {
      name: "总巡检(次)",
      value: 56,
      itemStyle: {
        color: "#2178ff"
      }
    },
    {
      name: "总预警(次)",
      value: 12,
      itemStyle: {
        color: "#07fdff"
      }
    },
    {
      name: "总抢修(次)",
      value: 34,
      itemStyle: {
        color: "#d2feff"
      }
    }
  ]
};

export default {
  name: "baseData",
  components: {
    Systime,
    countTo,
    powerTypePieChart,
    BarChart,

    PieChart,
    LineChart,
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
      powerTypeData: powerTypeData,
      lineChartData: lineChartData,
      tracklineChartData: tracklineChartData,
      gainChartData:gainChartData,
      startVal: 0,
      maintenanceCenter: 3,
      totalUsers: 234,
      totalCapacity: 23333,
      powerRoom: 56,
      safeRunning: 2311
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
.screenbg {
  background: url(../../../assets/image/largescreen/img_big_data_bj.png)
    no-repeat;
  background-size: 100% 100%;
}
.tophead {
  position: relative;
  padding: 40px 0px 30px;

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
      vertical-align: super;
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
  span {
    display: inline-block;
    background: url("../../../assets/image/userscreen/ic_number_bj.png")
      repeat-x;
    background-size: 40px 100%;
    color: #fff;
    font-size: 36px;
    font-weight: bold;
    padding-left: 5px;
    letter-spacing: 5px;
  }
}
.maincontent {
  padding: 0 30px;
  h6 {
    font-size: 16px;
    color: #68b6ef;
    margin-bottom: 20px;
    font-weight: normal;
    &:after {
      content: "";
      background: url(../../../assets/image/largescreen/img_divisio_minimum.png)
        center no-repeat;
      background-size: 100% 100%;
      width: 70%;
      display: inline-block;
      height: 10px;
      margin-left: 10px;
    }
  }
}

.chartbox {
  background: url("../../../assets/image/userscreen/img_suspension_bj.png")
    no-repeat bottom center;
  background-size: 100%;
}
.smbarbox {
  .el-col {
    position: relative;
  }
  img {
    width: 100%;
  }
  span {
    color: #fff;
    position: absolute;
    top: 25%;
    left: 0;
    right: 0;
    text-align: center;
    display: block;
    font-size: 20px;
  }
}
</style>
