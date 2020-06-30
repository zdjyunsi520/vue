<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>

      <el-scrollbar class="marginright-fx">
        <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="80px" style="width:370px;">

          <el-form-item label="所属单位" prop="text" v-if="!form.id">
            <el-input v-model="form.text" placeholder="" :disabled="true" />
          </el-form-item>

          <el-form-item label="人员姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入人员姓名" />
          </el-form-item>

          <el-form-item label="手机号" prop="mobilephone">
            <el-input v-model="form.mobilephone" placeholder="请输入人员手机号" />
          </el-form-item>

          <el-form-item label="开通账号" prop="isopenaccount" v-if="!form.id">
            <el-switch v-model="form.isopenaccount" class="switchStyle switch-mx" style="width:60px" active-color="#56a7ff" inactive-color="#dddfe5" active-text="开通" inactive-text="不开通">
            </el-switch>
          </el-form-item>
          <el-form-item label="用户名" prop="username" v-if="form.isopenaccount">
            <el-input v-model="form.username" placeholder="请输入4-18位数字或字母" />
          </el-form-item>
          <el-form-item label="输入密码" prop="password" v-if="form.isopenaccount">
            <el-input v-model="form.password" placeholder="请输入8-30位数字+字母+特殊符号" type="password" auto-complete="new-password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmpassword" v-if="form.isopenaccount">
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
import { add, update } from "@/api/systemManager/user";
export default {
  data() {
    const rules = {
      text: [
        {
          required: true,
          message: ""
        }
      ],
      name: [
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,12}$/,
          required: true,
          message: "请输入12位以内的汉字或数字或字母",
          trigger: "blur"
        }
      ],
      username: [
        {
          required: true,
          pattern: /^[A-Za-z0-9]{4,18}$/,
          message: "请输入4-18位数字或字母",
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
      ],
      mobilephone: [
        {
          required: true,
          pattern: /^1\d{10}$/,
          message: "请输入正确的手机号",
          trigger: "blur"
        }
      ],
      isopenaccount: [
        {
          required: true,
          message: ""
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
    let { data, title } = this.$route.params;
    this.title = title;
    this.reset(data);
  },
  computed: {},
  methods: {
    selected(name) {
      this.form.iconurl = name;
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          text: "",
          tenantId: "",
          name: "",
          mobilephone: "",
          isopenaccount: false,
          id: "",
          username: "",
          password: "",
          confirmpassword: ""
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
          if (this.form.id) fn = update;
          else fn = add;
          fn(this.form)
            .then(response => {
              //消息提示
              var txt = this.form.id ? "编辑成功！" : "新增成功！";
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
/deep/.switchStyle.switch-mx {
  width: 70px !important;
}
/deep/.switchStyle.switch-mx .el-switch__core,
/deep/.el-switch.switch-mx .el-switch__label,
/deep/.switch-mx .el-switch__core {
  width: 80px !important;
}

/deep/.switch-mx .el-switch__label--left {
  left: 3px !important;
}
/deep/.switch-mx .el-switch__label--right {
  z-index: 9;
  left: -20px;
}
</style>