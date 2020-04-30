<template>
  <el-tabs class="xl-tabs">
    
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="是否开放商家注册">
          <el-radio-group v-model="form.merRegistrationSwitch">
            <el-radio :label="1">开放</el-radio>
            <el-radio :label="0">不开放</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商家端是否显示快递服务">
          <el-radio-group v-model="form.expressSwitch">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button  class="xl-form-item-button" :loading="loading" type="warning" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
  </el-tabs>

</template>

<script>
import { getDeptConfig as fetchList,updateDeptConfig } from '@/api/system/deptConfig';
export default {
  data() {
    const emptyRule = {
      required: true,
      trigger: 'blur',
      message: '此处不能为空'
    };
    const rules = {
      password: [emptyRule],
      password1: [emptyRule],
      phone: [emptyRule],
      qq: [emptyRule],
      recommendCode: [emptyRule]
    };
    const form = {
      merRegistrationSwitch:1,
       expressSwitch:1
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
            
            this.form = r.data
        })
    },
    handleSubmit() {
     
      this.handleSave()
      
    },
    handleSave(){
      this.$refs.form.validate(v => {
              if (v) {
            this.loading = true;
                var o = updateDeptConfig;
                o(this.form)
                  .then(res => {
                    this.$message.success(res.msg);
                  })
                  .finally(e => {
                    this.loading = false;
                  });
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