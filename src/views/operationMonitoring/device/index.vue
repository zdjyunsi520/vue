<template>
  <div class="app-container">
    <el-scrollbar>
      <div class="search-box">
        <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-querybox">
          <el-form-item label="单位名称：" prop='tenantId'>
            <el-select v-model="queryParams.tenantId" clearable placeholder="请选择" @change="handleChangeTenantId">
              <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配电室：" prop='switchroomId'>
            <el-select v-model="queryParams.switchroomId" clearable placeholder="请选择">
              <el-option v-for="(item,index) in switchrooms" :key="index" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="bg-white datainfo1 " v-if="dataList.length==0">
        <template>
          <div class="nodata-box" style='height:calc(100vh - 225px)'>
            <img src="@/assets/image/nodata.png" style='padding-top: 10%;' />
            <p>暂时还没有数据</p>
          </div>
        </template>
      </div>
      <div class="bg-white  datainfo1  marginbottom15" v-for="item in dataList">

        <div class="form-smtitle ">{{item.CabinetName}}</div>
        <el-row :gutter="20">
          <template v-if="!item.IntervalData||item.IntervalData.length==0">
            <div class="nodata-box">
              <img src="@/assets/image/nodata.png" />
              <p>暂时还没有数据</p>
            </div>
          </template>

          <template v-for="item1 in item.IntervalData">
            <el-col :span="8" :xs='24' class="smbsdatabox orange-box" v-if="item1.Type==3">
              <div>
                <div class="tophead">
                  <i>
                    <svg-icon icon-class='ic_temperature_control' /></i>{{item1.Name}}
                </div>
                <div class="cntbox">
                  <el-row :gutter="40">
                    <el-col :span="24">
                      <p>
                        <span>温度</span>
                        <label>{{item1.Humidity?item1.Humidity:'-'}}</label>
                        <b>℃</b>
                      </p>
                      <p>
                        <span>湿度</span>
                        <label>{{item1.Temperature?item1.Temperature:'-'}}</label>
                        <b>%</b>
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
            <el-col :span="8" :xs='24' class="smbsdatabox lightblue-box" v-else-if="item1.Type==4">
              <div>
                <div class="tophead">
                  <i>
                    <svg-icon icon-class='ic_smoke_sensation' /></i>{{item1.Name}}
                </div>
                <div class="cntbox">
                  <el-row :gutter="40">
                    <el-col :span="24">
                      <p>
                        <span>火灾</span>
                        <label>{{item1.IsFire?'是':'否'}}</label>
                      </p>
                      <p>
                        <span>传感器</span>
                        <label>{{item1.IsSensorNormal?'正常':'异常'}}</label>
                      </p>
                      <p>
                        <span>测试状态</span>
                        <label>{{item1.IsTest?'是':'否'}}</label>
                      </p>
                      <p>
                        <span>信号轻强度</span>
                        <label>{{item1.SignalStrength?item1.SignalStrength:'-'}}</label>
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
            <el-col :span="8" :xs='24' class="smbsdatabox blue-box" v-else>
              <div>
                <div class="tophead">
                  <i>
                    <svg-icon icon-class='ic_panel_cabinet' /></i>{{item1.Name}}
                </div>
                <div class="cntbox">
                  <el-row :gutter="40">
                    <el-col :span="12">
                      <p>
                        <span>Ua</span>
                        <label>{{item1.Ua?item1.Ua:'-'}}</label>
                        <b>V</b>
                      </p>
                      <p>
                        <span>Ub</span>
                        <label>{{item1.Ub?item1.Ub:'-'}}</label>
                        <b>V</b>
                      </p>
                      <p>
                        <span>Uc</span>
                        <label>{{item1.Uc?item1.Uc:'-'}}</label>
                        <b>V</b>
                      </p>
                      <p>
                        <span>Pt</span>
                        <label>{{item1.Pt?item1.Pt:'-'}}</label>
                        <b>kW</b>
                      </p>
                      <p>
                        <span>St</span>
                        <label>{{item1.St?item1.St:'-'}}</label>
                        <b>kVA</b>
                      </p>
                    </el-col>
                    <el-col :span="12">
                      <p>
                        <span>Ia</span>
                        <label>{{item1.Ia?item1.Ia:'-'}}</label>
                        <b>A</b>
                      </p>
                      <p>
                        <span>Ib</span>
                        <label>{{item1.Ib?item1.Ib:'-'}}</label>
                        <b>A</b>
                      </p>
                      <p>
                        <span>Ic</span>
                        <label>{{item1.Ic?item1.Ic:'-'}}</label>
                        <b>A</b>
                      </p>
                      <p>
                        <span>Pft</span>
                        <label>{{item1.Pft?item1.Pft:'-'}}</label>
                        <b></b>
                      </p>
                      <p>
                        <span>E</span>
                        <label>{{item1.E?item1.E:'-'}}</label>
                        <b></b>
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>

          </template>
        </el-row>
      </div>

    </el-scrollbar>

  </div>
