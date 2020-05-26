
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
    <el-row :gutter="20" class="comheight ">
      <div class="dataCount">
        <countTo :startVal='startVal' :endVal='endVal' :duration='3000'></countTo>
      </div>
    </el-row>
  </div>
</template>

<script>
import Systime from "../components/systime.vue";

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
    Systime,
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
      pieChartData: pieChartData,

      startVal: 0,
      endVal: 2017
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
  padding: 40px 0px;

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
    // .img_title{width: }
  }
}

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
