<template>
  <div class="app-container">
    <el-form ref="queryForm" :inline="true" label-width="120px" class="xl-query">
      <el-form-item>
        <el-input placeholder="买手ID" v-model="queryParams.id" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!-- <el-button :loading="loading" icon="el-icon-search" size="mini" @click="handleQuery">导出</el-button> -->
      </el-form-item>
    </el-form>
    <el-table border v-loading="listLoading" :data="postList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="买手ID" align="center" prop="id" />
      <el-table-column label="手机号码" align="center" prop="buyerAccount" />
      <el-table-column label="旺旺ID" align="center" prop="bindAccountName" />
      <el-table-column label="买手账号类型" align="center" prop="bindAccountType" :formatter="filterPlatform" />
      <el-table-column label="推广员ID" align="center" prop="promoterId" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { dateFortmat } from '@/utils';
import { lowList as fetchList } from '@/api/buyer/info';

export default {
  components: {},
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
        auditState: '',
        id: '',
        phone: '',
        realName: ''
      }
    };
  },
  created() {},
  filters: {},
  watch: {},
  computed: {
    ...mapGetters({ platformType: 'status/platformType' }),
    platformKV() {
      return this.platformType.reduce((l, v) => {
        l[v.key] = v.value;
        return l;
      }, {});
    }
  },

  methods: {
    filterPlatform(row) {
      return this.platformKV[row.bindAccountType];
    },
    handleOpen(refName, index, sts) {
      var target = this.$refs[refName];
      const f = this.postList[index];
      if (sts == undefined) {
        target.form.id = f.id;
        target.buyerAccount = f.buyerAccount;
        target.getInfo();
      } else {
        target.form.id = f.id;
        target.form.note = '';
        target.form.state = '';
        target.storeName = f.buyerAccount;
        target.actionType = sts;
        if (!sts) {
          target.form.state = 1;
        }
      }
      target.dialogVisible = true;
    },
    handleDelete(index) {
      this.loading = true;
      var data = this.postList[index];
      var postData = { id: data.id };
      this.$confirm(
        '确定要进行 ' + data.bbuyerAudit.realName + ' 删除 操作吗？'
      )
        .then(() => del(postData))
        .then(r => {
          this.getList();
          this.$message.success(r.msg);
        })
        .finally(() => (this.loading = false));
    },
    handlePass(index) {
      this.loading = true;
      var data = this.postList[index];
      var postData = { id: data.id };
      this.$confirm(
        '确定要进行 ' + data.bbuyerAudit.realName + ' 审核通过 操作吗？'
      )
        .then(() => reivew(postData))
        .then(r => {
          this.getList();
          this.$message.success(r.msg);
        })
        .catch(() => (this.loading = false))
        .finally(() => (this.loading = false));
    },
    handleEnable(index) {
      this.loading = true;
      var data = this.postList[index];
      var postData = { id: data.id, note: '', state: 0 };
      this.$confirm(
        '确定要进行 ' + data.bbuyerAudit.realName + ' 启用 操作吗？'
      )
        .then(() => disabled(postData))
        .then(r => {
          this.getList();
          this.$message.success(r.msg);
        })
        .catch(() => (this.loading = false))
        .finally(() => (this.loading = false));
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
      this.$confirm('是否确认导出?', '警告', {
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