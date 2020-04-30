<template>
    <div>
        <el-table :data="tableData" border >
            <el-table-column prop="taskTypeName" label="任务类型" />
            <el-table-column prop="orderNo" label="订单编号" />
            <el-table-column prop="taskNo" label="任务编号" />
            <el-table-column prop="storeName" label="店铺名称" />
            <el-table-column prop="commission" label="佣金" />
            <el-table-column prop="principal" label="本金" />
            <el-table-column prop="rebateAmount" label="商家返款" />
            <el-table-column prop="createTime" label="接单时间" />filterMallOrder
             <el-table-column prop="createTime" label="任务状态" :formatter="filterMallOrder"/>
              <el-table-column prop="createTime" label="申诉状态" :formatter="filterComplainBuyer" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import {buyerOrder as fetchInfo} from '@/api/buyer/info'
import { mapState,mapGetters } from 'vuex';

export default {
  data() {
    return {
      tableData:null,
           queryParams:{
             pageNum:1,
          pageSize:10,
            buyerId:''
            },
            total:0
    };
  },

 computed:{
    ...mapState(['common']),
     ...mapGetters({
         mallOrderKV:'status/mallOrderKV',
     complainBuyerKV:'status/complainBuyerKV'
     })
  },

  methods: {

    filterComplainBuyer(row){
      return this.complainBuyerKV[row.appealStatus]
    },
    filterMallOrder(row){
      return this.mallOrderKV[row.orderStatus]
    },
    getList() {
      this.queryParams.buyerId = this.common.buyerId
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