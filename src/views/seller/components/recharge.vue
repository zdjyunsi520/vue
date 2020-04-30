<template>
<el-row>
  <el-table :data="tableData" border >
    <el-table-column prop="rechargeNumber" label="充值编号" />
    <el-table-column prop="bankName" label="银行" />
    <el-table-column prop="bankAccountName" label="开户名" />
    <el-table-column prop="transferMoney" label="金额" />
    <el-table-column prop="rechargeTime" label="提交时间" />
    <el-table-column prop="auditState" label="状态" :formatter="filterSeller" />
    <el-table-column prop="note" label="备注" />
  </el-table>
  <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-row>
</template>

<script>
import {fetchRecharge as fetchInfo} from '@/api/seller'
import { mapState,mapGetters } from 'vuex';

export default {
  data() {
    return {
      tableData:null,
       queryParams:{
          pageNum:1,
          pageSize:10,
          merId:''
      },
      total:0
    };
  },

 computed:{
    ...mapState(['common']),
    ...mapGetters({sellerKV:'status/rechargeKV'})
  },

  methods: {

    filterSeller(row){
      return this.sellerKV[row.auditState]
    },
    getList() {
      this.queryParams.merId = this.common.merId
      fetchInfo(this.queryParams)
        .then(({ data }) => {
          this.tableData = data.list
          this.total = data.total
        })
    }
  }
};
</script>

<style lang="scss" scoped>
.el-row {
  font-size: 14px;
}
.xl-main-pic {
  img {
    width: 100%;
    height: 100%;
  }
}
.xl-mian-header-top {
  & > .el-col {
    background: #d8dde5;
    color: #040404;
    padding: 10px 20px;
  }
}
.xl-main-center {
  text-align: center;
}
.xl-mian-header {
  & > .el-col {
    margin-top: 60px;
    text-align: center;
  }
  .xl-main-first {
    margin-top: 0;
    text-align: left;
  }
}
.xl-main-link {
  overflow: hidden;
  height: 100%;
  white-space: nowrap;
  word-break: break-word;
}
.xl-main-text {
  .el-row {
    margin: 5% 10px;
  }
}
span {
  color: #0098e1;
}
.xl-task-row {
  padding-left: 20px;
  height: 50px;
  line-height: 50px;
}
.xl-img-row {
  margin: 20px;
}
</style>