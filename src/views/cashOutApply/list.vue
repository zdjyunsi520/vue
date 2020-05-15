<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="postList" border>
      <!-- <el-table-column type="selection" width="55" align="center"  />  :formatter="" -->
      <el-table-column label="提现时间" width="160px" align="center" prop="withdrawTime" />
      <el-table-column label="提现金额" align="center" prop="withdrawAmount" />
      <el-table-column label="提现银行" width="160px" align="center" prop="bankName" />
      <el-table-column label="提现账户" width="200px" align="center" prop="bankNumber" />
      <el-table-column label="开户人" align="center" prop="bindBankName" />
      <el-table-column label="提现状态" width="120px" align="center" prop="state" :formatter="filterSimpleRecharge" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fetchList } from '@/api/cashOutApply';
export default {
  components: {},
  data() {
    return {
      // 遮罩层
      listLoading: false,
      deptList: null,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters({ simpleRechargeKV: 'status/simpleRechargeKV' })
  },
  watch: {},
  methods: {
    filterSimpleRecharge(row) {
      return this.simpleRechargeKV[row.state];
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
    }
  }
};
</script>
<style lang="scss" scoped>
// .xl-query {
//   /deep/.el-form-item {
//     margin-bottom: 0;
//   }
//   /deep/ .el-input__inner {
//     width: 130px;
//   }
//   /deep/.el-date-editor.el-input {
//     width: 200px;

//     .el-input__inner {
//       width: 200px;
//     }
//   }
// }
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