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
      default: "130px"
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
      if (this.barchartData.xAxisData.length > 0) {
        this.chart.hideLoading();
        this.setOptions(this.barchartData);
      }
    },
    showLoading() {
      this.chart.showLoading({
        text: "Loading",
        color: "#999999",
        textColor: "#999",
        maskColor: "rgba(0, 0, 0, 0)",
        zlevel: 0
      });
    },

    setOptions({ ytext, title, xAxisData, listData } = {}) {
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
          right: 0,
          top: "0px",
          itemWidth: 6,
          itemHeight: 6,
          icon: "circle",
          textStyle: {
            color: "#909399"
          },
          data: xAxisData
        },

        xAxis: [
          {
            type: "category",
            data: xAxisData,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: "#909399"
              }
            }
          }
        ],
        yAxis: [
          {
            name: ytext,
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#909399"
              }
            },
            splitLine: {
              lineStyle: {
                color: "#dde4f4",
                type: "dashed"
              }
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: title,
            type: "bar",
            barWidth: "30%",
            barMaxWidth: "50",
            data: listData
          }
        ]
      });
      this.chart.hideLoading();
    }
  }
};
</script>
