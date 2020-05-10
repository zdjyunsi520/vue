<template>
  <el-dialog width="500px" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备类型" prop="type">
            <el-select v-model="form.type" clearable size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in equipmentType" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="设备编码" prop="serialcode">
            <el-input v-model="form.serialcode" placeholder="请输入设备编码" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备校验码" prop="checkcode">
            <el-input v-model="form.checkcode" placeholder="烟感、摄像头必填" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
                    <el-form-item label="设备校验码" prop="remark">
                        <el-input v-model="form.remark" placeholder="请输入手机号" />
                    </el-form-item>
                </el-col> -->
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
import { add } from "@/api/commonManager/equipment";
import { mapGetters } from "vuex";
export default {
  data() {
    const rules = {
      type: [
        {
          required: true,
          message: "此处不能为空",
          trigger: "blur"
        }
      ],
      serialcode: [
        {
          required: true,
          message: "此处不能为空",
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
  created() {},
  computed: {
    ...mapGetters({ equipmentType: "status/equipmentType" })
  },
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          type: "",
          serialcode: "",
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
      }
      //表单重置
      this.reset(data);
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.type == 4 || this.form.type == 5) {
            if (this.form.checkcode == "") {
              this.$message.error("请输入设备校验码");
              return;
            }
          }
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
</style>