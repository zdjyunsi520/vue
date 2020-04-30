<template>
  <!-- 添加或修改分站对话框 -->
  <el-dialog :title="title" :visible.sync="open" width="700px" center  :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="管理人姓名" prop="name">
            <el-input
              v-model="form.name"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="归属分站" prop="deptId">
              <el-select v-model="form.deptId" clearable size="small">
                <el-option label="所属站点" value="" />
                <el-option
                  :key="item.deptName"
                  :label="item.deptName"
                  :value="item.deptId"
                  v-for="item in deptType"
                />
              </el-select>
            </el-form-item>
          </el-col>

        <el-col :span="12">
          <el-form-item
            label="联系电话"
            prop="phone"
          >
            <el-input
              v-model="form.phone"
              placeholder=""
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="开户行" prop="bankName">
            <el-input
              v-model="form.bankName"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="卡号" prop="bankNumber">
            <el-input v-model="form.bankNumber" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户人" prop="bindBankName">
            <el-input v-model="form.bindBankName" placeholder="" />
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
import { updateCashOutInfo as updateDept ,addCashOutInfo as addDept } from "@/api/system/dept";
import { mapGetters, mapActions } from "vuex";
import { validMoney } from "@/utils/validate";
export default {
  data() {
    const rule = [
      {
        required: true,
        trigger: "blur",
        validator: (rule, value, callback) => {
          if (value) {
            callback();
          } else {
            callback(new Error("这里输入的不正确"));
          }
        }
      }
    ];
    return {
      accept: ".jpg,.png,.jpeg",
      show: false,
      goodsImgUrl: "",
      title: "",
      open: false,
      form: {},
      // 表单校验
      rules: {
        deptId: rule,
        loginName: rule,
        name: rule,

      }
    };
  },
  computed: {
    ...mapGetters({ path: "imgOSS/path" ,deptType:'status/deptType'})
  },
  methods: {
    ...mapActions({ ossUpload: "imgOSS/ossUpload" }),
    // 表单重置
    reset() {
      this.form = {
        id:'',
        deptId:'',
        bankName: "",
        bankNumber: "",
        bindBankName: "",
        name: "",
        phone: "",
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id) {
            updateDept(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.$emit("getList");
              } else {
                this.msgError(response.msg);
              }
            })
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
    }
  }
};
</script>

<style lang="scss" scoped></style>
