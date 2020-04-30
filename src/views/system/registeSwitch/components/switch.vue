<template>
    
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item>
          <el-radio-group v-model="form.type">
            <el-radio :label="1">全开（所有人可邀请注册）</el-radio>
            <el-radio :label="2">半开（指定买手可邀请注册）</el-radio>
            <el-radio :label="3">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type==2">
            可邀请注册的买手ID（以英文逗号隔开）
            <el-input type="textarea" v-model="form.buyerIds" :rows="5"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="xl-form-item-button" :loading="loading" type="warning" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>

</template>

<script>
import { fetchList,update } from '@/api/system/registeSwitch';
export default {
  data() {
    const emptyRule = {
      required: true,
      trigger: 'blur',
      message: '此处不能为空'
    };
    const rules = {
      //buyerIds: [emptyRule]
    };
    const form = {
      type:1,
       buyerIds:''
    };
    return {
      form,
      form1: form,
      rules,
      loading: false
    };
  },
  components: {  },
  created() {
    this.fetchList()
  },

  methods: {
    fetchList(){
        fetchList().then(r=>{
            r.data&&(this.form = r.data)
        })
    },
    handleSubmit() {
      this.handleSave()
    },
    handleSave(){
        this.loading = true;
        if(this.form.type==2&&this.form.buyerIds==''){
                this.$message.error('请填写可邀请注册的买手ID')
                return
        }
        var o = update;
        o(this.form)
            .then(res => {
            this.$message.success(res.msg);
            })
            .finally(e => {
            this.loading = false;
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
  width: 200px;
  font-weight: normal;
}
/deep/.el-input,
/deep/.el-select {
  width: 360px;
  .el-input {
    width: 100%;
  }
}
/deep/.el-form-item__error {
  left: 195px;
}
.xl-width-150 {
  width: 100px;
}
/deep/.el-input__inner {
  width: 100%;
}
.xl-tabs {
  margin: 20px;
}

</style>