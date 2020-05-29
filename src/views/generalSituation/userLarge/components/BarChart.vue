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
      default: "72%"
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
            this.setOption(newVal);
          } else {
            this.setOption(oldVal);
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
        color: "#999999",
        textColor: "#999",
        maskColor: "rgba(0, 0, 0, 0)",
        zlevel: 0
      });
    },

    setOptions({  title, xAxisData, listData } = {}) {
      const sideData = listData.map(item => item + 4.5);
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: "10px",
          left: "10px",
          right: "10px",
          bottom: "40px",
          containLabel: true
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
                color: "#36435f"
              }
            },
            axisLabel:{
              color:'#fff'
            }
          }
        ],
        yAxis: [
          {
            // name: ytext,
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#36435f"
              }
            },
            splitLine: {
              lineStyle: {
                color: "#36435f",
                type: "dashed"
              }
            },
            splitArea: {
              show: false
            },
            axisLabel:{
              color:'#fff'
            }
          }
        ],
        series: [
          {
            name: title,
            type: "bar",
            barWidth: 16.5,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: "#0B4EC3" // 0% 处的颜色
                    }, {
                        offset: 0.6,
                        color: "#138CEB" // 60% 处的颜色
                    }, {
                        offset: 1,
                        color: "#17AAFE" // 100% 处的颜色
                    }], false)
                }
            },
            data: listData
          },{
            type: 'bar',
            barWidth: 6,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                        offset: 0,
                        color: "#09337C" // 0% 处的颜色
                    }, {
                        offset: 0.6,
                        color: "#0761C0" // 60% 处的颜色
                    }, {
                        offset: 1,
                        color: "#0575DE" // 100% 处的颜色
                    }], false)
                }
            },
            barGap: 0,
            data: sideData
        }, {
            name: 'b',
            tooltip: {
                show: false
            },
            type: 'pictorialBar',
            itemStyle: {
                borderWidth: 1,
                borderColor: '#0571D5',
                color: '#1779E0'
            },
            symbol: 'path://M 0,0 l 120,0 l -30,60 l -120,0 z',
            symbolSize: ['20', '5'],
            symbolOffset: ['0', '-5'],
            symbolPosition: 'end',
            data: listData,
            z: 3
        }]
      });
      this.chart.hideLoading();
    }
  }
};
</script>
