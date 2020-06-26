<template>
  <div class="app-container">
    <div class="search-box xl-querybox">
      <el-form :inline="true" ref="queryForm" :model="queryParams">
        <el-form-item label="用电单位：" prop="tenantId">
          <el-select v-model="queryParams.tenantId" placeholder="请选择">
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词：" prop="name">
          <el-input v-model="queryParams.name" placeholder="缺陷编号/设备名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!-- <el-form-item label="缺陷编号：" prop="No">
          <el-input v-model="queryParams.No"></el-input>
        </el-form-item> -->
        <el-form-item label="发现日期：" prop="reporttimestart">
          <el-date-picker v-model="queryParams.reporttimestart" type="date" placeholder="请选择日期" style='width:46%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          &nbsp;至&nbsp;
          <el-date-picker v-model="queryParams.reporttimeend" type="date" placeholder="请选择日期" style='width:46%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item label="缺陷等级：" prop="rank">
          <el-select v-model="queryParams.rank" placeholder="请选择">
            <el-option v-for="(item,index) in ranks" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="设备名称：" prop="assetsname">
          <el-input v-model="queryParams.assetsname"></el-input>
        </el-form-item> -->
        <el-form-item label="消缺结果：" prop="IsProcessed">
          <el-select v-model="queryParams.IsProcessed" placeholder="请选择">
            <el-option v-for="(item,index) in IsProcesseds" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择">
            <el-option v-for="(item,index) in statuss" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-row class="table-btns">
        <el-button type="primary" @click="handleAdd">
          <svg-icon icon-class='ic_add' class="tablesvgicon"></svg-icon>新增
        </el-button>
        <el-popover placement="bottom-end" :loading="downloadLoading" @click="handleExport" class="floatright " style="margin:0;margin-top:5px" popper-class='downloadpop' width="50px" trigger="hover" content="导出">
          <el-button slot="reference" class="downloadbtn">
            <svg-icon icon-class='ic_export' class="tablesvgicon"></svg-icon>
          </el-button>
        </el-popover>

      </el-row>
      <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" element-loading-spinner="el-icon-loading" :data="dataList" @row-dblclick="dbhandleUpdate" border fit :height="tableHeight" highlight-current-row>
        <template slot="empty">
          <div class="nodata-box">
            <img src="../../../assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </template>
        <el-table-column label="缺陷编号" sortable width="180" prop="No"></el-table-column>
        <el-table-column label="用电单位" sortable min-width="230" prop="TenantName"></el-table-column>
        <el-table-column label="设备名称" min-width="150" sortable prop="AssetsNames"></el-table-column>
        <el-table-column label="缺陷等级" sortable width="120" prop="RankName"></el-table-column>
        <el-table-column label="缺陷现象" min-width="250" prop="Description">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom" effect="light" popper-class='tabpopover' v-if="scope.row.Description&&scope.row.Description.length>30">
              <p>{{ scope.row.Description}}</p>
              <div slot="reference" class="name-wrapper">
                {{scope.row.Description.substring(0,30)+'...'}}
              </div>
            </el-popover>
            <div v-else>{{scope.row.Description }}</div>
          </template>

        </el-table-column>
        <el-table-column label="发现时间" width="120" prop="DetectTime">
          <template slot-scope="scope">
            {{scope.row.DetectTime.substring(0,10)}}
          </template>
        </el-table-column>
        <el-table-column label="发现人" width="120" sortable prop="Detecter"> </el-table-column>
        <el-table-column label="消缺结果" sortable width="120" prop="IsProcessed">
          <template slot-scope="scope">
            <span v-if="scope.row.IsProcessed"><i class="green dot"></i>已消缺</span>
            <span v-else><i class="red dot"></i>未消缺</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" sortable width="90" prop="BugStatusName"></el-table-column>
        <el-table-column label="操作" fixed="right" width="250">
          <template slot-scope="scope">
            <div>
              <el-button type="primary" plain size="mini" @click="handleLook(scope.row)">
                <svg-icon icon-class='ic_look' class="tablesvgicon"></svg-icon>查看
              </el-button>
              <el-button type="primary" plain v-if='scope.row.Status==2' size="mini" @click="handleUpdate(scope.row)">
                <svg-icon icon-class='ic_solve' class="tablesvgicon"></svg-icon>消缺
              </el-button>
              <el-button type="primary" plain v-if='scope.row.Status==3' size="mini" @click="handleUpdate(scope.row)">
                <svg-icon icon-class='ic_check' class="tablesvgicon"></svg-icon>验收
              </el-button>
              <el-button type="primary" plain v-if='scope.row.Status==1' size="mini" @click="handleUpdate(scope.row)">
                <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
              </el-button>
              <el-button type="primary" plain v-if='scope.row.Status==1' size="mini" @click="handleDelete(scope.row)">
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
import { getAssetsBugs, deleted } from "@/api/biz";
import { getChildrenList } from "@/api/org";
export default {
  data() {
    return {
      // 搜索参数
      queryParams: {
        pageno: 1,
        pagesize: 10,
        tenantname: "",
        No: "",
        reporttimestart: "",
        reporttimeend: "",
        rank: "",
        assetsname: "",
        IsProcessed: "",
        status: ""
      },
      downloadLoading: false,
      TenantIds: [],
      nowDoc: {},
      dataList: null,
      listLoading: false,
      total: 0,
      tableHeight: "calc(100% - 120px)",
      ranks: [
        { name: "一般缺陷", id: 1 },
        { name: "紧急缺陷", id: 2 },
        { name: "严重缺陷", id: 3 }
      ],
      IsProcesseds: [
        { name: "全部", id: "" },
        { name: "未消缺", id: false },
        { name: "已消缺", id: true }
      ],
      statuss: [
        { name: "全部", id: "" },
        { name: "登记", id: "0" },
        { name: "消缺", id: "1" },
        { name: "验收", id: "2" },
        { name: "完成", id: "3" }
      ]
    };
  },

  created() {
    this.getList();
    this.getTenants();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getAssetsBugs(this.queryParams)
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
    // formatterStatus(status) {
    //   if (status == 0) {
    //     return "登记";
    //   } else if (status == 1) {
    //     return "消缺";
    //   } else if (status == 2) {
    //     return "验收";
    //   } else if (status == 3) {
    //     return "完成";
    //   } else if (status == "") {
    //     return "全部";
    //   }
    // },
    // formatterRank(rank) {
    //   if (rank == 1) {
    //     return "一般缺陷";
    //   } else if (rank == 2) {
    //     return "紧急缺陷";
    //   } else if (rank == 3) {
    //     return "严重缺陷";
    //   }
    // },

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
        name: "/defect/orderList/components/add",
        params: { data: {}, title, TenantIds, ranks }
      });
    },
    /** 编辑按钮操作 */
    handleLook(row) {
      const title = "编辑缺陷工单";
      const Id = row.Id;
      const ReadOnly = true;
      let arr = ["", "add", "add", "repair", "backFile", "backFile"];

      this.$router.push({
        name: "/defect/orderList/components/" + arr[row.Status],
        params: { Id, ReadOnly }
      });
    },
    dbhandleUpdate(row) {
      if (row.Status == 1) {
        this.handleUpdate(row);
      }
    },

    /** 编辑按钮操作 */
    handleUpdate(row) {
      const Id = row.Id;

      let arr = ["", "add", "repair", "backFile", "backFile"];
      this.$router.push({
        name: "/defect/orderList/components/" + arr[row.Status],
        params: { Id }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(v => {
        const Ids = row.Id;
        deleted({ Ids })
          .then(r => {
            this.$message.success("成功删除!");
            this.getList();
          })
          .finally(v => {
            this.listLoading = false;
          });
      });
    },

    // 导出
    handleExport() {
      return;
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
        const tHeader = [
          "缺陷编号",
          "用电单位",
          "设备名称",
          "缺陷等级",
          "缺陷现象",
          "发现时间",
          "发现人",
          "消缺结果",
          "状态"
        ];
        const list = this.dataList;
        const data = this.formatJson(this.columns, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "缺陷工单",
          autoWidth: true,
          bookType: "xlsx"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return jsonData.map(v =>
            filterVal.map(j => {
              if (j === "PatrolMemberNames") {
                return v[j].substring(0, 10);
                // } else if (j === "Status") {
                //   return this.formatterStatus(v[j]);
              } else {
                return v[j];
              }
            })
          );
        })
      );
    }
  }
};
</script>

<style lang="scss">
</style>