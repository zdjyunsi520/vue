<template>
  <div class="app-container">
    <div class="search-box xl-querybox">
      <el-form :inline="true" ref="queryForm" :model="queryParams" :style="isOpen?'height:'+baseformHeight+'px;overflow: hidden;padding-right: 62px;':'padding-right: 62px;'" >
        <el-form-item label="工单编号：" prop="OrderCode">
          <el-input v-model="queryParams.OrderCode"></el-input>
        </el-form-item>
        <el-form-item label="用电单位：" prop="tenantId">
          <el-select v-model="queryParams.tenantId" placeholder="全部">
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务来源：" prop="RepairSource">
          <el-select v-model="queryParams.RepairSource" placeholder="全部">
            <el-option label="用户报修" :value="1"></el-option>
            <el-option label="故障告警" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="queryParams.status" placeholder="全部">
            <el-option label="受理" :value="1"></el-option>
            <el-option label="抢修" :value="2"></el-option>
            <el-option label="归档" :value="3"></el-option>
            <el-option label="完成" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="text" @click="handleHighSearch"  v-show='isOpenbtn' class="hightsearchbtn">高级筛选<i :class="isOpen?'el-icon-arrow-down':'el-icon-arrow-up'" /></el-button>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-row class="table-btns">
        <el-button type="primary"  @click="handleAdd">
          <svg-icon icon-class='ic_add' class="tablesvgicon"></svg-icon>新增
        </el-button>
      </el-row>
      <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" :data="dataList" border fit :height="tableHeight"  @row-dblclick="dbhandleUpdate" highlight-current-row>
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column label="工单编号" width="180" sortable prop="OrderCode"></el-table-column>
        <el-table-column label="用电单位" min-width="200" sortable prop="SourceTenantName"></el-table-column>
        <el-table-column label="业务来源" width="120" sortable prop="RepairSource" :formatter="formatterOrderResource">
        </el-table-column>
        <el-table-column label="紧急程度" width="120" sortable prop="EmergencyLevel" :formatter="formatterUrgency"></el-table-column>
        <el-table-column label="受理时间" width="180" prop="ReceiveTime" />
        <el-table-column label="状态" width="100" sortable prop="Status" :formatter="formatterStatus" />
        <el-table-column label="故障地址" min-width="220" prop="Address"></el-table-column>
        <el-table-column label="故障现象" min-width="250" prop="Situation">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom" effect="light" popper-class='tabpopover' v-if="scope.row.Situation&&scope.row.Situation.length>30">
              <p>{{ scope.row.Situation}}</p>
              <div slot="reference" class="name-wrapper">
                {{scope.row.Situation.substring(0,30)+'...'}}
              </div>
            </el-popover>
            <div v-else>{{scope.row.Situation }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="230">
          <template slot-scope="{row}">
            <div>
              <el-button type="primary" plain size="mini" @click="handleLook(row)">
                <svg-icon icon-class='ic_look' class="tablesvgicon"></svg-icon>查看
              </el-button>
              <el-button v-if="row.Status==2" type="primary" plain size="mini" @click="handleUpdate(row)">
                <svg-icon icon-class='ic_repair' class="tablesvgicon"></svg-icon>抢修
              </el-button>
              <el-button v-if="row.Status==3" type="primary" plain size="mini" @click="handleUpdate(row)">
                <svg-icon icon-class='ic_file' class="tablesvgicon"></svg-icon>归档
              </el-button>
              <el-button type="primary" plain v-if="row.Status==1" size="mini" @click="handleUpdate(row)">
                <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
              </el-button>
              <el-button type="primary" plain v-if="row.Status==1" size="mini" @click="handleDelete(row)">
                <svg-icon icon-class='ic_delete' class="tablesvgicon"></svg-icon>删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />

    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList, deleted } from "@/api/repairOrder";
