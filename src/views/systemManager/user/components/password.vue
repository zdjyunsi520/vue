<template>
  <el-dialog width="500px" :title="title+'密码'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-row>
        <el-col :span="24" v-if="!form.first">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入4-18位数字或字母" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-else>
          <el-form-item label="原密码" prop="oldpassword">
            <el-input v-model="form.oldpassword" placeholder="请输入原密码" type="password" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入8-30位数字+字母+特殊符号" type="password" auto-complete="new-password" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="确认密码" prop="confirmpassword">
            <el-input v-model="form.confirmpassword" placeholder="请输入8-30位数字+字母+特殊符号" type="password" auto-complete="new-password" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </div>
    <!-- 添加或修改参数配置对话框 end -->
  </el-dialog>
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
  created() {},
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
      //改变窗口状态
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        //关闭窗口时取消按钮转圈圈
        this.loading = false;
      }
      //表单重置
      this.reset(data);
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
</style>