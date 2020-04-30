<template>
  <!-- 充值信息填写 -->
  <el-dialog width="80%" :title="'订单编号:'+form.orderNo" :visible.sync="dialogVisible" :modal-append-to-body="false"   center>
      <el-row v-loading="loading" class="xl-task-row">
          <el-col :span="6" v-if="refundServiceFeeHead!=undefined">总站获得的平台服务费:{{refundServiceFeeHead}}</el-col>
          <el-col :span="6" v-if="refundServiceFeeDept!=undefined">分站获得的平台返款服务费（加价):{{refundServiceFeeDept}}</el-col>
          <el-col :span="6" v-if="emptyParcelPostageHead!=undefined">总站获得的空包邮费:{{emptyParcelPostageHead}}</el-col>
          <el-col :span="6" v-if="emptyParcelPostageDept!=undefined">分站获得的空包邮费（加价）:{{emptyParcelPostageDept}}</el-col>
          <el-col :span="6" v-if="labelFeeHead!=undefined">总站获得的打标（卡首页）服务费:{{labelFeeHead}}</el-col>
          <el-col :span="6" v-if="labelFeeDept!=undefined">分站获得的打标（卡首页）服务费:{{labelFeeDept}}</el-col>
          <el-col :span="6" v-if="deptCommission!=undefined">分站获得的总佣金（包括分站加价）:{{deptCommission}}</el-col>
          <el-col :span="6" v-if="headCommission!=undefined">总站获得的佣金:{{headCommission}}</el-col>
          <el-col :span="6" v-if="commissionRaisePrice!=undefined">分站佣金加价:{{commissionRaisePrice}}</el-col>
          <el-col :span="6" v-if="deptProfit!=undefined">分站获得的总利润:{{deptProfit}}</el-col>
          <el-col :span="6" v-if="baseCommission!=undefined">基础佣金（包括分站加价）:{{baseCommission}}</el-col>
          <el-col :span="6" v-if="totalCommission!=undefined">总佣金（包括分站加价）:{{totalCommission}}</el-col>
          <el-col :span="6" v-if="buyerCommission!=undefined">刷手佣金:{{buyerCommission}}</el-col>
          <el-col :span="6" v-if="superiorBuyerCommission!=undefined">刷手上级佣金:{{superiorBuyerCommission}}</el-col>
          <el-col :span="6" v-if="topSuperiorBuyerCommission!=undefined">刷手上上级佣金:{{topSuperiorBuyerCommission}}</el-col>
          <el-col :span="6" v-if="highestBuyerCommission!=undefined">刷手上上上级佣金:{{highestBuyerCommission}}</el-col>
          <el-col :span="6" v-if="promoterCommission!=undefined">商家直接推广员佣金:{{promoterCommission}}</el-col>
          <el-col :span="6" v-if="superiorPromoterCommission!=undefined">推广员上级佣金:{{superiorPromoterCommission}}</el-col>
          <el-col :span="6" v-if="topSuperiorPromoterCommission!=undefined">推广员上上级佣金:{{topSuperiorPromoterCommission}}</el-col>
      </el-row>
  </el-dialog>
  <!-- 充值信息填写 -->
</template>

<script>
import {fetchOrderDetail } from '@/api/profit/station'
export default {
  data() {
    const form = {
      auditState: 0
    };

    return {
      form,
      dialogVisible: false,
      loading: false,
      refundServiceFeeHead:undefined,
      refundServiceFeeDept:undefined,
      emptyParcelPostageHead:undefined,
      emptyParcelPostageDept:undefined,
      labelFeeHead:undefined,
      labelFeeDept:undefined,
      deptCommission:undefined,
      headCommission:undefined,
      commissionRaisePrice:undefined,
      baseCommission:undefined,
      totalCommission:undefined,
      buyerCommission:undefined,
      superiorBuyerCommission:undefined,
      topSuperiorBuyerCommission:undefined,
      promoterCommission:undefined,
      superiorPromoterCommission:undefined,
      topSuperiorPromoterCommission:undefined,
      highestBuyerCommission:undefined,
      highestBuyerCommissionRate:undefined,
      highestBuyerCommission:undefined,
      deptProfit:undefined,
    };
  },
  props: ['reason'],
  created() {},
  methods: {
    handleOpen() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
      }
    },
    getList(){
        this.loading=true
        fetchOrderDetail(this.form).then(r=>{
            Object.assign(this,r.data)
        }).finally(()=>this.loading=false)
    }

  }
};
</script>

<style lang="scss" scoped>
.xl-task-row {
  padding-left: 20px;
  line-height: 50px;
}
</style>