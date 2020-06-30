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
      default: "350px"
    },
    autoResize: {
      type: Boolean,
      default: true
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
      this.setOptions(this.chartData);
    },
    setOptions({ xAxisData, actualData,labelunit } = {}) {
      this.chart.setOption({
        xAxis: {
          type: "category",
          data: xAxisData,
          boundaryGap: false,
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
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          padding: [5, 10]
        },
        yAxis: {
          name: labelunit?"单位（"+labelunit+"）":'',
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
          show: false
        },
        series: [
          {
            // name: "",
            smooth: false,
            type: "line",
            itemStyle: {
              normal: {
                color: "#558cf7",
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 1,
                  type: "solid",
                  color: "#558cf7" //折线的颜色
                },

                areaStyle: {
                  color: "#7fa9fa"
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#dde9ff" // 0% 处的颜色
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
