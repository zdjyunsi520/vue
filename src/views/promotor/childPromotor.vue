<template>
  <div class="app-container">

    <el-form ref="queryForm" :inline="true" label-width="120px" class="xl-query">
           <el-form-item>
        <el-input placeholder="推广员ID" v-model="queryParams.exId" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-input placeholder="推广员账号" v-model="queryParams.exAccount" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询邀请的推广员</el-button>
        <!-- <el-button v-hasPermi="['management:Extension:excel']" :loading="loading" type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button> -->
      </el-form-item>
    </el-form>
    <el-table border v-loading="listLoading" :data="postList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
     <el-table-column label="推广员ID" align="center" prop="id" />
      <el-table-column label="所属站点" align="center" prop="deptName" />
      <el-table-column label="推广员级别" align="center" prop="lev" />
      <!-- <el-table-column label="上级推广员" align="center" prop="upExId" /> -->
      <el-table-column label="用户名" align="center"  prop="exAccountName" />
      <el-table-column label="手机号码" align="center"  prop="exAccount" />
      <el-table-column label="QQ" align="center" prop="qq" />
      <!-- <el-table-column label="账户余额" align="center" prop="eextensionAccount.exAccountBalance" />
      <el-table-column label="累计赚取" align="center" prop="eextensionAccount.totalEarn" /> -->
      <el-table-column label="二级分销" align="center" prop="isSecond" />
      <el-table-column label="订单分成比例" align="center" prop="orderProportion" />
      <!-- <el-table-column label="直属商家放单量" align="center" prop="eextensionAccount.directlyMerOrderTotal" />
      <el-table-column label="直属商家已完结单量" align="center" prop="eextensionAccount.directlyMerOrderFinish" />
      <el-table-column label="下属商家放单量" align="center" prop="eextensionAccount.indirectMerOrderTotal" />
      <el-table-column label="下属商家已完结单量" align="center" prop="eextensionAccount.indirectMerOrderFinish" /> -->
      <el-table-column label="状态" align="center" prop="state" :formatter="filterDisable" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fetchList } from '@/api/promotor/childPromotor';



export default {
    name:'查询邀请推广员',
  data() {
    return {
      // 遮罩层
      loading: false,
      listLoading: false,

      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
           exId: '',
        exAccount: '',
      }
    };
  },
  computed: {
    ...mapGetters({
      deptType: 'status/deptType',
      disableType: 'status/disableType'
    }),
    disableKV() {
      return this.disableType.reduce((l, v) => {
        l[v.key] = v.value;
        return l;
      }, {});
    }
  },
  created() {

  },
  methods: {
    filterDisable(row) {
      return this.disableKV[row.state];
    },



    /** 查询岗位列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.postList = response.data.list;
          this.total = response.data.total;
        })
        .finally(e => {
          this.listLoading = false;
        });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        exportExcel(this.queryParams)
          .then(r => {
            this.download(r.data.data);
            this.$message.success(r.data.msg);
          })
          .finally(e => {
            this.loading = false;
          });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.xl-query {
  /deep/.el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-input__inner {
    width: 130px;
  }
  /deep/.el-date-editor.el-input {
    width: 200px;

    .el-input__inner {
      width: 200px;
    }
  }
}
/deep/.cell {
  text-align: center;
  .el-row {
    margin-bottom: 2px;
  }
  .el-input__inner {
    width: 88px;
  }
}
/deep/.el-table th.gutter {
  display: table-cell !important;
}
/deep/.el-select-dropdown__list {
  width: 180px;
}
</style>