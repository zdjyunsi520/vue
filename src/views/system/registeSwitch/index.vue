<template>
  <el-tabs class="xl-tabs">
    <el-tab-pane label="注册开关">
        <i-switch></i-switch>
    </el-tab-pane>
    <el-tab-pane label="限制注册两级">
     <limit></limit>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import iSwitch from './components/switch';
import limit from './components/limit';
export default {
    name:'买手注册开关',

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
  components: { iSwitch,limit },
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

/deep/.el-form-item__error {
  left: 195px;
}
.xl-width-150 {
  width: 100px;
}
.xl-tabs {
  margin: 20px;
}
.xl-button{
  margin-top:10px;
  padding-left:120px;
}
</style>