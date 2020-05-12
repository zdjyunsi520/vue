<template>
  <div style="margin-top:50px;">
    <!-- <el-dialog top="20px" width="80%" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center> -->

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="contactperson">
            <el-input v-model="form.contactperson" placeholder="请输入名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资产属性" prop="industry">
            <el-select v-model="form.industry" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key+''+index" :label="item.name" :value="item.key" v-for="(item,index) in electronType1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="屏柜类型" prop="parentId">
            <el-select v-model="form.parentId" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in panelCabinetType" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="电压等级" prop="principleactivity">
            <el-select v-model="form.principleactivity" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in electronLvl" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属单位" prop="province">
            <el-select v-model="form.province" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in areaList" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="型号" prop="contactperson">
            <el-input v-model="form.contactperson" placeholder="请输入型号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运行状态" prop="province">
            <el-select v-model="form.province" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in runningState" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="生产厂家" prop="address">
            <el-input v-model="form.address" placeholder="请输入生产厂家" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="投运日期" prop="starttime">
            <el-date-picker v-model="form.starttime" type="date" placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序号" prop="sortindex">
            <el-input-number v-model="form.sortindex" controls-position="right" :min="0" style="width:100px" />
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </div>
    <!-- 添加或修改参数配置对话框 end -->
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import { add, fetchTree, update } from "@/api/systemManager/organization";
import { fetchList } from "@/api/commonManager/area";
import { mapGetters } from "vuex";
import { fetchList as fetchProfession } from "@/api/commonManager/profession";
const electronType = [
  { key: "高压配电室", value: "高压配电室" },
  { key: "变压器室", value: "变压器室" },
  { key: "低压配电室", value: "低压配电室" }
];
const electronType1 = [
  { key: "用户资产", value: "用户资产" },
  { key: "局方资产", value: "局方资产" }
];
const runningState = [
  { key: "在运", value: "在运" },
  { key: "停运", value: "停运" }
];
const electronLvl = [
  { key: "220KV", value: "220KV" },
  { key: "380KV", value: "380KV" },
  { key: "400KV", value: "400KV" },
  { key: "6KV", value: "6KV" },
  { key: "10KV", value: "10KV" },
  { key: "20KV", value: "20KV" },
  { key: "35KV", value: "35KV" },
  { key: "110KV", value: "110KV" }
];
const panelCabinetType = [
  { key: "中央控制屏", value: "中央控制屏" },
  { key: "保护屏", value: "保护屏" },
  { key: "故障录波屏", value: "故障录波屏" },
  { key: "测控屏", value: "测控屏" },
  { key: "远东屏", value: "远东屏" },
  { key: "直流屏", value: "直流屏" },
  { key: "站用电屏", value: "站用电屏" },
  { key: "UPS屏", value: "UPS屏" },
  { key: "计量屏", value: "计量屏" },
  { key: "公用屏", value: "公用屏" }
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
      panelCabinetType,
      electronType1,
      electronLvl,
      runningState
    };
  },
  created() {
    const data = this.$route.query.data;
    this.reset(data);
  },
  computed: {
    ...mapGetters({ equipmentType: "status/equipmentType" })
  },
  methods: {
    handleElectron(v) {},
    /** 行业列表 */

    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          parentId: "",
          name: "",
          artificialperson: "",
          creditcode: "",
          phoneno: "",
          contactperson: "",
          mobilephone: "",
          industry: "",
          principleactivity: "1",
          province: "1",
          city: "1",
          area: "1",
          address: "",
          isenable: 1,
          longitude: "",
          latitude: "",
          attribute: "",
          starttime: "",
          maintype: "",
          subtype: "",
          contractcapacity: "",
          voltlevel: "",
          operatingcapacity: "",
          industryname: "",
          principleactivityname: ""
        },
        data
      );
    },
    handleOpen(data) {
      this.$router.push({
        path: "/equipmentAccount/maintain/panelCabinet/index"
      });
    },
    handleMap() {},
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.industryname = this.professionList.filter(
            v => v.key == this.form.industry
          )[0].text;
          this.form.principleactivityname = this.professionChildList.filter(
            v => v.key == this.form.principleactivity
          )[0].text;
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