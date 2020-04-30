<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/m/shop')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            店铺审核
          </div>
          <count-to :start-val="0" :end-val="common.count.mMerchantBindStore" :duration="1500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/buyer/account/all')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            买手账号审核
          </div>
          <count-to :start-val="0" :end-val="bBuyerAccountInfo" :duration="1500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/buyer/info/review')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            买手身份审核
          </div>
          <count-to :start-val="0" :end-val="common.count.bBuyerAudit" :duration="1500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
        <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/m/recharge')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            商家充值
          </div>
          <count-to :start-val="0" :end-val="common.count.mRechargeRecord" :duration="1500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
        <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/w/cashOut/seller')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            商家提现
          </div>
          <count-to :start-val="0" :end-val="common.count.mWithdrawRecord" :duration="1500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
        <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/w/cashOut/buyer')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            买手提现
          </div>
          <count-to :start-val="0" :end-val="common.count.bWithdrawRecord" :duration="1500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/complain/seller')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            商家申诉
          </div>
          <count-to :start-val="0" :end-val="common.count.merchantAppeal" :duration="1500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/complain/buyer')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            买手申诉
          </div>
          <count-to :start-val="0" :end-val="common.count.buyerAppeal" :duration="1500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/f/index')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            意见反馈
          </div>
          <count-to :start-val="0" :end-val="common.count.sysFeedback" :duration="1500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
   <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/w/cashOut/popular')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            推广员提现
          </div>
          <count-to :start-val="0" :end-val="common.count.eWithdrawRecord" :duration="1500" class="card-panel-num" />
        </div>
      </div>
    </el-col>
       <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('/w/cashOut/station')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            分站提现
          </div>
          <count-to :start-val="0" :end-val="common.count.dWithdrawRecord" :duration="1500" class="card-panel-num" />
        </div>
      </div>
    </el-col>






  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import {fetchTotalCount} from '@/api/common'
import {mapState,mapActions} from 'vuex'
export default {
  data(){
    return {

    }
  },
  components: {
    CountTo
  },
  created(){
    this.handleRefresh()
  },
    computed:{
            ...mapState(['common']),
            bBuyerAccountInfo(){
                return this.common.count.bBindPddAccountInfo+this.common.count.bBindTbAccountInfo+this.common.count.bBindJdAccountInfo
            }
        },
  methods: {
    ...mapActions({reflash:'common/refresh'}),
            handleRefresh(){
                this.reflash()
            },
    handleSetLineChartData(type) {
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
      this.$router.push({path:type,params:{dt:Math.random()}})
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
