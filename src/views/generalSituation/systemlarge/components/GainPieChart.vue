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
      default: "100%"
    },

    piechartData: {
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
    piechartData: {
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
      if (
        this.piechartData.inspection ||
        this.piechartData.warning ||
        this.piechartData.repair
      ) {
        this.chart.hideLoading();
        this.setOptions(this.piechartData);
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

    setOptions({ inspection, warning, repair } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          show: false,
          right: 30,
          bottom: 30,
          data: ["总巡检", "总预警", "总抢修"]
        },
        // color: ["#2178ff", "#07fdff", "#d2feff"],
        series: [
          {
            name: "总抢修",
            type: "pie",
            hoverAnimation:false,
            radius: ["40%", "53%"],
            center: ["50%", "50%"],
            label: {
              normal: {
                show: false,
                position: "center",
                color: "#fff",
                formatter: function(params) {
                  return params.value;
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            // itemStyle: {
            //   borderColor: "#3e4674"
            // },
            data: [
              {
                value: 100,
                itemStyle: {
                  normal: {
                    color: "rgba(0,0,0,0.1)"
                  }
                }
              },
              {
                value: repair,
                itemStyle: {
                  normal: {
                    color: "rgba(210, 254, 255,1)"
                  }
                }
              }
            ]
          },

          {
            name: "总预警",
            type: "pie",
            hoverAnimation:false,
            radius: ["60%", "73%"],
            center: ["50%", "50%"],
            legendHoverLink: false,
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            // itemStyle: {
            //   borderColor: "#3e4674"
            // },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  normal: {
                    color: "rgba(0,0,0,0.1)"
                  }
                }
              },
              {
                value: warning,
                itemStyle: {
                  normal: {
                    color: "rgba(7, 253, 255,1)"
                  }
                }
              }
            ]
          },

          {
            name: "总巡检",
            type: "pie",
            hoverAnimation:false,
            radius: ["80%", "93%"],
            center: ["50%", "50%"],
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "10",
                  fontWeight: "bold"
                }
              }
            },
            // itemStyle: {
            //   borderColor: "#3e4674"
            // },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  normal: {
                    color: "rgba(0,0,0,0.1)"
                  }
                }
              },
              {
                value: inspection,
                itemStyle: {
                  normal: {
                    color: "rgba(33, 120, 255,1)"
                  }
                }
              }
            ]
          }
        ]
      });
      this.chart.hideLoading();
    }
  }
};
</script>
