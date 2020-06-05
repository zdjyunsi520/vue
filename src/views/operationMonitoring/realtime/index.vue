<template>
  <div class="app-container">
    <el-row :gutter="20" class="containerbox dragbox" ref="dragbox">
      <el-col :xs="{span: 24}" class="treebox comheight dragleft">
        <div style="background:#fff;height:100%">
          <el-scrollbar v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
            <el-tree :data="treeData"  :render-content="renderContent" :props="defaultProps" ref="tree" :highlight-current="true" @node-click="handleNodeClick" default-expand-all node-key="id" :expand-on-click-node="false"></el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col class="dragresize">
        <span class="iconslider">
          <svg-icon icon-class="ic_drag" style="font-size:26px;margin-left:-8px;" />
          <i class="el-icon-arrow-left" style="font-size:12px;margin-left:-2px;" />
        </span>
      </el-col>
      <el-col :xs="{span: 24}" class="comheight mxright  dragright">
        <el-scrollbar>
          <div class="bg-white datainfo ">
            <div>
              <div class="form-smtitle marginBottom30">实时信息 </div>
              <el-row :gutter="40" class="cellinfo">
                <el-col :span='6' :xs='12'>
                  <h5>电压(V)</h5>
                  <p @click="handleClick('UA')">A相<span>{{info.UA}}</span></p>
                  <p @click="handleClick('UB')">B相<span>{{info.UB}}</span></p>
                  <p @click="handleClick('UC')">C相<span>{{info.UC}}</span></p>
                </el-col>
                <el-col :span='4' :xs='12'>
                  <h5>电流(A)</h5>
                  <p @click="handleClick('IA')">A相<span>{{info.IA}}</span></p>
                  <p @click="handleClick('IB')">B相<span>{{info.IB}}</span></p>
                  <p @click="handleClick('IC')">C相<span>{{info.IC}}</span></p>
                </el-col>

                <el-col :span='4' :xs='24'>
                  <h5 class="smtitleh5 blue">总视在功率(kVA)<b @click="handleClick('S')">{{info.S}}</b></h5>
                        <p @click="handleClick('SA')">A相<span>{{info.SA}}</span></p>
                  <p @click="handleClick('SB')">B相<span>{{info.SB}}</span></p>
                  <p @click="handleClick('SC')">C相<span>{{info.SC}}</span></p>
                </el-col>
                <el-col :span='4' :xs='12'>
                  <h5 class="smtitleh5">总有功功率(kW)<b @click="handleClick('P')">{{info.P}}</b></h5>
                   <p @click="handleClick('PA')">A相<span>{{info.PA}}</span></p>
                  <p @click="handleClick('PB')">B相<span>{{info.PB}}</span></p>
                  <p @click="handleClick('PC')">C相<span>{{info.PC}}</span></p>
                </el-col>
                <el-col :span='6' :xs='12'>
                  <h5 class="smtitleh5">总功率因素<b @click="handleClick('PF')">{{info.PF}}</b></h5>
                  <p @click="handleClick('PFA')">A相<span>{{info.PFA}}</span></p>
                  <p @click="handleClick('PFB')">B相<span>{{info.PFB}}</span></p>
                  <p @click="handleClick('PFC')">C相<span>{{info.PFC}}</span></p>
                </el-col>
              </el-row>
            </div>
            <div style="margin-top:40px">
              <div class="form-smtitle marginBottom30">其他参数 </div>
              <el-row :gutter="20" class="cellinfo noborder">
                <el-col :span='5' :xs='12' v-for="item in otherData">
                  <p class="on" @click="handleClick(item.Type)">{{item.Name}}({{item.Unit}})<span>{{item.Value}}</span></p>
                </el-col>
               
              </el-row>
            </div>
          </div>
          <div class="bg-white datainfo " style="margin-top:15px;">
            <div class="form-smtitle marginBottom30" style="position:relative">历史曲线
  
              <div class="rightradiobox">
                <b>{{labelName}}</b>
                <label>日期</label>
                <el-date-picker v-model="form.beginTime" type="date" size="small" placeholder="选择日期"></el-date-picker>

                <el-radio-group v-model="form.cycleType"  size="mini">
                  <el-radio-button :label="1">15分钟</el-radio-button>
                  <el-radio-button :label="2">日</el-radio-button>
                  <el-radio-button :label="3">月</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <!-- <el-row>
              <el-col :span="3"> {{labelName}}</el-col>
              <el-col :span="3">周期 
                <el-select v-model="form.cycleType">
                  <el-option label="月" :value="3" />
                  <el-option label="日" :value="2" />
                  <el-option label="15分钟" :value="1" />
                </el-select>
              </el-col>
              <el-col :span="3"> 日期<el-date-picker v-model="form.beginTime" type="date" placeholder="选择日期"></el-date-picker>
              </el-col>
            </el-row> -->
            <div class="chart-wrapper">
              <LineChart ref="chart" :chartData='lineChartData' />
              <!-- <p class="tips" style="padding-top:13%">暂无数据</p> -->
            </div>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getMeasureData, getMeasureDataHistory } from "@/api/report";
