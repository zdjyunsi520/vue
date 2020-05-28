<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";


const animationDuration = 6000;

const chinaGeoCoordMap = {
    '黑龙江': [127.9688, 45.368],
    '大庆': [126.9688, 45.868],
    '内蒙古': [110.3467, 41.4899],
    "吉林": [125.8154, 44.2584],
    '北京': [116.4551, 40.2539],
    "辽宁": [123.1238, 42.1216],
    "河北": [114.4995, 38.1006],
    "天津": [117.4219, 39.4189],
    "山西": [112.3352, 37.9413],
    "陕西": [109.1162, 34.2004],
    "甘肃": [103.5901, 36.3043],
    "宁夏": [106.3586, 38.1775],
    "青海": [101.4038, 36.8207],
    "新疆": [87.9236, 43.5883],
    "西藏": [91.11, 29.97],
    "四川": [103.9526, 30.7617],
    "重庆": [108.384366, 30.439702],
    "山东": [117.1582, 36.8701],
    "河南": [113.4668, 34.6234],
    "江苏": [118.8062, 31.9208],
    "安徽": [117.29, 32.0581],
    "湖北": [114.3896, 30.6628],
    "浙江": [119.5313, 29.8773],
    "福建": [119.4543, 25.9222],
    "江西": [116.0046, 28.6633],
    "湖南": [113.0823, 28.2568],
    "贵州": [106.6992, 26.7682],
    "云南": [102.9199, 25.4663],
    "广东": [113.12244, 23.009505],
    "广西": [108.479, 23.1152],
    "海南": [110.3893, 19.8516],
    '上海': [121.4648, 31.2891]
};
const chinaDatas = [
    [{
        name: '黑龙江',
        value: 0.88
    }],
    [{
        name: '内蒙古',
        value: 0.12
    }],
    // [{
    //     name: '吉林',
    //     value: 0.89
    // }],
    // [{
    //     name: '辽宁',
    //     value: 0.86
    // }],
    [{
        name: '河北',
        value: 0.88
    }],
    [{
        name: '北京',
        value: 0.83
    }],
    
   
    [{
        name: '陕西',
        value: 0.56
    }],
    [{
        name: '宁夏',
        value: 0.17
    }],
    [{
        name: '云南',
        value: 0.11
    }],
    [{
        name: '四川',
        value: 1
    }],
  
   
  
    // [{
    //     name: '江苏',
    //     value: 0.88
    // }],
    // [{
    //     name: '安徽',
    //     value: 0.73
    // }],
    // [{
    //     name: '湖北',
    //     value: 0.75
    // }],
    // [{
    //     name: '浙江',
    //     value: 0.82
    // }],
    // [{
    //     name: '大庆',
    //     value: 0.67
    // }],
   
    [{
        name: '湖南',
        value: 0.75
    }],
    [{
        name: '广东',
        value: 0.78
    }],
    [{
        name: '海南',
        value: 0.1
    }],
    [{
        name: '新疆',
        value: 0
    }],
    [{
        name: '上海',
        value: 0.91
    }]
];


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

 
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    // barchartData: {
    //   handler(newVal, oldVal) {
    //     if (this.chart) {
    //       if (newVal) {
    //         this.setOption(newVal);
    //       } else {
    //         this.setOption(oldVal);
    //       }
    //     } else {
    //       this.initChart();
    //     }
    //   },
    //   deep: true //对象内部属性的监听，关键。
    // }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  create(){
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
      // this.showLoading();
      // if (this.barchartData.listData) {
        // this.chart.hideLoading();
        this.setOptions();
      // }
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
    convertData(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = chinaGeoCoordMap[dataItem[0].name];
            var toCoord = [119.4543, 25.9222];
            if (fromCoord && toCoord) {
                res.push([{
                    coord: fromCoord,
                    value: dataItem[0].value
                }, {
                    coord: toCoord,
                }]);
            }
        }
        return res;
    },

    setOptions() {
      
      var series = [];
      [['福建', chinaDatas]].forEach((item, i)=> {
        // console.log(item,this.convertData(item[1]))
        series.push({
            type: 'lines',
            zlevel: 3,
              symbol: ['none', 'circle'], 
            effect: {
                show: true,
                period: 4, //箭头指向速度，值越小速度越快
                trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
                symbol: 'arrow', //箭头图标
                symbolSize: 5, //图标大小
            },
            lineStyle: {
                normal: {
                    width: 1, //尾迹线条宽度
                    opacity: 1, //尾迹线条透明度
                    curveness: .4 //尾迹线条曲直度
                }
            },
            data: this.convertData(item[1])
          },{
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 4,
              rippleEffect: { //涟漪特效
                  period: 4, //动画时间，值越小速度越快
                  brushType: 'stroke', //波纹绘制方式 stroke, fill
                  scale: 4 //波纹圆环最大限制，值越大波纹越大
              },
              label: {
                  normal: {
                      show: true,
                      position: 'right', //显示位置
                      offset: [5, 0], //偏移设置
                      formatter: function(params) { //圆环显示文字
                          return params.data.name;
                      },
                      fontSize: 13
                  },
                  emphasis: {
                      show: true
                  }
              },
              symbol: 'circle',
              symbolSize: function(val) {
                  return 15 + val[2] * 3; //圆环大小
              },
              itemStyle: {
                  normal: {
                      show: false,
                      color: '#f00'
                  }
              },
              data: item[1].map(function(dataItem) {
                  return {
                      name: dataItem[0].name,
                      value: chinaGeoCoordMap[dataItem[0].name].concat([dataItem[0].value])
                  };
              }),
          },
          //被攻击点
          {
              type: 'scatter',
              coordinateSystem: 'geo',
              zlevel: 4,
              
              rippleEffect: {
                  period: 4,
                  brushType: 'stroke',
                  scale: 4
              },
              label: {
                  normal: {
                      show: true,
                      position: 'right',
                      //offset:[5, 0],
                      color: '#0f0',
                      formatter: '{b}',
                      textStyle: {
                          color: "#0f0"
                      }
                  },
                  emphasis: {
                      show: true,
                      color: "#f60"
                  }
              },
              symbol: 'pin',
              symbolSize: 30,
              data: [{
                  name: item[0],
                  value: chinaGeoCoordMap[item[0]].concat([10]),
              }],
          });
    });


    this.chart.setOption({
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(166, 200, 76, 0)',
        showDelay: 0,
        hideDelay: 0,
        enterable: true,
        transitionDuration: 0,
        extraCssText: 'z-index:100',
        formatter: function(params, ticket, callback) {
            //根据业务自己拓展要显示的内容
            var res = "";
            var name = params.name;
            var value = params.value[params.seriesIndex + 1];
            res = "<span style='color:#fff;'>" + name + "</span><br/>数据：" + value;
            return res;
        }
      },
      backgroundColor: 'rgba(166, 200, 76, 0)',
      visualMap: { //图例值控制
          show:false,
          min: 0,
          max: 1,
          calculable: true,
          color: ['#00ff78', '#ff971b', '#acff43', '#ff73b7', '#ffff46', '#27bbfe'],
          textStyle: {
              color: '#fff'
          }
      },
      geo: {
          map: 'china',
          zoom: 1.3, 
          zlevel: 2,
          label: {
              emphasis: {
                  show: false
              }
          },
           layoutCenter: ['50%', '50%'],
            layoutSize: "100%",
          roam: false, //是否允许缩放
          itemStyle: {
              normal: {
                  color: 'rgba(1, 27, 108, 0)', //地图背景色
                  borderColor: '#1c69e8', //省市边界线00fcff 516a89
                  borderWidth:1.2,
                   shadowColor: '#092f8f',//外发光
                    shadowBlur: 20

              },
              emphasis: {
                  color: 'rgba(37, 43, 61, 0)' //悬浮背景
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
