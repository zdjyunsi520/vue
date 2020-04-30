<template>
  <!-- 充值信息填写 -->
  <el-dialog width="800px" title="逃单确认" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="任务编号">
        {{form.taskNo}}
      </el-form-item>
      <el-form-item label="订单编号">
         {{form.orderNo}}
      </el-form-item>
      <el-form-item label="商家ID">
         {{form.merId}}
      </el-form-item>
      <el-form-item label="买手ID">
         {{form.buyerId}}
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input v-model="form.note"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="warning" @click="handleSubmit">确定</el-button>

      <el-button @click="handleOpen">取消</el-button>
    </div>
  </el-dialog>
  <!-- 充值信息填写 -->
</template>

<script>
import { escape } from '@/api/order/order';

export default {
  data() {
    const rules={
      note:[{required:true,message:'请填写备注'}]
    }
    const form = {
      buyerId: '',
       merId: '',
        note: '',
         orderNo: '',
          orderStatus: '',
           taskNo: '',
    };

    return {
      form,
      form1:form,
      dialogVisible: false,
      loading: false,
      rules
    };
  },
  created() {
    this.create()
  },
  methods: {
    create(){
    this.form = Object.assign({},this.form1)

    },
    handleOpen() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
        this.create()
      }
    },
    handleSubmit() {
     this.$refs.form.validate(v=>{
        if(v){
      this.loading = true;
          var fn = escape;
          this.form.taskGoodsInfoList = ''
          fn(this.form)
            .then(res => {
              this.$message.success(res.msg);
              this.handleOpen();
            })
            .catch(e => {
              this.loading = false;
            });
            }
     })
      
    }
  },
  computed: {
    title() {
      return '拒绝原因';
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