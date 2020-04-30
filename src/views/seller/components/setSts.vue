<template>
  <!-- 充值信息填写 -->
  <el-dialog width="800px" :title="''" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
    <el-form ref="form" :model="form">
      <el-form-item label="商家ID">
        {{form.merId}}
      </el-form-item>
      <el-form-item label="原因" prop="creditLev">
        <el-input v-model="form.remarks"></el-input>
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
import { disabled } from '@/api/seller';

export default {
  data() {
    const form = {
      merId: 0,
      remarks: '',
      status: ''
    };

    return {
      form,
      dialogVisible: false,
      loading: false
    };
  },
  created() {},
  methods: {
    handleOpen() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
      }
    },
    handleSubmit() {
      this.loading = true;
      if (this.form.remarks == '') {
        this.$message.error('请填写操作原因');
        this.loading = false;
        return;
      }
      disabled(this.form)
        .then(res => {
          this.$emit('getList');
          this.$message.success(res.msg);
          this.handleOpen();
        })
        .catch(e => {
          this.loading = false;
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