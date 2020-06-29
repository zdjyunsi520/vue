<template>
  <div class="app-container">
    <div class="search-box ">
      <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-query" :style="isOpen?'height:'+baseformHeight+'px;overflow: hidden;padding-right: 62px;':'padding-right: 62px;'" >
        <el-form-item label="用电单位：" prop="tenantId">
          <el-select v-model="queryParams.tenantId" clearable placeholder="请选择用电单位">
            <el-option v-for="(item,index) in allassetsTree" :key="index" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="StartDate">
          <el-date-picker v-model="queryParams.StartDate" type="date" placeholder="请选择日期" style='width:46%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          &nbsp;至&nbsp;
          <el-date-picker v-model="queryParams.EndDate" type="date" placeholder="请选择日期" style='width:46%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item label="告警类型：" prop="WarningType">
          <el-select v-model="queryParams.WarningType" clearable placeholder="请选择告警类型">
            <el-option v-for="(item,index) in WarningTypes" :key="index" :label="item.type" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警设备：" prop="AssetsId" >
          <div style='width:200px;border-radius:4px;overflow:hidden'>
            <TreeSelect :getCheckedNodes="false" showText="text" :mutiple="false" :data="assetsTree" @change="handleConfirm" :checkedKeys="assetsTreeId" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>

        </el-form-item>
      </el-form>
      <el-button type="text" @click="handleHighSearch"  v-show='isOpenbtn' class="hightsearchbtn">高级筛选<i :class="isOpen?'el-icon-arrow-down':'el-icon-arrow-up'" /></el-button>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <div>
        <el-popover placement="bottom-end" :loading="downloadLoading" class="floatright " popper-class='downloadpop' width="50px" trigger="hover" content="导出">
          <el-button slot="reference" class="downloadbtn" @click="handleExport">
            <svg-icon icon-class='ic_export' class="tablesvgicon"></svg-icon>
          </el-button>
        </el-popover>
      </div>
      <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" :data="dataList" :height="tableHeight" border style='margin-top:20px'>
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <!-- <el-table-column type="selection" fixed="left" width="50" /> -->
        <el-table-column label="告警等级" width="130" prop="Level" >
          <template slot-scope="scope">
            <span v-if="scope.row.Level==1"><i class="dot color1"></i>一般事件</span>
            <span v-else-if="scope.row.Level==2"><i class="dot color2"></i>轻微告警</span>
            <span v-else-if="scope.row.Level==3"><i class="dot color3"></i>普通告警</span>
            <span v-else-if="scope.row.Level==4"><i class="dot color4"></i>严重</span>
          </template>

        </el-table-column>
        <el-table-column label="用电单位" min-width="250" prop="TenantName"></el-table-column>
        <el-table-column label="配电房/屏柜" min-width="300" prop="SwitchRoomName">
          <template slot-scope="scope">
            {{scope.row.SwitchRoomName}}/{{scope.row.CabinetName}}
          </template>
        </el-table-column>
        <el-table-column label="设备名称" width="150" prop="AssetsName"></el-table-column>
        <el-table-column label="信号名" width="120" prop="Signal"></el-table-column>
        <el-table-column label="告警描述" min-width="250" prop="Description"></el-table-column>
        <el-table-column label="告警时间" width="180" prop="CreateTime"></el-table-column>
        <el-table-column label="告警值" width="110" prop="Value">
          <template slot-scope="scope">
            <span :class='scope.row.Level==1?"color1":scope.row.Level==2?"color2":scope.row.Level==3?"color3":"color4"'>{{scope.row.Value}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />

      <el-dialog title="设备选择" :visible.sync="dialogAssetsVisible" center width="500px">
        <el-tree :data="assetsTree" :props="defaultProps" :check-strictly='true' node-key="id" ref="tree" show-checkbox :highlight-current="true" :default-expand-all="false" @check-change='checkchange' :expand-on-click-node="false"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handlecheck">
            <svg-icon icon-class='ic_save' class='tablesvgicon savesvgicon'></svg-icon>保 存
          </el-button>
          <el-button @click="dialogAssetsVisible = false">
            <svg-icon icon-class='ic_cancel' class='cancelsvgicon '></svg-icon>取 消
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetHistorychList } from "@/api/operationMonitoring/realtimeAlarm";
import { getTrees, getChildrenList } from "@/api/org";
import TreeSelect from "@/views/components/TreeSelect";
export default {
  components: { TreeSelect },
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
      tableHeight: "calc(100% - 110px)",
      TenantIds: [],
      downloadLoading: false,
      dialogAssetsVisible: false,
      allassetsTree: [],
      columns: [
        "告警等级",
        "用电单位",
        "配电房/屏柜",
        "设备名称",
        "信号名",
        "告警描述",
        "告警时间",
        "告警值"
      ],
      props: [
        "Level",
        "TenantName",
        "SwitchRoomName",
        "AssetsName",
        "Signal",
        "Description",
        "CreateTime",
        "Value"
      ],
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
      assetsTreeId: [],
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
      ],
      isOpen: false,
      formHeight: "",
      baseformHeight: 46,
      isOpenbtn:false,
    };
  },
  created() {
    this.getList();
    this.getAssets();
  },
  computed: {
    assetsTree() {
      const list = this.allassetsTree
        .filter(v => v.id == this.queryParams.tenantId)
        .map(v => v.childs);
      return list.length ? list[0] : [];
    }
  },
  mounted() {
        this.formHeight = this.$refs.queryForm.$el.clientHeight;
        this.isOpenbtn=this.formHeight > this.baseformHeight?true:false;
        window.onresize = () => {
            return (() => {
                this.formHeight = this.$refs.queryForm.$el.clientHeight;
                this.isOpenbtn=this.formHeight > this.baseformHeight?true:false;
            })()
        }
  },
  watch:{
      'formHeight': function(newVal){
          this.$nextTick(()=>{
            var newheight = this.$refs.queryForm.$el.clientHeight;
            this.isOpen=newheight > this.baseformHeight?true:false;
            this.isOpenbtn=newheight > this.baseformHeight?true:false
          })
      },
  },
  methods: {
     // 高级筛选
    handleHighSearch() {
      this.isOpen = !this.isOpen;
    },
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
    // getAssets() {
    //   this.dialogAssetsVisible = true;
    //   getTrees()
    //     .then(res => {
    //       this.allassetsTree = res.data;
    //       this.allassetsTree.forEach(v => {
    //         if (v.id == this.queryParams.tenantId) {
    //           this.assetsTree = v.childs;
    //           if (this.queryParams.AssetsId) {
    //             this.$refs.tree.setCheckedKeys([this.queryParams.AssetsId]);
    //           }
    //           return;
    //         }
    //       });
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    // 获取设备列表
    getAssets() {
      getTrees().then(res => {
        this.allassetsTree = res.data;
      });
    },
    handleConfirm(data) {
      this.assetsTreeId = data.map(v => v.id);
      this.queryParams.AssetsId = this.assetsTreeId.join(",");
    },
    // levelformatter(row) {
    //   var txt = "";
    //   if (row.Level == 1) {
    //     txt = '<span><i class=" dot" style="#666666"></i>一般事件</span> ';
    //   } else if (row.Level == 2) {
    //     txt = "轻微告警";
    //   } else if (row.Level == 3) {
    //     txt = "普通告警";
    //   } else if (row.Level == 4) {
    //     txt = "严重";
    //   }
    //   return txt;
    // },
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

    /** 搜索用户列表 */
    getList() {
      this.listLoading = true;
      fetHistorychList(this.queryParams)
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
      this.assetsTreeId = [];
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

        const list = this.dataList.concat();
        var txt = "";
        list.map(v => {
          if (v.Level == 1) {
            txt = "一般事件";
          } else if (v.Level == 2) {
            txt = "轻微告警";
          } else if (v.Level == 3) {
            txt = "普通告警";
          } else if (v.Level == 4) {
            txt = "严重";
          }
          v.Level = txt;
          return v.Level;
        });
        const props = this.props.slice(0);
        const data = this.formatJson(props, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "历史告警",
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
  .dot{
    &.color1{
      background-color:#666666;
    }
    &.color2{
      background-color:#FFC21C;
    }
    &.color3{
      background-color:#FF7F2D;
    }
    &.color4{
      background-color:#EB5223;
    }
  }
  span.color1{
    color:#666666;
  }
  span.color2{
    color:#FFC21C;
  }
  span.color3{
    color:#FF7F2D;
  }
  span.color4{
    color:#FFC21C;
  }
</style>
