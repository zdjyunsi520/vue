<template>
  <!-- 充值信息填写 -->
  <el-dialog width="800px" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
    <el-form ref="form" :model="form">
      <el-form-item label="反馈ID">
        {{form.id}}
      </el-form-item>
      <el-form-item label="回复内容" prop="creditLev">

        <el-input v-model="form.replyContent" type="textarea" :col="5"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="warning" @click="handleSubmit">提交</el-button>

      <el-button @click="handleOpen">取消</el-button>
    </div>
  </el-dialog>
  <!-- 充值信息填写 -->
</template>

<script>
import { reply } from '@/api/feedBack';
export default {
  data() {
    const form = {
      isReply: 1,
      id: '',
      replyContent: ''
    };

    return {
      form: {},
      form1: form,
      dialogVisible: false,
      loading: false
    };
  },
  created() {},
  methods: {
    resetForm() {
      Object.assign(this.form, this.form1);
    },
    handleOpen() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.resetForm();
        this.loading = false;
      }
    },
    handleSubmit() {
      this.loading = true;
      if (this.form.replyContent == '') {
        this.$message.error('请填写回复信息');
        this.loading = false;
        return;
      }
      var o = reply;
      o(this.form)
        .then(res => {
          this.$emit('getList');
          this.$message.success(res.msg);
          this.handleOpen();
        })
        .catch(e => {
          this.loading = false;
        });
    }
  },
  computed: {
    title() {
      return '意见反馈回复';
    }
  }
};
</script>

<style lang="scss" scoped>
</style>