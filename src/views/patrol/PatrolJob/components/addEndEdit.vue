<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="550px" center top="2vh">
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="140px"
      size="medium"
      style="padding-right:5%"
    >
      <el-form-item label="巡视单位" prop="TenantId">
        <el-select v-model="form.TenantId" placeholder="请选择巡视单位" style="width:100%">
          <el-option
            v-for="(item,index) in TenantIds"
            :key="index"
            :label="item.text"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="patroladdress">
        <el-input v-model="form.patroladdress" placeholder="请输入地址"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contactusername">
        <el-input v-model="form.contactusername" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactphone">
        <el-input v-model="form.contactphone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="巡视日期" prop="PatrolTime">
        <el-date-picker
          v-model="form.PatrolTime"
          type="date"
          placeholder="请选择日期"
          style="width:100%"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="巡视人员" prop="PatrolUserId">
        <el-input v-model="form.PatrolUserId"></el-input>
      </el-form-item>
      <el-form-item label="巡视人员联系电话" prop="patroluserphone">
        <el-input v-model="form.patroluserphone"></el-input>
      </el-form-item>
      <el-form-item label="巡视成员" prop="patrolmemberids">
        <el-input placeholder="请选择巡视成员" v-model="form.patrolmemberids"></el-input>
      </el-form-item>
      <el-form-item label="巡视内容" prop="patrolscope">
        <el-input type="textarea" :rows="4" placeholder="请输入巡视内容" v-model="form.patrolscope"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
        <el-button type="primary" plain @click="dialogVisible=false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { createPatrolJob,detailPatrolJob,modifyPatrolJob} from "@/api/patrol";
export default {
  props: {
    isEdit: Boolean
  },
  data() {
    return {
      form: {},
      rules: {
          TenantId: [
            { required: true, message: '请选择巡视单位', trigger: 'change' },
          ],
          PatrolUserId: [
            { required: true, message: '请请选择巡视人员', trigger: 'change' }
          ],
          PatrolTime: [
            { required: true, message: '请选择巡视日期', trigger: 'change' }
          ],
      },
      dialogVisible: false,
      loading: true,
      title: "",
      form: {},
      TenantIds:[],
      
    };
  },
  created() {
  },
  methods: {
   
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          ptrolnature:2,
          TenantId:'',
          patroladdress:'',
          contactusername:'',
          contactphone:'',
          PatrolTime:'',
          PatrolUserId:'',
          patroluserphone:'',
          patrolmemberids:'',
          patrolscope:'',
          confirmuserid:'',
          confirmuserphone:'',
        },
        data
      );
    },
    getInfo(data) {
      this.loading = true;
      if (data) {
        const id = {id:data.Id};
        if (id) {
          detailPatrolJob(id).then(res => {
              this.reset(data);
              this.form = res.data;
            })
            .finally(v => (this.loading = false));
        }
      } else {
        this.loading = false;
        this.reset(data);
        this.$nextTick(()=>{
            this.$refs.form.clearValidate();
        })
      }
    },
    handleOpen(data) {
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        this.loading = false;
      }
      //表单重置
      this.getInfo(data);
    },
    /** 提交按钮 */
    handleSubmit() {
      console.log(2222,this.form.PatrolTime)
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
            //添加用户
            const form = {
                "tenantId":this.form.TenantId,
                "ptrolnature":2,
                "patroladdress":this.form.patroladdress,
                "contactusername":this.form.contactusername,
                "contactphone":this.form.contactphone,
                "patroltime":this.form.PatrolTime,
                "patroluserid":"0ddcc0dd-ea50-4d8d-a64e-e3c7205f1217",
                "patroluserphone":this.form.patroluserphone,
                "patrolmemberids":this.form.patrolmemberids,
                "patrolscope":this.form.PatrolScope,
                "confirmuserid":this.form.confirmuserid,
                "confirmuserphone":this.form.confirmuserphone
            };
          if (this.form.Id != undefined) {
            //保存修改
            form.id = this.form.Id;
            modifyPatrolJob(form).then(response => {
                this.msgSuccess(response.msg);
                this.$emit("getList");
                this.handleOpen();
              })
              .catch(r => {
                //取消按钮转圈圈
                this.loading = false;
              });
          } else {
            createPatrolJob(form).then(response => {
                this.msgSuccess(response.msg);
                this.$emit("getList");
                this.handleOpen();
              })
              .catch(r => {
                this.loading = false;
              });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-select {
  width: 100%;
}
</style>