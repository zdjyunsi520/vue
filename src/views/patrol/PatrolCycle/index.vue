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
      <el-form-item label="巡视周期">
        <el-input v-model="searchForm.cycleday"  style="max-width:240px" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSearch">查询</el-button>
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
        <el-table-column label="巡视周期" width="100" sortable align='center' prop="CycleDay">
          <template slot-scope="scope">
            {{scope.row.CycleDay}}天
          </template>
        </el-table-column>
        <el-table-column label="开始时间" width="200"  sortable align='center' prop="StartTime"></el-table-column>
        <el-table-column fixed="right" label="操作" width="220" align="center">
          <template slot-scope="scope">
            <div> 
                <el-button type="primary" plain size="mini" @click="toEdit(scope.row)" >编辑</el-button>
                <el-button type="success" plain size="mini" @click="toDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"  :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"  :hide-on-single-page="true"> </el-pagination>
    </div>
    
    <!-- 新增 编辑 -->
     <el-dialog :title="!isEdit?'新增巡视信息':'修改巡视信息'" :visible.sync="dialogVisible" width="500px" center top="10vh">
      <el-form :model="infoForm" ref="docForm" :rules="rules" label-width="110px" size="medium" style="padding-right:5%">
        <el-form-item label="巡视单位" prop="Tenantid">
            <el-select v-model="infoForm.Tenantid" placeholder="请选择巡视单位" style='width:100%' >
                <el-option v-for="(item,index) in Tenantids" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
         <el-form-item label="巡视周期(天)" prop="Cycleday">
            <el-input v-model="infoForm.Cycleday"  placeholder="请输入天数" ></el-input>
        </el-form-item>
         <el-form-item label="开始时间" prop="StartTime">
            <el-date-picker v-model="infoForm.StartTime" type="date" placeholder="请选择日期" style='width:100%'  value-format="timestamp"  format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item> 
         <el-form-item label="巡视人员" prop="patroluserid">
            <el-input v-model="infoForm.patroluserid" ></el-input>
        </el-form-item>
         <el-form-item label="巡视成员" prop="PatrolMemberName">
            <el-input placeholder="请选择巡视成员" v-model="infoForm.PatrolMemberName" ></el-input>
        </el-form-item>
         <el-form-item label="巡视内容" prop="PatrolScope">
            <el-input type="textarea" :rows='4' placeholder="请输入巡视内容" v-model="infoForm.PatrolScope" ></el-input>
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
import {getTableData} from "@/api/patrol";
// import {getDepartment,getDocTableList,showDocDetail,getSignInfo} from "../../api/table";
export default {
components: {
    // tableInfo
  },
  data() {
    return {
      searchForm:{
        patrolusername:"",
        cycleday:"",
        tenantid:"",
      },
      infoForm:{
          Tenantid:'',
          Cycleday:'',
          StartTime:'',
          patroluserid:'',
          PatrolMemberName:'',
          PatrolScope:'',
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
      rules: {
          Tenantid: [
            { required: true, message: '请选择巡视单位', trigger: 'change' },
          ],
          Cycleday: [
            { required: true, message: '请输入天数', trigger: 'blur' }
          ],
          StartTime: [
            { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
          ],
          PatrolUserName: [
            { required: true, message: '请选择巡视人员', trigger: 'change' }
          ],
      }
    }
  },

  created() {
    this.getTableList();
    //   this.getDepts();
  },
  methods: {
    toAdd(){
        this.dialogVisible=true;
        this.isEdit=false;
    },
    toEdit(){
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
      const data={
          pageno:this.currentPage,
          pagesize:this.pageSize
      };
    getTableData(data).then(response => {
        this.tableData = response.data;
        this.total = response.total;
    }).finally(v =>{
        this.listLoading=false;
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