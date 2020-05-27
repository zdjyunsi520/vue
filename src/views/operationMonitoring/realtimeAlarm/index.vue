<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-query">
        <el-form-item label="用电单位" prop="tenantId">
          <el-select v-model="queryParams.tenantId" clearable placeholder="请选择用电单位">
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警类型" prop="alarmType">
          <el-select v-model="queryParams.alarmType" clearable placeholder="请选择告警类型">
            <el-option v-for="(item,index) in alarmTypes" :key="index" :label="item.type" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否确认" prop="isCheck">
          <el-select v-model="queryParams.isCheck" clearable placeholder="请选择告警类型">
            <el-option v-for="(item,index) in isChecks" :key="index" :label="item.type" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-table v-loading="listLoading" :data="dataList" :height="dataList?tableHeight:'0'" border style='margin-top:20px'>
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column type="selection" fixed="left" width="55" align="center" />
        <el-table-column label="告警等级" min-width="220" sortable align='center' prop="ReportName"></el-table-column>
        <el-table-column label="用电单位" min-width="250" sortable align='center' prop="ReportName1"></el-table-column>
        <el-table-column label="配电房/屏柜" width="150" sortable align='center' prop="ReportName2"></el-table-column>
        <el-table-column label="设备名称" width="150" sortable align='center' prop="ReportName3"></el-table-column>
        <el-table-column label="信号名" width="150" sortable align='center' prop="ReportName4"></el-table-column>
        <el-table-column label="告警描述" width="150" sortable align='center' prop="ReportName5"></el-table-column>
        <el-table-column label="告警时间" min-width="140" sortable align='center' prop="ReportName6"></el-table-column>
        <el-table-column label="告警值" min-width="140" sortable align='center' prop="ReportName7"></el-table-column>
        <el-table-column label="是否复归" min-width="140" sortable align='center' prop="ReportName8"></el-table-column>
        <el-table-column label="是否确认" min-width="140" sortable align='center' prop="ReportName9"></el-table-column>
        <el-table-column label="操作" min-width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="primary" plain size="mini" @click="handleCheck(scope.row)">确认</el-button>
              <el-button type="primary" plain size="mini" @click="handleDispatch(scope.row)">派单</el-button>
              <el-button type="primary" plain size="mini" @click="handleMonitor(scope.row)">监控</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { fetchReport } from "@/api/patrol";
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
      tableHeight: "auto",
      TenantIds: [],

      // 查询参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        alarmType: "",
        isCheck: ""
      },
      alarmTypes: [
        {
          id: "",
          type: "全部"
        },
        {
          id: "1",
          type: "越上上限"
        },
        {
          id: "2",
          type: "越上限"
        },
        {
          id: "3",
          type: "越下限"
        },
        {
          id: "4",
          type: "越下下限"
        },
        {
          id: "5",
          type: "其他告警"
        },
        {
          id: "6",
          type: "过压"
        },
        {
          id: "7",
          type: "欠压"
        },
        {
          id: "8",
          type: "过流"
        },
        {
          id: "9",
          type: "失电"
        },
        {
          id: "10",
          type: "超温"
        },
        {
          id: "11",
          type: "分闸"
        },
        {
          id: "12",
          type: "故障态"
        },
        {
          id: "13",
          type: "工况异常"
        },
        {
          id: "14",
          type: "告警"
        },
        {
          id: "15",
          type: "火警"
        },
        {
          id: "16",
          type: "故障"
        },
        {
          id: "17",
          type: "启动"
        },
        {
          id: "18",
          type: "超温报警"
        },
        {
          id: "19",
          type: "烟雾报警"
        }
      ],
      isChecks: [
        {
          id: "",
          type: "全部"
        },
        {
          id: "0",
          type: "未确认"
        },
        {
          id: "1",
          type: "已确认"
        }
      ]
    };
  },
  created() {
    this.getList();
    this.getTenants();
  },
  mounted() {
    let _this = this;
    window.onresize = function() {
      _this.setTableHeight();
    };
  },
  destroyed() {
    window.onresize = null;
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
    setTableHeight() {
      this.tableHeight = this.$refs.containerbox.offsetHeight - 80;
    },
    /** 查询用户列表 */
    getList() {
      this.listLoading = true;
      fetchReport(this.queryParams)
        .then(response => {
          // this.dataList = response.data;
          this.total = response.total;
          this.dataList = [
            {
              ReportName: "一般",
              ReportName1: "福建迅腾电力科技有限公司",
              ReportName2: "配电室1/--",
              ReportName3: "1#烟感",
              ReportName4: "故障",
              ReportName5: "1#烟感 故障 启动",
              ReportName6: "2020-04-05 15:11:32",
              ReportName7: "1.0",
              ReportName8: "是",
              ReportName9: "是"
            },
            {
              ReportName: "普通",
              ReportName1: "福建迅腾电力科技有限公司",
              ReportName2: "配电室1/低压进线间隔",
              ReportName3: "低压进线间隔",
              ReportName4: "A相电流",
              ReportName5: "低压进线间隔 A相电流 过流",
              ReportName6: "1#烟感 故障 启动",
              ReportName7: "2020-04-03 14:41:27",
              ReportName8: "1.0",
              ReportName9: "是"
            }
          ];
        })
        .finally(r => {
          this.listLoading = false;
          this.setTableHeight();
        });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.patroltimeend = "";
      this.handleQuery();
    },
    // 监控
    handleMonitor(row) {},
    // 派单
    handleDispatch(row) {},
    // 确认
    handleCheck(row) {}
  }
};
</script>
<style lang="scss">
</style>
