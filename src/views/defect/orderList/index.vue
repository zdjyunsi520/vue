<template>
  <div  class="app-container">
      <div class="search-box">
        <el-form :inline="true" ref="queryForm" :model="queryParams">
        <el-form-item label="用电单位" >
            <el-select v-model="queryParams.tenantname" placeholder="请选择" style="width:240px" >
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.text" :value="item.text"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="缺陷编号">
            <el-input v-model="queryParams.bugNumber" ></el-input>
        </el-form-item>
        <el-form-item label="发现日期">
            <el-date-picker v-model="queryParams.reporttimestart" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd"  format="yyyy-MM-dd"> </el-date-picker>
            至
            <el-date-picker v-model="queryParams.reporttimeend" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd"  format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item label="缺陷等级">
            <el-select v-model="queryParams.rank" placeholder="请选择" style="max-width:240px" >
                <el-option v-for="(item,index) in ranks" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备名称">
            <el-input v-model="queryParams.assetsname" ></el-input>
        </el-form-item>
        <el-form-item label="消缺结果">
            <el-select v-model="queryParams.solve" placeholder="请选择" style="max-width:240px" >
                <el-option v-for="(item,index) in solves" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择" style="max-width:240px" >
                <el-option v-for="(item,index) in statuss" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button type="primary" icon="el-icon-refresh" @click="resetQuery">重置</el-button>
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
        </el-form-item>
        </el-form>
    </div>
    <div class="tb-contain">
      <el-table v-loading="listLoading" :data="tableData" element-loading-text="Loading" border fit highlight-current-row >
        <el-table-column label="缺陷编号" min-width="250"  sortable align='center'  prop="TenantName"></el-table-column>
        <el-table-column label="用电单位" min-width="250" align='center' prop="TenantName"></el-table-column>
        <el-table-column label="设备名称"  min-width="150" sortable align='center' prop="PatrolUserName"></el-table-column>
        <el-table-column label="缺陷等级" width="250" align='center' prop="PatrolMemberNames"></el-table-column>
        <el-table-column label="缺陷现象" width="250" align='center' prop="PatrolMemberNames"></el-table-column>
        <el-table-column label="发现时间" width="250" align='center' prop="PatrolMemberNames">
          <template slot-scope="scope">
            {{scope.row.StartTime.substring(0,10)}}
          </template>
        </el-table-column>
        <el-table-column label="发现人" width="120" sortable align='center' prop="CycleDay"> </el-table-column>
        <el-table-column label="消缺结果" width="250" align='center' prop="PatrolMemberNames">
          <template slot-scope="scope">
            {{scope.row.StartTime.substring(0,10)}}
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column label="状态" width="250" align='center' prop="PatrolMemberNames">
          <template slot-scope="scope">
            {{scope.row.StartTime.substring(0,10)}}
          </template>
        </el-table-column>
        </el-table-column>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <div> 
                <el-button type="primary" plain size="mini" @click="handleUpdate(scope.row)" >编辑</el-button>
                <el-button type="success" plain size="mini" @click="toDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    
    </div>
    <p style="color:red">注： 1、设备下拉选择接口，</p>
    
    <!-- 新增 编辑 -->
    <add ref="add" @getList="getList"></add>
    <!-- <!-- <addEndEdit ref="addEndEdit"  @getList="getList"></addEndEdit> --> -->

  </div>
</template>

<script>
import { getAssetsBugs} from "@/api/biz";
import { getGetHierarchicalDtos} from "@/api/org";
import add from "./components/add";
export default {
components: {
     add,
  },
  data() {
    return {
      // 查询参数
      queryParams: {
        pageno: 1,
        pagesize: 10,
        tenantname:"",
        bugNumber:"",
        reporttimestart:"",
        reporttimeend:"",
        rank:"",
        assetsname:"",
        solve:"",
        status:"",
      },
      TenantIds:[],
      nowDoc:{},
      tableData: [],
      listLoading:true,
      total: 0,
      ranks:[
          {name:'一般缺陷',id:1},
          {name:'紧急缺陷',id:2},
          {name:'严重缺陷',id:3}
      ],
      solves:[
          {name:'全部',id:''},
          {name:'未消缺',id:"0"},
          {name:'已消缺',id:'1'}
      ],
      statuss:[
          {name:'全部',id:''},
          {name:'登记',id:"0"},
          {name:'消缺',id:'1'},
          {name:'验收',id:'2'},
          {name:'完成',id:'3'}
      ],
    }
  },

  created() {
    this.getList();
    this.getTenants();
  },
  methods: {
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
  
    /** 新增按钮操作 */
    handleAdd() {
      const target = this.$refs.add;
      target.handleOpen();
      target.title = "添加";
      target.ranks = this.ranks;
      target.TenantIds = this.TenantIds;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const target = this.$refs.update;
      const id = row.Id;
      const username = row.UserName;
      const name = row.Name;
      const mobilephone = row.MobilePhone;
      target.handleOpen({ id, username, name, mobilephone });
      target.title = "修改信息";
    },
    // toEdit(row){
    //     const target = this.$refs.addEndEdit;
    //     target.handleOpen(row);
    //     target.title = "修改巡视信息";
    // },
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
            this.getList();
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
    getList(){
        this.listLoading=true;
        getAssetsBugs(this.queryParams).then(response => {
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
      }).catch(error => {
        console.log(error); 
      });
    },
    
 
  }
}
</script>

<style lang="scss">
</style>