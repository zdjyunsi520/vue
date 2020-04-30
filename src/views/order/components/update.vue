<template>
  <!-- 充值信息填写 -->
  <el-dialog width="800px" :title="'修改会员信息'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="手机号码">
        {{form.buyerAccount}}
      </el-form-item>
      <el-form-item label="用户密码" prop="storeName">
        <el-input v-model="form.password" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="确认用户密码" prop="storeName">
        <el-input v-model="form.password1" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="QQ" prop="storeAccountId">
        <el-input v-model="form.qq" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="所属银行" prop="storeAccountId">
        <el-input v-model="form.bbuyerBindBank.bankName" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="银行账号" prop="storeAccountId">
        <el-input v-model="form.bbuyerBindBank.bankCardNumber" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="开户人" prop="storeAccountId">
        <el-input v-model="form.bbuyerBindBank.bankBindName" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="storeAccountId">
        <el-input v-model="form.bbuyerAudit.bindIdentityCard" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="storeAccountId">
        <el-input v-model="form.bbuyerAudit.realName" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="允许接高价单">
        <el-radio-group v-model="form.isAcceptHighPrice">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="推广员" prop="storeAccountId">
        <el-input v-model="form.promoterId" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="warning" @click="handleSubmit">修改</el-button>

      <el-button @click="handleOpen">取消</el-button>
    </div>
  </el-dialog>
  <!-- 充值信息填写 -->
</template>

<script>
import { update, getInfoById } from '@/api/buyer/info';
export default {
  data() {
    const emptyRule = {
      required: true,
      trigger: 'blur',
      message: '此处不能为空'
    };
    const rules = {};
    const form = {
      id: '',
      buyerAccount: '',
      qq: '',
      registerTime: '',
      promoterId: '',
      state: '',
      principalIsWithdraw: '',
      lastLoginTime: '',
      note: ' ',
      deptId: '',
      password: '',
      createTime: '',
      credit: '',
      source: '',
      isBlack: '',
      deptName: '',
      isRealName: '',
      isBindBank: '',
      brokerageIsWithdraw: '',
      buyerAccountQuality: '',
      recommendCode: '',
      posterUrl: '',
      shareUrl: '',
      secondLevId: '',
      threeLevId: '',
      isOpenVoice: '',
      isOpenShake: '',
      lastLoginTerminal: '',
      isAcceptHighPrice: '',
      bbuyerBindBank: {
        id: '',
        buyerId: '',
        buyerAccount: '',
        bankCardNumber: '',
        bankBindName: '',
        bankName: '',
        bindPwd: '',
        bindTime: '',
        state: 0,
        updateTime: null
      },
      bbuyerAudit: {
        id: '',
        buyerId: '',
        buyerAccount: '',
        realName: '',
        bindBankId: '',
        bindIdentityCard: '',
        identityAddress: '',
        birthday: '',
        accountDentityFrontUrl: '',
        identityFrontUrl: '',
        auditState: '',
        auditName: '',
        auditNote: '',
        createTime: '',
        auditTime: '',
        identityReverseUrl: '',
        sex: '',
        nation: '',
        bbuyerBindBank: ''
      },
      bbuyerAccountInfo: {
        id: '',
        buyerId: '',
        buyerAccount: '',
        allMoney: '',
        allPrincipal: '',
        allBrokerage: '',
        createTime: '',
        updateTime: '',
        state: '',
        usableBrokerage: '',
        usablePrincipal: ''
      }
    };
    return {
      form,
      form1: form,
      rules,
      dialogVisible: false,
      loading: false
    };
  },
  created() {
    this.create();
  },
  methods: {
    getInfo() {
      this.loading = true;
      getInfoById({
        id: this.form.id
      })
        .then(r => {
          Object.assign(this.form, r.data);
          this.form.password = '';
        })
        .finally(() => (this.loading = false));
    },
    create() {
      this.form = Object.assign({}, this.form1);
    },
    handleOpen() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
        this.create();
      }
    },
    handleSubmit() {
      this.$refs.form.validate(v => {
        if (v) {
          this.loading = true;
          var o = update;

          o(this.form)
            .then(res => {
              this.$emit('getList');
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
/deep/.el-form-item__label {
  width: 30%;
}
/deep/.el-input,
/deep/.el-select {
  width: 45%;
  .el-input {
    width: 100%;
  }
}
/deep/.el-form-item__error {
  left: 45%;
}
.xl-width-150 {
  width: 100px;
}
/deep/.el-input__inner {
  width: 100%;
}
</style>