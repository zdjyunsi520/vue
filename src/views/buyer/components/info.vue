<template>
  <el-row>
        <el-row class="xl-task-row">
          <el-col :span="8">用户ID：<span>{{data.id}}</span></el-col>
          <el-col :span="8">手机号：<span>{{data.buyerAccount}}</span></el-col>
          <el-col :span="8">QQ：<span>{{data.qq}}</span></el-col>
          <el-col :span="8">本金：<span>{{data.allPrincipal}}</span></el-col>
          <el-col :span="16">佣金：<span>{{data.allBrokerage}}</span></el-col>
          <el-col :span="8">银行：<span>{{data.bankName}}</span></el-col>
          <el-col :span="8">卡号：<span>{{data.bankCardNumber}}</span></el-col>
          <el-col :span="8">姓名：<span>{{data.bankBindName}}</span></el-col>
          <el-col :span="8">注册时间：<span>{{data.createTime}}</span></el-col>
          <el-col :span="16">最后登录时间：<span>{{data.lastLoginTime}}</span></el-col>
          <el-col :span="8">淘宝账号数量：<span>{{data.tbNum}}</span></el-col>
          <el-col :span="8">拼多多账号数量：<span>{{data.jdNum}}</span></el-col>
          <el-col :span="8">京东账号数量：<span>{{data.pddNum}}</span></el-col>
        </el-row>

  </el-row>
</template>

<script>
import {buyerInfo as fetchInfo} from '@/api/buyer/info'
import { mapState,mapGetters } from 'vuex';
const data = {
         "buyerAccount":"",
        "bankBindName":"",
        "bankCardNumber":"",
        "bankName":"",
        "allPrincipal":'',
        "allBrokerage":'',
        "id":'',
        "lastLoginTime":"",
        "createTime":"",
        "qq":"25525555",
        "tbNum":'',
        "pddNum":'',
        "jdNum":''
    };
export default {
  data() {
    return {
      data
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
      const buyerId = this.common.buyerId
      fetchInfo({ buyerId })
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