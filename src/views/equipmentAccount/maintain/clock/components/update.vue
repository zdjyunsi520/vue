<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}电力表计</p>
      <el-scrollbar>
        <el-form ref="form" :model="form" label-position="right" :rules="rules" label-width="110px">
          <el-row>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="设备编号" prop="SerialCode">
                <el-input v-model="form.SerialCode" placeholder="请输入设备编号" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="是否启用" prop="Status">
                <el-switch v-model="form.Status" :active-value="1" :inactive-value="0" class="switchStyle" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="启用" inactive-text="禁用">
                </el-switch>
              </el-form-item>
            </el-col>
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
              <el-form-item label="运行状态" prop="IsEnable">
                <el-select v-model="form.IsEnable">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in runningStateType" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="10" :push="2" :xs="24">
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
              <el-form-item label="CT变化" prop="CTRatio">
                <el-input v-model="form.CTRatio" placeholder="请输入CT变化" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="资产属性" prop="Property">
                <el-select v-model="form.Property">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in assetAttributeType" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="PT变化" prop="RTRatio">
                <el-input v-model="form.RTRatio" placeholder="请输入PT变化" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="通讯主机" prop="DataServerId">
                <el-select v-model="form.DataServerId">
                  <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in communicationHostType" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="排序号" prop="SortIndex">
                <el-input-number v-model="form.SortIndex" controls-position="right" :min="0" />
              </el-form-item>
            </el-col>

            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="数据源地址" prop="DataAddress">
                <el-select v-model="form.DataAddress" :disabled="!!form.Id">
                  <el-option :key="item" :label="item" :value="item" v-for="item in 254" />
                </el-select>
              </el-form-item>
            </el-col>
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
import { add, update } from "@/api/equipmentAccount/maintain/clock";
import { mapGetters, mapActions } from "vuex";
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
          pattern: /^[A-Za-z0-9]{1,18}$/,
          required: true,
          message: "请输入18位以内的数字或字母",
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
      IsEnable: rule,
      Status: rule,
      DataAddress: rule,

      ExFactoryDate: [
        {
          required: false,
          message: "此处不能为空",
          trigger: "blur"
        }
      ]
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
          SerialCode: "",
          Name: "",
          TenantId: "",
          StartTime: "",
          Property: "",
          DataServerId: "",
          IsEnable: true,
          Status: 1,
          Factory: "",
          ModelName: "",
          CTRatio: "",
          RTRatio: "",
          Id: "",
          SortIndex: 1,
          ExFactoryDate:'',
          DataAddress: "",
          ParentId: ""
        },
        data
      );
    },
    handleOpen() {
      this.form.type = 5;
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
              this.form.id = response.data ? response.data.Id : this.form.Id;
              //刷新列表
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