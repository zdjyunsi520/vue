<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

const animationDuration = 6000;

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "180px"
    },

    barchartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    barchartData: {
      handler(newVal, oldVal) {
        if (this.chart) {
          if (newVal) {
            this.setOptions(newVal);
          } else {
            this.setOptions(oldVal);
          }
        } else {
          this.initChart();
        }
      },
      deep: true //对象内部属性的监听，关键。
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.showLoading();
      if (this.barchartData.listData) {
        this.chart.hideLoading();
        this.setOptions(this.barchartData);
      }
    },
    showLoading() {
      this.chart.showLoading({
        text: "Loading",
        color: "#ffffff",
        textColor: "#ffffff",
        maskColor: "rgba(0, 0, 0, 0)",
        zlevel: 0
      });
    },

    setOptions({ xAxisData, listData } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: "30px",
          left: "40px",
          right: "40px",
          bottom: "20px",
          containLabel: true
        },
        legend: {
          show: false
        },
        radiusAxis: {
          type: "category",
          data: xAxisData,
          boundaryGap: ["20%", "20%"],
          z: 10,
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#3e4674"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#3e4674"
            }
          },
          splitArea: {
            show: true
          }
        },

        polar: {},
        angleAxis: {
          boundaryGap: ["20%", "20%"],
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#3e4674"
            }
          },
          splitArea: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#3e4674"
            }
          },
          minorSplitLine: {
            show: true
          }
        },
        series: [
          {
            // name: title,
            type: "bar",
            barWidth: "40%",
            barMaxWidth:'10',
            coordinateSystem: "polar",
            data: listData
          }
        ]
      });
      this.chart.hideLoading();
    }
  }
};
</script>
