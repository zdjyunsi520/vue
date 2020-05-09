<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按年度统计" name="0"></el-tab-pane>
        <el-tab-pane label="按巡视性质统计" name="1"></el-tab-pane>
        <el-tab-pane label="按完成情况统计" name="2"></el-tab-pane>
    </el-tabs>
    
    <el-form :inline="true"  size="mini" >
      <el-form-item label="巡视单位">
        <el-select v-model="searchForm.tenantId" placeholder="请选择" style="max-width:200px" >
          <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年度" v-show="activeName=='0'">
          <el-date-picker v-model="searchForm.patrolYear" type="year" placeholder="请选择年" value-format="timestamp"> </el-date-picker>
      </el-form-item>
      <el-form-item label="巡视日期" v-show="activeName!='0'">
            <el-date-picker v-model="searchForm.patroltimebegin" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd"  format="yyyy-MM-dd"> </el-date-picker>
            至
            <el-date-picker v-model="searchForm.patroltimeend" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd"  format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <el-form-item label="巡视性质"  v-show="activeName!='1'">
        <el-select v-model="searchForm.ptrolnature" placeholder="请选择" style="max-width:200px" >
          <el-option v-for="(item,index) in ptrolnatures" :key="index" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态"  v-show="activeName!='2'">
        <el-select v-model="searchForm.isexecute" placeholder="请选择" style="max-width:200px" >
          <el-option v-for="(item,index) in isexecutes" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableList">查询</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>
    <div class="chart-wrapper">
        <BarChart/>
    </div>
    <div class="tb-contain">
      <el-table v-loading="listLoading" :data="tableData" element-loading-text="Loading" border fit highlight-current-row >
        <el-table-column label="巡视人员"  align='center' prop="PatrolUserName"></el-table-column>
        <el-table-column v-for="item in months" :key="item" :prop="item"  :label="item" ></el-table-column>
      </el-table>
     
    </div>
    
  </div>
</template>

<script>

import { userReportByYear,userReportByNature,userReportByExecute } from "@/api/patrol";
import BarChart from "./components/BarChart";
import { getGetHierarchicalDtos} from "@/api/org";
export default {
components: {
    BarChart
  },
  data() {
    return {
      searchForm:{
        tenantId:"",
        patroltimebegin:"",
        patroltimeend:"",
        patrolYear:"",
        ptrolnature:"",
        isexecute:"",
      },
      TenantIds:[],
      activeName:'0',
      nowDoc:{},
      tableData: [],
      listLoading:true,
      ptrolnatures:[
          {name:'全部'},
          {name:'定期巡视'},
          {name:'临时巡视'}
      ],
      isexecutes:[
          {name:'全部',id:''},
          {name:'已执行',id:'1'},
          {name:'未执行',id:'0'}
      ],
      months:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
    }
  },

  created() {
    this.getTableList(this.activeName);
    this.getTenants();
  },
  methods: {
    handleClick(tab, event) {
        this.getTableList(this.activeName);
    },
    
    // 巡视单位列表
    getTenants(){
      getGetHierarchicalDtos().then(response => {
         this.TenantIds=response.data;
      }).catch(error => {
        console.log(error); 
      });
    },
    getTableList(activeName){
      const data={
        "type":1,
        "tenantId":this.searchForm.tenantId,
        "patroltimebegin":this.searchForm.patroltimebegin,
        "patroltimeend":this.searchForm.patroltimeend,
      };
      switch (activeName) {
        case '0':
          data.ptrolnature=this.searchForm.ptrolnature;
          data.isexecute=this.searchForm.isexecute;
          userReportByYear(data).then(response => {
            this.listLoading=false;
            this.tableData = response.data;
          }).catch(error => {
            console.log(error); 
          });
          break;
        case '1':
          data.isexecute=this.searchForm.isexecute;
          userReportByNature(data).then(response => {
            this.listLoading=false;
            this.tableData = response.data;
          }).catch(error => {
            console.log(error); 
          });
          break;
        case '2':
          data.ptrolnature=this.searchForm.ptrolnature;
          userReportByExecute(data).then(response => {
            this.listLoading=false;
            this.tableData = response.data;
          }).catch(error => {
            console.log(error); 
          });
          break;
        default:
          break;
      }
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {

      }).then(response => {
        })
        .catch(function() {});
    },
 
  }
}
</script>

<style lang="scss">
</style>