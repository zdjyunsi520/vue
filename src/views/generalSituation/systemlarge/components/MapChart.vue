<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

const animationDuration = 6000;

let chinaDatas = [
  // [
  //   {
  //     name: "黑龙江",
  //     value: 0.88
  //   }
  // ],
];
let localName = "";
let localCoordinate = [];

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
      default: "90%"
    },
    mapchartData: {
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
    mapchartData: {
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
  create() {
    this.initChart();
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
      if (this.mapchartData.chinaDatas.length > 0) {
        this.chart.hideLoading();
        this.setOptions(this.mapchartData);
      }
    },
    showLoading() {
      this.chart.showLoading({
        text: "Loading",
        color: "#fff",
        textColor: "#fff",
        maskColor: "rgba(0, 0, 0, 0)",
        zlevel: 0
      });
    },
    convertData(data, localCoordinate, chinaGeoCoordMap) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        console.log(dataItem);
        var fromCoord = chinaGeoCoordMap[dataItem.Text];
        var toCoord = localCoordinate;
        if (fromCoord && toCoord) {
          res.push([
            {
              coord: fromCoord,
              value: dataItem.Value
            },
            {
              coord: toCoord
            }
          ]);
        }
      }
      return res;
    },

    setOptions({
      localName,
      chinaDatas,
      localCoordinate,
      chinaGeoCoordMap
    } = {}) {
      var series = [];
      [[localName, chinaDatas]].forEach((item, i) => {
        series.push(
          // {
          //   type: "lines",
          //   zlevel: 3,
          //   symbol: ["none", "circle"],
          //   tooltip: {
          //     show: false
          //   },
          //   effect: {
          //     show: true,
          //     period: 4, //箭头指向速度，值越小速度越快
          //     trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
          //     symbol: "arrow", //箭头图标
          //     symbolSize: 5 //图标大小
          //   },
          //   lineStyle: {
          //     normal: {
          //       width: 1, //尾迹线条宽度
          //       opacity: 1, //尾迹线条透明度
          //       curveness: 0.4 //尾迹线条曲直度
          //     }
          //   },
          //   data: this.convertData(item[1], localCoordinate, chinaGeoCoordMap)
          // },
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 4,
            rippleEffect: {
              //涟漪特效
              period: 5, //动画时间，值越小速度越快
              brushType: "stroke", //波纹绘制方式 stroke, fill
              scale: 4 //波纹圆环最大限制，值越大波纹越大
            },

            tooltip: {
              show: false
            },
            label: {
              normal: {
                show: true,
                position: "right", //显示位置
                offset: [5, 0], //偏移设置
                formatter: function(params) {
                  
                  //圆环显示文字
                  return params.data.value[2]==0?"":params.data.name;
                },
                fontSize: 13
              },
              emphasis: {
                show: true,
                formatter: function(params) {
                  
                  //圆环显示文字
                  return  params.data.name;
                },
              }
            },
            symbol: "circle",
            symbolSize: function(val) {
              return 5 + val[2] * 0.08; //圆环大小
              // return 5; //圆环大小
            },

            itemStyle: {
              normal: {
                show: false,
                color: "#f00"
              }
            },
            data: item[1].map(function(dataItem) {
              return {
                name: dataItem.Text,
                value: chinaGeoCoordMap[dataItem.Text].concat([dataItem.Value])
              };
            })
          }
          //被攻击点
          // {
          //   type: "scatter",
          //   coordinateSystem: "geo",
          //   zlevel: 4,

          //   tooltip: {
          //     show: false
          //   },
          //   rippleEffect: {
          //     period: 4,
          //     brushType: "stroke",
          //     scale: 4
          //   },
          //   label: {
          //     normal: {
          //       show: true,
          //       position: "right",
          //       //offset:[5, 0],
          //       color: "#06fdff",
          //       formatter: "{b}",
          //       textStyle: {
          //         color: "#06fdff"
          //       }
          //     },
          //     emphasis: {
          //       show: true,
          //       color: "#06fdff"
          //     }
          //   },
          //   symbol: "pin",
          //   symbolSize: 30,
          //   data: [
          //     {
          //       name: item[0],
          //       value: chinaGeoCoordMap[item[0]].concat([10])
          //     }
          //   ]
          // }
        );
      });

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          // backgroundColor: "rgba(166, 200, 76, 0)",
          // showDelay: 0,
          // hideDelay: 0,
          enterable: true,
          // transitionDuration: 0,
          extraCssText: "z-index:100",
          formatter: function(params, ticket, callback) {
            //根据业务自己拓展要显示的内容
            var res = "";
            var name = params.name;
            var value = params.value[params.seriesIndex + 1];
            res =
              "<span style='color:#fff;'>" +
              name +
              "</span><br/>数据：" +
              value;
            return res;
          }
        },
        backgroundColor: "rgba(166, 200, 76, 0)",
        visualMap: {
          //图例值控制
          show: false,
          min: 0,
          max: 1,
          calculable: true,
          color: ["#d2feff"], //,"#d2feff", "#2178ff"

          textStyle: {
            color: "#fff"
          }
        },
        geo: {
          map: "china",
          zoom: 1.2,
          zlevel: 2,
          label: {
            emphasis: {
              show: false
            }
          },
          layoutCenter: ["50%", "50%"],
          layoutSize: "100%",
          roam: false, //是否允许缩放
          itemStyle: {
            normal: {
              color: "rgba(1, 27, 108, 0)", //地图背景色
              borderColor: "#1c69e8", //省市边界线00fcff 516a89
              borderWidth: 1.2,
              shadowColor: "#092f8f", //外发光
              shadowBlur: 20
            },
            emphasis: {
              color: "rgba(37, 43, 61, 0)" //悬浮背景
            }
          }
        },
        series: series
      });
      // this.chart.hideLoading();
    }
  }
};
</script>
