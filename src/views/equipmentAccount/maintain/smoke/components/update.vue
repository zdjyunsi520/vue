<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}烟感</p>
      <el-scrollbar>
        <el-form ref="form" :model="form" label-position="left" :rules="rules" label-width="110px">
          <el-row>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="设备编号" prop="serialcode">
                <el-input v-model="form.serialcode" placeholder="请输入设备编号" />
                <el-tag type="danger">新增提示当前设备不在资产设备库中</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="是否启用" prop="isenable">
                <el-switch v-model="form.isenable" class="switchStyle" :active-value="1" :inactive-value="0" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="启用" inactive-text="禁用">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="型号" prop="ModelName">
                <el-input v-model="form.ModelName" placeholder="请输入型号" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="所属单位" prop="tenantid">
                <el-select v-model="form.tenantid">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="生产厂家" prop="factory">
                <el-input v-model="form.factory" placeholder="请输入生产厂家" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="运行状态" prop="status">
                <el-select v-model="form.status">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in runningStateType" />
                </el-select>
                <el-tag type="danger">未提供此字段</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs='24'>
              <el-form-item label="出厂日期" prop="exfactorydate">
                <el-date-picker v-model="form.exfactorydate" type="date" placeholder="请选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="投运日期" prop="starttime">
                <el-date-picker v-model="form.starttime" type="date" placeholder="请选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="排序号" prop="sortindex">
                <el-input-number v-model="form.sortindex" controls-position="right" :min="0" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="资产属性" prop="attribute">
                <el-select v-model="form.attribute">
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
          <el-button type="primary" icon="el-icon-check" @click="handleSubmit" :loading="loading">确 定</el-button>
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
      name: rule,
      serialcode: rule,
      attribute: rule,

      isenable: rule,
      starttime: rule,
      attribute: rule,
      voltagelevel: rule,
      tenantid: rule
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
          id: "",
          serialcode: "",
          attribute: "",
          name: "",
          tenantid: "",
          starttime: "",
          isenable: 1,
          ModelName: "",
          factory: "",
          sortindex: 1,
          exfactorydate: ""
        },
        data
      );
    },
    handleOpen(data) {
      this.$router.push({
        name: "/equipmentAccount/maintain/index"
      });
    },
    handleMap() {},
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // this.form.starttime = dateFortmat(this.form.starttime, "yyyy-MM-dd");
          // this.form.exfactorydate = dateFortmat(
          //   this.form.exfactorydate,
          //   "yyyy-MM-dd"
          // );
          //按钮转圈圈
          this.loading = true;
          const fn = this.form.id ? update : add;
          //添加用户
          fn(this.form)
            .then(response => {
              //消息提示
              this.$message.success(response.msg);
              //刷新列表
              //this.$emit("getList");
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