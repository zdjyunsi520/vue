<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="500px" center top="10vh">
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="110px"
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
      <el-form-item label="巡视周期(天)" prop="CycleDay">
        <el-input v-model="form.CycleDay" placeholder="请输入天数"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="StartTime">
        <el-date-picker
          v-model="form.StartTime"
          type="date"
          placeholder="请选择日期"
          style="width:100%"
         
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="巡视人员" prop="patroluserid">
        <el-select v-model="form.patroluserid" placeholder="请选择巡视人员" style="width:100%">
          <el-option
            v-for="(item,index) in patrolusers"
            :key="index"
            :label="item.text"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="巡视成员" prop="PatrolMemberName">
        <el-select v-model="form.PatrolMemberName" placeholder="请选择巡视成员" multiple style="width:100%">
          <el-option
            v-for="(item,index) in patrolusers"
            :key="index"
            :label="item.text"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="巡视内容" prop="PatrolScope">
        <el-input type="textarea" :rows="4" placeholder="请输入巡视内容" v-model="form.PatrolScope"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
        <el-button type="primary" plain @click="dialogVisible=false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { createPatrolCycle, modifyPatrolCycle,detailPatrolCycle } from "@/api/patrol";
import { getGetEmployee} from "@/api/org";
export default {
  props: {
    isEdit: Boolean
  },
  data() {
    return {
      form: {},
      rules: {
        TenantId: [
          { required: true, message: "请选择巡视单位", trigger: "change" }
        ],
        CycleDay: [{ required: true, message: "请输入天数", trigger: "blur" }],
        StartTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        patroluserid: [
          { required: true, message: "请选择巡视人员", trigger: "change" }
        ]
      },
      dialogVisible: false,
      loading: true,
      title: "",
      form: {},
      patrolusers:[],
    };
  },
  created() {
      this.getGetEmployees();
  },
  methods: {
    // 巡视人员
    getGetEmployees(){
      getGetEmployee().then(response => {
         this.patrolusers=response.data;
      }).catch(error => {
        console.log(error); 
      });
    },
      
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id:undefined,
          TenantId: "",
          CycleDay: "",
          StartTime: "",
          patroluserid: "",
          PatrolMemberName: "",
          PatrolScope: ""
        },
        data
      );
    },
    getInfo(data) {
      this.loading = true;
      if (data) {
        const id = {id:data.Id};
        if (id) {
          detailPatrolCycle(id).then(res => {
              this.reset(data);
              this.form = res.data;
              this.form.StartTime = new Date(res.data.StartTime).getTime();
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
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
            //添加用户
            const form = {
                "tenantid":this.form.TenantId,
                "cycleday":this.form.CycleDay,
                "starttime":this.form.StartTime,
                "patroluserid":"0ddcc0dd-ea50-4d8d-a64e-e3c7205f1217",
                "patrolmemberids":"1E078858-862E-44C9-B138-46191953D5E4,56C1F009-3483-4993-A86E-7354F96E2382",
                "patrolscope":this.form.PatrolScope
            };
          if (this.form.Id != undefined) {
            //保存修改
            form.id = this.form.Id;
            modifyPatrolCycle(form).then(response => {
                this.msgSuccess(response.msg);
                this.$emit("getList");
                this.handleOpen();
              })
              .catch(r => {
                //取消按钮转圈圈
                this.loading = false;
              });
          } else {
            createPatrolCycle(form).then(response => {
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