import { getChildrenList } from "@/api/org";
export default {
  data() {
    return {
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        OrderCode: "",
        RepairSource: "",
        status: ""
      },
      downloadLoading: false,
      TenantIds: [],
      nowDoc: {},
      dataList: null,
      listLoading: true,
      total: 0,
      tableHeight: "calc(100% - 120px)",
      ranks: [
        { name: "一般", id: 1 },
        { name: "紧急", id: 2 },
        { name: "严重", id: 3 }
      ],
      solves: [
        { name: "全部", id: "" },
        { name: "未消缺", id: "0" },
        { name: "已消缺", id: "1" }
      ],
      status: [
        { name: "故障受理", id: 1 },
        { name: "故障抢修", id: 2 },
        { name: "故障归档", id: 3 },
        { name: "完成", id: 4 }
      ],
      isOpen: false,
      formHeight: "",
      baseformHeight: 46,
      isOpenbtn:false,
    };
  },

  created() {
    this.getList();
    this.getTenants();
  },
  computed: {
    ...mapGetters({
      repairOrderKV: "status/repairOrderKV",
      urgencyKV: "status/urgencyKV",
      orderResourceKV: "status/orderResourceKV"
    }),
    statusKV() {
      return this.status;
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
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(res => {
          this.dataList = res.data;
          this.total = res.total;
        })
        .finally(v => {
          this.listLoading = false;
        });
    },
    // 巡视单位列表
    getTenants() {
      getChildrenList().then(res => {
        this.TenantIds = res.data;
      });
    },
    formatterStatus(row) {
      return this.repairOrderKV[row.Status];
    },
    formatterOrderResource(row) {
      // return row.RepairSource==1?'用户报修':'故障告警';
      return this.orderResourceKV[row.RepairSource];
    },
    formatterUrgency(row) {
      return this.urgencyKV[row.EmergencyLevel];
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageno = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.reporttimeend = "";
      this.handleQuery();
    },

    /** 新增按钮操作 */
    handleAdd() {
      const title = "新增缺陷工单";
      const ranks = this.ranks;
      const TenantIds = this.TenantIds;
      this.$router.push({
        name: "/repairOrder/repair/components/add",
        params: { data: { RepairSource: 1 }, title, TenantIds, ranks }
      });
    },
    dbhandleUpdate(row) {
      if (row.Status == 1) {
        this.handleUpdate(row);
      }
    },

    /** 编辑按钮操作 */
    handleUpdate(row) {
      const title = "编辑缺陷工单";
      const data = row;
      const TenantIds = this.TenantIds;
      const ranks = this.ranks;

      let arr = ["add", "add", "repair", "backFile", "backFile"];
      // const id = row.Id;
      // const username = row.UserName;
      // const name = row.Name;
      // const mobilephone = row.MobilePhone;
      this.$router.push({
        name: "/repairOrder/repair/components/" + arr[row.Status],
        params: { data, title, TenantIds, ranks }
      });
    },
    /** 编辑按钮操作 */
    handleLook(row) {
      const title = "编辑缺陷工单";
      const data = row;
      const TenantIds = this.TenantIds;
      const ranks = this.ranks;
      const ReadOnly = true;
      let arr = ["add", "add", "add", "repair", "backFile", "backFile"];
      // const id = row.Id;
      // const username = row.UserName;
      // const name = row.Name;
      // const mobilephone = row.MobilePhone;
      this.$router.push({
        name: "/repairOrder/repair/components/" + arr[row.Status],
        params: { data, title, TenantIds, ranks, ReadOnly }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(v => {
        const id = row.Id;
        deleted({ id })
          .then(r => {
            this.$message.success("成功删除！");
            this.getList();
          })
          .finally(v => {
            this.listLoading = false;
          });
      });
    }

    // // 导出
    // handleExport() {
    //     this.$confirm("是否确认导出表格吗?", "警告", {
    //         confirmButtonText: "确定",
    //         cancelButtonText: "取消",
    //         type: "warning"
    //     }).then(() => {
    //         this.download();
    //     });
    // },
    // download() {
    //     this.downloadLoading = true;
    //     import("@/vendor/Export2Excel").then(excel => {
    //         const tHeader = [
    //             "缺陷编号",
    //             "用电单位",
    //             "设备名称",
    //             "缺陷等级",
    //             "缺陷现象",
    //             "发现时间",
    //             "发现人",
    //             "消缺结果",
    //             "状态"
    //         ];
    //         const list = this.dataList;
    //         const data = this.formatJson(this.columns, list);
    //         excel.export_json_to_excel({
    //             header: tHeader,
    //             data,
    //             filename: "缺陷工单",
    //             autoWidth: true,
    //             bookType: "xlsx"
    //         });
    //         this.downloadLoading = false;
    //     });
    // },
    // formatJson(filterVal, jsonData) {
    //     return jsonData.map(v =>
    //         filterVal.map(j => {
    //             return jsonData.map(v =>
    //                 filterVal.map(j => {
    //                     if (j === "PatrolMemberNames") {
    //                         return v[j].substring(0, 10);
    //                     } else if (j === "Status") {
    //                         return this.formatterStatus(v[j]);
    //                     } else {
    //                         return v[j];
    //                     }
    //                 })
    //             );
    //         })
    //     );
    // }
  }
};
</script>

<style lang="scss">
</style>