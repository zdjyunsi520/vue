<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}烟感</p>
      <el-scrollbar>
        <el-form ref="form" :model="form" label-position="left" :rules="rules" label-width="110px">
          <el-row>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="设备编号" prop="SerialCode">
                <el-input v-model="form.SerialCode" placeholder="请输入设备编号" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="是否启用" prop="IsEnable">
                <el-switch v-model="form.IsEnable" class="switchStyle" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="启用" inactive-text="停用">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="名称" prop="Name">
                <el-input v-model="form.Name" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="型号" prop="ModelName">
                <el-input v-model="form.ModelName" placeholder="请输入型号" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="所属单位" prop="TenantId">
                <el-select v-model="form.TenantId">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="生产厂家" prop="Factory">
                <el-input v-model="form.Factory" placeholder="请输入生产厂家" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="运行状态" prop="Status">
                <el-select v-model="form.Status">
                  <el-option label="请选择" value></el-option>
                  <el-option label="在运" :value="1" />
                  <el-option label="停运" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs='24'>
              <el-form-item label="出厂日期" prop="ExFactoryDate">
                <el-date-picker v-model="form.ExFactoryDate" type="date" placeholder="请选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="投运日期" prop="StartTime">
                <el-date-picker v-model="form.StartTime" type="date" placeholder="请选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="排序号" prop="SortIndex">
                <el-input-number v-model="form.SortIndex" controls-position="right" :min="0" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="资产属性" prop="Attribute">
                <el-select v-model="form.Attribute">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in assetAttributeType" />
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs="24" class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check" @click="handleSubmit" :loading="loading">保 存</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import { add, update } from "@/api/equipmentAccount/maintain/smoke";
import { mapGetters } from "vuex";

export default {
  data() {
    const rule = [
      {
        required: true,
        message: "此处不能为空",
        trigger: "blur"
      }
    ];
    const rules = {
      Name: rule,
      SerialCode: rule,
      Attribute: rule,

      IsEnable: rule,
      StartTime: rule,
      Attribute: rule,
      voltagelevel: rule,
      TenantId: rule
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: ""
    };
  },
  created() {
    const { data, title } = this.$route.params;
    this.title = title;
    this.reset(data);
  },
  computed: {
    ...mapGetters({
      powerRoomType: "status/panelCabinetType",
      assetAttributeType: "status/assetAttributeType",
      voltageLevelType: "status/voltageLevelType",
      runningStateType: "status/runningStateType",
      companyType: "status/companyType"
    })
  },
  methods: {
    handleElectron(v) {},
    /** 行业列表 */

    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          SerialCode: "",
          Attribute: "",
          Name: "",
          TenantId: "",
          StartTime: "",
          IsEnable: true,
          Status: 1,
          ModelName: "",
          Factory: "",
          SortIndex: 1,
          ParentId: "",
          ExFactoryDate: ""
        },
        data
      );
    },
    handleOpen() {
      this.form.type = 7;
      const data = this.form;
      this.$router.push({
        name: "/equipmentAccount/maintain/index",
        params: { data }
      });
    },
    handleMap() {},
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // this.form.StartTime = dateFortmat(this.form.StartTime, "yyyy-MM-dd");
          // this.form.ExFactoryDate = dateFortmat(
          //   this.form.ExFactoryDate,
          //   "yyyy-MM-dd"
          // );
          //按钮转圈圈
          this.loading = true;
          const fn = this.form.Id ? update : add;
          //添加用户
          fn(this.form)
            .then(response => {
              //消息提示
              var txt = this.form.Id ?'编辑成功！':'新增成功！'
              this.$message.success(txt);
              //刷新列表
              this.form.id = response.data ? response.data.Id : this.form.Id;
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
.bm-view {
  width: 100%;
  height: 300px;
}
</style>