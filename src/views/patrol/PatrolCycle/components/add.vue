<template>
  <div class="app-container">
  <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>
    
      <el-scrollbar>
    <el-form
      :model="form"
      ref="form" label-position="left"
      :rules="rules"
      label-width="110px"
    style="width:600px">
      <el-form-item label="巡视单位" prop="TenantId">
        <el-select v-model="form.TenantId" placeholder="请选择巡视单位" style="width:100%" @change="getPatrolusers">
          <el-option
            v-for="(item,index) in TenantIds"
            :key="index"
            :label="item.Name"
            :value="item.Id"
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
      <el-form-item label="巡视人员" prop="PatrolUserId">
        <el-select v-model="form.PatrolUserId" placeholder="请选择巡视人员" style="width:100%">
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
import {  add, update,getInfo } from "@/api/patrol";
import { getTenantEmployees } from "@/api/org";
export default {
 
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
        PatrolUserId: [
          { required: true, message: "请选择巡视人员", trigger: "change" }
        ]
      },
      loading: false,
      title: "",
      form: {},
      TenantIds:[],
      patrolusers:[],
      allpatrolusers:[],
    };
  },
  created() {
    this.getTenantEmployees();
    let { data , title ,TenantIds} = this.$route.params;
    this.title = title;
    this.TenantIds = TenantIds;
    if (data && data.Id) {
      this.getInfo(data);
    } else {
      this.reset(data);
    }

  },
  methods: {
    // 巡视人员
    getTenantEmployees(){
      getTenantEmployees({}).then(res => {
         this.allpatrolusers=res.data;
      }).catch(error => {
        console.log(error); 
      });
    },
      
    //获取关联的巡视人员下拉列表
    getPatrolusers(){
      this.allpatrolusers.map(v =>{
        if (v.id == this.form.TenantId) {
          this.patrolusers = v.childs ;
          return;
        }
      })
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id:undefined,
          TenantId: "",
          CycleDay: "",
          StartTime: "",
          PatrolUserId: "",
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
          getInfo(id).then(res => {
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
       this.$router.push({
        name: "/patrol/PatrolCycle/index",
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
          if (this.form.id) fn = update;
          else fn = add;
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