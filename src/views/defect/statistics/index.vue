<template>
<div class="app-container">
    <div class="search-box marginbottom15">
      <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="按年度统计" name="0"></el-tab-pane>
          <el-tab-pane label="按缺陷等级统计" name="1"></el-tab-pane>
          <el-tab-pane label="按消缺率统计" name="2"></el-tab-pane>
      </el-tabs>
      <el-form  :model="queryParams"  :rules="rules" ref="queryForm" :inline="true" class="xl-query" >
        <el-form-item label="用电单位" prop='tenantId'>
          <el-select v-model="queryParams.tenantId"   clearable placeholder="请选择" >
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年度" v-show="activeName=='0'" prop='patrolYear'>
            <el-date-picker v-model="queryParams.patrolYear" clearable type="year" placeholder="请选择年" value-format="yyyy" format="yyyy"> </el-date-picker>
        </el-form-item>
        <el-form-item label="年月" v-show="activeName!='0'" prop='patrolMonth'>
            <el-date-picker v-model="queryParams.patrolMonth" clearable type="month" placeholder="请选择年月" value-format="yyyy-MM" format="yyyy-MM"> </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="巡视日期" v-show="activeName!='0'" prop='patroltimebegin'>
              <el-date-picker v-model="queryParams.patroltimebegin" type="date" placeholder="请选择日期"  clearable style='width:47%' value-format="yyyy-MM-dd"  format="yyyy-MM-dd"> </el-date-picker>
              至
              <el-date-picker v-model="queryParams.patroltimeend" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd" clearable format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item> -->
        <el-form-item label="缺陷等级"  v-show="activeName=='0'" prop='rank'>
          <el-select v-model="queryParams.rank" clearable placeholder="请选择" >
            <el-option v-for="(item,index) in ranks" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态"  prop='status'>
          <el-select v-model="queryParams.status" clearable placeholder="请选择" >
            <el-option v-for="(item,index) in statuss" :key="index" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
        </el-form-item>
        <el-form-item>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-download"  :loading="downloadLoading"  @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox marginbottom15" ref="containerbox">
      <el-table v-loading="listLoading" element-loading-text="Loading" :data="dataList" ref='table' :height="dataList?tableHeight:'0'" @row-click='handleRowInfo' border style='margin-top:20px'>
        <el-table-column label="用电单位" fixed="left" v-if="activeName==1" min-width="120" align='center' prop="Name"></el-table-column>
        <el-table-column label="缺陷等级" fixed="left" v-else min-width="120" align='center' prop="rank"></el-table-column>
        <el-table-column v-for="(item,index) in columns" :key="props[index]" :prop="props[index]"  align='center' :label="item"></el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
    <div class="bg-white containerbox  chart-wrapper">
        <BarChart ref="chart" :chartData='chartData'/>
    </div>
    
  </div>
</template>

<script>

import { bugReportByYear,bugReportByRank,bugReportByRate } from "@/api/biz";
import BarChart from "./components/BarChart";
import { getChildrenList} from "@/api/org";
export default {
components: {
    BarChart
  },
  data() {
    return {
      // 查询参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        patrolYear:'',
        patrolMonth:'',
        rank:'',
        status:'',
      },
      downloadLoading:false,
      dataList:null,
      total: 0,
      rules: {},
      TenantIds:[],
      activeName:'0',
      nowDoc:{},
      tableHeight: "0",
      listLoading:true,

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
          {name:'登记',id:"1"},
          {name:'消缺',id:'2'},
          {name:'验收',id:'3'},
          {name:'完成',id:'4'}
      ],
      
      columns:[],
      columns1:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
      columns2:['一般缺陷','紧急缺陷','严重缺陷'],
      columns3:['一般缺陷','紧急缺陷','严重缺陷',"总计"],
      props:[],
      prop1:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec',],
      prop2:['TotalCount','TemporaryCount','RegularCount'],
      prop3:['TotalCount','ExecuteCount','UnexecuteCount'],
      chartData:{},
    }
  },

  created() {
    this.getList(this.activeName);
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
      this.tableHeight = this.$refs.containerbox.offsetHeight-40;
    },
    handleClick(tab, event) {
      this.resetQuery();
      this.getList(this.activeName);
    },
    
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList(this.activeName);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.patroltimeend='';
      this.handleQuery();
    },
    // 巡视单位列表
    getTenants(){
      getChildrenList().then(response => {
         this.TenantIds=response.data;
      }).catch(error => {
        console.log(error); 
      });
    },
    getList(activeName,row){
      const data={
        "tenantId":this.queryParams.tenantId,
      };
      let smtitle='';
      
      let fn='';
      switch (activeName) {
        case '0':
          data.rank=this.queryParams.rank;
          data.status=this.queryParams.status;
          data.patrolYear=this.queryParams.patrolYear;
          fn = bugReportByYear;
          this.columns = this.columns1.slice(0);
          this.props = this.prop1.slice(0);
          smtitle='-按年度统计';
          break;
        case '1':
          data.status=this.queryParams.status;
          data.patrolMonth=this.queryParams.patrolMonth;
          fn = bugReportByRank;
          this.columns = this.columns2.slice(0);
          this.props = this.prop2.slice(0);
          smtitle='-按缺陷等级统计';
          break;
        case '2':
          data.rank=this.queryParams.rank;
          data.patrolMonth=this.queryParams.patrolMonth;
          fn = bugReportByRate;
          this.columns = this.columns3.slice(0);
          this.props = this.prop3.slice(0);
          smtitle='-按消缺率统计';
          break;
        default:
          break;
      }
      console.log(fn,smtitle)
      fn(data).then(res => {
        this.dataList = res.data;
        this.total = res.total;
        let arr=[];
        if (!row) {
          arr = this.dataList[this.dataList.length-1];
        }else{
          arr=row;
        }
        this.chartData.listData = this.props.map(v=>arr[v]);
        this.chartData.xAxisData = this.columns;
        this.chartData.title = arr.Name+smtitle;
        
        this.$nextTick(()=>{
          this.$refs.chart.initChart();
          this.$refs.table.doLayout()
        })
      }).finally(r => {
          this.listLoading = false;
          this.setTableHeight();
        });;
    },
    // 点击行 
    handleRowInfo(row){
      this.getList(this.activeName,row);
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
        const tHeader = this.columns.slice(0);
        const list = this.dataList;
        const data = this.formatJson(this.columns, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.chartData.title,
          autoWidth: true,
          bookType:'xlsx'
        })
        this.downloadLoading = false
      })
    }, 
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          return v[j]
      }))
    }
 
  }
}
</script>

<style lang="scss">
</style>