</template>

<script>
import {
  GetTenantList as getChildrenList,
  getPowerRoomByTenantId,
  getDeviceMonitor
} from "@/api/report";
import { getTrees } from "@/api/org";
export default {
  data() {
    return {
      // 搜索参数
      queryParams: {
        tenantId: "",
        switchroomId: ""
      },

      dataList: [],
      rules: {},
      TenantIds: [],
      TenantTree: [],
      listLoading: true,
      firstLoad: 1,
      switchrooms: []
    };
  },

  created() {
    this.getTenants();
    this.getAssets();
  },
  computed: {},
  methods: {
    //切换用电单位ID
    handleChangeTenantId() {
      this.switchrooms = this.TenantIds.filter(
        v => v.Id == this.queryParams.tenantId
      )[0].Childs;
      let switchroomId = "";
      if (this.switchrooms.length) {
        switchroomId = this.switchrooms[0].Id;
      }
      this.queryParams.switchroomId = switchroomId;
      this.handleFirstEvent();
    },
    //第一次进来
    handleFirstEvent() {
      if (
        this.firstLoad &&
        this.queryParams.switchroomId &&
        this.queryParams.tenantId
      ) {
        this.getMonitor();
      }
      this.firstLoad = 0;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getMonitor();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.patrolYear = "";
      this.timeBegin = "";
      this.timeEnd = "";
      this.queryParams.patroltimebegin = "";
      this.queryParams.patroltimeend = "";
      this.handleQuery();
    },

    getAssets() {
      getTrees().then(res => {
        this.TenantTree = res.data;
        this.handleChangeTenantId();
      });
    },
    // 巡视单位列表
    getTenants() {
      getChildrenList().then(response => {
        this.TenantIds = response.data;
        if (this.TenantIds.length)
          this.queryParams.tenantId = this.TenantIds[0].Id;
      });
    },

    getMonitor() {
      this.dataList = [];
      this.listLoading = true;
      getDeviceMonitor(this.queryParams)
        .then(res => {
          this.dataList = res.data || [];
        })
        .finally(r => {
          this.listLoading = false;
        });
    },

    getPowerRoomByTenantId() {
      getPowerRoomByTenantId(this.queryParams).then(r => {});
    }
  }
};
</script>

<style lang="scss" >
.datainfo1 {
  padding: 20px;
  .el-row {
    margin-bottom: -15px;
  }
}
.smbsdatabox {
  & > div {
    border: solid 1px #f1f1f1;
    margin-bottom: 15px;
  }
  .tophead {
    margin: -1px;
    height: 54px;
    font-size: 16px;
    padding: 0 20px;
    line-height: 54px;
    i {
      margin-right: 10px;
      vertical-align: -0.15em;
      width: 26px;
      height: 26px;
      background: #fff;
      border-radius: 100%;
      line-height: 26px;
      display: inline-block;
      font-size: 26px;
    }
  }
  &.blue-box {
    .tophead {
      background-color: #eef4fe;
      color: #558cf7;
      i {
        background-color: #558cf7;
      }
    }
    label {
      color: #4473f2;
    }
  }
  &.lightblue-box {
    .tophead {
      color: #77c3f9;
      background-color: #e7f5fe;
      i {
        background-color: #77c3f9;
      }
    }
    label {
      color: #77c3f9;
    }
  }
  &.orange-box {
    .tophead {
      background-color: #fcf0e2;
      color: #f3a248;
      i {
        background-color: #f3a248;
      }
    }
    label {
      color: #f3a248;
    }
  }
  .cntbox {
    padding: 10px 20px 10px;
    height: 250px;
    font-weight: normal;
    font-size: 14px;
    p {
      padding: 15px 12%;
      display: flex;
      margin: 0;
      justify-content: space-between;
      span {
        display: inline-block;
        flex: 1;
        color: #333;
      }
      label {
        display: inline-block;
        width: 30px;
        text-align: center;
      }
      b {
        display: inline-block;
        width: 30px;
        font-weight: normal;
        text-align: right;
        color: #909399;
      }
    }
  }
}
</style>