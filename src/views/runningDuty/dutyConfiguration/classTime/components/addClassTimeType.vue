<template>
  <el-dialog width="500px" :title="title+'班次类型'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" center>

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="班次类型" prop="name">
            <el-input v-model="form.name" placeholder="请输入班次类型" />
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
import { add, update } from "@/api/runningDuty/dutyConfiguration/classTimeType";
export default {
  data() {
    const rules = {
      name: [
        {
          required: true,
          message: "班次类型不能为空",
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
      roleList: []
    };
  },
  created() {},
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          //tenantId: "cb1618fe-0c4c-4cc9-bfb4-08f3a243d7af",
          name: ""
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
        this.$refs.form.clearValidate();
      }
      //表单重置
      this.reset(data);
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          const fn = this.form.id ? update : add;
          fn(this.form)
            .then(response => {
              this.msgSuccess(response.msg);
              this.$emit("getList");
              this.handleOpen();
            })
            .catch(r => {
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