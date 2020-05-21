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
        <el-form-item prop="phone">
          <el-input placeholder="请输入手机号" v-model="form.phone" class="input-with-select phoneinput">
            <el-select v-model="select" slot="prepend" placeholder="请选择" style="color: #333;">
              <el-option label="中国 +86" value="中国 +86"></el-option>
            </el-select>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input v-model="form.code" autocomplete="off" placeholder="请填写验证码" class="codeinput">
            <template slot="append">
              <el-button type="text" class="sendbtn" @click="handleSend">发送验证码</el-button>
            </template>

          </el-input>
          <!-- <short-message ref="sms" @validatePhone="validatePhone"></short-message> -->
        </el-form-item>
        <el-form-item prop="newBindPassword">
          <el-input type="password" v-model="form.newBindPassword" autocomplete="off" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item prop="againBindPassword">
          <el-input type="password" v-model="form.againBindPassword" autocomplete="off" placeholder="请再次确认新密码"></el-input>
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
      phone: "",
      sts: 0,
      newBindPassword: "",
      againBindPassword: "",
      userName: ""
    };

    const rules = {
      phone: [{ required: true, trigger: "blur", message: "手机不能为空" }],
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
      loading: false,
      select: "中国 +86"
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
    handlerBack() {
      this.$router.push("/login");
    },
    handleSend() {},
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
    height: 480px;
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
    }
    // .phoneinput {
    //   &.el-input--medium .el-input__inner {
    //     border-left: none;
    //   }
    // }
    // .codeinput {
    //   &.el-input--medium .el-input__inner {
    //     border-right: none;
    //   }
    // }
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
      color: #558cf7;
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
    width: 100% !important;
  }
}
</style>