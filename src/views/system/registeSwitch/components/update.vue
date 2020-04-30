<template>
  <!-- 充值信息填写 -->
  <el-dialog width="800px" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="ID" v-show="form.id">
        {{form.id}}
      </el-form-item>
      <el-form-item label="最上级买手ID" prop="highestBuyerId">
        <el-input v-model="form.highestBuyerId" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="付费团团名" prop="groupName">
        <el-input v-model="form.groupName" autocomplete="off" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="warning" @click="handleSubmit">{{title}}</el-button>
      <el-button @click="handleOpen">取消</el-button>
    </div>
  </el-dialog>
  <!-- 充值信息填写 -->
</template>

<script>
import { update1, add } from '@/api/system/registeSwitch';
export default {
  data() {
    const emptyRule = {
      required: true,
      trigger: 'blur',
      message: '此处不能为空'
    };
    const rules = {
        highestBuyerId:[emptyRule],
        groupName:[emptyRule]
    };
    const form = {
      id: '',
      highestBuyerId: '',
      groupName:'',
    };
    return {
      form,
      form1: form,
      rules,
      dialogVisible: false,
      loading: false
    };
  },
  computed:{
      title(){
          return this.form.id?'修改':'添加'
      }
  },
  created() {
    this.create();
  },

  methods: {
   
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
          var o
          if(this.form.id){
              o = update1
          }else{
              o=add
          }
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