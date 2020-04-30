<template>
  <el-tabs class="xl-tabs">
    <el-tab-pane label="添加会员">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="会员类型">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">买手</el-radio>
            <el-radio :label="2">商家</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="确认用户密码" prop="password1">
          <el-input type="password" v-model="form.password1" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="form.qq" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="邀请码" prop="">
          <el-input v-model="form.recommendCode" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-hasPermi="['system:member:addMerchant:add']" class="xl-form-item-button" :loading="loading" type="warning" @click="handleSubmit">添加</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="批量添加会员">
      <xl-add ref="add"></xl-add>
    </el-tab-pane>
    <el-tab-pane label="设置被邀请的人可接高价单">
      <el-form ref="form2" :model="form2" :rules="rules">
        <el-form-item label="邀请人ID" prop="buyerId">
            <el-input v-model="form2.buyerId"></el-input><br/>

        </el-form-item>
        <el-form-item class="xl-button">
            <el-button @click="handleSetHigh">设置被邀请的人可接高价单</el-button>
            <el-button @click="handleSetHighRightNow">设置被邀请的人可接高价单且立返</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import { add ,setHigh,setHighRightNow} from '@/api/buyer/info';
import XlAdd from './components/add';
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
      recommendCode: [emptyRule],
      buyerId:[emptyRule]
    };
    const form = {
      password: '',
      password1: '',
      phone: '',
      qq: '',
      recommendCode: '',
      type: 1
    };
    return {
      form,
      form1: form,
      rules,
      loading: false,
      form2:{
        buyerId:''
      },
      form3:{
        buyerId:''
      }
    };
  },
  components: { XlAdd },
  created() {
    this.create();
  },

  methods: {
    create() {
      this.form = Object.assign({}, this.form1);
    },
    handleOpen() {
      this.loading = false;
      this.create();
    },
    handleSetHigh(){
      this.$refs.form2.validate(v=>{
        if(v){
          this.loading = true
          setHigh(this.form2).then(r=>{
            this.$message.success(r.msg)
            this.form2.buyerId = ''
          }).finally(()=>this.loading=false)
        }
      })
    },
    handleSetHighRightNow(){
      this.$refs.form2.validate(v=>{
        if(v){
          this.loading = true
          setHighRightNow(this.form2).then(r=>{
            this.$message.success(r.msg)
            this.form2.buyerId = ''
          }).finally(()=>this.loading=false)
        }
      })
    },
    handleSubmit() {
      this.loading = true;
      this.$refs.form.validate(v => {
        if (v) {
          if (this.form.type == 1 && this.form.recommendCode == '') {
            this.$message.error('邀请码不能为空');
            this.loading = false;
            return;
          }
          if (this.form.password != this.form.password1) {
            this.$message.error('两次密码不一致');
            this.loading = false;
            return;
          }
          // if (this.form.type == 1 && this.form.recommendCode == '') {
          //   this.$message.error('邀请码不能为空');
          //   this.loading = false;
          //   return;
          // }
          var o = add;

          o(this.form)
            .then(res => {
           
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
.el-form {
  margin-top: 20px;
}
.xl-form-item-button {
  margin-left: 240px;
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
.xl-button{
  margin-top:10px;
  padding-left:120px;
}
</style>