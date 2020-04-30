<template>
  <!-- 充值信息填写 -->
  <el-dialog width="800px" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
    <el-form ref="form" :model="form">
      <el-form-item label="ID">
        {{bindAccountName}}
      </el-form-item>
      <el-form-item label="原因" prop="creditLev">

        <el-input v-model="form.note" type="textarea" :col="5"></el-input>
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
export default {
  data() {
    const form = {
      auditState: 0,
      id: 0,
      note: ''
    };

    return {
      form,
      dialogVisible: false,
      loading: false,
      controlIndex: 0,
      titleList: ['兑现拒绝'],
      bindAccountName: '',
      review: null
    };
  },
  props: ['reason'],
  created() {},
  methods: {
    handleOpen() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
      }
    },
    handleSubmit() {
      this.loading = true;
      if (this.form.note == '') {
        this.$message.error('请填写操作原因');
        this.loading = false;
        return;
      }
      var o = this.review;
      this.form.auditState = 4;
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
      return '' + this.titleList[this.controlIndex];
    }
  }
};
</script>

<style lang="scss" scoped>
</style>