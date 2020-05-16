<template>
  <div  class="app-container">
      <div class="search-box marginbottom15">
        <el-form :inline="true" ref="queryForm" :model="queryParams">
        <el-form-item label="用电单位" prop="tenantId">
            <el-select v-model="queryParams.tenantId" placeholder="请选择" style="width:240px" >
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="缺陷编号" prop="bugNumber">
            <el-input v-model="queryParams.bugNumber" ></el-input>
        </el-form-item>
        <el-form-item label="发现日期" prop="reporttimestart">
            <el-date-picker v-model="queryParams.reporttimestart" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd"  format="yyyy-MM-dd"> </el-date-picker>
            至
            <el-date-picker v-model="queryParams.reporttimeend" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd"  format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item label="缺陷等级"  prop="rank">
            <el-select v-model="queryParams.rank" placeholder="请选择" style="max-width:240px" >
                <el-option v-for="(item,index) in ranks" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="assetsname">
            <el-input v-model="queryParams.assetsname" ></el-input>
        </el-form-item>
        <el-form-item label="消缺结果" prop="solve">
            <el-select v-model="queryParams.solve" placeholder="请选择" style="max-width:240px" >
                <el-option v-for="(item,index) in solves" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择" style="max-width:240px" >
                <el-option v-for="(item,index) in statuss" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
        </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-row class="table-btns">
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
            <el-button icon="el-icon-download"  :loading="downloadLoading"  @click="handleExport">导出</el-button>
      </el-row>
      <el-table v-loading="listLoading" :data="dataList" element-loading-text="Loading" border fit :height="dataList?tableHeight:'0'" highlight-current-row >
        <el-table-column label="缺陷编号" sortable min-width="250"  sortable align='center'  prop="bugNumber"></el-table-column>
        <el-table-column label="用电单位"sortable  min-width="250" align='center' prop="TenantName"></el-table-column>
        <el-table-column label="设备名称"  min-width="150" sortable align='center' prop="assetsname"></el-table-column>
        <el-table-column label="缺陷等级" sortable min-width="250" align='center' prop="rank"></el-table-column>
        <el-table-column label="缺陷现象" min-width="250" align='center' prop="PatrolMemberNames"></el-table-column>
        <el-table-column label="发现时间" min-width="250" align='center' prop="reporttimestart">
          <template slot-scope="scope">
            {{scope.row.StartTime.substring(0,10)}}
          </template>
        </el-table-column>
        <el-table-column label="发现人" min-width="120" sortable align='center' prop="CycleDay"> </el-table-column>
        <el-table-column label="消缺结果" sortable width="250" align='center' prop="PatrolMemberNames">
          <template slot-scope="scope">
            {{scope.row.StartTime.substring(0,10)}}
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column label="状态" sortable min-width="250" align='center' prop="Status"> 
          <template slot-scope="scope">
            {{formatterStatus(scope.row.Status)}}
          </template>

        </el-table-column>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <div> 
            <el-button type="text" icon="el-icon-edit-outline" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="text"  icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    
    </div>
  </div>
</template>

<script>
import { getAssetsBugs,deleted} from "@/api/biz";
import { getChildrenList} from "@/api/org";
export default {

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
      downloadLoading:false,
      TenantIds:[],
      nowDoc:{},
      dataList: null,
      listLoading:true,
      total: 0,
      tableHeight: "0",
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
    setTableHeight() {
      this.tableHeight = this.$refs.containerbox.offsetHeight - 120;
    },
    getList(){
        this.listLoading=true;
        getAssetsBugs(this.queryParams).then(res => {
          this.dataList = res.data;
          this.total = res.total;
        }).finally(v =>{
          this.listLoading=false;
        });
    },
    // 巡视单位列表
    getTenants(){
      getChildrenList().then(res => {
         this.TenantIds=res.data;
      }).catch(error => {
        console.log(error); 
      });
    },
    formatterStatus(status){
      if (status==0) {
        return '登记';
      }else if(row.status==1) {
        return '消缺';
      }else if(row.status==2) {
        return '验收';
      }else if(row.status==3) {
        return '完成';
      }else if(row.status=='') {
        return '全部';
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageno = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.reporttimeend='';
      this.handleQuery();
    },
  
    /** 新增按钮操作 */
    handleAdd() {
      const title = "新增缺陷工单"; 
      const ranks = this.ranks;;
      const TenantIds= this.TenantIds;
      this.$router.push({
        name: "/defect/orderList/components/add",
        params: { data: {}, title, TenantIds,ranks }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const title = "修改缺陷工单";
      const data = row;
      const TenantIds= this.TenantIds;
      const ranks = this.ranks;;
      // const id = row.Id;
      // const username = row.UserName;
      // const name = row.Name;
      // const mobilephone = row.MobilePhone;
      this.$router.push({
        name: "/defect/orderList/components/add",
        params: { data, title, TenantIds,ranks }
      });
    
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
        deleted({ id }).then(r => {
          this.$message.success('成功删除!');
          this.getList();
        }).finally(v =>{
            this.listLoading=false;
          });;
      });
    },

    
     // 导出
    handleExport() {
      this.$confirm("是否确认导出表格吗?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
         this.download();
      });
    },
    download() {
      this.downloadLoading = true;
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['缺陷编号','用电单位','设备名称','缺陷等级','缺陷现象','发现时间','发现人','消缺结果','状态'];
        const list = this.dataList;
        const data = this.formatJson(this.columns, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '缺陷工单',
          autoWidth: true,
          bookType:'xlsx'
        })
        this.downloadLoading = false
      })
    }, 
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'PatrolMemberNames') {
            return v[j].substring(0,10)
          }else if (j === 'Status') {
            return this.formatterStatus(v[j])
          } else {
            return v[j]
          }
        }))
      }))
    }
 
  }
}
</script>

<style lang="scss">
</style>