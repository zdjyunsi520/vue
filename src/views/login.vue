<template>
  <div class="login mobilewrap">
    <div class="login-main">
      <div class="smloginimg">
        <img src="../assets/image/img_electric_tower.png" class="img_electric">
        <img src="../assets/image/img_slogan.png" class="textimg1">
        <img src="../assets/image/img_text_white.png" class="textimg2">
      </div>
      <div class='m-logobox'>
        <svg-icon icon-class="logo" />
        <p><span>欢迎登录迅腾智慧能源云平台</span></p>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <h3 class="title"><img src="../assets/image/loginlogo.png"><span>欢迎登录<label>迅腾智慧能源云平台</label></span></h3>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="new-username" placeholder="请输入账号" clearable>
            <svg-icon slot="prefix" icon-class="ic_user" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" auto-complete="new-password" placeholder="请输入密码" clearable @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="ic_pwd" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
       
        <div class="smbottombtn">
          <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
          <span class="pwdbtn" @click="handlerFindpwd">
            <svg-icon icon-class="ic_find_out" style="font-size: 25px;vertical-align: middle;margin-right: 4px;" />找回密码</span>
        </div>
        <el-form-item style="width:100%;">
          <el-button :loading="loading" class="btnbg" size="medium" type="primary" style="width:100%;" @click="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>2019-2020 xuntengdl.com 版权所有 闽ICP备19017481号</span>
    </div>
  </div>
</template>

<script>
// import { getCodeImg } from "@/api/login";
import Base64 from "@/utils";
// import shortMessage from "@/components/ShortMessage";
// import { checkNeedSms } from "@/api/shortMessage";
import Cookies from "js-cookie";
export default {
  name: "Login",
  //components: { shortMessage },
  data() {
    return {
      needSms: false,
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        fromurl: "system"
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            message: "用户名不能为空"
          }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [
          {
            required: true,
            trigger: "change",
            message: "验证码不能为空"
          }
        ]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // checkNeedSms().then(res => {
    //   if (res.data) {
    //     this.needSms = true;
    //   } else {
    //     this.needSms = false;
    //     this.getCode();
    //   }
    // });
    this.getCookie();
  },
  methods: {
    setUserName() {
      this.$refs.loginForm.validateField("username", v => {
        if (v) {
          return;
        }
        const target = this.$refs.sms;
        target.form.userName = this.loginForm.username;
        target.getMessage();
      });
    },
    // getCode() {
    //   getCodeImg().then(res => {
    //     this.codeUrl = "data:image/gif;base64," + res.data.img;
    //     this.loginForm.uuid = res.data.uuid;
    //   });
    // },
    getCookie() {
      const rememberMe = Boolean(Cookies.get("rememberMe"));
      let username = "";
      let password = "";
      //  let fromurl = "";
      if (rememberMe) {
        username = Cookies.get("username");
        password = Base64.decode(Cookies.get("password"));
        //   fromurl = Base64.decode(Cookies.get("fromurl"));
        this.loginForm = Object.assign(this.loginForm, {
          username,
          password,
          rememberMe
          //     fromurl
        });
      }
    },
    // 找回密码
    handlerFindpwd() {
      this.$router.push("/findpwd");
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              if (this.loginForm.rememberMe) {
                Cookies.set("username", this.loginForm.username, {
                  expires: 30
                });
                Cookies.set(
                  "password",
                  Base64.encode(this.loginForm.password),
                  {
                    expires: 30
                  }
                );
                // Cookies.set("fromurl", Base64.encode(this.loginForm.fromurl), {
                //   expires: 30
                // });
                Cookies.set("rememberMe", this.loginForm.rememberMe, {
                  expires: 30
                });
              } else {
                Cookies.remove("username");
                Cookies.remove("password");
                Cookies.remove("rememberMe");
                //   Cookies.remove("fromurl");
              }

              this.loading = false;
              location.reload();

              // this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
              // this.getCode();
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  height: 100%;
  background-image: url("../assets/image/login-background.jpg");
  background-size: 100% 100%;
  position: relative;
  .login-main {
    padding: 45px;
    display: flex;
    height: 100%;
    justify-content: center;
    position: relative;
    align-items: center;
    .smloginimg {
      box-shadow: 0px 0px 8px 0px rgba(58, 58, 58, 0.25);
      border-radius: 5px 0 0 10px;
      overflow: hidden;
      position: relative;
      display: block;
      height: 100%;
      img.img_electric {
        width: 100%;
        height: 100%;
      }
      .textimg2 {
        position: absolute;
        bottom: 80px;
        right: 80px;
        width: 80%;
      }
      .textimg1 {
        position: absolute;
        top: 60px;
        left: 60px;
        width: 45%;
      }
    }
    .login-form {
      border-radius: 0 5px 10px 0;
      background: #ffffff;
      height: 100%;
      width: 586px;
      padding: 0 80px;
      .el-input {
        height: 46px;
        input {
          height: 46px;
          padding-left: 45px;
        }
      }
      .input-icon {
        height: 48px;
        width: 20px;
        margin-left: 10px;
      }
      .el-form-item {
        margin-bottom: 20px;
      }
      .el-checkbox__label {
        font-size: 12px;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #558cf7;
        font-size: 12px;
      }
    }
    .smbottombtn {
      margin-bottom: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span.pwdbtn {
        cursor: pointer;
        font-size: 12px;
        color: #558cf7;
      }
    }
  }
}
.title {
  margin: 50% auto 60px;
  img {
    margin-bottom: 30px;
    width: 120px;
    display: block;
  }
  font-size: 20px;
  font-weight: normal;
  color: #222836;
  label {
    font-weight: normal;
    color: #558cf7;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.btnbg {
  background-image: linear-gradient(90deg, #0072ff 0%, #5f95ff 100%);
  height: 46px;
  line-height: 46px;
  padding: 0;
}
  .m-logobox{display:none;}

@media screen and (max-width: 768px) {
  .login {
    height: 100%;
    background-image: url("../assets/image/login-mbg.png");
    background-size: 100% 100%;
  }
  .m-logobox{
    display:block;
    text-align: center;
    color: #fff;
    font-size: 20px;
    svg{
      font-size:70px;
    }
  }
  .login .login-main .smloginimg,.el-login-footer {
    display: none;
  }
  .login .login-main .smbottombtn{
    justify-content: flex-end;
  }
  .login .login-main .login-form {
    width: 100%;
    padding: 40px 20px 20px;
    border-radius: 20px;
    .title,.el-input__icon{
      display:none;
    }
    .el-input input{
      border: none;
      border-bottom: 1px solid #e0e0e0;
      border-radius: 0;
      padding-left:0px;
    }
    .smbottombtn>label{
      display:none
    }
   
  }
  .title {
    margin: 23% auto 60px;
  }
  .login .login-main {
    padding: 50px 20px 20px;flex-direction: column;
  }
  .btnbg{
     background-image: linear-gradient(90deg, #3280ff 0%, #3381ff 100%);
    box-shadow: 0px 10px 30px 0px #a6c6ff;
    border-radius: 5px;
  }
}
 @media screen and (max-width:1366px) {
     .title{
            margin: 31% auto 60px;
     }





 }

</style>
