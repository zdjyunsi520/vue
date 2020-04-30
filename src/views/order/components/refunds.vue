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
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="订单编号">
        {{ form.orderNo }}
      </el-form-item>
      <el-form-item label="退给谁">
        <el-radio-group v-model="radio" @change="handleChange">
          <el-radio :label="0">买手</el-radio>
          <el-radio :label="1">商家</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="退本金" prop="principal">
        <el-input v-model="form.principal"></el-input>
      </el-form-item>
      <!-- <el-form-item label="退佣金" prop="">
        <el-input v-model="form.note"></el-input>
      </el-form-item> -->
      <el-form-item label="理由" prop="reason">
        <el-input v-model="form.reason" type="textarea" :rows="5"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="warning" @click="handleSubmit"
        >确定</el-button
      >

      <el-button @click="handleOpen">取消</el-button>
    </div>
  </el-dialog>
  <!-- 充值信息填写 -->
</template>

<script>
import { buyerRefund, sellerRefund } from "@/api/order/order";
import { validMoney } from "@/utils/validate";
export default {
  data() {
    const form = {
      id: 0,
      principal: "",
      orderNo: "",
      reason: ""
    };
    const rules = {
      principal: [
        {
          required: true,
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (validMoney(value)) {
              callback();
            } else {
              callback(new Error("金额填写有误"));
            }
          }
        }
      ],
      reason: [{ required: true, trigger: "blur", message: "此处不能为空" }]
    };
    return {
      form,
      form1: form,
      dialogVisible: false,
      loading: false,
      storeName: "",
      radio: 0,
      rules,
      buyerActualPayment: 0,
      rebateAmount: 0,
      buyerSuppliedMarginAmout: 0,
      merchantSuppliedMarginAmout: 0
    };
  },
  created() {
    this.create();
  },
  methods: {
    create() {
      Object.assign(this.form, this.form1);
    },
    handleChange() {
      if (this.radio) {
            const principal =
          this.rebateAmount -
          this.buyerActualPayment -
          this.merchantSuppliedMarginAmout;
        this.form.principal = principal < 0 ? "" : principal;
      } else {
          const principal =
          this.buyerActualPayment -
          this.rebateAmount -
          this.buyerSuppliedMarginAmout;
        this.form.principal = principal < 0 ? "" : principal;
      }
    },
    handleOpen() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
        this.create();
      }
    },
    handleSubmit() {
      this.loading = true;
      if (this.form.note == "") {
        this.$message.error("请填写" + this.title);
        this.loading = false;
        return;
      }
      var fn = this.radio ? sellerRefund : buyerRefund;

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
      return "退钱";
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item__label {
  width: 30%;
}
/deep/.el-input,
/deep/.el-select,
.el-textarea {
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
