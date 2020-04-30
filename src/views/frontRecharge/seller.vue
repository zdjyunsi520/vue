<template>
  <el-form ref="form" :model="form" :rules="rules">
    <el-form-item label="操作类型">
      <el-radio-group v-model="form.transactionInOut">
        <el-radio :label="1">充值</el-radio>
        <el-radio :label="2">扣款</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="资金类型">
      <el-radio-group v-model="form.transactionType">
        <el-radio :label="1">本金</el-radio>
        <el-radio :label="2">佣金</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="手机号码" prop="merAccount">
      <el-input v-model="form.merAccount" autocomplete="off" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="订单编号" prop="orderNo">
      <el-input v-model="form.orderNo" autocomplete="off" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="金额" prop="transactionMoney">
      <el-input v-model="form.transactionMoney" autocomplete="off" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="交易事由" prop="note">
      <el-input type="textarea" :rows="4" v-model="form.note" autocomplete="off" placeholder=""></el-input>
    </el-form-item>
    <el-form-item class="xl-padding-left">
      <el-button :loading="loading" type="success" @click="handleSubmit">提交</el-button>
      <el-button :loading="loading" type="warning" @click="handleOpen">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { recharge } from '@/api/frontRecharge/seller';
import { validMoney } from '@/utils/validate';
export default {
  name:'商家充值',
  data() {
    const emptyRule = {
      required: true,
      trigger: 'blur',
      message: '此处不能为空'
    };
    const rules = {
      merAccount: [emptyRule],
        orderNo: [emptyRule],
      transactionMoney: [
        {
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (!validMoney(value)) {
              callback(new Error('这里出了点问题'));
            } else {
              callback();
            }
          }
        }
      ],
      note: [emptyRule]
    };
    const form = {
      transactionType: 1,
      transactionInOut: 1,
      merAccount: '',
      transactionMoney: '',
      note: '',
      orderNo:''
    };
    return {
      form,
      form1: form,
      rules,
      loading: false
    };
  },
  created() {
    this.create();
  },
  methods: {
    create() {
      this.form = Object.assign({}, this.form1);
    },
    handleOpen() {
      this.loading = false;
      this.create();
    },
    handleSubmit() {
      this.loading = true;
      this.$refs.form.validate(v => {
        if (v) {
         
          var o = recharge;

          o(this.form)
            .then(res => {
              this.$message.success(res.msg);
              this.handleOpen();
            })
            .catch(e => {
              this.loading = false;
            });
        } else {
          this.loading = false;
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