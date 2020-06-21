<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>

      <el-scrollbar class="marginright-fx">
        <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="80px" :inline-message="true" style="max-width:370px;">
          <el-form-item label="旧密码" prop="oldpassword">
            <el-input v-model="form.oldpassword" placeholder="请输入旧密码" type="password" auto-complete="new-password" />
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入8-30位数字+字母+特殊符号" type="password" auto-complete="new-password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmpassword">
            <el-input v-model="form.confirmpassword" placeholder="请输入8-30位数字+字母+特殊符号" type="password" auto-complete="new-password" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            <svg-icon icon-class='ic_save' class='tablesvgicon'></svg-icon>保 存
          </el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>

      </el-col>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { password as update } from "@/api/commonManager/user";
export default {
  data() {
    const rules = {
      oldpassword: [
        {
          required: true,
          pattern: /^(?=.*[a-z])(?=.*\d)(?=.*[#@!~%^&*])[a-z\d#@!~%^&*]{8,30}$/i,
          message: "请输入8-30位的数字+字母+特殊符号",
          trigger: "blur"
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
          pattern: /^(?=.*[a-z])(?=.*\d)(?=.*[#@!~%^&*])[a-z\d#@!~%^&*]{8,30}$/i,
          message: "请输入8-30位的数字+字母+特殊符号",
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
      deptType: "",
      fromurl: ""
    };
  },
  created() {
    let { data, title, fromurl } = this.$route.params;
    this.title = title ? title : "编辑密码";
    this.fromurl = fromurl;
    this.reset(data);
  },
  computed: {
    ...mapGetters(["userId"])
  },
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          id: "",
          oldpassword: "",
          password: "",
          confirmpassword: "",
          username: ""
        },
        data
      );
      if (this.form.id == "") {
        this.form.id = this.userId;
      }
    },
    handleOpen() {
      const fromurl = this.fromurl || "/commonManager/user/index";
      this.$router.push({
        name: fromurl,
        params: {}
      });
      return;
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          //添加用户
          update(this.form)
            .then(response => {
              //消息提示
              this.$message.success("编辑成功！");
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