<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "../../components/mixins/resize";

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
      default: "300px"
    },

    chartData: {
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
    chartData: {
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
      if (this.chartData) {
        this.chart.hideLoading();
        this.setOptions(this.chartData);
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

    setOptions({ title, xAxisData, series } = {}) {
      this.chart.setOption({
        title: {
          show: false,
          text: "单位(次)",
          left: "20px",
          top: "15px",
          textStyle: {
            fontSize: 12,
            color: "#999"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          right: 15,
          top: "10px",
          itemGap: 20,
          itemWidth: 6,
          itemHeight: 6,
          icon: "circle",
          textStyle: {
            color: "#909399",
            padding: [0, 0, 0, 8]
          },
          data: ["用户报修", "故障报警"]
        },

        grid: {
          top: "50px",
          left: "30px",
          right: "75px",
          bottom: "15px",
          containLabel: true
        },
        xAxis: [
          {
            name: "单位(次)",
            type: "value",
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            nameTextStyle: {
              color: "#909399"
            },
            axisLabel: {
              fontSize: 12,
              color: "#909399",
              margin: 20
            },
            axisLine: {
              lineStyle: {
                color: "#dde4f4"
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
        yAxis: [
          {
            type: "category",
            data: xAxisData,
            axisLine: {
              lineStyle: {
                color: "#909399"
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#dde4f4",
                type: "dashed"
              }
            },
            nameTextStyle: {
              color: "#909399"
            },
            axisLabel: {
              fontSize: 12,
              color: "#909399",
              margin: 15
            }
          }
        ],
        color: ["#f6cf71", "#558cf7"],

        series
      });
      this.chart.hideLoading();
    }
  }
};
</script>
