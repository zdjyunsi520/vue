<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '234px'
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
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        grid: {
          left: 10,
          right: 30,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        xAxis: {
          name:'时间',
          nameGap:5,
          boundaryGap:false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            show: false
          },
          axisLine:{
              lineStyle:{
              color:'#808080',
            }
          }
        },
        yAxis: {
          name:'负荷',
          nameGap:10,
          axisTick: {
            show: false
          },
          axisLine:{
              lineStyle:{
              color:'#808080',
            }
          }
        },
        legend: {
          data: ['expected', 'actual']
        },
        series: [{
          name: 'expected', 
          showAllSymbol:true,
          itemStyle: {
            normal: {
              color: '#999',
              lineStyle: {
                color: '#888',
                width: 2
              }
            }
          },
          smooth: true,
          clip: false,
          type: 'line',
          data: expectedData,
          markPoint: {
            symbolSize:40,
            label:{
              fontSize:12,
              fontWeight:'normal'
            },
              data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
              ]
          },
          // markLine: {
          //     data: [
          //         {type: 'average', name: '平均值'}
          //     ]
          // },
          
        },
        {
          name: 'actual',
          showAllSymbol:true,
          clip: false,
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#777',
              lineStyle: {
                color: '#999',
                width: 2
              },
            
            }
          },
          data: actualData,
          markPoint: {
            symbolSize:40,
            label:{
              fontSize:12,
              fontWeight:'normal'
            },
              data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
              ]
          },
          // markLine: {
          //     data: [
          //         {type: 'average', name: '平均值'}
          //     ]
          // },
          
        }]
      })
    }
  }
}
</script>
