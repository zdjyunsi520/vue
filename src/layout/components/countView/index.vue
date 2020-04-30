<template>
    <el-row class="xl-font-size">
        <el-col>
            <div v-if="common.count.mMerchantBindStore>0"><span @click="handleSetLineChartData('/m/shop')">店铺审核({{common.count.mMerchantBindStore}})</span></div>
            <div v-else>店铺审核({{common.count.mMerchantBindStore}})</div>
        </el-col>
        <el-col>
            <div v-if="bBuyerAccountInfo>0"><span @click="handleSetLineChartData('/buyer/account/all')">买手账号审核({{bBuyerAccountInfo}})</span></div>
            <div v-else>买手账号审核({{bBuyerAccountInfo}})</div>
        </el-col>
        <el-col>
            <div v-if="common.count.bBuyerAudit>0"><span @click="handleSetLineChartData('/buyer/info/review')">买手身份审核({{common.count.bBuyerAudit}})</span></div>
             <div v-else>买手身份审核({{common.count.bBuyerAudit}})</div>
        </el-col>
        <el-col>
            <div v-if="common.count.mRechargeRecord>0"><span @click="handleSetLineChartData('/m/recharge')">商家充值({{common.count.mRechargeRecord}})</span></div>
            <div v-else>商家充值({{common.count.mRechargeRecord}})</div>
        </el-col>
        <el-col>
            <div v-if="common.count.mWithdrawRecord>0"><span @click="handleSetLineChartData('/w/cashOut/seller')">商家提现({{common.count.mWithdrawRecord}})</span></div>
            <div v-else>商家提现({{common.count.mWithdrawRecord}})</div>
        </el-col>
         <el-col>
            <div v-if="common.count.eWithdrawRecord>0"><span @click="handleSetLineChartData('/w/cashOut/popular')">推广员提现({{common.count.eWithdrawRecord}})</span></div>
            <div v-else>推广员提现({{common.count.eWithdrawRecord}})</div>
        </el-col>
         <el-col>
            <div v-if="common.count.dWithdrawRecord>0"><span @click="handleSetLineChartData('/w/cashOut/station')">分站提现({{common.count.dWithdrawRecord}})</span></div>
            <div v-else>分站提现({{common.count.dWithdrawRecord}})</div>
        </el-col>
        <el-col>
            <div v-if="common.count.bWithdrawRecord>0"><span @click="handleSetLineChartData('/w/cashOut/buyer')">买手提现({{common.count.bWithdrawRecord}})</span></div>
            <div v-else>买手提现({{common.count.bWithdrawRecord}})</div>
        </el-col>
        <el-col>
            <div v-if="common.count.merchantAppeal>0"><span @click="handleSetLineChartData('/complain/seller')">商家申诉({{common.count.merchantAppeal}})</span></div>
            <div v-else>商家申诉({{common.count.merchantAppeal}})</div>
        </el-col>
        <el-col>
            <div v-if="common.count.buyerAppeal>0"><span @click="handleSetLineChartData('/complain/buyer')">买手申诉({{common.count.buyerAppeal}})</span></div>
            <div v-else>买手申诉({{common.count.buyerAppeal}})</div>
        </el-col>
        <el-col>
            <div v-if="common.count.sysFeedback>0"><span @click="handleSetLineChartData('/f/index')">意见反馈({{common.count.sysFeedback}})</span></div>
            <div v-else>意见反馈({{common.count.sysFeedback}})</div>
        </el-col>
        <el-col>
            <span class="link-type" @click="handleRefresh">点我刷新统计</span>
        </el-col>
    </el-row>
</template>

<script>
import {mapState,mapActions} from 'vuex'
    export default {
        name:'countView',
        data(){
            return {

            }
        },
        created(){
             // this.handleRefresh()
        },
        activated(){
          //  this.handleRefresh()
        },
        computed:{
            ...mapState(['common']),
            bBuyerAccountInfo(){
                return this.common.count.bBindPddAccountInfo+this.common.count.bBindTbAccountInfo+this.common.count.bBindJdAccountInfo
            }
        },
        methods:{
            ...mapActions({reflash:'common/refresh'}),
            handleRefresh(){
                this.reflash()
            },handleSetLineChartData(type) {
                if(type=='/buyer/account/all'){
                     if(this.common.count.bBindTbAccountInfo>0){
                        type='/buyer/account/tb'
                    }
                    else if(this.common.count.bBindJdAccountInfo>0){
                        type='/buyer/account/jd'
                    }
                    else if(this.common.count.bBindPddAccountInfo>0){
                        type='/buyer/account/pdd'
                    }
                }
                this.$router.push({path:type,params:{query:Math.random()}})
          }
        }
    }
</script>

<style lang="scss" scoped>
.xl-font-size{
    color:#606266;
    font-size:14px;
    font-weight: 400;
    /deep/.el-col{
        display: inline-block;
        margin:10px 0 10px 10px;
        float: none;
        width:auto;
        span{
            color:#f00;
            cursor: pointer;
        }
    }
}
</style>