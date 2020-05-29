<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

var arrName;
var arrValue;
var sumValue;
var objData ;
var optionData;

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
      default: "333px"
    },

    piechartData: {
      type: Array,
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
      if (this.piechartData) {
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


getArrayValue(array, key) {
    var key = key || "value";
    var res = [];
    if (array) {
        array.forEach(function(t) {
            res.push(t[key]);
        });
    }
    return res;
},

array2obj(array, key) {
    var resObj = {};
    for (var i = 0; i < array.length; i++) {
        resObj[array[i][key]] = array[i];
    }
    return resObj;
},

 getData(data) {
    var res = {
        series: [],
        yAxis: []
    };
    for (let i = 0; i < data.length; i++) {
        // console.log([70 - i * 15 + '%', 67 - i * 15 + '%']);
        res.series.push({
            name: '',
            type: 'pie',
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            radius: [73 - i * 15 + '%', 68 - i * 15 + '%'],
            center: ["50%", "45%"],
            label: {
                show: false
            },
            itemStyle: {
                label: {
                    show: false,
                },
                labelLine: {
                    show: false
                },
                borderWidth: 8,
            },
            data: [{
                value: data[i].value,
                name: data[i].name
            }, {
                value: sumValue - data[i].value,
                name: '',
                itemStyle: {
                    color: "rgba(0,0,0,0)",
                    borderWidth: 0
                },
                tooltip: {
                    show: false
                },
                hoverAnimation: false
            }]
        });
        res.series.push({
            name: '',
            type: 'pie',
            silent: true,
            z: 1,
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            radius: [73 - i * 15 + '%', 68 - i * 15 + '%'],
            center: ["50%", "45%"],
            label: {
                show: false
            },
            itemStyle: {
                label: {
                    show: false,
                },
                labelLine: {
                    show: false
                },
                borderWidth: 8,
            },
            data: [{
                value: 7.5,
                itemStyle: {
                    color: "#04306a",
                    borderWidth: 0
                },
                tooltip: {
                    show: false
                },
                hoverAnimation: false
            }, {
                value: 2.5,
                name: '',
                itemStyle: {
                    color: "rgba(0,0,0,0)",
                    borderWidth: 0
                },
                tooltip: {
                    show: false
                },
                hoverAnimation: false
            }]
        });
        res.yAxis.push((data[i].value / sumValue * 100).toFixed(2) + "%");
    }
    return res;
},


    setOptions({ inspection, warning, repair } = {}) {
      arrName =  this.getArrayValue(this.piechartData, "name");
      arrValue =  this.getArrayValue(this.piechartData, "value");
      sumValue = eval(arrValue.join('+'));
      objData =  this.array2obj(this.piechartData, "name");
      optionData = this.getData(this.piechartData)

      this.chart.setOption({
        legend: {
            show: true,
            icon: "circle",
            top: '8%',
            itemWidth: 6,
            itemHeight: 6,
            bottom: '53%',
            left: "50%",
            data: arrName,
            width: 40,
            padding: [0, 15],
            itemGap: 14,
            formatter: function(name) {
                return " {title|" + name + "} {value|" + (objData[name].value) + "}{title|kWh}"
            },
            textStyle: {
                rich: {
                    title: {
                        fontSize: 12,
                        lineHeight: 1,
                        color: "#fff"
                    },
                    value: {
                        fontSize: 14,
                        lineHeight: 1,
                        color: "#fff"
                    }
                }
            },
        },
        tooltip: {
            show: true,
            trigger: "item",
            formatter: "{a}<br>{b}:{c}({d}%)"
        },
        color: ['#2277ff', '#07feff', '#88fffc', '#ffffff'],
        xAxis: [{
            show: false
        }],
        series: optionData.series
      });
      this.chart.hideLoading();
    }
  }
};
</script>
