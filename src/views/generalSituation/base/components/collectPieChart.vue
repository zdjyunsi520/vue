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
      default: "150px"
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
      if (this.chartData.listData) {
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

    setOptions({ title, text, colors, listData } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {d}%"
        },

        color: colors,
        series: [
          {
            name: title,
            type: "pie",
            radius: ["60%", "85%"],
            center: ["50%", "48%"],
            hoverOffset: 3,
            emphasis: {
              itemStyle: {
                shadowColor: "rgba(0, 0, 0, 0.5)",
                shadowBlur: 2
              }
            },
            data: [
              {
                value: listData[0].value,
                name: listData[0].name,
                label: {
                  normal: {
                    show: true,
                    position: "center",
                    fontSize: 14,
                    formatter: params => {
                      return (
                        "{value| " +
                        params.value.toFixed(1) +
                        "%} \n{name|" +
                        text +
                        "}"
                      );
                    },
                    rich: {
                      name: {
                        fontSize: 12,
                        padding: [0, 0, 0, 0],
                        lineHeight: 20,
                        color: "#999999"
                      },
                      value: {
                        fontSize: 18,
                        padding: [0, 0, 10, 0],
                        fontWeight: "bold",
                        color: colors[0]
                      }
                    }
                  }
                }
              },
              {
                value: 100 - parseInt(listData[0].value),
                name: listData[1].name,
                label: {
                  normal: {
                    show: false
                  }
                }
              }
            ],
            labelLine: {
              show: false
            }
          }
        ]
      });
      this.chart.hideLoading();
    }
  }
};
</script>
