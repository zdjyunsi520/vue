<template>
  <div class="app-container">

    <el-row :gutter="20" class="containerbox dragbox" ref="dragbox">
      <el-col :xs="{span: 24}" class="treebox comheight dragleft">
        <div style="background:#fff;height:100%">
          <el-scrollbar v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
            <el-tree :data="treeData" :render-content="renderContent" :props="defaultProps" ref="tree" :highlight-current="true" @node-click="handleNodeClick" default-expand-all node-key="id" :expand-on-click-node="false"></el-tree>
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
                  <p @click="handleClick(item)" v-for="(item,index) in dataV" :key="index" v-show="index<3">{{item.Name}}<span>{{item.Value}}</span></p>
                </el-col>
                <el-col :span='4' :xs='12'>
                  <h5>电流(A)</h5>
                  <p @click="handleClick(item)" v-for="(item,index) in dataA" :key="index" v-show="index<3">{{item.Name}}<span>{{item.Value}}</span></p>
                </el-col>
                <el-col :span='4' :xs='24'>
                  <h5 class="smtitleh5 blue">总视在功率(kVA)
                    <p>但是第<span>4</span>条我想显示在这里</p>
                  </h5>

                  <p @click="handleClick({Name:'我是乱写的电压'})">第<span>1</span>条</p>
                  <p>第<span>2</span>条</p>
                  <p>第<span>3</span>条</p>
                  <p>第<span>4</span>条的html结构在这里</p>
                </el-col>
                <el-col :span='4' :xs='24'>
                  <h5 class="smtitleh5 blue">总视在功率(kVA)<b v-if="datakVA[3]" @click="handleClick(datakVA[3])">{{datakVA[3].Value}}</b></h5>
                  <p @click="handleClick(item)" v-for="(item,index) in datakVA" :key="index" v-show="index<3">{{item.Name}}<span>{{item.Value}}</span></p>

                </el-col>
                <el-col :span='4' :xs='12'>
                  <h5 class="smtitleh5">总有功功率(kW)<b @click="handleClick(item)">{{datakW[3]?datakW[3].Value:''}}</b></h5>
                  <p @click="handleClick(item)" v-for="(item,index) in datakW" :key="index" v-show="index<3">{{item.Name}}<span>{{item.Value}}</span></p>
                </el-col>
                <el-col :span='6' :xs='12'>
                  <h5 class="smtitleh5">总功率因素<b @click="handleClick(item)">{{dataPF[3]?dataPF[3].Value:''}}</b></h5>
                  <p @click="handleClick(item)" v-for="(item,index) in dataPF" :key="index" v-show="index<3">{{item.Name}}<span>{{item.Value}}</span></p>
                </el-col>
              </el-row>
            </div>
            <div style="margin-top:30px">
              <div class="form-smtitle marginBottom30">其他参数 </div>
              <el-row :gutter="20" class="cellinfo noborder">
                <el-col :span='5' :xs='12'>
                  <p class="on">反向无功电度(kVarh)<span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh)<span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
                <el-col :span='5' :xs='12'>
                  <p>反向无功电度(kVarh) <span>0.55</span></p>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="bg-white datainfo " style="margin-top:15px;">
            <div class="form-smtitle marginBottom30">历史曲线
              <el-tag type="danger">form.intervalId=</el-tag>
              <el-tag>{{form.intervalId}}</el-tag>
            </div>
            <div>
              <ul>
                <li>
                  {{labelName}}
                </li>
                <li>
                  周期 <el-select v-model="form.cycleType">
                    <el-option label="月" :value="3" />
                    <el-option label="日" :value="2" />
                    <el-option label="15分钟" :value="1" />
                  </el-select>
                </li>
                <li>
                  日期 <el-date-picker v-model="form.beginTime" type="date" placeholder="选择日期">
                  </el-date-picker>
                </li>
              </ul>

            </div>
            <div class="  chart-wrapper">
              <LineChart ref="chart" :chartData='chartData' />
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
import { getTrees } from "@/api/org";
import LineChart from "./components/LineChart";
const chartData = {
  expectedData: [100, 120, 161, 134, 105, 160, 165],
  actualData: [120, 82, 91, 154, 162, 140, 145]
};
export default {
  name: "components",
  components: {
    LineChart
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      chartData: chartData,
      treeData: [],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      baseData: [],
      id: null,
      weight: 0,
      labelName: "",
      form: {
        intervalId: "",
        type: "A",
        cycleType: 3,
        beginTime: ""
      },
      interval: null
    };
  },
  created() {
    // this.getList();
    this.getTreeData();
  },
  computed: {
    dataV() {
      const data = this.baseData
        .filter(v => v.Unit == "V")
        .map(v => {
          v.Name = v.Name.replace("电压", "");
          return v;
        });
      if (this.form.type == "" && data.length) this.form.type = data[0].Type;
      return data;
    },
    dataA() {
      return this.baseData
        .filter(v => v.Unit == "A")
        .map(v => {
          v.Name = v.Name.replace("电流", "");
          return v;
        });
    },
    datakW() {
      return this.baseData
        .filter(v => v.Unit == "KW")
        .map(v => {
          v.Name = v.Name.replace("有功功率", "");
          return v;
        });
    },
    datakVA() {
      return this.baseData
        .filter(v => v.Unit == "kVA")
        .map(v => {
          v.Name = v.Name.replace("视在功率", "");
          return v;
        });
    },
    dataPF() {
      return this.baseData
        .filter(v => v.Type.indexOf("PF") > -1)
        .map(v => {
          v.Name = v.Name.replace("功率因数", "");
          return v;
        });
    }
  },
  mounted() {
    this.dragControllerDiv();
  },
  watch: {
    id(id) {
      if (id) {
        this.form.intervalId = this.id;
        this.getMeasureData();
      }
    }
  },
  methods: {
    handleClick(data) {
      console.log(data.Type);
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
        this.findFistInterval(this.treeData);
        // this.$emit("getInfo", this.treeData[0]);
      });
    },
    findFistInterval(list) {
      if (list) {
        list.forEach(v => {
          this.findFistInterval(v.childs);
          if (this.id) return;
          if (v.type == 11) {
            this.id = v.id;
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
    getMeasureData() {
      const intervalId = this.id;
      getMeasureData({ intervalId }).then(res => {
        let list = res.data;
        this.baseData = res.data;
      });
      this.getMeasureDataHistory();
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      // this.interval = setInterval(() => {
      //   this.getMeasureDataHistory();
      // }, 15 * 1000);
    },
    getMeasureDataHistory() {
      getMeasureDataHistory(this.form).then(r => {});
    },

    handleNodeClick(obj, event) {
      const id = obj.id;
      const type = obj.type;

      if (type == 11) {
        this.id = "";
        this.baseData = [];
        //间隔
        this.id = obj.id;
      }
      // this.$emit("getInfo", { id, type });
    }

    /** 查询菜单列表 */
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
</style>