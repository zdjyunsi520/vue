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
      <el-form-item label="巡视性质">
        <el-select v-model="searchForm.ptrolnature" placeholder="请选择" style="max-width:200px" >
          <el-option v-for="(item,index) in ptrolnatures" :key="index" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.isexecute" placeholder="请选择" style="max-width:200px" >
          <el-option v-for="(item,index) in isexecutes" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSearch">查询</el-button>
        <el-button type="primary" @click="toReSet">重置</el-button>
        <el-button type="primary" @click="toAdd">新增临时任务单</el-button>
      </el-form-item>
    </el-form>
    <div class="tb-contain">
      <el-table v-loading="listLoading" :data="tableData" element-loading-text="Loading" border fit highlight-current-row >
        <el-table-column label="任务单编号" sortable prop="No"></el-table-column>
        <el-table-column label="巡视单位" sortable prop="TenantName"></el-table-column>
        <el-table-column label="巡视性质" sortable prop="PtrolNature">
          <template slot-scope="scope">
            <span>{{ scope.row.PtrolNature==1?"定期巡视":"临时巡视"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡视日期" sortable align='center' prop="PatrolTime"></el-table-column>
        <el-table-column label="巡视人员" sortable align='center' prop="PatrolUserName"></el-table-column>
        <el-table-column label="确认人" sortable align='center' prop="ConfirmUserName"></el-table-column>
        <el-table-column label="编制人" sortable align='center' prop="CreateUserName"></el-table-column>
        <el-table-column label="状态" sortable align='center' prop="isExecute">
          <template slot-scope="scope">
            <span>{{ scope.row.isExecute?"已执行":"未执行"}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220" align="center">
          <template slot-scope="scope">
            <div> 
                <el-button type="primary" plain size="mini" v-if="scope.row.isExecute" @click="toShowReport(scope.row)" >查看报告</el-button>
                <el-button type="primary" plain size="mini" v-if="scope.row.isExecute" @click="toBack(scope.row)" >回退</el-button>
                <el-button type="success" plain size="mini" v-else @click="toDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"  :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"  :hide-on-single-page="true"> </el-pagination>
    </div>
    
    <!-- 新增 编辑 -->
     <el-dialog :title="!isEdit?'新增巡视信息':'修改巡视信息'" :visible.sync="dialogVisible" width="550px" center top="2vh">
      <el-form :model="infoForm" ref="docForm" :rules="rules" label-width="140px" size="medium" style="padding-right:5%">
        <el-form-item label="巡视单位" prop="Tenantid">
            <el-select v-model="infoForm.Tenantid" placeholder="请选择巡视单位" style='width:100%' >
                <el-option v-for="(item,index) in Tenantids" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
         <el-form-item label="地址" prop="patroladdress">
            <el-input v-model="infoForm.patroladdress"  placeholder="请输入地址" ></el-input>
        </el-form-item>
         <el-form-item label="联系人" prop="contactusername">
            <el-input v-model="infoForm.contactusername"  placeholder="请输入联系人" ></el-input>
        </el-form-item>
         <el-form-item label="联系电话" prop="contactphone">
            <el-input v-model="infoForm.contactphone"  placeholder="请输入联系电话" ></el-input>
        </el-form-item>
         <el-form-item label="巡视日期" prop="patroltime">
            <el-date-picker v-model="infoForm.patroltime" type="date" placeholder="请选择日期" style='width:100%'  value-format="timestamp"  format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item> 
         <el-form-item label="巡视人员" prop="patroluserid">
            <el-input v-model="infoForm.patroluserid" ></el-input>
        </el-form-item>
         <el-form-item label="巡视人员联系电话" prop="patroluserphone">
            <el-input v-model="infoForm.patroluserphone" ></el-input>
        </el-form-item>
         <el-form-item label="巡视成员" prop="patrolmemberids">
            <el-input placeholder="请选择巡视成员" v-model="infoForm.patrolmemberids" ></el-input>
        </el-form-item>
         <el-form-item label="巡视内容" prop="patrolscope">
            <el-input type="textarea" :rows='4' placeholder="请输入巡视内容" v-model="infoForm.patrolscope" ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button type="primary" plain @click="dialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
     </el-dialog>

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
        ptrolnature:"",
        isexecute:"",
      },
      infoForm:{
          ptrolnature:2,
          Tenantid:'',
          patroladdress:'',
          contactusername:'',
          contactphone:'',
          patroltime:'',
          patroluserid:'',
          patroluserphone:'',
          patrolmemberids:'',
          patrolscope:'',
      },
      tenantids:[],
      isEdit:false,
      nowDoc:{},
      tableData: [],
      listLoading:true,
      currentPage: 1,
      pageSize:10,
      total: 0,
      dialogVisible:false,
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
      rules: {
          Tenantid: [
            { required: true, message: '请选择巡视单位', trigger: 'change' },
          ],
          patroluserid: [
            { required: true, message: '请请选择巡视人员', trigger: 'change' }
          ],
          patroltime: [
            { type: 'date', required: true, message: '请选择巡视日期', trigger: 'change' }
          ],
      }
    }
  },

  created() {
    //   this.getTableList();
    //   this.getDepts();
  },
  methods: {
    toAdd(){
        this.dialogVisible=true;
        this.isEdit=false;
    },
    toShowReport(){},
    toBack(){
        this.isEdit=true;
        this.dialogVisible=true;

    },
    toDelete(){
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    onSubmit(){
        
    },

    getTableList(){
      getTableData(this.currentPage-1,this.pageSize,2).then(response => {
        console.log(response)
        this.listLoading=false;
        this.tableData = response.data.rows;
        this.total = response.data.total;
      }).catch(error => {
        console.log(error); 
      });
    },
    getDepts(){
      getDepartment().then(response => {
        console.log(response)
         this.departmentIds=response.data;
      }).catch(error => {
        console.log(error); 
      });
    },
     // 查看公文
    showDoc(row){
      this.dialogShowVisible=true;
      showDocDetail(row.id).then(response => {
        console.log("查看",response)
        this.nowDoc = response.data;
      }).catch(error => {
        console.log(error); //请求失败返回的数据
      });
    },
    
    // 查询
    toSearch(){
      getDocTableList(this.currentPage,this.pageSize,2,this.searchForm.keyWord,this.searchForm.departmentId,this.searchForm.emergencyLevel,this.searchForm.startTime,this.searchForm.endTime).then(response => {
        console.log("查询",response)
        this.listLoading=false;
        this.tableData = response.data.rows;
        this.total = response.data.total;
      }).catch(error => {
        console.log(error); 
      });
    },
    toReSet(){
      this.searchForm.patrolusername='';
      this.searchForm.cycleday='',
      this.searchForm.tenantid='',
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