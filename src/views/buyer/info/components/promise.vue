<template>
  <el-row>
    <!-- 充值信息填写 -->
    <el-dialog width="800px" title="担保审核" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="买手ID">
          {{form.id}}
        </el-form-item>
        <el-form-item label="买手姓名">
         {{form.realName}}
        </el-form-item>
          <el-form-item label="手机号">
        {{form.buyerAccount}}
        </el-form-item>
        <el-form-item label="图片证据">
          <el-upload class="xl-limit-width" action="#" :accept="accept" :on-exceed="handleExceed" :limit="1" list-type="picture-card" :auto-upload="true" :http-request="uploadOSSIMG" :file-list="imageList">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="path + file.url" alt />
              <span class="el-upload-list__item-actions">
                <span v-if="!disabled" class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span v-if="disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                  <i class="el-icon-download"></i>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>

        </el-form-item>
        <el-form-item class="xl-text-align">
          <el-tag type="danger">最多上传1张图片</el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="warning" @click="handleSubmit">提交</el-button>
        <el-button @click="handleOpen">取消</el-button>
      </div>
    </el-dialog>
    <!-- 充值信息填写 -->
    <el-dialog :visible.sync="dialogVisible1">
      <img width="100%" :src="path+dialogImageUrl" alt />
    </el-dialog>
  </el-row>

</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { promise } from '@/api/buyer';

export default {
  data() {
    const form = {
      id: '',
      realName: '',
      buyerAccount: '',
      certificate:''
    };
    const rules = {
      appealContent: [
        { required: true, trigger: 'blur', message: '这里不能为空' }
      ],
      orderNo: [{ required: true, trigger: 'blur', message: '这里不能为空' }],
      type: [{ required: true, trigger: 'blur', message: '请选择申诉类型' }]
    };
    return {
      form,
      form1: form,
      rules,
      dialogVisible: false,
      loading: false,
      dialogVisible1: false,
      imageList: [],
      disabled: false,
      dialogImageUrl: null,
      accept: '.jpg,.png,.jpeg'
    };
  },
  created() {
    this.create()
  },
  methods: {
    ...mapActions({ ossUpload: 'imgOSS/ossUpload' }),
    create() {
      this.form = Object.assign({}, this.form1);
      this.imageList = [];
    },
    handleExceed() {
      this.$message.error('图片最多1张哦');
    },
    handleOpen() {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
        this.create();
      }
    },
    uploadOSSIMG(params) {
      const file = params.file;
      const accept = this.accept;
      this.ossUpload({ file, accept })
        .then(r => {
          this.imageList.push({ name: file.name, url: r });
        })
        .catch(e => {
          this.$message.error('图片上传失败请重新上传');
        });
    },
    handleSubmit() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.imageList.length ==0) {
            this.$message.error('请先上传担保图片')
            return
          }
            this.form.certificate = this.imageList[0].url;
          this.loading = true;
          var o = promise;

          o(this.form)
            .then(res => {
              this.$message.success(res.msg);
              this.handleOpen();
              this.$emit('getList');
            })
            .catch(e => {
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      });
    },
    handleRemove(file) {
      var index = -1;
      this.imageList.some((v, i) => {
        if (v.url == file.url) {
          index = i;
          return true;
        }
      });
      this.imageList.splice(index, 1);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible1 = true;
    },
    handleDownload(file) {}
  },
  computed: {
    ...mapGetters({
      path: 'imgOSS/path'
    })
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-form-item__label {
  width: 30%;
}
/deep/.el-input,
/deep/.el-select,
/deep/.el-textarea {
  width: 43%;
  /deep/.el-input__inner {
    width: 100%;
  }
  .el-input {
    width: 100%;
  }
}
/deep/.el-form-item__error {
  left: 45%;
}
.xl-width-150 {
  width: 100px;
}
.xl-text-align {
  padding-left: 245px;
}
/deep/.el-dialog__body {
  padding-bottom: 0;
}
.xl-limit-width{
  width:160px;
  height: 160px;
  overflow:hidden;
}
</style>