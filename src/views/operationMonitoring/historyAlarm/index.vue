<template>
  <div class="app-container">
    <div class="search-box marginbottom15">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按日期" name="0"></el-tab-pane>
        <el-tab-pane label="按类型" name="1"></el-tab-pane>
        <el-tab-pane label="按设备" name="2"></el-tab-pane>
      </el-tabs>

      <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-query">
        <el-form-item label="用电单位：" prop="tenantId">
          <el-select v-model="queryParams.tenantId" clearable placeholder="请选择用电单位">
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="告警类型：" prop="WarningType" v-if="activeName=='1'">
          <el-select v-model="queryParams.WarningType" clearable placeholder="请选择告警类型">
            <el-option v-for="(item,index) in WarningTypes" :key="index" :label="item.type" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="告警设备：" prop="AssetsId" v-if="activeName=='2'">
          <el-input v-model="queryParams.assetsIdtext" placeholder="请选择设备" auto-complete="off" @focus="getAssets" clearable></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="StartDate">
          <el-date-picker v-model="queryParams.StartDate" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          至
          <el-date-picker v-model="queryParams.EndDate" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>

        <el-form-item label="是否复归：" prop="IsRecovery">
          <el-select v-model="queryParams.IsRecovery" clearable placeholder="请选择">
            <el-option v-for="(item,index) in IsRecoverys" :key="index" :label="item.type" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          <el-button icon="el-icon-download" :loading="downloadLoading" @click="handleExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-table v-loading="listLoading" :data="dataList" :height="tableHeight" border style='margin-top:20px'>
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column type="selection" fixed="left" width="55" />
        <el-table-column label="告警等级" width="130" sortable prop="Level" :formatter="levelformatter"></el-table-column>
        <el-table-column label="用电单位" min-width="250" sortable prop="TenantName"></el-table-column>
        <el-table-column label="配电房/屏柜" min-width="300" sortable prop="SwitchRoomName">
          <template slot-scope="scope">
            {{scope.row.SwitchRoomName}}/{{scope.row.CabinetName}}
          </template>
        </el-table-column>
        <el-table-column label="设备名称" width="150" sortable prop="AssetsName"></el-table-column>
        <el-table-column label="信号名" width="120" sortable prop="Signal"></el-table-column>
        <el-table-column label="告警描述" min-width="250" sortable prop="Description"></el-table-column>
        <el-table-column label="告警时间" width="180" sortable prop="CreateTime"></el-table-column>
        <el-table-column label="告警值" width="110" sortable prop="Value"></el-table-column>
        
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />

      <el-dialog title="设备选择" :visible.sync="dialogAssetsVisible" center width="500px">
        <el-tree :data="assetsTree" :props="defaultProps" :check-strictly='true' node-key="id" ref="tree" show-checkbox :highlight-current="true" :default-expand-all="true" @check-change='checkchange' :expand-on-click-node="false"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handlecheck">保 存</el-button>
          <el-button @click="dialogAssetsVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetchList } from "@/api/operationMonitoring/realtimeAlarm";
import { getTrees, getChildrenList } from "@/api/org";
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
      tableHeight: "calc(100% - 80px)",
      TenantIds: [],
      downloadLoading: false,
      dialogAssetsVisible: false,
      assetsTree: [],
      allassetsTree: [],
      activeName: "0",
      defaultProps: {
        children: "childs",
        label: "text"
      },
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        alarmType: "",
        AssetsId: "",
        StartDate: "",
        EndDate: "",
        IsRecovery: "",
        assetsIdtext: ""
      },
      WarningTypes: [
        {
          id: "",
          type: "全部"
        },
        {
          id: 1,
          type: "越上上限"
        },
        {
          id: 2,
          type: "越上限"
        },
        {
          id: 3,
          type: "越下限"
        },
        {
          id: 4,
          type: "越下下限"
        },
        {
          id: 5,
          type: "其他告警"
        },
        {
          id: 6,
          type: "过压"
        },
        {
          id: 7,
          type: "欠压"
        },
        {
          id: 8,
          type: "过流"
        },
        {
          id: 9,
          type: "失电"
        },
        {
          id: 10,
          type: "超温"
        },
        {
          id: 11,
          type: "分闸"
        },
        {
          id: 12,
          type: "故障态"
        },
        {
          id: 13,
          type: "工况异常"
        },
        {
          id: 14,
          type: "告警"
        },
        {
          id: 15,
          type: "火警"
        },
        {
          id: 16,
          type: "故障"
        },
        {
          id: 17,
          type: "启动"
        },
        {
          id: 18,
          type: "超温报警"
        },
        {
          id: 19,
          type: "烟雾报警"
        }
      ],
      IsRecoverys: [
        {
          id: "",
          type: "全部"
        },
        {
          id: true,
          type: "是"
        },
        {
          id: false,
          type: "否"
        }
      ]
    };
  },
  created() {
    this.getList();
    this.getTenants();
  },
  methods: {
    // 单位列表
    getTenants() {
      getChildrenList()
        .then(response => {
          this.TenantIds = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取设备列表
    getAssets() {
      this.dialogAssetsVisible = true;
      getTrees()
        .then(res => {
          this.allassetsTree = res.data;
          this.allassetsTree.forEach(v => {
            if (v.id == this.queryParams.tenantId) {
              this.assetsTree = v.childs;
              if (this.queryParams.AssetsId) {
                this.$refs.tree.setCheckedKeys([this.queryParams.AssetsId]);
              }
              return;
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    levelformatter(row) {
      var txt = "";
      if (row.Level == 1) {
        txt = "一般事件";
      } else if (row.Level == 2) {
        txt = "轻微告警";
      } else if (row.Level == 3) {
        txt = "普通告警";
      } else if (row.Level == 4) {
        txt = "严重";
      }
      return txt;
    },
    checkchange(data, checked) {
      if (checked) {
        const target = this.$refs.tree;
        target.setCheckedKeys([data.id]);
      }
    },
    //设备选择确定
    handlecheck() {
      var arr = this.$refs.tree.getCheckedNodes();
      if (arr.length) {
        this.queryParams.assetsIdtext = arr[0].text;
        this.queryParams.AssetsId = arr[0].id;
        this.dialogAssetsVisible = false;
      } else {
        this.$message.error("请选择一个设备");
      }
    },
    handleClick(tab, event) {
      this.resetQuery("queryForm");
      this.queryParams.EndDate = "";
      this.getList(this.activeName);
    },

    /** 搜索用户列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data;
          this.total = response.total;
        })
        .finally(r => {
          this.listLoading = false;
        });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageno = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.assetsIdtext = "";
      this.queryParams.EndDate = "";
      this.handleQuery();
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
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = this.columns.slice(0);
        if (this.activeName != "2") {
          tHeader.unshift("用电单位");
        } else {
          tHeader.unshift("缺陷等级");
        }
        const list = this.dataList.slice(0);
        const props = this.props.slice(0);
        props.unshift("Name");
        const data = this.formatJson(props, list);
        console.log(this.dataList, this.props);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.chartData.title,
          autoWidth: true,
          bookType: "xlsx"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    }
  }
};
</script>
<style lang="scss" scoped>
// /deep/.el-checkbox:last-of-type {
//   margin-right: 10px !important;
// }
</style>
