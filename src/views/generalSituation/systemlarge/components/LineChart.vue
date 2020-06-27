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
      default: "98%"
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
      if (this.linechartData.xAxisData.length > 0) {
        this.hideLoading();
        this.setOptions(this.linechartData);
      }
    },

    showLoading() {
      this.chart.showLoading({
        text: "Loading",
        color: "#fff",
        textColor: "#fff",
        maskColor: "rgba(0, 0, 0,0)",
        zlevel: 0
      });
    },
    hideLoading() {
      this.chart.hideLoading();
    },

    setOptions({ xAxisData, legendData,yAxisName, highData, averageData, lowData } = {}) {
      this.chart.setOption({
        grid: {
          left: 10,
          right: 40,
          bottom: 30,
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
            color: "#68b6ef"
          },
          axisLabel: {
            fontSize: 12,
            color: "#68b6ef",
            margin: 20
          },
          axisLine: {
            lineStyle: {
              color: "#1b2c5e"
            }
          }
        },
        yAxis: {
          name: yAxisName,
          nameGap: 20,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: "#1b2c5e"
            }
          },
          nameTextStyle: {
            color: "#68b6ef"
          },
          axisLabel: {
            fontSize: 12,
            color: "#68b6ef",
            margin: 30
          },
          splitLine: {
            lineStyle: {
              color: "#1b2c5e"
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
            color: "#ffffff",
            fontSize: 12
          },
          data: legendData
        },
        series: [
          {
            name: legendData[0],
            showAllSymbol: true,
            itemStyle: {
              // normal: {
              color: "#2178ff"
              // lineStyle: {
              //   color: "#77c3f9",
              //   width: 2
              // }
              // }
            },

            lineStyle: {
              color: "#2178ff",
              width: 1
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#2178ff" // 0% 处的颜色
                  },

                  {
                    offset: 1,
                    color: "rgba(0,0,0,0)" // 100% 处的颜色
                  }
                ]) //背景渐变色
              }
            },
            smooth: true,
            clip: false,
            type: "line",
            data: highData
          },
          {
            name: legendData[1],
            showAllSymbol: true,
            clip: false,
            smooth: true,
            type: "line",
            itemStyle: {
              normal: {
                color: "#07fdff",
                lineStyle: {
                  color: "#07fdff",
                  width: 1
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#07fdff" // 0% 处的颜色
                  },

                  {
                    offset: 1,
                    color: "rgba(0,0,0,0)" // 100% 处的颜色
                  }
                ]) //背景渐变色
              }
            },
            data: averageData
          },
          {
            name: legendData[2],
            showAllSymbol: true,
            clip: false,
            smooth: true,
            type: "line",
            itemStyle: {
              normal: {
                color: "#d2feff",
                lineStyle: {
                  color: "#d2feff",
                  width: 1
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#1b2c5e" // 0% 处的颜色
                  },

                  {
                    offset: 1,
                    color: "rgba(0,0,0,0)" // 100% 处的颜色
                  }
                ]) //背景渐变色
              }
            },
            data: lowData
          }
        ]
      });
    }
  }
};
</script>
