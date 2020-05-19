<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>

      <el-scrollbar>
        <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="140px" style="width:600px">
          <el-form-item label="巡视单位" prop="tenantId">
            <el-select v-model="form.tenantId" placeholder="请选择巡视单位" @change="getTenantInfo(form.tenantId)">
              <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
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
          <el-form-item label="巡视日期" prop="patroltime">
            <el-date-picker v-model="form.patroltime" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="巡视人员" prop="patroluserid">
            <el-select v-model="form.patroluserid" placeholder="请选择巡视人员">
              <el-option v-for="(item,index) in patrolusers" :key="index" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="巡视人员联系电话" prop="patroluserphone">
            <el-input v-model="form.patroluserphone"></el-input>
          </el-form-item>
          <el-form-item label="巡视成员" prop="patrolmemberids">
            <el-select v-model="form.patrolmemberids" placeholder="请选择巡视成员" multiple>
              <el-option v-for="(item,index) in patrolusers" :key="index" :label="item.text" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="巡视内容" prop="patrolscope">
            <el-input type="textarea" :rows="4" placeholder="请输入巡视内容" v-model="form.patrolscope"></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check" @click="handleSubmit" :loading="loading">确 定</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import { addJob, getInfoJob, updateJob } from "@/api/patrol";
import { getInfo } from "@/api/systemManager/organization";
import { getTenantEmployees } from "@/api/org";
export default {
  data() {
    return {
      form: {},
      rules: {
        tenantId: [
          { required: true, message: "请选择巡视单位", trigger: "change" }
        ],
        patroluserid: [
          { required: true, message: "请请选择巡视人员", trigger: "change" }
        ],
        patroltime: [
          { required: true, message: "请选择巡视日期", trigger: "change" }
        ]
      },
      dialogVisible: false,
      loading: false,
      title: "",
      form: {},
      TenantIds: [],
      patrolusers: [],
      allpatrolusers: []
    };
  },
  created() {
    this.getTenantEmployees();
    let { data, title, TenantIds } = this.$route.params;
    this.title = title;
    this.TenantIds = TenantIds;
    this.reset(data);
    // if (data && data.Id) {
    //   this.getInfoJob(data);
    // } else {
    //   this.reset(data);
    // }
  },
  methods: {
    // 巡视人员
    getTenantEmployees() {
      getTenantEmployees({})
        .then(res => {
          this.allpatrolusers = res.data;

          if (this.form.tenantid) this.getPatrolusers();
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取关联的巡视人员下拉列表
    getPatrolusers() {
      if (this.form.tenantId)
        this.allpatrolusers.forEach(v => {
          if (v.id == this.form.tenantId) {
            this.patrolusers = v.childs;
          }
        });
    },

    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          // PtrolNature: 2,
          tenantId: "",
          patroladdress: "",
          contactusername: "",
          contactphone: "",
          patroltime: "",
          patroluserid: "",
          patroluserphone: "",
          patrolmemberids: "",
          patrolscope: "",
          id: ""
        },
        data
      );
    },
    getInfoJob(data) {
      this.loading = true;
      if (data) {
        const id = { id: data.Id };
        if (id) {
          getInfoJob(id)
            .then(res => {
              this.reset(data);
              this.form = res.data;
            })
            .finally(v => (this.loading = false));
        }
      } else {
        this.loading = false;
        this.reset(data);
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }
    },
    // 获取单位的信息：电话地址联系人
    getTenantInfo(id) {
      this.getPatrolusers();
      getInfo({ id }).then(res => {
        this.form.patroladdress = res.data.Address;
        this.form.contactusername = res.data.ContactPerson;
        this.form.contactphone = res.data.MobilePhone;
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
          console.log("this.form.patrolmemberids", this.form.patrolmemberids);
          this.form.patrolmemberids = this.form.patrolmemberids.join(",");
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
              this.form.patrolmemberids = this.form.patrolmemberids.split(",");
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