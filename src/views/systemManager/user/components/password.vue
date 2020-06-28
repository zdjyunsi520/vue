<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>

      <el-scrollbar class="marginright-fx">
        <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="80px" :inline-message="true" style="width:370px;">

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
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            <svg-icon icon-class='ic_save' class='tablesvgicon savesvgicon'></svg-icon>保 存
          </el-button>
          <el-button @click="handleOpen(null)">
            <svg-icon icon-class='ic_goback' class='tablesvgicon'></svg-icon>返 回
          </el-button>
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
          pattern: /^[A-Za-z0-9]{4,18}$/,
          message: "请输入4-18位数字或字母",
          trigger: "blur"
        }
      ],
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
      title: ""
    };
  },
  created() {
    let { data, title } = this.$route.params;
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
          first: "",
          tenantId: "",
          text: ""
        },
        data
      );
    },
    handleOpen() {
      const data = { id: this.form.tenantId, text: this.form.text };
      this.$router.push({
        name: "/systemManager/user/index",
        params: { data }
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
              var txt = this.form.first ? "编辑成功！" : "新增成功！";
              this.$message.success(txt);
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