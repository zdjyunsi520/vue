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
      default: '120px'
    },
    // pieChartData: {
    //   type: Number,
    //   required: true
    // }
  },
  data() {
    return {
      chart: null
    }
  },
  // watch: {
  //   pieChartData: {
  //     deep: true,
  //     handler(val) {
  //   console.log('333',this.pieChartData)
  //       this.setOptions(val)
  //     }
  //   }
  // },
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
      this.chart = echarts.init(this.$el, 'macarons');
    // this.setOptions(this.pieChartData)
    //},
   // setOptions(actualData){
      this.chart.setOption({
        title:{
          text:'抢修完成率',
          textStyle:{
            color:'#666',
            fontSize:12
          },
          bottom:10,
          left:'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          show:false,
          right: '0',
          bottom: '10',
          data: ['已完成', '未完成']
        },
        color : ['#333', '#999' ],
        series: [
          {
            name: '抢修情况',
            type: 'pie',
            radius:['35%', '60%'],
            center: ['50%', '40%'],
            emphasis: {
              itemStyle:{
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 5,
              }
            },
            data: [
              { 
                value: 33,
                name: '已完成' ,
                label:{
                  normal: {
                      show:true,
                      position: 'center',
                      formatter: '{d}%',
                    },
                },
               },
              { value:11, name: '未完成' ,
                label:{
                  normal: {
                      show:false,
                    },
                },
                
              },
            ],
            labelLine:{
              show:false
            },
          }
        ],
       
      })
    }
  }
}
</script>
