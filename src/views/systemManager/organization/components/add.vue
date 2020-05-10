<template>
  <el-dialog top="20px" width="80%" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="上级单位" prop="parentId">
            <el-select v-model="form.parentId" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.id" :label="item.text" :value="item.id" v-for="item in treeData" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行业类别" prop="industry">
            <el-select v-model="form.industry" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key+''+index" :label="item.name" :value="item.key" v-for="(item,index) in professionList" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行业分类" prop="principleactivity">
            <el-select v-model="form.principleactivity" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in professionChildList" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法人代表" prop="artificialperson">
            <el-input v-model="form.artificialperson" placeholder="请输入法人代表" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="省份" prop="province">
            <el-select v-model="form.province" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in equipmentType" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="统一信用代码" prop="creditcode">
            <el-input v-model="form.creditcode" placeholder="请输入统一信用代码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市" prop="city">
            <el-select v-model="form.city" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in equipmentType" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phoneno">
            <el-input v-model="form.phoneno" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域/县" prop="area">
            <el-select v-model="form.area" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in equipmentType" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contactperson">
            <el-input v-model="form.contactperson" placeholder="请输入联系人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人手机" prop="mobilephone">
            <el-input v-model="form.mobilephone" placeholder="请输入联系人手机" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" prop="isenable">
            <el-switch v-model="form.isenable" :inactive-value="0" :active-value="1" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>{{form.isenable?'启用':'禁用'}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          地图定位
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度" prop="longitude">
            <el-input v-model="form.longitude" placeholder="输入或通过地图点击获取" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="form.latitude" placeholder="输入或通过地图点击获取" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="地图搜索" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入内容进行搜索" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleMap">搜索</el-button>
        </el-col>
        <el-col :span="24">
          地图
        </el-col>
        <el-col :span="24">附加属性 <el-checkbox v-model="form.attribute" true-label="用电" false-label="" @change="handleElectron">用电</el-checkbox>
        </el-col>
        <el-col :span="12">
          <el-form-item label="立户日期" prop="starttime">
            <el-date-picker v-model="form.starttime" type="date" placeholder="选择日期" :disabled="disabled">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电压等级" prop="voltlevel">
            <el-select v-model="form.voltlevel" size="small" :disabled="disabled">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in electronLvl" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用电分类" prop="maintype">
            <el-select v-model="form.maintype" size="small" :disabled="disabled">
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in electronType" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用电小类" prop="subtype">
            <el-select v-model="form.subtype" size="small" :disabled="disabled">
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in electronType1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同容量(kVA)" prop="contractcapacity">
            <el-input v-model="form.contractcapacity" placeholder="请输入合同容量" :disabled="disabled" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运行容量(kVA)" prop="operatingcapacity">
            <el-input v-model="form.operatingcapacity" placeholder="请输入运行容量" :disabled="disabled" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </div>
    <!-- 添加或修改参数配置对话框 end -->
  </el-dialog>
</template>

<script>
import { add, fetchTree } from "@/api/systemManager/organization";
import { mapGetters } from "vuex";
import { fetchList as fetchProfession } from "@/api/commonManager/profession";
const electronType = [
  { key: "高压", value: "高压" },
  { key: "高压非居民", value: "高压非居民" },
  { key: "高压居民", value: "高压居民" }
];
const electronType1 = [
  { key: "大型专变用户", value: "大型专变用户" },
  { key: "中小型专变用户", value: "中小型专变用户" }
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
      principleactivity: "1",
      province: "1",
      city: "1",
      area: "1",
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
      professionList: "",
      electronType,
      electronType1,
      electronLvl,
      treeData: []
    };
  },
  created() {
    this.getProfession();
    this.getTree();
  },
  computed: {
    ...mapGetters({ equipmentType: "status/equipmentType" }),
    professionChildList() {
      if (this.professionList && this.form.industry) {
        const obj = this.professionList.filter(
          v => v.key == this.form.industry
        );
        if (obj.length) return obj[0].childs;
        else return [];
      } else return [];
    },
    disabled() {
      return this.form.attribute == "";
    }
  },
  methods: {
    getTree() {
      fetchTree({}).then(r => {
        this.treeData = r.data;
      });
    },
    handleElectron(v) {},
    /** 行业列表 */
    getProfession() {
      fetchProfession({}).then(response => {
        this.professionList = response.data;
      });
    },
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
          operatingcapacity: ""
        },
        data
      );
    },
    handleOpen(data) {
      //改变窗口状态
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        //关闭窗口时取消按钮转圈圈
        this.loading = false;
      }
      //表单重置
      this.reset(data);
    },
    handleMap() {},
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          //添加用户
          add(this.form)
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