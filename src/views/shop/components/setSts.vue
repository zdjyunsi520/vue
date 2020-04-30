<template>
  <!-- 充值信息填写 -->
  <el-dialog
    width="800px"
    :title="title"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center
    :destroy-on-close="true"
  >
    <el-form ref="form" :model="form">
      <el-form-item label="店铺名称">
        {{ storeName }}
      </el-form-item>
      <el-form-item :label="title">
        <el-input v-model="form.remarks"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="warning" @click="handleSubmit"
        >修改</el-button
      >

      <el-button @click="handleOpen">取消</el-button>
    </div>
  </el-dialog>
  <!-- 充值信息填写 -->
</template>

<script>
import { disabled, refuse } from "@/api/shop";

export default {
  data() {
    const form = {
      storeId: 0,
      remarks: "",
      storeStatus: ""
    };

    return {
      form,
      dialogVisible: false,
      loading: false,
      actionType: 0,
      storeName: ""
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
      if (this.form.remarks == "") {
        this.$message.error("请填写" + this.title);
        this.loading = false;
        return;
      }
      var fn = this.actionType ? refuse : disabled;

      fn(this.form)
        .then(res => {
          this.$emit("getList");
          this.$message.success(res.msg);
          this.handleOpen();
        })
        .catch(e => {
          this.loading = false;
        });
    }
  },
  computed: {
    title() {
      return this.actionType ? "审核拒绝原因" : "禁用原因";
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
