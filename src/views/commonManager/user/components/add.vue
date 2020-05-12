<template>
  <div class="app-container">
  <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>

        <el-form ref="form" :model="form" :rules="rules" label-width="110px" :inline-message="true" style="width:600px">

          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入8-30位数字+字母+特殊符号" type="password" auto-complete="new-password" />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmpassword">
            <el-input v-model="form.confirmpassword" placeholder="请输入8-30位数字+字母+特殊符号" type="password" auto-complete="new-password" />
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" auto-complete="off" />
          </el-form-item>

          <el-form-item label="预留手机号" prop="mobilephone">
            <el-input v-model="form.mobilephone" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>

        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check"   @click="handleSubmit" :loading="loading">确 定</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>
  </div>
  </div>
</template>

<script>
import { add } from "@/api/commonManager/user";
export default {
  data() {
    const rules = {
      username: [
        {
          required: true,
          message: "用户名不能为空",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          pattern: /.{10,}$/,
          message: "密码输入有误",
          trigger: "blur"
        }
      ],
      confirmpassword: [
        {
          required: true,
          pattern: /.{10,}$/,
          message: "确认密码输入有误",
          trigger: "blur"
        }
      ],

      name: [
        {
          required: true,
          message: "'请输入正确的姓名",
          trigger: "blur"
        }
      ],
      mobilephone: [
        {
          pattern: /^1\d{10}$/,
          message: "请输入正确的手机号码",
          trigger: "blur"
        }
      ]
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      // 角色选项
      roleOptions: [],
      deptType: ""
    };
  },
  created() {
    let { data , title } = this.$route.params;
    this.title = title;
    this.reset(data);
  },
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          username: "",
          name: "",
          password: "",
          confirmpassword: "",
          mobilephone: ""
        },
        data
      );
    },
    handleOpen(data) {
      this.$router.push({
        name: "/commonManager/user/index",
        params: {}
      });
      return;
      //改变窗口状态
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        //关闭窗口时取消按钮转圈圈
        this.loading = false;
      }
      //表单重置
      this.reset(data);
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          //添加用户
          add(this.form)
            .then(response => {
              //消息提示
              this.$message.success(response.msg);
              //刷新列表
              this.$emit("getList");
              //关闭窗口
              this.handleOpen();
            })
            .catch(r => {
              //取消按钮转圈圈
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-select {
  width: 100%;
}

/deep/.el-form-item__error--inline {
  position: absolute;
  top: 50%;
  margin-top: -10px;
  width: 100%;
}
</style>