<template>
  <div v-show="visible" class="app-container smInfoform-wrap" >
    <!-- <el-row class="" > -->
    <div class="search-box" v-if="showBtn">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" icon="el-icon-edit-outline" @click="handleUpdate">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- </el-row> -->
    <el-row class="containerbox">
    <el-scrollbar>
      <el-row class="smInfoform-box">
        <div class="form-smtitle marginBottom30">基本属性</div>
        <el-form label-position="top" :model="infoData">
        <el-row :gutter="30" >
          <el-col :xs="{span: 24}" :span="12" class="border-right">
            <el-col :span="24">
              <el-form-item label="名称">
                <el-input v-model="infoData.Name" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="运行状态">
                <el-input v-model="infoData.IsEnable" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="资产属性">
                <el-input v-model="infoData.AttributeName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="设备序列号">
                <el-input v-model="infoData.SerialCode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="软件版本号">
                <el-input v-model="infoData.SoftwareVersion" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :xs="{span: 24}" :span="12" >
            <el-col :span="24">
              <el-form-item label="所属单位">
                <el-input v-model="infoData.TenantName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="投运日期">
                <el-input v-model="infoData.StartTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="型号">
                <el-input v-model="infoData.ModelName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="设备验证码">
                <el-input v-model="infoData.ValidateCode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="通道号">
                <el-input v-model="infoData.ChannelNo" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        </el-form>
      </el-row>
      <el-row class="smInfoform-box">
        <div class="form-smtitle marginBottom30">附属信息</div>
        <el-form label-position="top" :model="infoData">
        <el-row :gutter="30" >
          <el-col :xs="{span: 24}" :span="12"  class="border-right">
            <el-col :span="24">
              <el-form-item label="创建人">
                <el-input v-model="infoData.CreateUserName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="最后维护人">
                <el-input v-model="infoData.UpdateUserName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :xs="{span: 24}" :span="12" >
            <el-col :span="24">
              <el-form-item label="创建时间">
                <el-input v-model="infoData.CreateTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="最后维护时间">
                <el-input v-model="infoData.UpdateTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          </el-row>
        </el-form>
          <!-- <el-col :xs="{span: 24}" :span="12">
            <label>创建时间</label><span>{{infoData.CreateTime | parseTime('{y}-{m}-{d}')}}</span>
          </el-col>
      
          <el-col :xs="{span: 24}" :span="12">
            <label>最后维护时间</label><span>{{infoData.UpdateTime | parseTime('{y}-{m}-{d}')}}</span>
          </el-col> -->
        </el-row>
      </el-scrollbar>
    </el-row>
  </div>

</template>

<script>
import { getInfo } from "@/api/equipmentAccount/maintain/camera";
import commonTree from "@/views/equipmentAccount/components";
export default {
  components: { commonTree },
  data() {
    return {
      operateId: "",
      infoData: {},
      visible: false,
      showBtn: false
    };
  },

  created() {},
  methods: {
    handleCommand(commond) {
      if (commond == "a") {
        this.$router.push({
          path: "/equipmentAccount/maintain/panelCabinet/components/update",
          params: {}
        });
      }
    },
    handleAdd() {},
    handleUpdate() {
      const data = {};
      this.$router.push({
        path: "/equipmentAccount/maintain/communicationHost/components/update",
        params: { data }
      });
    },
    handleDelete() {},
    getInfo(data) {
      getInfo(data).then(r => {
        this.infoData = r.data;
        this.infoData.IsEnable = r.data.IsEnable ? "在运" : "停运";
        this.infoData.StartTime = this.parseTime( r.data.StartTime, "{y}-{m}-{d}" );
        this.infoData.CreateTime = this.parseTime( r.data.CreateTime, "{y}-{m}-{d}" );
        this.infoData.UpdateTime = this.parseTime( r.data.UpdateTime, "{y}-{m}-{d}" );
      });
    }
  }
};
</script>

