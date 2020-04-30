<template>
  <!-- 充值信息填写 -->
  <el-dialog
    width="800px"
    title="店铺转移"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center
    :destroy-on-close="true"
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="店铺名称">
        {{ data.storeName }}
      </el-form-item>
      <el-form-item label="转移到" prop="merAccount">
       <el-input v-model="form.merAccount" placeholder="商家账号"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
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
import { transfer } from "@/api/shop";

export default {
  data() {
    const form = {
      storeId: '',
      remarks: "",
      merAccount:''
    };
    const rules ={
        merAccount:[{required:true,trigger:'blur',message:'这里不能为空'}],
        remarks:[{required:true,trigger:'blur',message:'这里不能为空'}],
    }

    return {
        rules,
      form,
      form1:form,
      dialogVisible: false,
      loading: false,
        data:{}
    };
  },
  created() {
      this.create()
  },
  methods: {
      create(){
         this.form =  Object.assign({},this.form1)
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
                this.form.storeId = this.data.storeId
                transfer(this.form)
                    .then(res => {
                    this.$emit("getList");
                    this.$message.success(res.msg);
                    this.handleOpen();
                    })
                    .catch(e => {
                    this.loading = false;
                    });
            }
        })
      
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
