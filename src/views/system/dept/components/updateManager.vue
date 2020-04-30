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
            label="登录账号"
            prop="loginName"
          >
            <el-input :disabled="form.id!=''"
              v-model="form.loginName"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="登录密码"
            prop="password"
          >
            <el-input
              v-model="form.password"
              placeholder=""
            />
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
          <el-form-item label="开户行" prop="bindName">
            <el-input
              v-model="form.bindName"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="卡号" prop="bindBankNumber">
            <el-input v-model="form.bindBankNumber" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户人" prop="bindBankName">
            <el-input v-model="form.bindBankName" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="提现密码" prop="bindPassword">
            <el-input v-model="form.bindPassword" placeholder="" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否可提现" prop="isWithdraw">
             <el-radio-group v-model="form.isWithdraw">
    <el-radio :label="1">是</el-radio>
    <el-radio :label="0">否</el-radio>
  </el-radio-group>
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
import { updateManagerInfo as updateDept ,addManagerInfo as addDept } from "@/api/system/dept";
import { mapGetters, mapActions } from "vuex";
import { validMoney } from "@/utils/validate";
import { listRole } from "@/api/system/role";
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
      roleOptions:null,
      // 表单校验
      rules: {
        deptId: rule,
        loginName: rule,
        name: rule,
      //  password:rule
      }
    };
  },
  created(){
    this.getRoles()
  },
  computed: {
    ...mapGetters({ path: "imgOSS/path" ,deptType:'status/deptType'})
  },
  methods: {
    ...mapActions({ ossUpload: "imgOSS/ossUpload" }),
    getRoles() {
      listRole().then(response => {
        this.roleOptions = response.data.filter(v => v.status == 0);
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id:'',
        deptId:'',
        bindBankName: "",
        bindBankNumber: "",
        bindName: "",
        bindPassword: "",
        isWithdraw: 1,
        loginName: "",
        name: "",
        password: "",
        phone: "",
       // sex: 2,
        //roleId:''
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id) {
            updateDept(this.form).then(response => {
                this.msgSuccess(response.msg)
                this.open = false;
                this.$emit("getList");
              
            })
          } else {
          if(this.form.password){
            addDept(this.form).then(response => {
                this.msgSuccess(response.msg);
                this.open = false;
                this.$emit("getList");
           
            });
             }else{
              this.$message.error('请填写密码')
            }
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
