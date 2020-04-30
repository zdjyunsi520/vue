<template>
<el-row>
  <el-table :data="tableData" border >
    <el-table-column prop="taskTypeName" label="任务类型" />
<el-table-column prop="taskNo" label="任务编号" />
<el-table-column prop="orderNo" label="订单编号" />
<el-table-column prop="merId" label="商家ID" />
<el-table-column prop="buyerId" label="买手账号" />
<el-table-column prop="receiptTime" label="接单时间" />
<el-table-column prop="advanceDeposit" label="垫付资金" />
<el-table-column prop="buyerActualPayment" label="用户付款" />
<el-table-column prop="rebateAmount" label="商品返款" />
<el-table-column prop="mallOrderNo" label="第三方单号" />
<el-table-column prop="taskGoodsInfoList[0].goodsName" label="商品名称" >
    <template slot-scope="{row}">
       <span class="xl-no-wrap">{{row.taskGoodsInfoList[0].goodsName}}</span>
    </template>
</el-table-column>
<el-table-column prop="keyword" label="关键字" />
        <el-table-column prop="orderStatus" label="状态" :formatter="filterSeller" />
  </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
  </el-row>
</template>

<script>
import {fetchPending as fetchInfo} from '@/api/seller'
import { mapState,mapGetters } from 'vuex';

export default {
  data() {
    return {
      tableData:null,
      queryParams:{
          pageNum:1,
          pageSize:10,merId:''
      },
      total:0,

    };
  },

 computed:{
    ...mapState(['common']),
    ...mapGetters({sellerKV:'status/mallOrderKV'})
  },

  methods: {

    filterSeller(row){
      return this.sellerKV[row.orderStatus]
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
.xl-no-wrap {
  overflow: hidden;
  white-space: nowrap;
  word-break: break-word;
}
</style>