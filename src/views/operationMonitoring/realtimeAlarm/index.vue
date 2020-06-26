<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-query">
        <el-form-item label="用电单位：" prop="tenantId">
          <el-select v-model="queryParams.tenantId" clearable placeholder="请选择用电单位">
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警类型：" prop="WarningType">
          <el-select v-model="queryParams.WarningType" clearable placeholder="请选择告警类型">
            <el-option v-for="(item,index) in WarningTypes" :key="index" :label="item.type" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否确认：" prop="IsConfirmed">
          <el-select v-model="queryParams.IsConfirmed" clearable placeholder="请选择告警类型">
            <el-option v-for="(item,index) in IsConfirmeds" :key="index" :label="item.type" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警时间：" prop="WarningTime">
          <el-select v-model="WarningTime" clearable placeholder="请选择告警时间" @change='getWarningTime'>
            <el-option label="全部" value=""></el-option>
            <el-option label="近一个月" value="0"></el-option>
            <el-option label="近一周" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" :data="dataList" :height="tableHeight" border style='margin-top:20px'>
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <!-- <el-table-column type="selection" fixed="left" width="50" /> -->
        <el-table-column label="告警等级" width="130" prop="Level" :formatter="levelformatter"></el-table-column>
        <el-table-column label="用电单位" min-width="250" prop="TenantName"></el-table-column>
        <el-table-column label="配电房/屏柜" min-width="300" prop="SwitchRoomName">
          <template slot-scope="scope">
            {{scope.row.SwitchRoomName}}/{{scope.row.CabinetName}}
          </template>
        </el-table-column>
        <el-table-column label="设备名称" width="150" prop="AssetsName"></el-table-column>
        <el-table-column label="信号名" width="120" prop="Signal"></el-table-column>
        <el-table-column label="告警描述" min-width="250" prop="Description"></el-table-column>
        <el-table-column label="告警时间" width="180" prop="CreateTime"></el-table-column>
        <el-table-column label="告警值" width="110" prop="Value"></el-table-column>
        <el-table-column label="是否确认" width="120" prop="IsConfirmed">
          <template slot-scope="scope">
            {{scope.row.IsConfirmed?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column label="确认人" width="140" prop="ConfirmPersonName"></el-table-column>
        <el-table-column label="确认描述" min-width="230" prop="HandleDescription"></el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button type="primary" plain size="mini" v-if="!scope.row.IsConfirmed" @click="handleCheck(scope.row)">
                <svg-icon icon-class='ic_enable' class="tablesvgicon"></svg-icon>确认
              </el-button>
              <el-button type="primary" plain size="mini" v-else-if="!scope.row.IsReported" @click="handleDispatch(scope.row)">
                <!-- <el-button type="primary" plain size="mini" @click="handleDispatch(scope.row)"> -->
                <svg-icon icon-class='ic_dispatch' class="tablesvgicon"></svg-icon>派单
              </el-button>
              <el-button type="primary" plain size="mini" v-else @click="handleToOrder(scope.row)">
                <!-- <el-button type="primary" plain size="mini" @click="handleToOrder(scope.row)"> -->
                <svg-icon icon-class='ic_look' class="tablesvgicon"></svg-icon>查看工单
              </el-button>
              <el-button type="primary" plain size="mini" @click="handleMonitor(scope.row)">
                <svg-icon icon-class='ic_video' class="tablesvgicon"></svg-icon>监控
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { fetchList, confirm } from "@/api/operationMonitoring/realtimeAlarm";
import { getChildrenList } from "@/api/org";

export default {
  name: "",
  data() {
    return {
      deptType: null,
      // 遮罩层
      listLoading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      rules: {},
      tableHeight: "calc(100% - 80px)",
      TenantIds: [],
      WarningTime: "",

      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        WarningType: "",
        StartDate: "",
        EndDate: "",
        IsConfirmed: ""
      },
      WarningTypes: [
        {
          id: "",
          type: "全部"
        },
        {
          id: 1,
          type: "越上上限"
        },
        {
          id: 2,
          type: "越上限"
        },
        {
          id: 3,
          type: "越下限"
        },
        {
          id: 4,
          type: "越下下限"
        },
        {
          id: 5,
          type: "其他告警"
        },
        {
          id: 6,
          type: "过压"
        },
        {
          id: 7,
          type: "欠压"
        },
        {
          id: 8,
          type: "过流"
        },
        {
          id: 9,
          type: "失电"
        },
        {
          id: 10,
          type: "超温"
        },
        {
          id: 11,
          type: "分闸"
        },
        {
          id: 12,
          type: "故障态"
        },
        {
          id: 13,
          type: "工况异常"
        },
        {
          id: 14,
          type: "告警"
        },
        {
          id: 15,
          type: "火警"
        },
        {
          id: 16,
          type: "故障"
        },
        {
          id: 17,
          type: "启动"
        },
        {
          id: 18,
          type: "超温报警"
        },
        {
          id: 19,
          type: "烟雾报警"
        }
      ],
      IsConfirmeds: [
        {
          id: "",
          type: "全部"
        },
        {
          id: false,
          type: "未确认"
        },
        {
          id: true,
          type: "已确认"
        }
      ]
    };
  },
  created() {
    this.getList();
    this.getTenants();
  },
  methods: {
    // 巡视单位列表
    getTenants() {
      getChildrenList()
        .then(response => {
          this.TenantIds = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /** 搜索用户列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.total = response.total;
          this.dataList = response.data;
        })
        .finally(r => {
          this.listLoading = false;
        });
    },
    getWarningTime() {
      var date = new Date();
      var list = [];
      if (this.WarningTime != "") {
        if (this.WarningTime == "1") {
          list = this.getDateRange(date, 6, true);
        } else if (this.WarningTime == "0") {
          list = this.getDateRange(date, 30, true);
        }
        this.queryParams.StartDate = list[0];
        this.queryParams.EndDate = list[1];
      } else {
        this.queryParams.StartDate = "";
        this.queryParams.EndDate = "";
      }
    },

    getDateRange(dateNow, intervalDays, bolPastTime) {
      let oneDayTime = 24 * 60 * 60 * 1000;
      let list = [];
      let lastDay;

      if (bolPastTime == true) {
        lastDay = new Date(dateNow.getTime() - intervalDays * oneDayTime);
        list.push(this.formateDate(lastDay));
        list.push(this.formateDate(dateNow));
      } else {
        lastDay = new Date(dateNow.getTime() + intervalDays * oneDayTime);
        list.push(this.formateDate(dateNow));
        list.push(this.formateDate(lastDay));
      }
      return list;
    },
    formateDate(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();

      if (month < 10) {
        month = "0" + month;
      }

      if (day < 10) {
        day = "0" + day;
      }

      return year + "-" + month + "-" + day + "";
    },
    levelformatter(row) {
      var txt = "";
      if (row.Level == 1) {
        txt = "一般事件";
      } else if (row.Level == 2) {
        txt = "轻微告警";
      } else if (row.Level == 3) {
        txt = "普通告警";
      } else if (row.Level == 4) {
        txt = "严重";
      }
      return txt;
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageno = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.StartDate = "";
      this.queryParams.EndDate = "";
      this.handleQuery();
    },
    // 监控
    handleMonitor(row) {},
    // 派单
    handleDispatch(row) {
      const SourceTenantId = row.TenantId;
      const Situation = "故障告警";
      this.$router.push({
        name: "/repairOrder/repair/components/add",
        params: { data: { SourceTenantId, Situation }, fromUrl: true }
      });
    },

    // 查看工单
    handleToOrder(row) {
      const ReadOnly = true;
      this.$router.push({
        name: "/repairOrder/repair/components/add",
        params: { data, ReadOnly, fromUrl: true }
      });
    },
    // 确认
    handleCheck(row) {
      const data = {
        Id: row.Id
      };
      this.$router.push({
        name: "/operationMonitoring/realtimeAlarm/components/check",
        params: { data }
      });

      // var Id = row.Id;
      // var description = row.Description;
      // confirm({ Id, description }).then(r => {
      //   this.getList();
      // });
    }
  }
};
</script>
<style lang="scss">
</style>
