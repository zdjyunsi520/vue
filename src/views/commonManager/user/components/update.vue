<template>
  <div class="search-box" style="height:100%;position: relative;padding-bottom:90px">
    <el-row>
      <el-col :span="8">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px" inline-message="true">

          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" :disabled="true" />
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>

          <el-form-item label="预留手机号" prop="mobilephone">
            <el-input v-model="form.mobilephone" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>

        </el-form>
        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
          <el-button @click="handleOpen(null)">取 消</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { update } from "@/api/commonManager/user";
export default {
  data() {
    const rules = {
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
      title: ""
    };
  },
  created() {
    const data = this.$route.params.data;
    this.reset(data);
  },
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          id: "",
          username: "",
          name: "",
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