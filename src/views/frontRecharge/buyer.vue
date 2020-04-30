<template>
  <el-form ref="form" :model="common.form" :rules="rules" >
    <el-form-item label="操作类型">
      <el-radio-group v-model="common.form.resource">
        <el-radio :label="0" :value="0">入款</el-radio>
        <el-radio :label="1" :value="1">扣款</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="资金类型">
      <el-radio-group v-model="common.form.transactionType">
        <el-radio :label="1" :value="1">本金</el-radio>
        <el-radio :label="2" :value="2">佣金</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- <el-form-item label="买手ID" prop="buyerId">
      <el-input v-model="form.buyerId"></el-input>
    </el-form-item> -->
    <el-form-item label="手机号" prop="buyerAccount">
      <el-input v-model="common.form.buyerAccount"></el-input>
    </el-form-item>
    <el-form-item label="金额" prop="transactionMoney">
      <el-input v-model="common.form.transactionMoney"></el-input>
    </el-form-item>
    <el-form-item label="任务编号" prop="taskNo">
      <el-input v-model="common.form.taskNo"></el-input>
    </el-form-item>
    <el-form-item label="订单编号" prop="orderNo">
      <el-input v-model="common.form.orderNo"></el-input>
    </el-form-item>
    <el-form-item label="交易事由" prop="note">
      <el-input type="textarea" v-model="common.form.note"></el-input>
    </el-form-item>
    <el-form-item class="xl-padding-left">
      <el-button :loading="loading" type="success" @click="handleSubmit"
        >提交</el-button
      >
      <el-button type="warning" @click="handleOpen">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapState} from 'vuex'
import { recharge, cashOut } from "@/api/frontRecharge/buyer";
import { validMoney } from "@/utils/validate";
export default {
    name:'买手充值',
  data() {
    const emptyRule = {
      required: true,
      trigger: "blur",
      message: "此处不能为空"
    };
    const rules = {
      merAccount: [emptyRule],
      transactionMoney: [
        {
          required: true,
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (!validMoney(value)) {
              callback(new Error("这里出了点问题"));
            } else {
              callback();
            }
          }
        }
      ],
      note: [emptyRule],
     // taskNo: [emptyRule],
      orderNo: [emptyRule],
     // buyerId: [emptyRule],
      buyerAccount:[emptyRule]
    };
    const form = {
      transactionType: 1,
      taskNo: "",
      orderNo: "",
      buyerId: "",
     buyerAccount: "",
      transactionMoney: "",
      note: "",
      resource:0
    };
    return {
      form,
      form1: form,
      rules,
      loading: false
    };
  },
  created() {
    //

  },
  computed:{
    ...mapState(['common'])
  },
  methods: {
    create() {
      this.common.form = Object.assign({}, this.form1);
    },
    handleOpen() {
      this.loading = false;
      this.create();
    },
    handleSubmit() {
      this.$refs.form.validate(v => {
        if (v) {

          this.loading = true;
          var o;
          if (this.common.form.resource) {
            o = cashOut;
          } else {
            o = recharge;
          }
          o(this.common.form)
            .then(r => {
              this.$message.success(r.msg);
              this.handleOpen();
            })
            .finally(() => (this.loading = false));
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form {
  margin-top: 20px;
}
.xl-form-item-button {
  margin-left: 120px;
}
/deep/.el-form-item__label {
  width: 120px;
  font-weight: normal;
}
/deep/.el-input,
/deep/.el-textarea,
.xl-padding-left {
  width: 45%;
  .el-input {
    width: 100%;
  }
}
.xl-padding-left {
  text-align: center;
  margin-left: 100px;
}
/deep/.el-form-item__error {
  left: 45%;
}
</style>
