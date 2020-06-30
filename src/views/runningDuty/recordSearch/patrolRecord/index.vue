<template>
  <div class="comheight comflexbox">
    <div class="search-box xl-querybox ">
      <div class='sm-searchbox'>
        <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-querybox" :rules="rules" >
          <el-form-item label="用电单位：" prop="tenantId">

            <el-select v-model="queryParams.tenantId">
              <el-option label="全部" value></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
            </el-select>

          </el-form-item>
          <el-form-item label="值班班组：" prop="teamId">
            <el-select v-model="queryParams.teamId" @change='getDutyTeam'>
              <el-option label="全部" value=""></el-option>
              <el-option :key="item.Id" :label="item.Name" :value="item.Id" v-for="item in teamList" />
            </el-select>
          </el-form-item>
          <el-form-item label="岗位：" prop="dutyTeam" v-show='isShow'>
            <el-select v-model="queryParams.dutyTeam">
              <el-option label="全部" value=""></el-option>
              <el-option :key="item.Id" :label="item.Name" :value="item.Id" v-for="item in dutyTeams" />
            </el-select>
          </el-form-item>
          <el-form-item label="关键词：" prop="keyword" label-width="61px" v-show='isShow'>
            <el-input v-model="queryParams.keyword" placeholder="巡视人/记录人/巡视内容/巡视情况" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>

          <!-- <el-form-item label="巡视人：" prop="patrolname">
                    <el-input v-model="queryParams.patrolname" placeholder="" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="记录人：" prop="recordname">
                    <el-input v-model="queryParams.recordname" placeholder="" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="巡视内容：" prop="recordcontent">
                    <el-input v-model="queryParams.recordcontent" placeholder="" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="巡视情况：" prop="situation">
                    <el-input v-model="queryParams.situation" placeholder="" clearable @keyup.enter.native="handleQuery" />
                </el-form-item> -->
          <el-form-item label="巡视日期：" prop="timeRange" v-show='isShow'>
            <el-date-picker v-model="timeRange" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" style='width:230px'></el-date-picker>
            <!-- <el-date-picker v-model="queryParams.starttime" style='width: 47%;' type="date" placeholder="请选择日期" clearable></el-date-picker>
          至
          <el-date-picker v-model="queryParams.endtime" style='width: 47%;' type="date" placeholder="请选择日期" clearable></el-date-picker> -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="text" @click="handleHighSearch" class="hightsearchbtn">高级筛选<i :class="isShow?'el-icon-arrow-down':'el-icon-arrow-up'" /></el-button>
      </div>
    </div>
    <div class="bg-white containerbox " ref="containerbox">
      <el-table :data="dataList" @selection-change="handleSelectionChange" border :height="height" @sort-change="handleSortChange" style='margin-top:15px;'>

        <template slot="empty">
          <div class="nodata-box">
            <img src="@/assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <!-- <el-table-column type="selection" fixed="left" width="50" /> -->
        <el-table-column label="用电单位" min-width='230' prop="TenantName" />
        <el-table-column label="值班班组" min-width='150' prop="TeamName" />
        <el-table-column label="巡视开始时间" width='180' prop="PatrolStartTime" />
        <el-table-column label="巡视结束时间" width='180' prop="PatrolEndTime" />
        <el-table-column label="巡视人员" min-width='120' prop="PatrolName" />
        <el-table-column label="记录人" width='120' prop="RecorderName" />
        <el-table-column label="记录时间" width='180' prop="RecordTime" />
        <el-table-column label="巡视内容" min-width='200' prop="RecordContent" />
        <el-table-column label="巡视情况" min-width='200' prop="Situation" />
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList, deleted } from "@/api/runningDuty/record/patrolRecord";
import {
  fetchTeam,
  getListsByDutyTeam
} from "@/api/runningDuty/dutyConfiguration";

export default {
  props: {
    shifts: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  name: "user",
  data() {
    return {
      // 遮罩层
      listLoading: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      height: "calc(100% - 80px)",
      rules: {},
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        situation: "",
        teamId: "",
        dutyTeam: "",
        recordcontent: "",
        starttime: "",
        endtime: "",
        patrolname: "",
        keyword: "",
        recordname: ""
      },
      timeRange: [],
      teamList: [],
      dutyTeams: [],
      isShow: false,
    };
  },

  created() {
    this.getTeam();
  },
  computed: {
    ...mapGetters({
      companyType: "status/companyType"
    }),
    single() {
      return this.ids.length != 1;
    },
    multiple() {
      return this.ids.length == 0;
    }
  },
 
  methods: {
    // 高级筛选
    handleHighSearch() {
      this.isShow = !this.isShow;
    },
    getTeam() {
      fetchTeam({ ifused: true }).then(r => {
        this.teamList = r.data;
      });
    },

    getDutyTeam() {
      console.log(this.queryParams);
      getListsByDutyTeam({ dutyteamId: this.queryParams.teamId }).then(r => {
        console.log(2);
        this.dutyTeams = r.data;
      });
    },
    handleSortChange(row) {
      this.queryParams.orderby = `${row.prop} ${
        row.order == "ascending" ? "asc" : "desc"
      }`;
      this.getList();
    },
    /** 搜索用户列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data;
          this.total = response.total;
        })
        .finally(r => {
          this.listLoading = false;
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageno = 1;
      if (this.timeRange.length > 0) {
        this.queryParams.starttime = this.timeRange[0] + " 00:00:00";
        this.queryParams.endtime = this.timeRange[1] + " 23:59:59";
      } else {
        this.queryParams.starttime = "";
        this.queryParams.endtime = "";
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.timeRange = [];
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>