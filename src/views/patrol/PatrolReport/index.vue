<template>
  <div>
    <el-form :inline="true"  size="mini" style="padding:20px 20px 0">
      <el-form-item label="巡视单位">
        <el-select v-model="searchForm.tenantid" placeholder="请选择" style="max-width:200px" >
          <el-option v-for="(item,index) in tenantids" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="巡视人员">
        <el-input v-model="searchForm.patrolusername"  style="max-width:240px" ></el-input>
      </el-form-item>
      <el-form-item label="巡视日期">
            <el-date-picker v-model="infoForm.patroltimebegin" type="date" placeholder="请选择日期" style='width:47%' value-format="timestamp"  format="yyyy-MM-dd"> </el-date-picker>
            至
            <el-date-picker v-model="infoForm.patroltimeend" type="date" placeholder="请选择日期" style='width:47%' value-format="timestamp"  format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSearch">查询</el-button>
        <el-button type="primary" @click="toReSet">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="tb-contain">
      <el-table v-loading="listLoading" :data="tableData" element-loading-text="Loading" border fit highlight-current-row >
        <el-table-column label="报告名称" sortable prop=""></el-table-column>
        <el-table-column label="巡视单位" sortable prop="TenantName"></el-table-column>
        <el-table-column label="巡视日期" sortable align='center' prop="PatrolTime"></el-table-column>
        <el-table-column label="巡视人员" sortable align='center' prop="PatrolUserName"></el-table-column>
        <el-table-column label="确认人" sortable align='center' prop="ConfirmUserName"></el-table-column>
        <el-table-column label="报告时间" sortable align='center' prop=""></el-table-column>
        <el-table-column fixed="right" label="操作" width="220" align="center">
          <template slot-scope="scope">
            <div> 
                <el-button type="primary" plain size="mini" @click="toShowReport(scope.row)" >查看报告</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"  :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"  :hide-on-single-page="true"> </el-pagination>
    </div>
    
  </div>
</template>

<script>
// import tableInfo from "../../components/tableInfo.vue";
// import {getDepartment,getDocTableList,showDocDetail,getSignInfo} from "../../api/table";
export default {
components: {
    // tableInfo
  },
  data() {
    return {
      searchForm:{
        patrolusername:"",
        patroltimebegin:"",
        patroltimeend:"",
        tenantid:"",
      },
     
      nowDoc:{},
      tableData: [],
      listLoading:true,
      currentPage: 1,
      pageSize:10,
      total: 0,
      
    }
  },

  created() {
    //   this.getTableList();
    //   this.getDepts();
  },
  methods: {
   
    toShowReport(){},

    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableList();
    },
  }
}
</script>

<style lang="scss">
</style>