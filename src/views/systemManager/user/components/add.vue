<template>
   <div class="app-container">
  <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>
    
      <el-scrollbar>
        <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="110px"  style="width:600px">

          <el-form-item label="所属单位" prop="text" v-if="!form.id">
            <el-input v-model="form.text" placeholder="" :disabled="true" />
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入人员姓名" />
          </el-form-item>

          <el-form-item label="预留手机号" prop="url">
            <el-input v-model="form.mobilephone" placeholder="请输入人员手机号" />
          </el-form-item>

          <el-form-item label="是否开通账号" prop="isopenaccount" v-if="!form.id">
            <el-switch v-model="form.isopenaccount" class="switchStyle switch-mx" style="width:60px" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="开通" inactive-text="不开通">
            </el-switch>
          </el-form-item>
          <el-form-item label="用户名" prop="username" v-if="form.isopenaccount">
            <el-input v-model="form.username" placeholder="请输入4-18位数字或字母" />
          </el-form-item>
          <el-form-item label="密码" prop="password" v-if="form.isopenaccount">
            <el-input v-model="form.password" placeholder="请输入8-30位数字+字母+特殊符号" type="password" auto-complete="new-password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmpassword" v-if="form.isopenaccount">
            <el-input v-model="form.confirmpassword" placeholder="请输入8-30位数字+字母+特殊符号" type="password" auto-complete="new-password" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary"  icon="el-icon-check" @click="handleSubmit" :loading="loading">保 存</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
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
      name: [
        {
          required: true,
          message: "姓名不能为空",
          trigger: "blur"
        }
      ],
      username: [
        {
          required: true,
          message: "用户名不能为空",
          trigger: "blur"
        }
      ],
      deptId: [
        {
          required: true,
          message: "归属分站不能为空",
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
          if (this.form.id) fn = update;
          else fn = add;
          fn(this.form)
            .then(response => {
              //消息提示
               var txt = this.form.id? '编辑成功！' : '新增成功！';
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