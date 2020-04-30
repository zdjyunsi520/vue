<template>
  <el-row>
    <el-row>
  


      <el-row>
        <el-row class="xl-mian-header-top">
          <el-col>基本信息</el-col>
        </el-row>
        <el-row class="xl-task-row">
          <el-col :span="24">商家ID：<span>{{data.id}}</span></el-col>
          <el-col :span="8">手机号：<span>{{data.merAccount}}</span></el-col>
          <el-col :span="16">QQ：<span>{{data.qq}}</span></el-col>
          <el-col :span="8">状态：<span>{{filterSeller}}</span></el-col>
          <el-col :span="16">注册时间：<span>{{data.registerTime}}</span></el-col>
        </el-row>

      </el-row>
      <el-row>
        <el-row class="xl-mian-header-top">
          <el-col>账户信息</el-col>
        </el-row>
        <el-row class="xl-task-row">
          <el-col :span="8">本金：<span>{{data.mmerchantAccountInfo.usablePrincipal}}</span></el-col>
          <el-col :span="16">佣金：<span>{{data.mmerchantAccountInfo.usableBrokerage}}</span></el-col>
        </el-row>

      </el-row>
      <el-row>
        <el-row class="xl-mian-header-top">
          <el-col>银行信息</el-col>
        </el-row>
        <el-row class="xl-task-row">
           <el-col :span="24">银行名称：<span>{{data.mbindBank.bankName}}</span></el-col>
          <el-col :span="24">银行账号：<span>{{data.mbindBank.bankCardNumber}}</span></el-col>
          <el-col :span="24">开户人：<span>{{data.mbindBank.bankAccountName}}</span></el-col>
        </el-row>

      </el-row>
</el-row>
  </el-row>
</template>

<script>
import {fetchInfo} from '@/api/seller'
import { mapState,mapGetters } from 'vuex';
const data = {
        "searchValue":null,
        "createBy":null,
        "createTime":null,
        "updateBy":null,
        "updateTime":null,
        "remark":null,
        "id":null,
        "merAccount":null,
        "password":null,
        "lev":null,
        "qq":null,
        "state":null,
        "registerTime":null,
        "number":null,
        "isPowerPublishTask":null,
        "taskType":null,
        "deptId":null,
        "integral":null,
        "name":null,
        "salt":null,
        "exAccountName":null,
        "deptName":null,
        "exId":null,
        "node":null,
        "isRecharge":null,
        "isWithdraw":null,
        "isTieCard":null,
        "maximumNumberOfStores":null,
        "limitMerIdOrStoreId":null,
        "merRecommendCode":null,
        "source":null,
        "invitationType":null,
        "mmerTaskOrder":{
            "searchValue":null,
            "createBy":null,
            "createTime":null,
            "updateBy":null,
            "updateTime":null,
            "remark":null,
            "id":null,
            "merId":null,
            "merAccount":null,
            "totalTask":null,
            "totalOrder":null,
            "laterTaskTime":null,
            "nearlySevenDaysOrderQuantity":null,
            "orderQuantityYesterday":null
        },
        "mlimitPublishTask":{
            "searchValue":null,
            "createBy":null,
            "createTime":null,
            "updateBy":null,
            "updateTime":null,
            "remark":null,
            "id":null,
            "merAccount":null,
            "merId":null,
            "taskType":null,
            "note":null,
            "taskTypeName":null,
            "limitedTime":null
        },
        "mmerchantAccountInfo":{
            "searchValue":null,
            "createBy":null,
            "createTime":null,
            "updateBy":null,
            "updateTime":null,
            "remark":null,
            "id":null,
            "merId":null,
            "merAccount":null,
            "allMoney":null,
            "state":null,
            "usableBrokerage":null,
            "usablePrincipal":null
        },
        "mbindBank":{
            "searchValue":null,
            "createBy":null,
            "createTime":null,
            "updateBy":null,
            "updateTime":null,
            "remark":null,
            "id":null,
            "merId":null,
            "merAccount":null,
            "bankCardNumber":null,
            "bankAccountName":null,
            "bankName":null,
            "bankBindPwd":null,
            "bindTime":null,
            "bindState":null
        }
    };
export default {
  data() {
    return {
      data,
    };
  },

 computed:{
    ...mapState(['common']),
    ...mapGetters({sellerKV:'status/sellerKV'}),
    filterSeller(){
      return this.sellerKV[this.data.state]

    }
  },

  methods: {
  
    getList() {
      const merId = this.common.merId
      fetchInfo({ merId })
        .then(({ data }) => {
          Object.assign(this.data, data);
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