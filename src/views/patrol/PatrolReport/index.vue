<template>
  <div class="app-container">
    <el-form :inline="true"   >
      <el-form-item label="巡视单位">
        <el-select v-model="searchForm.tenantId" placeholder="请选择" style="max-width:200px" >
          <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="巡视人员">
        <el-input v-model="searchForm.patrolusername"  style="max-width:240px" ></el-input>
      </el-form-item>
      <el-form-item label="巡视日期">
            <el-date-picker v-model="searchForm.patroltimebegin" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd"  format="yyyy-MM-dd"> </el-date-picker>
            至
            <el-date-picker v-model="searchForm.patroltimeend" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd"  format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableList">查询</el-button>
        <el-button type="primary" @click="toReSet">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="tb-contain">
      <el-table v-loading="listLoading" :data="tableData" element-loading-text="Loading" border fit highlight-current-row >
        <el-table-column label="报告名称" min-width="220" sortable align='center' prop=""></el-table-column>
        <el-table-column label="巡视单位" min-width="250" sortable align='center' prop="TenantName"></el-table-column>
        <el-table-column label="巡视日期" width="150" sortable align='center' prop="PatrolTime">
          <template slot-scope="scope">
            {{scope.row.PatrolTime.substring(0,10)}}
          </template>
        </el-table-column>
        <el-table-column label="巡视人员"  min-width="140"sortable align='center' prop="PatrolUserName"></el-table-column>
        <el-table-column label="确认人" min-width="140" sortable align='center' prop="ConfirmUserName"></el-table-column>
        <el-table-column label="报告时间"  min-width="140" sortable align='center' prop=""></el-table-column>
        <el-table-column  label="操作" width="180" align="center">
          <template slot-scope="scope">
            <div> 
                <el-button type="primary" plain size="mini" @click="toShowReport(scope.row)" >查看报告</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"  :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" > </el-pagination>
    </div>
    
    <p style="color:red">注：<br/>
     1、表格字段补全<br/>
     2、查看报告<br/>
    </p>
  </div>
</template>

<script>
import { getPatrolJob } from "@/api/patrol";
import { getGetHierarchicalDtos} from "@/api/org";
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
        tenantId:"",
      },
      TenantIds:[],
      nowDoc:{},
      tableData: [],
      listLoading:true,
      currentPage: 1,
      pageSize:10,
      total: 0,
      
    }
  },

  created() {
    this.getTableList();
    this.getTenants();
  },
  methods: {
    // 巡视单位列表
    getTenants(){
      getGetHierarchicalDtos().then(response => {
         this.TenantIds=response.data;
         this.$refs.addEndEdit.TenantIds = response.data;
      }).catch(error => {
        console.log(error); 
      });
    },

    getTableList(){
        const data={
            'pageno':this.currentPage,
            'pagesize':this.pageSize,
            'tenantid':this.searchForm.tenantId,
            "patroltimebegin":this.searchForm.patroltimebegin,
            "patroltimeend":this.searchForm.patroltimeend,
            'patrolusername':this.searchForm.patrolusername,
        };
        getPatrolJob(data).then(response => {
          console.log(response)
          this.listLoading=false;
          this.tableData = response.data;
          this.total = response.total;
        }).catch(error => {
          console.log(error); 
        });
    },
    toReSet(){
      this.searchForm.patrolusername='';
      this.searchForm.patroltimeend='';
      this.searchForm.patroltimebegin='',
      this.searchForm.tenantId='',
      this.getTableList();
    },
    toShowReport(){
      window.open('https://www.baidu.com/','_blank')
    },

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