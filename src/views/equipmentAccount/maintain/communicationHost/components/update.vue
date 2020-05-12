<template>
  <div style="margin-top:50px;">
    <!-- <el-dialog top="20px" width="80%" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center> -->

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备编号" prop="contactperson">
            <el-input v-model="form.contactperson" placeholder="请输入设备编号" />
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
          <el-form-item label="名称" prop="contactperson">
            <el-input v-model="form.contactperson" placeholder="请输入名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="型号" prop="contactperson">
            <el-input v-model="form.contactperson" placeholder="请输入型号" />
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
          <el-form-item label="生产厂家" prop="contactperson">
            <el-input v-model="form.contactperson" placeholder="请输入生产厂家" />
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
        path: "/equipmentAccount/maintain/interval/index"
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