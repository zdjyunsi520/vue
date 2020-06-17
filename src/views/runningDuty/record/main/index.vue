<template>
  <div class="comheight">
    <el-scrollbar>
      <el-row class="rowbox">
        <div v-if="currentData.length==0">
          <div class="nodata-box">
            <img src="@/assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </div>
        <div v-else>
          <div class="leftcard">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>接班信息</span>
              </div>
              <div class="text item">
                <el-form ref="form" :model="form" :rules="rules" :inline="true">
                  <el-form-item prop="PositionName">
                    <el-input :value='"岗位："+form.PositionName' disabled />
                  </el-form-item>
                  <el-form-item prop="StartTime">
                    <el-input :value="'接班时间：'+this.parseTime(form.StartTime, '{y}-{m}-{d} {hh}:{mm}:{ss}')" disabled />
                  </el-form-item>
                  <el-form-item prop="UserName">
                    <el-input :value="'接班人：'+form.UserName" disabled />
                  </el-form-item>
                  <el-form-item prop="Weather">
                    <el-select v-model="form.Weather" placeholder="请选择天气" :disabled='isDisabled'>
                      <el-option label="晴" :value="1"></el-option>
                      <el-option label="阴" :value="2"></el-option>
                      <el-option label="雨" :value="3"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="Temperature">
                    <el-input v-model="form.Temperature" placeholder="请输入温度" :disabled='isDisabled' />
                  </el-form-item>
                  <el-form-item class="cardbtns">
                    <el-button type="primary" size="mini" :disabled='isDisabled' @click="handleAccept">接班</el-button>
                    <el-button type="info" size="mini" :disabled='isDisabled' plain @click="handleReset">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
            <div class="databtnbox left">
              <el-button type="primary" circle size="mini">接</el-button>
              <label>2020-04-29 早班 08:00:00</label>
            </div>
          </div>
          <div class="rightcard">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>交班信息</span>
              </div>
              <div class="text item">
                <el-form ref="form" :model="form1" :rules="rules" :inline="true">
                  <el-form-item prop="PositionName">
                    <el-input :value='"岗位："+form1.PositionName' disabled />
                  </el-form-item>
                  <el-form-item prop="StartTime">
                    <el-input :value="'交班时间：'+ this.parseTime(form1.StartTime, '{y}-{m}-{d} {hh}:{mm}:{ss}')" disabled />
                  </el-form-item>
                  <el-form-item prop="UserName">
                    <el-input :value="'交班人：'+form1.UserName" disabled />
                  </el-form-item>
                  <el-form-item prop="Weather">
                    <el-select v-model="form1.Weather" placeholder="请选择天气">
                      <el-option label="晴" :value="1"></el-option>
                      <el-option label="阴" :value="2"></el-option>
                      <el-option label="雨" :value="3"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="Temperature">
                    <el-input v-model="form1.Temperature" placeholder="请输入温度" />
                  </el-form-item>
                  <el-form-item class="cardbtns">
                    <el-button type="primary" size="mini" @click="handleAccept">交班</el-button>
                    <!-- <el-button type="primary" size="mini" plain>召回</el-button> -->
                    <el-button type="info" size="mini" plain @click="handleReset1">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
            <div class="databtnbox right">
              <label>2020-04-10 早班 18:00:00</label>
              <el-button type="primary" plain circle disabled size="mini">交</el-button>
            </div>
          </div>
        </div>
      </el-row>

    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList, deleted } from "@/api/runningDuty/record/shiftRecord";

export default {
  name: "user",
  components: {},
  props: {
    currentData: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      rules: {},
      isDisabled: false,
      form: {},
      form1: {}
    };
  },

  created() {},
  watch: {
    currentData: {
      handler: function(val, oldval) {
        if (val.length > 0) {
          if (new Date() > new Date(val[0].StartTime)) {
            this.isDisabled = true;
            this.reset(val[0]);
            this.reset1(val[0]);
          } else {
            this.reset();
            this.getCurrentDate();
          }
          this.getCurrentDate1();
        }
      },
      deep: true //对象内部的属性监听，也叫深度监听
    }
  },
  computed: {
    ...mapGetters({
      companyType: "status/companyType"
    })
  },
  methods: {
    getCurrentDate() {
      setTimeout(() => {
        this.form.StartTime = new Date();
        this.getCurrentDate();
      }, 1000);
    },
    getCurrentDate1() {
      setTimeout(() => {
        this.form1.StartTime = new Date();
        this.getCurrentDate1();
      }, 1000);
    },
    handleAccept() {},
    handleReset() {
      this.form.Temperature = "";
      this.form.Weather = "";
    },
    handleReset1() {
      this.form1.Temperature = "";
      this.form1.Weather = "";
    },
    reset(data) {
      this.form = Object.assign(
        {
          StartTime: new Date(),
          UserName: "",
          Weather: "",
          Temperature: "",
          PositionName: ""
        },
        data
      );
    },
    reset1(data) {
      this.form1 = Object.assign(
        {
          StartTime: new Date(),
          UserName: "",
          Weather: "",
          Temperature: "",
          PositionName: ""
        },
        data,
        {
          Weather: "",
          Temperature: ""
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-card {
  width: 360px;
  .el-card__header {
    padding: 15px 30px;
    border-bottom: none;
    box-sizing: border-box;
    background-color: #f9fafd;
  }
  .el-card__body {
    padding: 20px 30px;
    .el-form {
      padding-right: 0px;
      .el-form-item {
        margin-bottom: 15px;
        margin-right: 0;
        width: 100%;
      }
      .el-form-item--medium .el-form-item__label {
        line-height: inherit;
        margin-bottom: 15px;
      }
      .el-form-item--medium .el-form-item__content {
        width: 100%;
      }
    }
    .cardbtns {
      margin-bottom: 0 !important;
      text-align: center;
    }
  }
}
.rowbox {
  padding: 30px 0px;
  width: 750px;
  margin-left: -420px;
  position: relative;
  left: 50%;
}
.databtnbox {
  position: absolute;
  z-index: 1;
  .el-button--mini.is-circle {
    height: 40px;
    line-height: 38px;
    padding: 0;
    width: 40px;
    font-size: 18px;
    span {
      font-size: 18px;
    }
  }
  label {
    color: #303133;
    font-weight: normal;
    font-size: 14px;
    margin: 0 15px;
  }
  &.left {
    right: -305px;
    top: 42%;
    label {
      color: #558cf7;
    }
    &::before {
      content: "";
      width: 70px;
      height: 0;
      border-top: solid 1px #dcdfe4;
      display: inline-block;
      vertical-align: middle;
    }
  }
  &.right {
    left: -305px;
    top: 42%;
    label {
      color: #303133;
    }
    &::after {
      content: "";
      width: 70px;
      height: 0;
      border-top: solid 1px #dcdfe4;
      display: inline-block;
      vertical-align: middle;
    }
  }
}
.leftcard {
  display: inline-block;
  position: relative;
  margin-bottom: 70px;
  .el-card {
    float: right;
  }
  &::after {
    content: "";
    width: 1px;
    height: 70vh;
    background-color: #ebeef5;
    display: inline-block;
    position: absolute;
    right: -86px;
    top: 0;
  }
}
.rightcard {
  top: 220px;
  margin-left: -210px;
  left: 50%;
  display: inline-block;
  position: relative;
}
</style>
