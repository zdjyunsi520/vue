<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}间隔</p>
      <el-scrollbar class="marginright-fx">
        <el-form ref="form" :model="form" label-position="right" :rules="rules" label-width="80px">
          <el-row>
            <el-form-item label="名称" prop="Name">
              <el-input v-model="form.Name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="资产属性" prop="Property">
              <el-select v-model="form.Property">
                <el-option label="请选择" value></el-option>
                <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in assetAttributeType" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="间隔类型" prop="Type">
              <el-select v-model="form.Type">
                <el-option label="请选择" value></el-option>
                <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in powerRoomType" />
              </el-select>

            </el-form-item>
            <el-form-item label="关联设备" prop="BindDeviceId">
              <el-select v-model="form.BindDeviceId">
                <el-option label="请选择" value></el-option>
                <el-option :key="item.Id" :label="item.Name" :value="item.Id" v-for="item in deviceType" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="所属单位" prop="TenantId">
              <el-select v-model="form.TenantId">
                <el-option label="请选择" value></el-option>
                <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
              </el-select>
            </el-form-item>
            <el-form-item label="电压等级" prop="VoltLevel">
              <el-select v-model="form.VoltLevel">
                <el-option label="请选择" value></el-option>
                <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in voltageLevelType" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="运行状态" prop="IsEnable">
              <el-select v-model="form.IsEnable">
                <el-option label="请选择" value></el-option>
                <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in runningStateType" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否总进线" prop="IsMainLine">
              <el-select v-model="form.IsMainLine">
                <el-option label="请选择" value></el-option>
                <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in rwType" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="投运日期" prop="StartTime">
              <el-date-picker v-model="form.StartTime" type="date" placeholder="请选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="排序号" prop="SortIndex">
              <el-input-number v-model="form.SortIndex" controls-position="right" :min="0" :max="9999" />
            </el-form-item>
          </el-row>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs="24" class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            <svg-icon icon-class='ic_save' class='tablesvgicon'></svg-icon>保 存
          </el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import { add, update } from "@/api/equipmentAccount/maintain/interval";
import { mapGetters, mapActions } from "vuex";
import { dateFortmat } from "@/utils";

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
      Name: [
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,12}$/,
          required: true,
          message: "请输入12位以内的汉字或数字或字母",
          trigger: "blur"
        }
      ],
      SortIndex: [
        {
          pattern: /^\d{1,4}$/,
          required: false,
          message: "请输入4位以内的整数"
        }
      ],
      Type: rule,
      TenantId: rule,
      IsEnable: rule,
      StartTime: rule,
      Property: rule,
      assetsid: rule
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      deviceType: []
    };
  },
  created() {
    const { data, title } = this.$route.params;
    this.title = title;
    this.reset(data);
    this.fetchDeviceList();
  },
  computed: {
    ...mapGetters({
      powerRoomType: "status/intervalType",
      assetAttributeType: "status/assetAttributeType",
      voltageLevelType: "status/voltageLevelType",
      runningStateType: "status/runningStateType",
      companyType: "status/companyType",
      connectType: "status/connectType",
      rwType: "status/rwType"
    })
  },
  methods: {
    ...mapActions({ deviceList: "common/deviceList" }),
    handleElectron(v) {},
    fetchDeviceList() {
      const TenantId = this.form.TenantId;
      this.deviceList({ TenantId }).then(r => {
        this.deviceType = r.data;
      });
    },

    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id: "",
          TenantId: "",
          BindDeviceId: "",
          BindDeviceType: "",
          Name: "",
          Type: "",
          IsEnable: true,
          StartTime: dateFortmat(new Date(), "yyyy-MM-dd"),
          Property: "",
          VoltLevel: "",
          IsMainLine: true,
          ParentId: "",
          SortIndex: 1
        },
        data
      );
    },
    handleOpen() {
      this.form.type = 11;
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
          //按钮转圈圈
          this.loading = true;
          const fn = this.form.Id ? update : add;
          this.form.BindDeviceType = this.deviceType
            .filter(v => v.Id == this.form.BindDeviceId)
            .map(v => v.Type)
            .join("");
          this.form.IsMainLine = this.form.IsMainLine ? true : false;
          fn(this.form)
            .then(response => {
              //消息提示
              var txt = this.form.Id ? "编辑成功！" : "新增成功！";
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
/deep/.onlyform-box .el-form .el-form-item {
  width: 350px;
  display: inline-block;
  vertical-align: text-top;
}
</style>