<template>
  <el-form ref="form" :model="form" :rules="rules">
    <el-form-item label="推送平台">
      <el-radio-group v-model="platform">
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1">Android</el-radio>
        <el-radio :label="2">IOS</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="推送用户" prop="withdrawAmount">
      <el-radio-group v-model="user">
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1" :disabled="platform==0">指定用户</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="用户ID" prop="regId" v-show="user==1">
      <el-input v-model="form.regId" type="textarea" :rows="4" autocomplete="off" placeholder="多个用户用半角逗号隔开"></el-input>
    </el-form-item>
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" autocomplete="off" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <el-input v-model="form.content" autocomplete="off" type="textarea" :rows="4" placeholder=""></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="xl-form-item-button" :loading="loading" type="warning" @click="handleSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { all, androidAll, androidOne, iosAll, iosOne } from '@/api/pushManage';
export default {
  data() {
    const emptyRule = {
      required: true,
      trigger: 'blur',
      message: '此处不能为空'
    };
    const rules = {
      title: [emptyRule],
      content: [emptyRule]
    };
    const form = {
      title: '',
      content: '',
      regId: ''
    };
    return {
      form,
      form1: form,
      rules,
      loading: false,
      platform: 0,
      user: 0
    };
  },
  created() {
    this.create();
  },
  watch: {
    user(v) {
      if (v == 0) {
        this.form.regId = '';
      }
    },
    platform(v) {
      if (v == 0) {
        this.user = 0;
      }
    }
  },
  methods: {
    create() {
      this.form = Object.assign({}, this.form1);
    },
    handleOpen() {
      this.loading = false;
      this.create();
    },
    handleSubmit() {
      this.loading = true;
      this.$refs.form.validate(v => {
        if (v) {
          if (this.user) {
            if (!this.form.id) {
              this.$message.error('请输入指定用户ID');
              this.loading = false;
              return;
            }
          }
          var o;
          if (this.platform == 0) {
            o = all;
          } else if (this.platform == 1) {
            if (this.user) {
              o = androidOne;
            } else {
              o = androidAll;
            }
          } else if (this.user) {
            o = iosOne;
          } else {
            o = iosAll;
          }

          o(this.form)
            .then(res => {
              this.$message.success(res.msg);
              this.amount -= this.form.withdrawAmount;
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
  margin-left: 120px;
}
/deep/.el-form-item__label {
  width: 120px;
  font-weight: normal;
}
/deep/.el-input,
/deep/.el-textarea {
  width: 600px;
  .el-input {
    width: 100%;
  }
}
/deep/.el-form-item__error {
  left: 350px;
}
.xl-width-150 {
  width: 100px;
}
/deep/.el-input__inner {
  width: 100%;
}
</style>