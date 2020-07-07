<template>
  <div class="app-container">
    <div class="reportbox">
      <div class="tophead">
        <h3>{{dataInfo.ReportName}}</h3>
        <p>
          <span>天气：{{dataInfo.Weather}}</span>
          <span>温度：{{dataInfo.Temperature}}&#8451;</span>
          <span>巡视人员：{{dataInfo.PatrolUserName}}</span>
          <span>巡视成员：{{dataInfo.PatrolMemberNames}}</span>
          <!-- <span>确认人签名：{{dataInfo.ConfirmUserName}}<img :src="dataInfo.ElectricSign" class='signimg' /></span> -->
          <span>确认人签名：<img v-if="dataInfo.ElectricSign" :src="'http://apibizt.xtioe.com'+dataInfo.ElectricSign" class='signimg' /></span>
        </p>
        <el-button type="primary" icon="el-icon-printer" class="printbtn no-print" @click="handlePrint">打印</el-button>
      </div>
      <div class="containbox">
        <div v-for="(item,index) in dataInfo.RecordDetail" :key='index'>
          <div>
            <h5>{{index+1}}、{{item.Room.SwitchingRoomName}}</h5>
            <el-row :gutter="40">
              <el-col :span="24">
                <h6>{{index+1}}.1、计量柜</h6>
                <div class="contbox">
                  <p>
                    <span class="bluebg">电度(kWh)</span>
                    <span>-</span>
                    <span class="bluebg">有功功率(kWh)</span>
                    <span>-</span>
                    <span class="bluebg">功率因数</span>
                    <span>-</span>
                  </p>
                  <p>
                    <span class="bluebg">A相电流(A)</span>
                    <span>-</span>
                    <span class="bluebg">B相电流(A)</span>
                    <span>-</span>
                    <span class="bluebg">C相电流(A)</span>
                    <span>-</span>
                  </p>
                  <p>
                    <span class="bluebg">A相电压(V)</span>
                    <span>-</span>
                    <span class="bluebg">B相电压(V)</span>
                    <span>-</span>
                    <span class="bluebg">C相电压(V)</span>
                    <span>-</span>
                  </p>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="24">
                <h6>{{index+1}}.2、配电柜</h6>
                <div class="contbox">
                  <p>
                    <span class="bluebg">设备</span>
                    <span class="bluebg">状态</span>
                    <span class="bluebg">设备</span>
                    <span class="bluebg">状态</span>
                    <span class="bluebg">设备</span>
                    <span class="bluebg">状态</span>
                  </p>
                  <p>
                    <span>温感</span>
                    <span>-</span>
                    <span>温感</span>
                    <span>-</span>
                    <span>温感</span>
                    <span>-</span>
                  </p>
                  <p>
                    <span>温感</span>
                    <span>-</span>
                    <span>温感</span>
                    <span>-</span>
                    <span>温感</span>
                    <span>-</span>
                  </p>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="40">
              <el-col :span="24">
                <h6>{{index+1}}.3、变压器</h6>
                <div>
                  <div v-for="transfrom in item.Transfrom">
                    <h5>{{transfrom.Name}}</h5>
                    <p>
                      <span>{{transfrom.AHighTemperature}}</span>
                      <span>{{transfrom.ALowTemperature}}</span>
                      <span>{{transfrom.AssetsBugNo}}</span>
                      <span>{{transfrom.Attachment}}</span>
                      <span>{{transfrom.BHighTemperature}}</span>
                      <span>{{transfrom.BLowTemperature}}</span>
                      <span>{{transfrom.BodyTemperature}}</span>
                      <span>{{transfrom.CHighTemperature}}</span>
                      <span>{{transfrom.CLowTemperature}}</span>
                      <span>{{transfrom.ErrorDetail}}</span>
                      <span>{{transfrom.IsNormal}}</span>
                      <span>{{transfrom.PowerFactor}}</span>
                    </p>
                  </div>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="40">
              <el-col :span="13">
                <h6>{{index+1}}.4、环境</h6>
                <div class="contbox">
                  <p>
                    <span class="bluebg">检查项目</span>
                    <span class="bluebg">情况</span>
                  </p>
                  <p>
                    <span>配电室卫生</span>
                    <span :class="filterClass(item.Room.RoomHygieneStatus)">{{filterStatus(item.Room.RoomHygieneStatus)}}</span>
                  </p>
                  <p>
                    <span>配电室漏水</span>
                    <span :class="filterClass(item.Room.RoomLeakageStatus)">{{filterStatus(item.Room.RoomLeakageStatus)}}</span>
                  </p>
                  <p>
                    <span>配电室积水</span>
                    <span :class="filterClass(item.Room.CableHydropsStatus)">{{filterStatus(item.Room.CableHydropsStatus)}}</span>
                  </p>
                </div>
              </el-col>
              <el-col :span="10" :push="1">
                <h6>{{index+1}}.5、安全用具</h6>
                <div class="contbox">
                  <p>
                    <span class="bluebg">检查项目</span>
                    <span class="bluebg">情况</span>
                  </p>
                  <p>
                    <span>灭火器</span>
                    <span :class="filterClass(item.Room.FireExtinguisherStatus)">{{filterStatus(item.Room.FireExtinguisherStatus)}}</span>
                  </p>
                  <p>
                    <span>挡鼠板</span>
                    <span :class="filterClass(item.Room.RatGuardStatus)">{{filterStatus(item.Room.RatGuardStatus)}}</span>
                  </p>
                  <p>
                    <span>绝缘器具</span>
                    <span :class="filterClass(item.Room.InsulatingToolsStatus)">{{filterStatus(item.Room.InsulatingToolsStatus)}}</span>
                  </p>
                </div>
              </el-col>

            </el-row>
            <div class="areabox">
              <h6>{{index+1}}.6、存在的问题及处理情况</h6>
              <p>{{item.Room.Result}}</p>
            </div>
            <div class="areabox">
              <h6>{{index+1}}.7、小结以及建议</h6>
              <p>{{item.Room.Suggest}}</p>
            </div>
          </div>
          <div>
            <h6>{{index+1}}.8、附件</h6>
            <div v-for="power in item.Power" style="display: inline;margin-right:15px">
              <!-- <h5>{{power.Name}}</h5> -->
              <img :src="'http://apibizt.xtioe.com'+power.Attachment" style='width:22%'>
              <!-- <span>附件url地址{{power.Attachment}}</span> -->
              <!-- <span>错误详情{{power.ErrorDetail}}</span>
                <span>是否正常{{power.IsNormal}}</span> -->
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getReportInfo } from "@/api/patrol";
export default {
  data() {
    return {
      jobid: "",
      dataInfo: {}
    };
  },
  created() {
    let { jobid } = this.$route.query;
    this.jobid = jobid;
    this.getReportInfo(this.jobid);
  },
  methods: {
    getReportInfo(id) {
      const jobid = id;
      getReportInfo({ jobid })
        .then(res => {
          this.dataInfo = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    filterStatus(val) {
      return val == 1 ? "正常" : "异常";
    },
    filterClass(val) {
      return val == 0 ? "red" : "";
    },
    handlePrint() {
      window.print();
    }
  }
};
</script>

<style lang="scss" scoped>
.signimg {
  height: 30px;
  vertical-align: bottom;
}
.reportbox {
  padding: 20px;
  background: #fff;
  font-size: 12px;
  color: #333333;
  .tophead {
    text-align: center;
    position: relative;
    h3 {
      margin: 0;
      padding: 20px 0;
      text-align: center;
      font-size: 28px;
    }
    p {
      font-size: 14px;
      span {
        display: inline-block;
        text-align: center;
        margin: 0 3%;
      }
    }
    .printbtn {
      position: absolute;
      top: 20px;
      right: 00px;
    }
  }

  .containbox {
    & > div {
      padding-top: 40px;
      h5 {
        font-size: 24px;
        padding-bottom: 40px;
        margin: 0;
      }
      h6 {
        font-size: 18px;
        font-weight: normal;
        color: #4473f2;
        padding-bottom: 20px;
        position: relative;
        margin: 0;
        &::before {
          content: "";
          width: 4px;
          height: 18px;
          background-color: #4473f2;
          margin-right: 10px;
          display: inline-block;
          vertical-align: bottom;
        }
      }
      .contbox {
        border: solid 1px #f1f1f1;
        margin-bottom: 40px;
        border-top: none;
        border-right: none;
        p {
          border-top: solid 1px #f1f1f1;
          display: flex;
          margin: 0;
          span {
            display: block;
            width: 18%;
            line-height: 40px;
            height: 40px;
            flex: 1;
            border-right: solid 1px #f1f1f1;
            text-align: center;
            &.red {
              color: #fe7388;
            }
          }
          .bluebg {
            background: #f7f8fe;
          }
        }
      }
      .areabox {
        padding-bottom: 40px;
        p {
          height: 160px;
          padding: 20px;
          background-color: #f7f8fa;
          border: solid 1px #f1f1f1;
        }
      }
    }
  }
}
@media print {
  .printbtn {
    display: none;
  }
}
</style>