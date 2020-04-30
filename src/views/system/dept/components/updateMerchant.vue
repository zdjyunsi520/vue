<template>
  <!-- 添加或修改分站对话框 -->
  <el-dialog :title="title" :visible.sync="open" width="600px" center  :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-row>
        <!-- <el-col :span="24">
          <el-form-item label="商家域名" prop="merSideServerName">
            <el-input v-model="form.merSideServerName" placeholder="" />
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="QQ1" prop="merServerQq">
            <el-input v-model="form.merServerQq" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="QQ2" prop="rechargeServerQq">
            <el-input
              v-model="form.rechargeServerQq"
              controls-position="right"
            />
          </el-form-item>
        </el-col>
<el-col :span="24">
          <el-form-item label="微信客服二维码" prop="wxPicUrl">
            <el-upload
              :accept="accept"
              :auto-upload="true"
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="file => uploadOSSIMG1.call(this, file)"
            >
              <img v-show="show1" :src="path + form.wxPicUrl" class="avatar" />
              <i v-show="!show1" class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-tag>推荐尺寸160x160</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="logo" prop="indexLogo">
            <el-upload
              :accept="accept"
              :auto-upload="true"
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :http-request="file => uploadOSSIMG.call(this, file)"
            >
              <img v-show="show" :src="path + form.indexLogo" class="avatar" />
              <i v-show="!show" class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-tag>推荐尺寸180x50</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateMerchant as updateDept } from "@/api/system/dept";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      accept: ".jpg,.png,.jpeg",
      show: false,
      show1:false,
      goodsImgUrl: "",
      title: "",
      open: false,
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级分站不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "分站名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        deptLeader: [
          { required: true, message: "分站拥有者不能为空", trigger: "blur" }
        ],
        backSideServerName: [
          { required: true, message: "后台域名不能为空", trigger: "blur" }
        ],
        exSideServerName: [
          { required: true, message: "推广域名不能为空", trigger: "blur" }
        ],
        merSideServerName: [
          { required: true, message: "商家域名不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({ path: "imgOSS/path" })
  },
  methods: {
    ...mapActions({ ossUpload: "imgOSS/ossUpload" }),
    // 表单重置
    reset() {
      this.form = {
        deptId: "",
        deptName: "",
        merServerQq: "",
        rechargeServerQq: "",
        indexLogo: "",
        wxPicUrl:''
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != "") {
            updateDept(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.$emit("getList");
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDept(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.$emit("getList");
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    uploadOSSIMG(params) {
      const file = params.file;
      const accept = this.accept;
      this.ossUpload({ file, accept })
        .then(r => {
          this.form.indexLogo = r;
          this.show = true;
        })
        .catch(e => {
          e = e || "图片上传失败请重新上传";
          this.$message.error(e);
        });
    },
    uploadOSSIMG1(params) {
      const file = params.file;
      const accept = this.accept;
      this.ossUpload({ file, accept })
        .then(r => {
          this.form.wxPicUrl = r;
          this.show1 = true;
        })
        .catch(e => {
          e = e || "图片上传失败请重新上传";
          this.$message.error(e);
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
