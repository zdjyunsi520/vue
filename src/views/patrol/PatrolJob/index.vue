<template>
  <div class="app-container">
    <el-form :inline="true"  size="mini" >
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
      <el-form-item label="巡视性质">
        <el-select v-model="searchForm.ptrolnature" placeholder="请选择" style="max-width:200px" >
          <el-option v-for="(item,index) in ptrolnatures" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.isexecute" placeholder="请选择" style="max-width:200px" >
          <el-option v-for="(item,index) in isexecutes" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableList">查询</el-button>
        <el-button type="primary" @click="toReSet">重置</el-button>
        <el-button type="primary" @click="toAdd">新增临时任务单</el-button>
      </el-form-item>
    </el-form>
    <div class="tb-contain">
      <el-table v-loading="listLoading" :data="tableData" element-loading-text="Loading" border fit highlight-current-row >
        <el-table-column label="任务单编号" min-width="220" align='center' sortable prop="No"></el-table-column>
        <el-table-column label="巡视单位" min-width="250" align='center' sortable prop="TenantName"></el-table-column>
        <el-table-column label="巡视性质" width="150"  align='center'  sortable prop="PtrolNature">
          <template slot-scope="scope">
            <span>{{ scope.row.PtrolNature==1?"定期巡视":"临时巡视"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡视日期" width="130"  sortable align='center' prop="PatrolTime">
          <template slot-scope="scope">
            {{scope.row.PatrolTime.substring(0,10)}}
          </template>
        </el-table-column>
        <el-table-column label="巡视人员"  min-width="140"  sortable align='center' prop="PatrolUserName"></el-table-column>
        <el-table-column label="确认人"  min-width="140" sortable align='center' prop="ConfirmUserName"></el-table-column>
        <el-table-column label="编制人"  min-width="140" sortable align='center' prop="CreateUserName"></el-table-column>
        <el-table-column label="状态"  width="140" sortable align='center' prop="IsExecute">
          <template slot-scope="scope">
            <span>{{ scope.row.IsExecute?"已执行":"未执行"}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="220" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.IsExecute"> 
                <el-button type="primary" plain size="mini"  @click="toShowReport(scope.row)" >查看报告</el-button>
                <el-button type="primary" plain size="mini" @click="toBack(scope.row)" >回退</el-button>
            </div>
            <div v-else> 
                <el-button type="primary" plain size="mini" @click="toEdit(scope.row)" >编辑</el-button>
                <el-button type="success" plain size="mini"  @click="toDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"  :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" > </el-pagination>
    </div>
    
    <!-- 新增 编辑 -->
    <addEndEdit ref="addEndEdit"  @getList="getTableList"></addEndEdit>

    <p style="color:red">注：<br/>
     1、条件查询：状态选择无效（接口参数缺失）<br/>
     2、提交修改时间，返回列表结果没变<br/>
     3、编制人？字段<br/>
     4、回退和查询报告的接口<br/>
    </p>
  </div>
</template>

<script>
import { getPatrolJob,deletePatrolJob} from "@/api/patrol";
import { getGetHierarchicalDtos} from "@/api/org";
import addEndEdit from "./components/addEndEdit";
import { mapGetters } from 'vuex'

export default {
components: {
    addEndEdit,
  },
  data() {
    return {
      searchForm:{
        tenantId:"",
        patroltimebegin:"",
        patroltimeend:"",
        ptrolnature:"",
        patrolusername:"",
        isexecute:"",
      },
      TenantIds:[],
      nowDoc:{},
      tableData: [],
      listLoading:true,
      currentPage: 1,
      pageSize:10,
      total: 0,
      dialogVisible:false,
      ptrolnatures:[
          {name:'全部',id:''},
          {name:'定期巡视',id:'1'},
          {name:'临时巡视',id:'2'}
      ],
      isexecutes:[
          {name:'全部',id:''},
          {name:'已执行',id:'1'},
          {name:'未执行',id:'0'}
      ],
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
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

    toAdd(){
        const target = this.$refs.addEndEdit;
        target.handleOpen();
        target.title = "新增临时任务单";
    },
    toEdit(row){
        const target = this.$refs.addEndEdit;
        target.handleOpen(row);
        target.title = "修改任务单";
    },
    toShowReport(row){
      window.open('https://www.baidu.com/','_blank')
    },
    toBack(){
        this.isEdit=true;
        this.dialogVisible=true;

    },
    toDelete(row){
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data={'id':row.Id};
          deletePatrolJob(data).then(response => {
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
            'tenantid':this.searchForm.tenantId,
            "patroltimebegin":this.searchForm.patroltimebegin,
            "patroltimeend":this.searchForm.patroltimeend,
            "ptrolnature":this.searchForm.ptrolnature,
            'patrolusername':this.searchForm.patrolusername,
            'isexecute':this.searchForm.isexecute,
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
      this.searchForm.ptrolnature='';
      this.searchForm.patrolusername='',
      this.searchForm.patroltimeend='';
      this.searchForm.patroltimebegin='',
      this.searchForm.tenantId='',
      this.searchForm.isexecute='',
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