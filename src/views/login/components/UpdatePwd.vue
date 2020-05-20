<template>
  <div class="pwdbox">
    <div class="pwd-main">
      <div class="pwdtitle">
        <svg-icon icon='logintag' class="logintag" />
        <span>找回密码</span>
      </div>
      <el-form :model="form" ref="form" :rules="rules">

        <!-- <el-form-item class="xl-line-height-initial" label="密码类型">
        <el-switch style="display: block" v-model="form.sts" active-color="#409eff" inactive-color="#409eff" active-text="登录密码" inactive-text="提现密码" :active-value='0' :inactive-value='1'>
        </el-switch>
      </el-form-item> -->

        <el-form-item prop="oldPassword">
          <el-input type="password" v-model="form.oldPassword" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input type="password" v-model="form.newPassword" autocomplete="off" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item prop="againPassword">
          <el-input type="password" v-model="form.againPassword" autocomplete="off" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="form.code" autocomplete="off" placeholder="请填写验证码"></el-input>
          <short-message ref="sms" @validatePhone="validatePhone"></short-message>

        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="warning" @click="handleSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { updatePassword } from "@/api/login";
import { removeToken } from "@/utils/auth";

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不得少于6位数哦"));
      } else {
        callback();
      }
    };
    const validatePassword1 = (rule, value, callback) => {
      if (value != this.form.newBindPassword) {
        callback(new Error("两次密码不一样"));
      } else {
        callback();
      }
    };

    const form = {
      deptId: "",
      oldPassword: "",
      sts: 0,
      newPassword: "",
      againPassword: "",
      userName: ""
    };

    const rules = {
      oldBindPassword: [
        { required: true, trigger: "blur", message: "旧密码不能为空" }
      ],
      newBindPassword: [
        { required: true, trigger: "blur", validator: validatePassword }
      ],
      againBindPassword: [
        {
          required: true,
          trigger: "blur",
          validator: validatePassword1
        }
      ],
      code: [
        {
          required: true,
          trigger: "blur",
          message: "短信验证码不能为空"
        }
      ]
    };
    return {
      form,
      form1: form,
      rules,
      dialogVisible: false,
      loading: false
    };
  },
  computed: {
    ...mapState(["user"]),
    title() {
      return this.form.sts == 0 ? "登录" : "提现";
    }
  },
  mounted() {
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
      this.loading = true;

      this.$refs.form.validate(v => {
        if (v) {
          this.form.deptId = this.user.deptId;
          this.form.userName = this.user.userName;
          updatePassword(this.form)
            .then(res => {
              this.$message({
                type: "success",
                message: res.msg
              });
              setTimeout(() => {
                removeToken();
                this.$router.push(`/login`);
              }, 1500);
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
.pwdbox {
  height: 100%;
  background-image: url("../../../assets/image/login-background.jpg");
  background-size: 100% 100%;
  position: relative;
  padding-top: 10%;
  .pwd-main {
    width: 420px;
    height: 440px;
    margin: auto;
    background-color: #ffffff;
    box-shadow: 0px 0px 5px 0px #96a9ff;
    border-radius: 5px;
    .pwdtitle {
      width: 166px;
      height: 50px;
      color: #fff;
      position: relative;
      text-align: center;
      line-height: 50px;
      .logintag {
        background-image: linear-gradient(90deg, #0072ff 0%, #5f95ff 100%);
        box-shadow: 0px 3px 5px 0px #c1d9ff;
        position: absolute;
        top: -30px;
        left: 0;
        right: 0;
        margin: auto;
        width: 166px;
      }
    }
    .el-form {
      padding: 0 40px;
      .el-form-item {
        margin-bottom: 20px;
        .el-input--medium .el-input__inner {
          line-height: 46px !important;
          height: 46px !important;
        }
      }
    }
  }
}
</style>