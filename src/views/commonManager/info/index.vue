<template>
  <div class="app-container">
    <div class="bg-white containerbox " style='position:relative'>
            
      <el-tabs v-model="activeName">
        <el-tab-pane label="软件许可及服务协议" name="0"></el-tab-pane>
        <el-tab-pane label="隐私政策" name="1"></el-tab-pane>
        <el-tab-pane label="注销协议" name="2"></el-tab-pane>
      </el-tabs>

      <el-scrollbar style="height:calc(100% - 80px)">
        <editor class="xl-height" @input="handleContent" v-if='activeName=="0"' ref="editors" :value="form.Licence"></editor>
        <editor class="xl-height" @input="handleContent1"  v-if='activeName=="1"' ref="editors1" :value="form.Privacy"></editor>
        <editor class="xl-height" @input="handleContent2"  v-if='activeName=="2"' ref="editors2" :value="form.Cancellation"></editor>

      </el-scrollbar>
      <el-col :span="24" :xs="24" class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check" @click="handleSubmit" :loading="loading">保 存</el-button>
        </div>
      </el-col>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// import { updateInfo as update, getInfo as fetchList } from "@/api/version";
import Editor from "@/components/Editor";
import { fetchList, update } from "@/api/commonManager/info";
export default {
  components: {
    Editor
  },
  data() {
    const rules = {
      download: [{ required: true, trigger: "blur", message: "此处不能为空" }],
      number: [{ required: true, trigger: "blur", message: "此处不能为空" }],
      content: [{ required: true, trigger: "blur", message: "此处不能为空" }],
      hotUrl: [{ required: true, trigger: "blur", message: "此处不能为空" }]
    };
    return {
      form: {},
      rules,
      loading: false,
      activeName:'0'
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  methods: {
    handleOpen(data) {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
      } else this.getList(data);
    },
    getList() {
      fetchList({}).then(r => {
        this.reset(r.data);
      });
    },
    handleContent(content) {
      this.form.Licence = content;
    },
    handleContent1(content) {
      this.form.Privacy = content;
    },
    handleContent2(content) {
      this.form.Cancellation = content;
    },
    reset(data) {
      this.form = Object.assign(
        {
          Licence: "",
          Privacy: "",
          Cancellation: ""
        },
        data
      );
    },
    handleSubmit() {
      this.loading = true;
      var o = update;
      o(this.form)
        .then(res => {
          this.$message.success(res.msg);
        })
        .finally(e => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.xl-height {
  display: inline-block;
  width: 100%;
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




