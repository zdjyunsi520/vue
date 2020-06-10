<template>
  <div class="app-container">
    <div class="search-box " >
            
      <el-tabs v-model="activeName">
        <el-tab-pane label="软件许可及服务协议" name="0"></el-tab-pane>
        <el-tab-pane label="隐私政策" name="1"></el-tab-pane>
        <el-tab-pane label="注销协议" name="2"></el-tab-pane>
        <el-tab-pane label="公司简介" name="3"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="bg-white containerbox " style='position:relative'>
      <el-scrollbar style="height:calc(100% - 80px)">
        <el-form ref="form" :model="form"  :rules="rules"   style="padding-right: 0px;">
            <el-form-item prop="licence" v-show='activeName=="0"'>
              <editor class="xl-height" @input="handleContent"  ref="editors" :value="form.licence"></editor>
            </el-form-item>
            <el-form-item prop="privacy" v-show='activeName=="1"'>
              <editor class="xl-height" @input="handleContent1"  ref="editors1" :value="form.privacy"></editor>
            </el-form-item>
            <el-form-item prop="cancellation" v-show='activeName=="2"' >
              <editor class="xl-height" @input="handleContent2"  ref="editors2" :value="form.cancellation"></editor>
            </el-form-item>
            <el-form-item prop="introduction" v-show='activeName=="3"'>
              <editor class="xl-height" @input="handleContent3"  ref="editors3" :value="form.introduction"></editor>
            </el-form-item>
         </el-form>

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
import Editor from "@/components/Editor";
import { fetchList, update } from "@/api/commonManager/info";
export default {
  components: {
    Editor
  },
  data() {
    const rules = {
      licence: [{ required: true, trigger: "blur", message: "此处不能为空" }],
      privacy: [{ required: true, trigger: "blur", message: "此处不能为空" }],
      cancellation: [{ required: true, trigger: "blur", message: "此处不能为空" }],
      introduction: [{ required: true, trigger: "blur", message: "此处不能为空" }]
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
        let form = r.data;
        this.form.licence = form.Licence;
        this.form.privacy = form.Privacy;
        this.form.cancellation = form.Cancellation;
        this.form.introduction = form.Introduction;
        
        this.reset(this.form);
        
      });
    },
    handleContent(content) {
      this.form.licence = content;
    },
    handleContent1(content) {
      this.form.privacy = content;
    },
    handleContent2(content) {
      this.form.cancellation = content;
    },
    handleContent3(content) {
      this.form.introduction = content;
    },
    reset(data) {
      this.form = Object.assign(
        {
          licence: "",
          privacy: "",
          cancellation: "",
          introduction: "",
        },
        data
      );
    },
    handleSubmit() {
      if(this.form.licence==''){
        this.$message.error("软件许可及服务协议不能为空！");
        this.activeName='0';
        return ;
      }
      if(this.form.privacy==''){
        this.$message.error("隐私政策不能为空！");
        this.activeName='1';
        return ;
      }
      if(this.form.cancellation==''){
        this.$message.error("注销协议不能为空！");
        this.activeName='2';
        return ;
      }
      if(this.form.introduction==''){
        this.$message.error("公司简介不能为空！");
        this.activeName='3';
        return ;
      }
      this.$confirm(
        '是否确认保存内容?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(v => {
          this.loading = true;
          var o = update;
          o(this.form)
            .then(res => {
              this.$message.success("保存成功！");
          }).finally(e => {
            this.loading = false;
          });
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
/deep/.search-box{border-bottom:0}
</style>




