<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}摄像头</p>
      <el-scrollbar>
        <el-form ref="form" :model="form" label-position="right" :rules="rules" label-width="110px">
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
                  <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in assetAttributeType" />
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
              <el-form-item label="生产厂家" prop="factory">
                <el-input v-model="form.factory" placeholder="请输入生产厂家" />
              </el-form-item>
            </el-col>

            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="所属单位" prop="tenantId">
                <el-select v-model="form.tenantId">
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
              <el-form-item label="运行状态" prop="IsEnable">
                <el-select v-model="form.IsEnable">
                  <el-option label="请选择" value></el-option>
                  <el-option label="在运" :value="true" />
                  <el-option label="停运" :value="false" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="排序号" prop="SortIndex">
                <el-input-number v-model="form.SortIndex" controls-position="right" :min="0" />
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
import { add, update } from "@/api/equipmentAccount/maintain/camera";
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
      serialcode: [
        {
          pattern: /^[A-Za-z0-9]{1,18}$/,
          required: true,
          message: "请输入18位以内的数字或字母",
          trigger: "blur"
        }
      ],
      name: [
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,12}$/,
          required: true,
          message: "请输入12位以内的汉字或数字或字母",
          trigger: "blur"
        }
      ],
      validatecode: [
        {
          pattern: /^[A-Za-z0-9]{1,18}$/,
          required: true,
          message: "请输入18位以内的数字或字母",
          trigger: "blur"
        }
      ],
      softwareversion: [
        {
          pattern: /^[^\u4e00-\u9fa5]{1,18}$/,
          required: true,
          message: "请输入18位以内的数字或字母或特殊符号",
          trigger: "blur"
        }
      ],
      modelname: [
        {
          pattern: /^[^\u4e00-\u9fa5]{1,18}$/,
          required: false,
          message: "请输入18位以内的数字或字母或特殊符号",
          trigger: "blur"
        }
      ],
      factory: [
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,24}$/,
          required: false,
          message: "请输入24位以内的汉字或数字或字母",
          trigger: "blur"
        }
      ],
      channelno: [
        {
          pattern: /^(([1-9]\d)|[1-9])$/,
          required: false,
          message: "请输入2位以内的整数"
        }
      ],
      SortIndex: [
        {
          pattern: /^\d{1,4}$/,
          required: false,
          message: "请输入4位以内的整数"
        }
      ],

      IsEnable: rule,
      starttime: rule,
      tenantId: rule,
      attribute: rule,

      exfactorydate: [
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
      equipmentType: "status/equipmentType",
      companyType: "status/companyType",
      assetAttributeType: "status/assetAttributeType"
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
          parentId: "",
          serialcode: "",
          validatecode: "",
          name: "",
          channelno: "",
          tenantId: "",
          attribute: "",
          softwareversion: "",
          starttime: "",
          modelname: "",
          exfactorydate: "",
          IsEnable: "",
          factory: "",
          SortIndex: 1
        },
        data
      );
    },
    handleOpen() {
      this.form.type = 8;
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
          const fn = this.form.id ? update : add;
          //添加用户
          fn(this.form)
            .then(response => {
              //消息提示
              var txt = this.form.id ? "编辑成功！" : "新增成功！";
              this.$message.success(txt);
              this.form.id = response.data ? response.data.Id : this.form.id;
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