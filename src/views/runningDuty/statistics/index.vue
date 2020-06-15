<template>
  <div class="app-container">
    <div class="search-box xl-querybox marginbottom15">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按人员统计" name="1"></el-tab-pane>
        <el-tab-pane label="按值班统计" name="2"></el-tab-pane>
      </el-tabs>
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
        <el-form-item label="用电单位：" prop="tenantId">
          <el-select v-model="queryParams.tenantId">
            <el-option label="请选择" value></el-option>
            <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
          </el-select>
        </el-form-item>
        <el-form-item label="年度：" prop="patrolYear">
          <el-date-picker v-model="patrolYear" clearable type="year" placeholder="请选择年" value-format="yyyy"> </el-date-picker>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          <el-button @click="handleExport">
            <svg-icon icon-class='ic_export' class="tablesvgicon"></svg-icon>
            导出
          </el-button>
        </el-form-item>
        <!-- <el-button type="success" icon="el-icon-edit-outline" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:user:edit']">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">删除</el-button>
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>-->
      </el-form>
    </div>
    <div class="bg-white containerbox marginbottom15" ref="containerbox">
      <p class="form-smtitle tb-smtitle">
        <span v-if="activeName=='1'">人员统计</span>
        <span v-if="activeName=='2'">值班统计</span>
      </p>
      <el-table v-loading="listLoading" :data="dataList" border :height="tableHeight" :row-class-name='totalstyle' @row-click='handleRowInfo'>
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" class="smimg" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column :label="activeName=='1'?'值班人员':'用电单位'" prop="Name" min-width="210" />
        <el-table-column v-for="(item,index) in columns" :key="props[index]" :prop="props[index]" :label="item" min-width="75" />
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
    <div class="bg-white containerbox  chart-wrapper">
      <p class="form-smtitle tb-smtitle">{{chartData.title}}-值班统计图 </p>
      <div class='smchartbox' v-if="dataList&&dataList.length>0">
        <BarChart ref="chart" :chartData='chartData' />
      </div>
      <p v-else class="tips" style="padding: 7% 0;">暂无数据</p>

    </div>
  </div>

</template>

<script>
import { mapGetters } from "vuex";
import { getDutyScheduleReport } from "@/api/report";
import BarChart from "./components/BarChart";
export default {
  name: "user",
  components: { BarChart },
  data() {
    return {
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
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        type: 1,
        tenantId: "",
        starttime: "",
        endtime: ""
      },
      patrolYear: "",
      activeName: "1",
      chartData: {},
      tableHeight: "calc(100% - 110px)",
      columns: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
      ],
      props: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ]
    };
  },

  created() {
    this.getList(this.activeName);
  },
  computed: {
    ...mapGetters({
      companyType: "status/companyType"
    })
  },
  methods: {
    handleClick(tab, event) {
      this.resetQuery("queryForm");
      this.patrolYear = "";
      this.queryParams.starttime = "";
      this.queryParams.endtime = "";
      this.queryParams.type = parseInt(this.activeName);
      this.getList(this.activeName);
    },

    /** 搜索用户列表 */
    getList(activeName, row) {
      this.listLoading = true;
      getDutyScheduleReport(this.queryParams)
        .then(response => {
          this.dataList = response.data;
          this.total = response.total;
          let arr = [];
          if (!row) {
            arr = this.dataList[this.dataList.length - 1];
          } else {
            arr = row;
          }
          this.chartData.listData = this.props.map(v => arr[v]);
          this.chartData.xAxisData = this.columns;
          this.chartData.title = arr.Name;

          this.$nextTick(() => {
            this.$refs.chart.initChart();
          });
        })
        .finally(r => {
          this.listLoading = false;
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageno = 1;
      this.queryParams.starttime = this.getBeginTime();
      this.queryParams.endtime = this.getEndTime();
      this.getList(this.activeName);
    },
    // 获取开始时间
    getBeginTime(time) {
      let begin = "";
      if (this.patrolYear != "") {
        begin = this.patrolYear + "-01-01 00:00:00";
      }
      return begin;
    },
    // 获取结束时间
    getEndTime() {
      let end = "";
      if (this.patrolYear != "") {
        end = this.patrolYear + "-12-31 23:59:59";
      }
      return end;
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.patrolYear = "";
      this.queryParams.starttime = "";
      this.queryParams.endtime = "";
      this.handleQuery();
    },
    // 点击行
    handleRowInfo(row) {
      this.getList(this.activeName, row);
    },
    totalstyle({ row, rowIndex }) {
      if (row.Name === "合计" || row.Name === "总计") {
        return "total-font";
      }
      return "";
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportUser(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
<style lang="scss">
</style>
