<template>
  <!-- 添加或修改分站对话框 -->
  <el-dialog :title="title" :visible.sync="open" width="600px" center>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
      <el-col :span="24">
            <el-form-item label="客服回复内容" prop="replyContent">
              <el-input
                v-model="form.replyContent"
                type="textarea"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="submitForm">确 定</el-button>
      <el-button :loading="loading" @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      list:null,
      open: false,
      form: {},
      operate:null,
      loading:false,
      // 表单校验
      rules: {
        replyContent: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ],
      }
    };
  },
  computed: {
  },
  created() {
  },
  methods: {
 
    // 表单重置
    reset() {
      this.form = {
        replyContent: "",
      };
      this.resetForm("form");
      this.loading=false
      this.open = !this.open
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading=true
          const data = this.list.map(v=>{
            const appealNo = v
            const replyContent = this.form.replyContent
            return {appealNo,replyContent}
          })
            this.operate(data).then(response => {
              this.$message.success(response.msg);
                this.open = false;
                this.$emit("getList");
            }).catch(()=>this.loading=false);
     
        }
      });
    },
    // 取消按钮
    cancel() {
      this.reset();
    }
  }
};
</script>

<style lang="scss" scoped></style>
