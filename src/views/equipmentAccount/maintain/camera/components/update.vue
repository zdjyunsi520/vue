<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}摄像头</p>
      <el-scrollbar>
        <el-form ref="form" :model="form" label-position="left" :rules="rules" label-width="110px">
          <el-row>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="设备序列号" prop="serialcode">
                <el-input v-model="form.serialcode" placeholder="请输入设备序列号" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="资产属性" prop="attribute">
                <el-select v-model="form.attribute">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key+''+index" :label="item.name" :value="item.key" v-for="(item,index) in electronType1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="通道号" prop="channelno">
                <el-input v-model="form.channelno" placeholder="请输入通道号" />
              </el-form-item>
            </el-col>

            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="设备验证码" prop="validatecode">
                <el-input v-model="form.validatecode" placeholder="请输入设备验证码" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="型号" prop="modelname">
                <el-input v-model="form.modelname" placeholder="请输入型号" />
              </el-form-item>
            </el-col>

            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="软件版本号" prop="softwareversion">
                <el-input v-model="form.softwareversion" placeholder="请输入软件版本号" />
              </el-form-item>
            </el-col>

            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="生产厂家" prop="contactperson">
                <el-input v-model="form.contactperson" placeholder="请输入生产厂家" />
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
              <el-form-item label="出厂日期" prop="exfactorydate">
                <el-date-picker v-model="form.exfactorydate" type="date" placeholder="请选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="运行状态" prop="province">
                <el-select v-model="form.province">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in runningState" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="排序号" prop="sortindex">
                <el-input-number v-model="form.sortindex" controls-position="right" :min="0" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="投运日期" prop="starttime">
                <el-date-picker v-model="form.starttime" type="date" placeholder="请选择日期"></el-date-picker>
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
import { add, fetchTree, update } from "@/api/systemManager/organization";
import { fetchList } from "@/api/commonManager/area";
import { mapGetters } from "vuex";
import { fetchList as fetchProfession } from "@/api/commonManager/profession";

const electronType1 = [
  { key: "用户资产", value: "用户资产" },
  { key: "局方资产", value: "局方资产" }
];

const runningState = [
  { key: "在运", value: "在运" },
  { key: "停运", value: "停运" }
];

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
      parentId: rule,
      name: rule,
      artificialperson: rule,
      creditcode: rule,
      phoneno: rule,
      contactperson: rule,
      mobilephone: rule,
      industry: rule,
      principleactivity: rule,
      province: rule,
      city: rule,
      area: rule,
      address: rule,

      longitude: rule,
      latitude: rule
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      professionList: [],
      electronType1,
      runningState
    };
  },
  created() {
    const { data, title } = this.$route.params;
    this.title = title;
    this.reset(data);
  },
  computed: {
    ...mapGetters({
      equipmentType: "status/equipmentType",
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
          parentid: "",
          serialcode: "",
          validatecode: "",
          name: "",
          channelno: "",
          tenantid: "",
          attribute: "",
          softwareversion: "",
          starttime: "",
          modelname: "",
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