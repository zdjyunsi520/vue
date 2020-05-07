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
      default: "250px"
    }
  },
  data() {
    return {
      chart: null
    };
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

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          show: false
        },
        emphasis: {
          itemStyle:{
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10,
          }
        },
        color: ["#333", "#999"],
        series: [
          {
            name: "采集情况",
            type: "pie",
            radius: ["45%", "75%"],
            center: ["50%", "50%"],
            labelLine:{
              show:false
            },
            data: [
              {
                value: 12,
                name: "在线",
                label: {
                  normal: {
                    show: true,
                    position: "center",
                    fontWeight:'bold',
                    fontSize:14,
                    formatter: "{d}%\n{b}率"
                  }
                },
 
              },
              {
                value: 24,
                name: "离线",
                label: {
                  normal: {
                    show: false
                  }
                },
              }
            ]
          }
        ]
      });
    }
  }
};
</script>
