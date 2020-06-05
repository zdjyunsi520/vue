<template>
  <el-dialog width="500px" :title="title+'班次'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" center>

    <!-- 添加或编辑参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="角色" prop="name">
            <el-input v-model="form.name" placeholder="请输入角色" />
          </el-form-item>

          <el-form-item label="最少人数" prop="minpersoncount">
            <el-input-number v-model="form.minpersoncount" :min="1" :max="99" controls-position="right" />
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">保 存</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </div>
    <!-- 添加或编辑参数配置对话框 end -->
  </el-dialog>
</template>

<script>
import { add, update } from "@/api/runningDuty/dutyConfiguration/role";
export default {
  data() {
    const rules = {
      name: [
        {
          required: true,
          message: "请输入角色",
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
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          name: "",
          charatypeId: "",
          minpersoncount: 1,
          remark: ""
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
               var txt = this.form.id ? '编辑成功！' : '新增成功！';
              this.$message.success(txt);
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