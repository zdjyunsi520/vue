<template>
  <div class="app-container">
    <el-scrollbar>
      <div class="search-box marginbottom15">
        <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-query">
          <el-form-item label="单位名称" prop='tenantId'>
            <el-select v-model="queryParams.tenantId" clearable placeholder="请选择" @change="handleChangeTenantId">
              <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配电室" prop='switchroomId'>
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
          <div class="nodata-box" style='height:calc(100vh - 240px)'>
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
            <el-col :span="8" :xs='24' class="smbsdatabox blue-box">
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
                        <span>p</span>
                        <label>{{item1.p?item1.p:'-'}}</label>
                        <b>kW</b>
                      </p>
                      <p>
                        <span>S</span>
                        <label>{{item1.S?item1.S:'-'}}</label>
                        <b>kVA</b>
                      </p>
                    </el-col>
                    <el-col :span="12">
                      <p>
                        <span>la</span>
                        <label>{{item1.la?item1.la:'-'}}</label>
                        <b>A</b>
                      </p>
                      <p>
                        <span>lb</span>
                        <label>{{item1.lb?item1.lb:'-'}}</label>
                        <b>A</b>
                      </p>
                      <p>
                        <span>lc</span>
                        <label>{{item1.lc?item1.lc:'-'}}</label>
                        <b>A</b>
                      </p>
                      <p>
                        <span>PF</span>
                        <label>{{item1.PF?item1.PF:'-'}}</label>
                        <b></b>
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
            <el-col :span="8" :xs='24' class="smbsdatabox lightblue-box">
              <div>
                <div class="tophead">
                  <i>
                    <svg-icon icon-class='ic_smoke_sensation' /></i>烟感间隔
                </div>
                <div class="cntbox">
                  <el-row :gutter="40">
                    <el-col :span="24">
                      <p>
                        <span>电池低电压</span>
                        <label>{{item1.R1_STATE?item1.R1_STATE:'-'}}</label>
                      </p>
                      <p>
                        <span>故障</span>
                        <label>{{item1.R22_STATE?item1.R22_STATE:'-'}}</label>
                      </p>
                      <p>
                        <span>火警</span>
                        <label>{{item1.R3_STATE?item1.R3_STATE:'-'}}</label>
                      </p>
                      <p>
                        <span>测试</span>
                        <label>{{item1.R5_STATE?item1.R5_STATE:'-'}}</label>
                      </p>
                      <p>
                        <span>AC PowerDown</span>
                        <label>{{item1.R2_STATE?item1.R2_STATE:'-'}}</label>
                      </p>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
            <el-col :span="8" :xs='24' class="smbsdatabox orange-box">
              <div>
                <div class="tophead">
                  <i>
                    <svg-icon icon-class='ic_temperature_control' /></i>温控间隔
                </div>
                <div class="cntbox">
                  <el-row :gutter="40">
                    <el-col :span="24">
                      <p>
                        <span>温度</span>
                        <label>{{item1.T?item1.T:'-'}}</label>
                        <b>℃</b>
                      </p>
                      <p>
                        <span>湿度</span>
                        <label>{{item1.HR?item1.HR:'-'}}</label>
                        <b>%</b>
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
import { getPowerRoomByTenantId, getDeviceMonitor } from "@/api/report";
import { getChildrenList, getTrees } from "@/api/org";
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
      getPowerRoomByTenantId(this.queryParams).then(res => {
        this.switchrooms = res.data || [];
        let switchroomId = "";
        if (this.switchrooms.length) {
          switchroomId = this.switchrooms[0].Id;
        }
        this.queryParams.switchroomId = switchroomId;
        this.handleFirstEvent();
      });
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
}
.smbsdatabox {
  & > div {
    border: solid 1px #f1f1f1;
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