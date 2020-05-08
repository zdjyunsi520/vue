<template>
  <div>
    <el-form :inline="true"  size="mini" style="padding:20px 20px 0">
      <el-form-item label="巡视单位">
        <el-select v-model="searchForm.tenantId" placeholder="请选择" style="width:200px" >
          <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.text" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="巡视人员">
        <el-input v-model="searchForm.patrolusername"  style="width:150px" ></el-input>
      </el-form-item>
      <el-form-item label="巡视周期">
        <el-input v-model="searchForm.cycleday"  style="width:80px"></el-input>&nbsp;天
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableList">查询</el-button>
        <el-button type="primary" @click="toReSet">重置</el-button>
        <el-button type="primary" @click="toAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="tb-contain">
      <el-table v-loading="listLoading" :data="tableData" element-loading-text="Loading" border fit highlight-current-row >
        <el-table-column label="巡视单位" min-width="250"  sortable align='center'  prop="TenantName"></el-table-column>
        <el-table-column label="巡视内容" min-width="250" align='center' prop="PatrolScope"></el-table-column>
        <el-table-column label="巡视人员"  min-width="150" sortable align='center' prop="PatrolUserName"></el-table-column>
        <el-table-column label="巡视成员" width="250" align='center' prop="PatrolMemberNames"></el-table-column>
        <el-table-column label="巡视周期" width="120" sortable align='center' prop="CycleDay">
          <template slot-scope="scope">
            {{scope.row.CycleDay}}天
          </template>
        </el-table-column>
        <el-table-column label="开始时间" width="200"  sortable align='center' prop="StartTime">
          <template slot-scope="scope">
            {{scope.row.StartTime.substring(0,10)}}
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <div> 
                <el-button type="primary" plain size="mini" @click="toEdit(scope.row)" >编辑</el-button>
                <el-button type="success" plain size="mini" @click="toDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-page="currentPage"  :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" > </el-pagination>
    </div>
    <p style="color:red">注： 1、巡视人员接口，巡视单位接口 未知<br/>2、新增/修改保存，返回 ‘用电单位信息错误’</p>
    
    <!-- 新增 编辑 -->
    <addEndEdit ref="addEndEdit"  @getList="getTableList"></addEndEdit>

  </div>
</template>

<script>
import { getPatrolCycle,deletePatrolCycle} from "@/api/patrol";
import { getGetHierarchicalDtos} from "@/api/org";
import addEndEdit from "./components/addEndEdit";
export default {
components: {
    addEndEdit,
  },
  data() {
    return {
      searchForm:{
        patrolusername:"",
        cycleday:"",
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
    toAdd(){
        const target = this.$refs.addEndEdit;
        target.handleOpen();
        target.title = "新增巡视信息";
    },
    toEdit(row){
        const target = this.$refs.addEndEdit;
        target.handleOpen(row);
        target.title = "修改巡视信息";
    },
    toDelete(row){
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data={
            'id':row.Id,
          };
          deletePatrolCycle(data).then(response => {
            this.getTableList();
            this.$message({
              type: 'success',
              message: '成功删除!'
            });
          }).finally(v =>{
            this.listLoading=false;
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    getTableList(){
        const data={
            'pageno':this.currentPage,
            'pagesize':this.pageSize,
            'patrolusername':this.searchForm.patrolusername,
            'tenantid':this.searchForm.tenantId,
            'cycleday':this.searchForm.cycleday,
        };
        getPatrolCycle(data).then(response => {
          this.tableData = response.data;
          this.total = response.total;
        }).finally(v =>{
          this.listLoading=false;
        });
    },
    // 巡视单位列表
    getTenants(){
      getGetHierarchicalDtos().then(response => {
         this.TenantIds=response.data;
         this.$refs.addEndEdit.TenantIds = response.data;
      }).catch(error => {
        console.log(error); 
      });
    },
    
    toReSet(){
      this.searchForm.patrolusername='';
      this.searchForm.cycleday='',
      this.searchForm.tenantId='',
      this.getTableList();
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