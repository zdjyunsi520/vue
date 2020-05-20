<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}间隔</p>
      <el-scrollbar>
        <el-form ref="form" :model="form" label-position="left" :rules="rules" label-width="110px">
          <el-row>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="资产属性" prop="property">
                <el-select v-model="form.property">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in assetAttributeType" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="间隔类型" prop="type">
                <el-select v-model="form.type">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in powerRoomType" />
                </el-select>

              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="关联设备" prop="binddeviceId">
                <el-select v-model="form.binddeviceId">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.Id" :label="item.Name" :value="item.Id" v-for="item in deviceType" />
                </el-select>
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
              <el-form-item label="电压等级" prop="voltlevel">
                <el-select v-model="form.voltlevel">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in voltageLevelType" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="10" :push="1" :xs="24">
              <el-form-item label="运行状态" prop="isenable">
                <el-select v-model="form.isenable">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in runningStateType" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="2" :xs="24">
              <el-form-item label="是否总进线" prop="ismainline">
                <el-select v-model="form.ismainline">
                  <el-option label="请选择" value></el-option>
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in rwType" />
                </el-select>
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
          </el-row>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs="24" class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check" @click="handleSubmit" :loading="loading">确 定</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
          <el-tag type="danger">修改报错50000</el-tag>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import { add, update } from "@/api/equipmentAccount/maintain/interval";
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
      name: rule,
      type: rule,
      tenantid: rule,
      isenable: rule,
      starttime: rule,
      property: rule,
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
      const tenantId = this.form.tenantid;
      this.deviceList({ tenantId }).then(r => {
        this.deviceType = r.data;
      });
    },

    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          id: "",
          tenantid: "",
          binddeviceId: "",
          binddevicetype: "",
          name: "",
          type: "",
          isenable: true,
          starttime: "",
          property: "",
          voltlevel: "",
          ismainline: 1,
          sortindex: 1
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
          const deviceType = this.deviceType.filter(
            v => v.Id == this.form.binddeviceId
          );
          this.form.binddevicetype = deviceType.length
            ? deviceType[0].Type
            : "";
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