<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

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
    autoResize: {
      type: Boolean,
      default: true
    },
    linechartData: {
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
    linechartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
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
      if (this.linechartData) {
        this.hideLoading();
        this.setOptions(this.linechartData);
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
    hideLoading() {
      this.chart.hideLoading();
    },
    setOptions({ expectedData, xAxisData, actualData, legendData } = {}) {
      this.chart.setOption({
        grid: {
          left: 30,
          right: 10,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          padding: [5, 10]
        },
        xAxis: {
          name: "",
          nameGap: 20,
          boundaryGap: false,
          data: xAxisData,
          axisTick: {
            show: false
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
          }
        },
        yAxis: {
          name: "单位(kW)",
          nameGap: 20,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#dde4f4"
            }
          },
          nameTextStyle: {
            color: "#909399"
          },
          axisLabel: {
            fontSize: 12,
            color: "#909399",
            margin: 30
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
          data: legendData
        },
        series: [
          {
            name: legendData[0],
            showAllSymbol: true,
            itemStyle: {
              // normal: {
              color: "#558cf7"
              // lineStyle: {
              //   color: "#77c3f9",
              //   width: 2
              // }
              // }
            },

            lineStyle: {
              color: "#77c3f9",
              width: 2
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#9bd0f7" // 0% 处的颜色
                  },

                  {
                    offset: 1,
                    color: "#fff" // 100% 处的颜色
                  }
                ]) //背景渐变色
              }
            },
            smooth: false,
            clip: false,
            type: "line",
            data: expectedData,
            markPoint: {
              symbol: "pin",
              symbolSize: 40,
              label: {
                fontSize: 12,
                fontWeight: "normal"
              },
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" }
              ]
            }
          },
          {
            name: legendData[1],
            showAllSymbol: true,
            clip: false,
            smooth: false,
            type: "line",
            itemStyle: {
              normal: {
                color: "#77c3f9",
                lineStyle: {
                  color: "#558cf7",
                  width: 2
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#98bbfd" // 0% 处的颜色
                  },

                  {
                    offset: 1,
                    color: "#fff" // 100% 处的颜色
                  }
                ]) //背景渐变色
              }
            },
            data: actualData,
            markPoint: {
              symbol: "pin",
              symbolSize: 40,
              label: {
                fontSize: 12,
                fontWeight: "normal"
              },
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" }
              ]
            }
          }
        ]
      });
    }
  }
};
</script>
