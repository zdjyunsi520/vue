<template>
  <div v-show="visible" class="app-container smInfoform-wrap">
    <!-- <el-row class="" > -->
    <div class="search-box" v-if="showBtn">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" plain @click="handleUpdate">
            <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
          </el-button>
          <el-button type="info" plain icon="el-icon-delete" @click="handleDelete">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- </el-row> -->
    <el-row class="containerbox">
      <el-scrollbar>
        <el-row class="smInfoform-box">
          <div class="form-smtitle marginBottom30">基本属性</div>
          <el-form label-position="top" :model="infoData">
            <el-row :gutter="20">
              <el-col :xs="{span: 24}" :span="12" class="border-right">
                <el-col :span="24">
                  <el-form-item label="名称">
                    <el-input v-model="infoData.Name" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="运行状态">
                    <el-input :value="filterRun(infoData.IsEnable)" disabled></el-input>
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
                <el-col :span="24">
                  <el-form-item label="生产厂家">
                    <el-input v-model="infoData.Factory" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="设备二维码">
                    <div class="ewmbox">
                      <img :src="'http://apidevt.xtioe.com'+infoData.QRCode" class="ewm" />
                      <el-button type="text" @click="showEwm(infoData)">点击查看</el-button>
                    </div>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :xs="{span: 24}" :span="12">
                <el-col :span="24">
                  <el-form-item label="所属单位">
                    <el-input v-model="infoData.TenantName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="投运日期">
                    <el-input :value="filterDate(infoData.StartTime)" disabled></el-input>
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
                <el-col :span="24">
                  <el-form-item label="出厂日期">
                    <el-input disabled :value="filterDate(infoData.ExFactoryDate)"></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <el-row class="smInfoform-box">
          <div class="form-smtitle marginBottom30">附属信息</div>
          <el-form label-position="top" :model="infoData">
            <el-row :gutter="30">
              <el-col :xs="{span: 24}" :span="12" class="border-right">
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
              <el-col :xs="{span: 24}" :span="12">
                <el-col :span="24">
                  <el-form-item label="创建时间">
                    <el-input :value="filterDate(infoData.CreateTime)" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="最后维护时间">
                    <el-input :value="filterDate(infoData.UpdateTime)" disabled></el-input>
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
    <ewmpop ref='ewmpop' :qrCode='qrCode'></ewmpop>
  </div>

</template>

<script>
import { getInfo, deleted } from "@/api/equipmentAccount/maintain/camera";
import ewmpop from "@/views/equipmentAccount/components/ewmpop.vue";
export default {
  components: {
    ewmpop
  },
  data() {
    return {
      operateId: "",
      infoData: {},
      visible: false,
      showBtn: false,
      qrCode: {}
    };
  },

  created() {},
  methods: {
    showEwm(obj) {
      this.$refs.ewmpop.dialogVisible = true;
      this.qrCode.title = obj.Name;
      this.qrCode.qrCodeUrl = obj.QRCode;
    },
    filterDate(date) {
      return date ? this.parseTime(date, "{y}-{m}-{d}") : "";
    },
    filterRun(state) {
      return !!state ? "在运" : "停运";
    },

    handleAdd() {},
    handleUpdate() {
      const id = this.infoData.Id;
      const parentId = this.infoData.ParentId;
      const serialcode = this.infoData.SerialCode;
      const validatecode = this.infoData.ValidateCode;
      const name = this.infoData.Name;
      const channelno = this.infoData.ChannelNo;
      const tenantId = this.infoData.TenantId;
      const attribute = this.infoData.Attribute;
      const softwareversion = this.infoData.SoftwareVersion;
      const starttime = this.infoData.StartTime;
      const modelname = this.infoData.ModelName;
      const factory = this.infoData.Factory;
      const exfactorydate = this.infoData.ExFactoryDate;
      const IsEnable = this.infoData.IsEnable;
      const SortIndex = this.infoData.SortIndex;
      const data = {
        id,
        parentId,
        serialcode,
        validatecode,
        name,
        channelno,
        tenantId,
        attribute,
        softwareversion,
        starttime,
        modelname,
        factory,
        exfactorydate,
        IsEnable,
        SortIndex
      };
      const title = "编辑";
      this.$router.push({
        name: "/equipmentAccount/maintain/camera/components/update",
        params: { data, title }
      });
    },
    handleDelete() {
      this.$confirm("确定要删除选中的摄像头吗？")
        .then(r => {
          const Id = this.infoData.Id;
          deleted({ Id }).then(r => {
            this.$emit("refresh");
            this.$message.success("删除成功！");
          });
        })
        .catch(e => {});
    },
    getInfo(data) {
      getInfo(data).then(r => {
        this.infoData = r.data;
      });
    }
  }
};
</script>

