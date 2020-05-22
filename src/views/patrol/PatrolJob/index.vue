<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :model="queryParams" :rules="rules" ref="queryForm" :inline="true" class="xl-query">
        <el-form-item label="巡视单位" prop="tenantId">
          <el-select v-model="queryParams.tenantId" placeholder="请选择巡视单位">
            <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡视人员" prop="patrolusername">
          <el-input v-model="queryParams.patrolusername" clearable></el-input>
        </el-form-item>
        <el-form-item label="巡视日期" prop="patroltimebegin">
          <el-date-picker v-model="queryParams.patroltimebegin" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
          至
          <el-date-picker v-model="queryParams.patroltimeend" type="date" placeholder="请选择日期" style='width:47%' value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item label="巡视性质" prop="ptrolnature">
          <el-select v-model="queryParams.ptrolnature" placeholder="请选择">
            <el-option v-for="(item,index) in ptrolnatures" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="isexecute">
          <el-select v-model="queryParams.isexecute" placeholder="请选择">
            <el-option v-for="(item,index) in isexecutes" :key="index" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-white containerbox" ref="containerbox">
      <el-row class="table-btns">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增临时任务单</el-button>
      </el-row>
      <el-table v-loading="listLoading" element-loading-text="Loading" :data="dataList" :height="dataList?tableHeight:'0'" border>
        <el-table-column label="任务单编号" min-width="220" align='center' sortable prop="No"></el-table-column>
        <el-table-column label="巡视单位" min-width="250" align='center' sortable prop="TenantName"></el-table-column>
        <el-table-column label="巡视性质" width="150" align='center' sortable prop="PtrolNatureText">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.PtrolNature==1?"定期巡视":"临时巡视"}}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="巡视日期" width="130" sortable align='center' prop="PatrolTime">
          <template slot-scope="scope">
            {{scope.row.PatrolTime.substring(0,10)}}
          </template>
        </el-table-column>
        <el-table-column label="巡视人员" min-width="140" sortable align='center' prop="PatrolUserName"></el-table-column>
        <el-table-column label="确认人" min-width="140" sortable align='center' prop="ConfirmUserName"></el-table-column>
        <el-table-column label="编制人" min-width="140" sortable align='center' prop="CreateUserName"></el-table-column>
        <el-table-column label="状态" width="140" sortable align='center' prop="IsExecute">
          <template slot-scope="scope">
            <span v-if="scope.row.IsExecute"><i class="red dot"></i>已执行</span>
            <span v-else><i class="green dot"></i>未执行</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="250" fixed="right">
          <template slot-scope="scope">
            <div v-if="scope.row.IsExecute">
              <el-button type="text" size="mini" icon="el-icon-document-remove" @click="handleReport(scope.row)">查看报告</el-button>
              <el-button type="text" size="mini" icon="el-icon-s-promotion" @click="handleBack(scope.row)">回退</el-button>
            </div>
            <div v-else>
              <el-button type="text" size="mini" @click="handleUpdate(scope.row)">
                <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
              </el-button>
              <el-button type="text" size="mini" @click="handleDelete(scope.row)">
                <svg-icon icon-class='ic_delete' class="tablesvgicon"></svg-icon>删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { fetchListJob, deletedJob, fallbackJob } from "@/api/patrol";
import { getChildrenList } from "@/api/org";

const ptrolnatures = [
  { name: "全部", id: "" },
  { name: "定期巡视", id: "1" },
  { name: "临时巡视", id: "2" }
];
const isexecutes = [
  { name: "全部", id: "" },
  { name: "已执行", type: true },
  { name: "未执行", type: false }
];
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
      TenantIds: [],

      ptrolnatures,
      isexecutes,
      // 查询参数
      queryParams: {
        pageno: 1,
        pagesize: 30,
        tenantId: "",
        patrolusername: "",
        patroltimeend: "",
        patroltimebegin: "",
        ptrolnature: "",
        isexecute: ""
      }
    };
  },
  computed: {},
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
    //获取关联的巡视人员下拉列表
    getPatrolusers() {
      this.allpatrolusers.forEach(v => {
        if (v.id == this.form.tenantid) {
          this.patrolusers = v.childs;
        }
      });
    },
    setTableHeight() {
      this.tableHeight = this.$refs.containerbox.offsetHeight - 120;
    },
    // 巡视单位列表
    getTenants() {
      getChildrenList()
        .then(response => {
          this.TenantIds = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /** 查询用户列表 */
    getList() {
      this.listLoading = true;
      fetchListJob(this.queryParams)
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
      this.queryParams.patroltimeend = "";
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
      const TenantIds = this.TenantIds;
      this.$router.push({
        name: "/patrol/PatrolJob/components/add",
        params: { data: {}, title, TenantIds }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const title = "修改巡视任务单";
      const data = { id: row.Id };

      const TenantIds = this.TenantIds;
      this.$router.push({
        name: "/patrol/PatrolJob/components/add",
        params: { data, title, TenantIds }
      });
    },
    // 回退
    handleBack(row) {
      const id = row.Id;
      fallbackJob({ id }).then(r => {
        this.$message.success("已回退!");
        this.getList();
      });
    },
    // 查看报告
    handleReport(row) {
      const id = row.Id;
      let routeData = this.$router.resolve({
        path: "/patrol/components/report",
        query: { jobid: id }
      });
      window.open(routeData.href, "_blank");
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(v => {
        const id = row.Id;
        deletedJob({ id }).then(r => {
          this.$message.success("成功删除!");
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
