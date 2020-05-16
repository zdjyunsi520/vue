<template>
   <div class="app-container">
  <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>
    
      <el-scrollbar>
        <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="140px"  style="width:600px">
      <el-form-item label="巡视单位" prop="TenantId">
        <el-select v-model="form.TenantId" placeholder="请选择巡视单位" @change="getTenantInfo(form.TenantId)">
          <el-option
            v-for="(item,index) in TenantIds"
            :key="index"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="PatrolAddress">
        <el-input v-model="form.PatrolAddress" placeholder="请输入地址"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="ContactUserName">
        <el-input v-model="form.ContactUserName" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="ContactPhone">
        <el-input v-model="form.ContactPhone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="巡视日期" prop="PatrolTime">
        <el-date-picker
          v-model="form.PatrolTime"
          type="date"
          placeholder="请选择日期"
         
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="巡视人员" prop="PatrolUserId">
        <el-select v-model="form.PatrolUserId" placeholder="请选择巡视人员">
          <el-option
            v-for="(item,index) in patrolusers"
            :key="index"
            :label="item.text"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    
      <el-form-item label="巡视人员联系电话" prop="PatrolUserPhone">
        <el-input v-model="form.PatrolUserPhone"></el-input>
      </el-form-item>
      <el-form-item label="巡视成员" prop="PatrolMemberIds">
        <el-select v-model="form.PatrolMemberIds" placeholder="请选择巡视成员" multiple>
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
    </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary"  icon="el-icon-check" @click="handleSubmit" :loading="loading">确 定</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>
  </div>
  </div>
</template>

<script>
import { addJob,getInfoJob,updateJob} from "@/api/patrol";
import {getInfo} from "@/api/systemManager/organization";

export default {
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
      loading: false,
      title: "",
      form: {},
      TenantIds:[],
      patrolusers:[],
      
    };
  },
  created() {
    let { data , title ,TenantIds} = this.$route.params;
    this.title = title;
    this.TenantIds = TenantIds;
    if (data && data.Id) {
      this.getInfoJob(data);
    } else {
      this.reset(data);
    }
  },
  methods: {
   
    // 巡视人员
    getGetEmployee(){
      getGetEmployee({}).then(res => {
         this.patrolusers=res.data;
      }).catch(error => {
        console.log(error); 
      });
    },
      
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          PtrolNature:2,
          TenantId:'',
          PatrolAddress:'',
          ContactUserName:'',
          ContactPhone:'',
          PatrolTime:'',
          PatrolUserId:'',
          PatrolUserPhone:'',
          PatrolMemberIds:'',
          PatrolScope:'',
          ConfirmUserId:'',
          ConfirmUserPhone:'',
        },
        data
      );
    },
    getInfoJob(data) {
      this.loading = true;
      if (data) {
        const id = {id:data.Id};
        if (id) {
          getInfoJob(id).then(res => {
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
    // 获取单位的信息：电话地址联系人
     getTenantInfo(id) {
      getInfo({ id }).then(res => {
        this.form.PatrolAddress = res.data.Address;
        this.form.ContactUserName = res.data.ContactPerson;
        this.form.ContactPhone = res.data.MobilePhone;
        console.log(this.form)
      });
    },

    handleOpen(data) {
       this.$router.push({
        name: "/patrol/PatrolJob/index",
        params: {}
      });
    },
    /** 提交按钮 */
    handleSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          
           //按钮转圈圈
          this.loading = true;
          let fn;
          if (this.form.id) fn = updateJob;
          else fn = addJob;
          fn(this.form)
            .then(response => {
              //消息提示
              this.$message.success(response.msg);
              //刷新列表
              this.$emit("getList");
              //关闭窗口
              this.handleOpen();
            })
            .catch(r => {
              //取消按钮转圈圈
              this.loading = false;
            });

          // this.loading = true;
          //   //添加用户
          //   const form = {
          //       "tenantId":this.form.TenantId,
          //       "PtrolNature":2,
          //       "PatrolAddress":this.form.PatrolAddress,
          //       "ContactUserName":this.form.ContactUserName,
          //       "ContactPhone":this.form.ContactPhone,
          //       "PatrolTime":this.form.PatrolTime,
          //       "patroluserid":"0ddcc0dd-ea50-4d8d-a64e-e3c7205f1217",
          //       "PatrolUserPhone":this.form.PatrolUserPhone,
          //       "PatrolMemberIds":this.form.PatrolMemberIds,
          //       "PatrolScope":this.form.PatrolScope,
          //       "ConfirmUserId":this.form.ConfirmUserId,
          //       "ConfirmUserPhone":this.form.ConfirmUserPhone
          //   };
          // if (this.form.Id != undefined) {
          //   //保存修改
          //   form.id = this.form.Id;
          //   updateJob(form).then(response => {
          //       this.msgSuccess(response.msg);
          //       this.$emit("getList");
          //       this.handleOpen();
          //     })
          //     .catch(r => {
          //       //取消按钮转圈圈
          //       this.loading = false;
          //     });
          // } else {
          //   addJob(form).then(response => {
          //       this.msgSuccess(response.msg);
          //       this.$emit("getList");
          //       this.handleOpen();
          //     })
          //     .catch(r => {
          //       this.loading = false;
          //     });
          // }
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