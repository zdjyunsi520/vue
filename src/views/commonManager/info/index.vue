<template>
  <div class="app-container">
    <div class="bg-white containerbox">
      <el-scrollbar style="height:calc(100% - 80px)">
        <p class="form-smtitle">软件许可及服务协议</p>
        <editor class="xl-height" @input="handleContent" ref="editors" :value="content"></editor>
        <p class="form-smtitle">隐私政策</p>
        <editor class="xl-height" @input="handleContent1" ref="editors1" :value="content1"></editor>
        <p class="form-smtitle">注销协议</p>
        <editor class="xl-height" @input="handleContent2" ref="editors2" :value="content2"></editor>

      </el-scrollbar>
      <el-col :span="24" :xs="24" class="absolute-bottom">

        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check" @click="handleBack">保 存</el-button>
        </div>
      </el-col>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// import { updateInfo as update, getInfo as fetchList } from "@/api/version";
import Editor from "@/components/Editor";

export default {
  components: {
    Editor
  },
  data() {
    const form = {
      download: "",
      version: "",
      content: "",
      number: "",
      hotUrl: "",
      id: ""
    };
    const rules = {
      download: [{ required: true, trigger: "blur", message: "此处不能为空" }],
      number: [{ required: true, trigger: "blur", message: "此处不能为空" }],
      content: [{ required: true, trigger: "blur", message: "此处不能为空" }],
      hotUrl: [{ required: true, trigger: "blur", message: "此处不能为空" }]
    };
    return {
      form,
      form1: form,
      rules,
      loading: false,
      content: "",
      accept: "",
      percent: 0,
      status: undefined,
      dialogVisible: false
    };
  },
  computed: {
    title() {
      return this.form.id ? "修改" : "查看";
    }
  },
  methods: {
    handleOpen(data) {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
      } else this.getList(data);
    },

    getList(data) {
      fetchList(data).then(r => {
        Object.assign(this.form, r.data);
        this.content = r.data.content;
      });
    },
    handleContent(content) {
      this.form.content = content;
    },

    create(data) {
      this.form = Object.assign({}, this.form1, data);
    },
    handleSubmit() {
      this.$refs.form.validate(v => {
        if (v) {
          this.loading = true;

          var o = update;

          o(this.form)
            .then(res => {
              this.$message.success(res.msg);
              this.$emit("getList");
              this.handleOpen();
            })
            .finally(e => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.xl-height {
  display: inline-block;
  width: 80%;
  height: 400px;
}
/deep/.editor {
  height: 100%;
  //margin:0 20px;
}
.form-smtitle {
  margin: 20px 0;
}
</style>




