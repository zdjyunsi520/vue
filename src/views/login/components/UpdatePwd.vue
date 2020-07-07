<template>
  <div class="pwdbox">
    <div class="topbox">
      <img src="../../../assets/logo/logo.png" class="logo">
      <div class="line"></div>
    </div>
    <div class="pwd-main">
      <div class="pwdtitle">
        <img src="../../../assets/image/img_title_blue.png" class="logintag">
        <span>找回密码</span>
      </div>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="form.username" auto-complete="new-password" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="mobilePhone">
          <el-input placeholder="请输入手机号" v-model="form.mobilePhone" class="input-with-select mobilePhoneinput">
            <el-select v-model="select" slot="prepend" placeholder="请选择" style="color: #fff;margin: -10px -21px;">
              <el-option label="中国 +86" value="中国 +86"></el-option>
            </el-select>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input v-model="form.code" auto-complete="new-password" placeholder="请填写验证码" class="codeinput">
            <template slot="append">
              <el-button type="text" class="sendbtn" @click="handleSend">{{countdown>0?countdown+'秒':"发送验证码"}}</el-button>
            </template>

          </el-input>
          <!-- <short-message ref="sms" @validatemobilePhone="validatemobilePhone"></short-message> -->
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" auto-complete="new-password" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmpassword">
          <el-input type="password" v-model="form.confirmpassword" auto-complete="new-password" placeholder="请再次确认新密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button :loading="loading" class="btnbg" size="medium" type="primary" style="width:100%;" @click="handleSubmit">确定</el-button>
        </el-form-item>
        <div class="smbottombtn">
          <span @click="handlerBack">
            <i class="el-icon-arrow-left" style="font-size: 16px;vertical-align: text-bottom;margin-right: 5px;"></i>返回登录</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { mapState } from "vuex";
import { forgetPwd, getMessage } from "@/api/login";
import { removeToken } from "@/utils/auth";

export default {
  data() {
    const validatePassword1 = (rule, value, callback) => {
      if (value != this.form.password) {
        callback(new Error("两次密码不一样"));
      } else {
        callback();
      }
    };

    const form = {
      username: "",
      mobilePhone: "",
      randnumber: "",
      ticket: "",
      code: "",
      password: "",
      confirmpassword: ""
    };

    const rules = {
      username: [
        {
          required: true,
          message: "账号不能为空"
        }
      ],
      mobilePhone: [
        {
          required: true,
          pattern: /^1\d{10}$/,
          message: "请输入正确的手机号"
        }
      ],
      password: [
        {
          required: true,
          pattern: /^(?=.*[a-z])(?=.*\d)(?=.*[#@!~%^&*])[a-z\d#@!~%^&*]{8,30}$/i,
          message: "请输入8-30位的数字+字母+特殊符号",
          trigger: "blur"
        }
      ],
      confirmpassword: [
        {
          required: true,
          validator: validatePassword1
        }
      ],
      code: [
        {
          required: true,
          message: "短信验证码不能为空"
        }
      ]
    };
    return {
      form,
      form1: form,
      rules,
      dialogVisible: false,
      loading: false,
      select: "中国 +86",
      code: "",
      countdown: 0
    };
  },
  computed: {},
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
    handlerBack() {
      this.$router.push("/login");
    },
    handleCountdown() {
      if (this.countdown < 1) {
        return;
      }
      this.countdown = this.countdown - 1;
      setTimeout(this.handleCountdown, 1000);
    },
    handleSend() {
      if (!/^\d{11}$/.test(this.form.mobilePhone)) {
        this.$message.error("请输入正确的手机号码");
        return;
      }
      if (this.countdown > 0) {
        return;
      }
      this.countdown = 30;
      this.handleCountdown();
      const msgappId = "77F29216A67D434A8AE7A85A94A1A463";
      this.form.randnumber = (parseInt(Math.random() * 1000000) + "").padEnd(
        6,
        "0"
      );
      this.form.ticket = md5(
        msgappId + this.form.randnumber + this.form.mobilePhone
      );
      getMessage(this.form)
        .then(r => {
          this.$message.success(r.msg);
        })
        .catch(e => {
          this.countdown = 0;
        });
    },
    handleSubmit() {
      this.$refs.form.validate(v => {
        if (v) {
          this.loading = true;
          forgetPwd(this.form)
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
        }
      });
    }
  }
};
</script>

<style lang="scss" >
.pwdbox {
  height: 100%;
  background-image: url("../../../assets/image/login-background.jpg");
  background-size: 100% 100%;
  position: relative;
  .topbox {
    position: absolute;
    top: 50px;
    left: 100px;
    right: 50px;
    .logo {
      margin-bottom: 18px;
    }
    .line {
      height: 1px;
      background-image: linear-gradient(
        90deg,
        #ffffff 0%,
        rgba(0, 0, 0, 0) 100%
      );
    }
  }
  .pwd-main {
    width: 420px;
    margin: auto;
    background-color: #ffffff;
    box-shadow: 0px 0px 5px 0px #96a9ff;
    padding: 60px 0 30px;
    position: absolute;
    height: 540px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 5px;
    .pwdtitle {
      width: 166px;
      height: 50px;
      color: #fff;
      text-align: center;
      z-index: 111;
      position: absolute;
      top: -26px;
      left: 0;
      right: 0;
      margin: auto;
      line-height: 50px;
      .logintag {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        width: 166px;
      }
      span {
        position: relative;
        z-index: 1;
        font-size: 18px;
      }
    }
  }
  .el-form {
    padding: 0 40px;
    .el-form-item {
      margin-bottom: 20px;
      .el-form-item__content {
        .el-input--medium .el-input__inner {
          line-height: 46px !important;
          height: 46px !important;
        }
      }
      // &.is-error {
      //   .mobilePhoneinput {
      //     .el-input__inner:focus {
      //       border-left: 1px solid #ff4949;
      //     }
      //   }
      // }
    }
    .mobilePhoneinput {
      &.el-input--medium .el-input__inner {
        border-left: 1px solid #fff;
      }
    }
    .el-form-item.is-error
      .mobilePhoneinput.el-input--medium
      > .el-input__inner {
      border-left: 1px solid #ff4949;
    }
    .mobilePhoneinput .el-input__inner:focus {
      border-left: 1px solid #1890ff;
    }

    .codeinput {
      &.el-input--medium .el-input__inner {
        border-right: 1px solid #fff;
      }
    }
    .el-form-item.is-error .codeinput.el-input--medium > .el-input__inner {
      border-right: 1px solid #ff4949;
    }
    .codeinput .el-input__inner:focus {
      border-right: 1px solid #1890ff;
    }
    .el-input-group__append,
    .el-input-group__prepend {
      width: 110px;
      background: #fff;
    }
    .smbottombtn {
      margin: 15px 0 0px;
      text-align: center;
      color: #558cf7;
      span {
        cursor: pointer;
        font-size: 14px;
      }
    }
    .sendbtn {
      color: #fff;
    }
  }
  .btnbg {
    background-image: linear-gradient(90deg, #0072ff 0%, #5f95ff 100%);
    height: 46px;
    line-height: 46px;
    margin-top: 40px;
    padding: 0;
  }
}
@media screen and (max-width: 768px) {
  .pwdbox .pwd-main {
    width: 92% !important;
    border-radius: 20px;
  }
  .pwdbox {
    height: 100%;
    background-image: url("../../../assets/image/login-mbg.png");
    background-size: 100% 100%;
  }
}
</style>