import { getStopIntervalTrees as getTrees } from "@/api/org";
import LineChart from "./components/LineChart";

const lineChartData = [
  {
    xAxisData: [
      "08:00",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01",
      "08:01"
    ],
    actualData: [
      120,
      82,
      91,
      154,
      162,
      140,
      145,
      120,
      82,
      91,
      154,
      162,
      91,
      154,
      162
    ]
  },
  {
    xAxisData: [
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01",
      "01-01"
    ],
    actualData: [
      180,
      160,
      151,
      106,
      145,
      150,
      130,
      151,
      106,
      145,
      150,
      130,
      180,
      160,
      151,
      106,
      145,
      150,
      130,
      151,
      106,
      145,
      150,
      130
    ]
  },
  {
    xAxisData: [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12"
    ],
    actualData: [180, 560, 151, 146, 145, 180, 560, 151, 146, 145, 30, 130]
  }
];
export default {
  name: "components",
  components: {
    LineChart
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      treeData: [],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      baseData: [],
      id: null,
      weight: 0,
      radioType: 0,
      labelName: "",
      form: {
        intervalId: "",
        type: "UA",
        cycleType: 1,
        beginTime: ""
      },
      interval: null,
    //  lineChartData: {xAxisData:[],actualData:[]},
      info: {},
      otherData:[],
      historyData:[]
    };
  },
  created() {
    // this.getList();
    this.getTreeData();
  },
  computed: {
lineChartData(){
  const xAxisData = []
    const actualData = []
   this.historyData.map(v=>{
    const data = v.CreateTime.split(' ')
    let value
    if(this.form.cycleType == 1){
      value = data[1]
    }else if(this.form.cycleType == 1){
      value = data[0]
    }else{
      value = data[0].split('-')[1]
    }
    return {value,value1:v.Value}
  }).forEach(v=>{
xAxisData.push(v.value)
actualData.push(v.value1)
  })

  return {xAxisData,actualData}
}
  },
  mounted() {
    this.dragControllerDiv();
  },
  watch: {
    'form':{
      deep:true,
      handler(){
        this.getMeasureData();
        }
    }
  },
  methods: {
    handleClick(data) {
      this.form.type = data
      this.labelName = data.Name;
    },
    renderContent(h, { node, data, store }) {
      return (
        // 间隔 加class
        <span class={data.type == 11 ? "custom-node" : ""}>
          <span>{data}</span>
        </span>
      );
    },

    // 获取设备关系树状图
    getTreeData() {
      getTrees().then(response => {
         
        this.loading = false;
        this.treeData = response.data;
       this.findFistInterval(response.data);
        // this.$emit("getInfo", this.treeData[0]);
      });
    },
    findFistInterval(list) {
      if (list) {
        list.forEach(v => {
          this.findFistInterval(v.childs);
          if (this.form.intervalId) return;
          if (v.type == 11) {
            this.form.intervalId = v.id;
               this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(v.id);
        });
          }
        });
      }
      // list.forEach((v, i) => {
      //   if (v.type == 11 && weight + i > this.weight) {
      //     this.weight = weight + i;
      //     this.id = v.id;
      //   } else {
      //     this.findFistInterval(v.childs, weight * 100);
      //   }
      // });
    },
    // 15分钟/日/月切换
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
    getMeasureData() {
      this.info ={}
      this.otherData = []
      getMeasureData(this.form).then(res => {
        let list = res.data;
        this.info = res.data.CommonData;
        this.otherData = res.data.OtherData
      });
      this.getMeasureDataHistory();
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      this.interval = setInterval(() => {
        this.getMeasureDataHistory();
      }, 15 * 1000);
    },
    getMeasureDataHistory() {
      getMeasureDataHistory(this.form).then(r => {
        this.historyData = r.data
      });
    },

    handleNodeClick(obj, event) {
      const id = obj.id;
      const type = obj.type;

      if (type == 11) {
        this.baseData = [];
        this.form.intervalId = obj.id;

      }
      // this.$emit("getInfo", { id, type });
    }

    /** 搜索菜单列表 */
    // getList() {
    //   this.loading = true;
    //   fetchList(this.queryParams)
    //     .then(response => {
    //       this.dataList = response.data.map(v => {
    //         // v.children = v.childs;
    //         v.lvl = true;
    //         return v;
    //       });
    //       this.dataList = response.data;

    //       this.$refs.tree.setCurrentKey(this.dataList[0].id);
    //       this.handleNodeClick(this.dataList[0]);
    //       this.loading = false;
    //       this.dataList.length && this.handleNodeClick(this.dataList[0]);
    //     })
    //     .finally(v => (this.loading = false));
    // },
    // getInfo() {
    //   const id = this.operateId;
    //   id &&
    //     getInfo({ id }).then(r => {
    //       this.data = Object.assign({}, r.data);
    //       this.smform = Object.assign({}, r.data);
    //       this.smform.Type =
    //         this.smform.Type == 1
    //           ? "分类"
    //           : this.smform.Type == 2
    //           ? "应用"
    //           : "权限";
    //     });
    // },
    // getList123() {
    //   this.getList();
    //   this.getInfo();
    // },
    // handleNodeClick({ id, lvl }) {
    //   if (lvl) {
    //     this.addId = id;
    //   } else {
    //     this.addId = "";
    //   }
    //   this.operateId = id;
    //   this.getInfo();
    // },
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/tree.scss";
/deep/.el-tree {
  color: #999 !important;
  font-size: 14px;
  .custom-node {
    color: #333 !important;
  }
}
.datainfo {
  .cellinfo {
    text-align: center;
    .el-col {
      width: 19%;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        background-color: #ebeef5;
        width: 1px;
        height: 130px;
        right: 0;
        top: 10%;
      }
      &:last-child:after {
        content: "";
        width: 0;
      }
    }
    &.noborder {
      .el-col:after {
        width: 0;
      }
    }
  }
  h5 {
    font-size: 18px;
    color: #313033;
    height: 62px;
    font-weight: normal;
    display: flex;
    justify-content: center;
    margin: 0 0 5px;
    flex-direction: column;
    padding: 10px 15px 10px;
    &.smtitleh5 {
      font-size: 14px;

      color: #999999;
      b {
        font-size: 18px;
        padding-top: 5px;
        font-weight: normal;
        color: #333333;
        display: block;
      }
      &.blue {
        background-color: #edf4ff;
        border-radius: 2px;
        color: #558cf7;
        b {
          color: #558cf7;
        }
      }
    }
  }
  p {
    color: #999999;
    font-size: 14px;
    margin: 0;
    line-height: 30px;
    span {
      color: #333;
      display: inline-block;
      margin-left: 20px;
    }
    &.on {
      background-color: #edf4ff;
      border-radius: 2px;
      color: #558cf7;
      span {
        color: #558cf7;
      }
    }
  }
}

.rightradiobox {
  position: absolute;
  top: 0px;
  right: 20px;
  color: #313033;
  & > b {
    font-size: 16px;
    margin-right: 10px;
  }
  & > label {
    display: inline-block;
    margin-right: 10px;
    font-size: 14px;
    font-weight: normal;
  }
  .el-radio-button--mini .el-radio-button__inner {
    padding: 9px 15px !important;
  }
}
</style>