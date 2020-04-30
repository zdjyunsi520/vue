<template>
  <el-tabs class="xl-tabs">
    
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="接单配置">
          <el-radio-group v-model="form.configValue">
            <el-radio label="1">1： 一个买手账号id，绑定多个不同的接单账号,不同的接单账号id只能接不同的店铺id</el-radio>
            <el-radio label="2">2： 一个买手账号id,绑定多个不同的接单账号，不同的接单账号id同时可以接受同一个店铺id</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button v-hasPermi="['system:config:update:receive_order_rule']" class="xl-form-item-button" :loading="loading" type="warning" @click="handleSubmit">保存接单配置</el-button>
        </el-form-item>
      </el-form>

      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="外挂接单配置">
          <el-radio-group v-model="form.assisterSwitch">
            <el-radio label="Y">允许外挂接单</el-radio>
            <el-radio label="N">不允许外挂接单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button v-hasPermi="['system:config:assister_switch:update']" class="xl-form-item-button" :loading="loading" type="warning" @click="handleSubmit1">保存外挂接单配置</el-button>
        </el-form-item>
      </el-form>
  </el-tabs>

</template>

<script>
import { getAcceptRule as fetchList,plugInRule,updateAcceptRule,updatePlugInRule } from '@/api/system/acceptRule';
export default {
  data() {
    const emptyRule = {
      required: true,
      trigger: 'blur',
      message: '此处不能为空'
    };
    const rules = {

    };
    const form = {
      configValue:"1",
      assisterSwitch:''
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
            this.form.configValue = r.data.configValue || "1"
        })
        plugInRule().then(r=>{
            this.form.assisterSwitch = r.data||'N'
        })
    },
    handleSubmit() {
      if(this.form.configValue==2){
        this.$confirm('此接单模式非常暴力，确定要使用该接单配置吗').then(()=>{
          this.handleSave(updateAcceptRule)
        }).catch(()=>this.form.configValue='1')
      }else{
        this.handleSave(updateAcceptRule)
      }
    },
    handleSubmit1() {
      this.handleSave(updatePlugInRule)
    },
    handleSave(fn){
      this.$refs.form.validate(v => {
              if (v) {
            this.loading = true;
                fn(this.form)
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
  width: 120px;
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
.el-radio{
    display: block;
    padding-bottom:8px;
}
</style>