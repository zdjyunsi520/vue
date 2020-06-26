<template>
  <div class="comheight comflexbox">
    <div class="search-box xl-querybox">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
        <el-form-item label="用电单位：" prop="tenantId">

          <el-select v-model="queryParams.tenantId">
            <el-option label="全部" value></el-option>
            <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
          </el-select>

        </el-form-item>
        <el-form-item label="值班班组：" prop="TeamId">
          <el-select v-model="queryParams.TeamId">
            <el-option label="全部" value></el-option>
            <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in teamList" />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位：" prop="ShiftId">
          <el-select v-model="queryParams.ShiftId">
            <el-option label="全部" value=""></el-option>
            <el-option :key="item.Id" :label="item.Name" :value="item.Id" v-for="item in shifts" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词：" prop="keyword" label-width="61px">
          <el-input v-model="queryParams.keyword" placeholder="记事内容/注意事项" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
         <!--  <el-form-item label="交班人：" prop="jiaoban">
                    <el-input v-model="queryParams.jiaoban" placeholder="请输入交班人" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="接班人：" prop="jieban">
                    <el-input v-model="queryParams.jieban" placeholder="请输入交班人" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
              <el-form-item label="记事内容：" prop="recordcontent">
                    <el-input v-model="queryParams.recordcontent" placeholder="" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="注意事项：" prop="caution">
                    <el-input v-model="queryParams.caution" placeholder="" clearable @keyup.enter.native="handleQuery" />
                </el-form-item> -->
        <el-form-item label="值班日期：" prop="starttime">
          <el-date-picker v-model="queryParams.starttime" style='width: 47%;' type="date" placeholder="请选择日期" clearable></el-date-picker>
          至 <el-date-picker v-model="queryParams.endtime" style='width: 47%;' type="date" placeholder="请选择日期" clearable></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox " ref="containerbox">
      <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" :data="dataList" @selection-change="handleSelectionChange" border :height="height" @sort-change="handleSortChange" style='margin-top:15px;'>

        <template slot="empty">
          <div class="nodata-box">
            <img src="@/assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <!-- <el-table-column type="selection" fixed="left" width="50" /> -->
        <el-table-column label="用电单位" min-width='230' prop="TenantName" />
        <el-table-column label="值班日期" width='180' prop="StartTime" />
        <el-table-column label="值班班组" width='140' prop="TeamName" />
        <el-table-column label="岗位" width='100' prop="ShiftName" />
        <el-table-column label="交班人" width='120' prop="HandoverName" />
        <el-table-column label="交班时间" width='180' prop="HandoverTime" />
        <el-table-column label="接班人" width='110' prop="SuccessorName" />
        <el-table-column label="接班时间" width='180' prop="SuccessTime" />
        <el-table-column label="记录内容" min-width='200' prop="RecordContent" />
        <el-table-column label="注意事项" min-width='200' prop="Caution" />
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList, deleted } from "@/api/runningDuty/record/shiftRecord";
import { fetchTeam } from "@/api/runningDuty/dutyConfiguration";

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
        keyword:"",
        TeamId: "",
        caution: "",
        recordcontent: "",
        starttime: "",
        endtime: "",
        ShiftId: ""
        // jieban:"",
        // jiaoban:""
      },
      teamList: []
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
    getTeam() {
      fetchTeam({ ifused: true }).then(r => {
        this.teamList = r.data;
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection;
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
<style lang="scss" scoped>
</style>
