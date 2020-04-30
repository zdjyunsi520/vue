<template>
  <!-- 账户绑定信息填写 -->
  <el-dialog width="800px" :title="'银行账户绑定'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>
    <el-form :model="form" ref="form" :rules="rules">
      <el-form-item label="开户人" prop="bankAccountName">
        <el-input v-model="form.bankAccountName" placeholder="请填写姓名"></el-input>
      </el-form-item>
      <el-form-item label="提现银行">
        <el-input v-model="form.bankName" placeholder="请填写银行名称"></el-input>
      </el-form-item>
      <el-form-item label="银行卡号" prop="bankCardNumber">
        <el-input v-model="form.bankCardNumber" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="提现密码" prop="bankBindPwd">
        <el-input type="password" v-model="form.bankBindPwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="再次输入密码" prop="password1">
        <el-input type="password" v-model="form.password1" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <template slot="label">
          <short-message></short-message>
        </template>
        <el-input v-model="form.code" placeholder="短信验证码"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="warning" @click="handleSubmit">确定提交</el-button>

      <el-button @click="handleOpen">取消提交</el-button>
    </div>
  </el-dialog>
  <!-- 账户绑定信息填写 -->
</template>

<script>
export default {
  data() {
    return {
      form: null,
      dialogVisible: false,
      loading: false
    };
  },
  methods: {
    create() {},
    handleOpen() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
        this.create();
      }
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
</style>