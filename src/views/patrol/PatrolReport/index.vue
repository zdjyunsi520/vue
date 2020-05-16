<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-query" >
        <el-form-item label="巡视单位" prop="tenantId">
            <el-select v-model="queryParams.tenantId" placeholder="请选择巡视单位"  >
              <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="巡视人员" prop="patrolusername">
          <el-input v-model="queryParams.patrolusername" clearable></el-input>
        </el-form-item>
        <el-form-item label="巡视日期">
            <el-date-picker v-model="queryParams.patroltimebegin" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd"  format="yyyy-MM-dd"> </el-date-picker>
            至
            <el-date-picker v-model="queryParams.patroltimeend" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd"  format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-table v-loading="listLoading" :data="dataList" :height="dataList?tableHeight:'0'" border style='margin-top:20px'>
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
        <el-table-column label="操作" min-width="200" fixed="right" align="center">
          <template slot-scope="scope">
             <div> 
                <el-button type="primary" plain size="mini" @click="toShowReport(scope.row)" >查看报告</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { fetchReport,deletedJob} from "@/api/patrol";
import { getChildrenList} from "@/api/org";

export default {
  name: "",
  data() {
    return {
      deptType: null,
      // 遮罩层
      listLoading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      rules: {},
      tableHeight: "0",
      TenantIds:[],

      ptrolnatures,
      isexecutes,
      // 查询参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        patrolusername:'',
        patroltimeend:'',
        patroltimebegin:'',
        ptrolnature:'',
        isexecute:'',
      }
    }
  },
  computed: {
   
  },
  created() {
    this.getList();
    this.getTenants();
    
  },
  mounted() {
    let _this = this;
    window.onresize = function() {
      _this.setTableHeight();
    };
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    // 巡视单位列表
    getTenants(){
      getChildrenList().then(response => {
         this.TenantIds=response.data;
      }).catch(error => {
        console.log(error); 
      });
    },
    setTableHeight() {
      this.tableHeight = this.$refs.containerbox.offsetHeight - 80;
    },
    /** 查询用户列表 */
    getList() {
      this.listLoading = true;
      fetchReport(this.queryParams)
        .then(response => {
          this.dataList = response.data;
          this.total = response.total;
        })
        .finally(r => {
          this.listLoading = false;
          this.setTableHeight();
        });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
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
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      const title = "新增巡视任务单";
      const TenantIds= this.TenantIds;
      this.$router.push({
        name: "/patrol/PatrolJob/components/add",
        params: { data: {}, title, TenantIds }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const title = "修改巡视任务单";
      const data = row;
      const TenantIds= this.TenantIds;
      this.$router.push({
        name: "/patrol/PatrolJob/components/add",
        params: { data, title, TenantIds }
      });
    },
    // 回退
    handleBack(row){

    },
    // 查看报告
    handleReport(row){
      window.open('https://www.baidu.com/','_blank')
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      console.log(row)
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(v => {
        const id = row.Id;
        deletedJob({ id }).then(r => {
          this.$message.success('成功删除!');
          this.getList();
        });
      });
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
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
<style lang="scss">
</style>
