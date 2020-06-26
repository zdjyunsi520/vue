<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}温控</p>
      <el-scrollbar class="marginright-fx">
        <el-form ref="form" :model="form" label-position="right" :rules="rules" label-width="80px">
          <el-row>
            <el-form-item label="设备编号" prop="SerialCode">
              <el-input v-model="form.SerialCode" placeholder="请输入设备编号" />
            </el-form-item>
            <el-form-item label="是否启用" prop="IsEnable">
              <el-switch v-model="form.IsEnable" :active-value="true" :inactive-value="false" class="switchStyle" active-color="#56a7ff" inactive-color="#dddfe5" active-text="启用" inactive-text="禁用">
              </el-switch>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="名称" prop="Name">
              <el-input v-model="form.Name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="型号" prop="ModelName">
              <el-input v-model="form.ModelName" placeholder="请输入型号" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="所属单位" prop="TenantId">
              <el-select v-model="form.TenantId">
                <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
              </el-select>
            </el-form-item>
            <el-form-item label="生产厂家" prop="Factory">
              <el-input v-model="form.Factory" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="运行状态" prop="RunStatus">
              <el-select v-model="form.RunStatus">
                <el-option label="在运" :value="true" />
                <el-option label="停运" :value="false" />
                <!-- <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in runningStateType" /> -->
              </el-select>
            </el-form-item>
            <el-form-item label="出厂日期">
              <el-date-picker v-model="form.ExFactoryDate" type="date" placeholder="请选择日期"></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="投运日期" prop="StartTime">
              <el-date-picker v-model="form.StartTime" type="date" placeholder="请选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="CT变化" prop="CTRatio">
              <el-input v-model="form.CTRatio" placeholder="请输入CT变化" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="资产属性" prop="Property">
              <el-select v-model="form.Property">
                <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in assetAttributeType" />
              </el-select>
            </el-form-item>
            <el-form-item label="PT变化" prop="RTRatio">
              <el-input v-model="form.RTRatio" placeholder="请输入PT变化" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="通讯主机" prop="DataServerId">
              <el-select v-model="form.DataServerId">
                <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in communicationHostType" />
              </el-select>
            </el-form-item>
            <el-form-item label="排序号" prop="SortIndex">
              <el-input-number v-model="form.SortIndex" controls-position="right" :min="1" :max="9999" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="数据源地址" prop="DataAddress" label-width="100px">
              <el-select v-model="form.DataAddress" :disabled="!!form.Id">
                <el-option :key="item" :label="item" :value="item" v-for="item in 254" />
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
      </el-scrollbar>

      <el-col :span="24" :xs="24" class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check" @click="handleSubmit" :loading="loading">保 存</el-button>
          <el-button @click="handleOpen(null)">
            <svg-icon icon-class='ic_goback' class='tablesvgicon'></svg-icon>返 回
          </el-button>
        </div>
      </el-col>

    </div>

  </div>
</template>

<script>
import { add, update } from "@/api/equipmentAccount/maintain/temperature";
import { mapGetters, mapActions } from "vuex";
import { fetchList } from "@/api/equipmentAccount/maintain/communicationHost";
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
      SerialCode: [
        {
          pattern: /^[A-Za-z0-9]{1,42}$/,
          required: true,
          message: "请输入42位以内的数字或字母",
          trigger: "blur"
        }
      ],
      Name: [
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,12}$/,
          required: true,
          message: "请输入12位以内的汉字或数字或字母",
          trigger: "blur"
        }
      ],
      ModelName: [
        {
          pattern: /^[^\u4e00-\u9fa5]{1,18}$/,
          required: false,
          message: "请输入18位以内的数字或字母或特殊符号",
          trigger: "blur"
        }
      ],
      Factory: [
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,24}$/,
          required: false,
          message: "请输入24位以内的汉字或数字或字母",
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
      CTRatio: [
        {
          pattern: /^\d{1,10}$/,
          required: false,
          message: "请输入10位以内的整数"
        }
      ],
      RTRatio: [
        {
          pattern: /^\d{1,10}$/,
          required: false,
          message: "请输入10位以内的整数"
        }
      ],
      TenantId: rule,
      StartTime: rule,
      Property: rule,
      DataServerId: rule,
      RunStatus: rule,
      IsEnable: rule,
      DataAddress: rule
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      communicationHostType: null
    };
  },
  created() {
    const { data, title } = this.$route.params;

    this.title = title;
    this.fetechList(data);

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
    ...mapActions({ communicationHost: "common/communicationHost" }),
    fetechList(data) {
      const TenantId = data.TenantId;
      // const switchingroomid = data.ParentId;
      this.communicationHost({ TenantId }).then(r => {
        this.communicationHostType = r.data.map(v => {
          const key = v.Id;
          const value = v.Name;
          return { key, value };
        });
      });
    },
    handleElectron(v) {},
    /** 行业列表 */

    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          // Id:'',
          SerialCode: "",
          Name: "",
          TenantId: "",
          StartTime: dateFortmat(new Date(), "yyyy-MM-dd"),
          Property: "",
          DataServerId: "",
          ModelName: "",
          Factory: "",
          CTRatio: "",
          RTRatio: "",
          SortIndex: "",
          ParentId: "",
          ExFactoryDate: "",
          RunStatus: true,
          IsEnable: true,
          DataAddress: ""
        },
        data
      );
    },
    handleOpen() {
      this.form.type = 6;
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
          //添加用户
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