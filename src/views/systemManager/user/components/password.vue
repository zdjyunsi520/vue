<template>
   <div class="app-container">
  <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>
    
      <el-scrollbar>
        <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="110px" :inline-message="true" style="width:600px">

          <el-form-item label="用户名" prop="username" v-if="!form.first">
            <el-input v-model="form.username" placeholder="请输入4-18位数字或字母" />
          </el-form-item>

          <el-form-item label="原密码" prop="oldpassword" v-else>
            <el-input v-model="form.oldpassword" placeholder="请输入原密码" type="password" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入8-30位数字+字母+特殊符号" type="password" auto-complete="new-password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmpassword">
            <el-input v-model="form.confirmpassword" placeholder="请输入8-30位数字+字母+特殊符号" type="password" auto-complete="new-password" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
          <el-button @click="handleOpen(null)">取 消</el-button>
        </div>
      </el-col>
  </div>
  </div>
</template>

<script>
import { createAccount as add } from "@/api/systemManager/user";
import { password as update } from "@/api/commonManager/user";
export default {
  data() {
    const rules = {
      username: [
        {
          required: true,
          pattern: /.{4,}$/,
          message: "用户名输入有误",
          trigger: "blur"
        }
      ],
      oldpassword: [
        {
          required: true,
          pattern: /.{10,}$/,
          message: "原密码输入有误",
          trigger: "blur"
        }
      ],
      password: [
        {
          required: true,
          pattern: /.{10,}$/,
          message: "新密码输入有误",
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
      ]
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: ""
    };
  },
  created() {
    let { data , title } = this.$route.params;
    this.title = title;
    this.reset(data);
  },
  computed: {},
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          id: "",
          oldpassword: "",
          password: "",
          confirmpassword: "",
          first: ""
        },
        data
      );
    },
    handleOpen(data) {
      this.$router.push({
        name: "/systemManager/user/index",
        params: {}
      });
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          let fn;
          if (this.form.first) fn = update;
          else fn = add;
          fn(this.form)
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