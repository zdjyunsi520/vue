<template>
  <div v-show="visible" class="app-container smInfoform-wrap">
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
                    <el-input :value="filterRun(infoData.Status)" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="投运日期">

                    <el-input :value="filterDate(infoData.StartTime)" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="生产厂家">
                    <el-input v-model="infoData.Factory" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="设备编号">
                    <el-input v-model="infoData.SerialCode" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-col>

              <el-col :xs="{span: 24}" :span="12" class="border-right">
                <el-col :span="24">

                  <el-form-item label="所属单位">
                    <el-input v-model="infoData.TenantName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">

                  <el-form-item label="资产属性">
                    <el-input v-model="infoData.PropertyName" disabled></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="型号">
                    <el-input v-model="infoData.ModelName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="出厂日期">
                    <el-input :value="filterDate(infoData.ExFactoryDate)" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="设备二维码">
                    <div class="ewmbox">
                      <img :src="'http://apidev.xtioe.com'+infoData.QRCode" class="ewm" />
                      <el-button type="text" @click="showEwm(infoData)">点击查看</el-button>
                    </div>
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
        </el-row>
      </el-scrollbar>
    </el-row>
    <ewmpop ref='ewmpop' :qrCode='qrCode'></ewmpop>
  </div>

</template>

<script>
import {
  getInfo,
  deleted
} from "@/api/equipmentAccount/maintain/communicationHost";
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
      return state == 1 ? "在运" : "停运";
    },
    handleCommand(commond) {
      if (commond == "a") {
        this.$router.push({
          path: "/equipmentAccount/maintain/camera/components/update",
          params: {}
        });
      }
    },
    handleAdd() {},
    handleUpdate() {
      const Id = this.infoData.Id;
      const serialcode = this.infoData.SerialCode;
      const name = this.infoData.Name;
      const tenantId = this.infoData.TenantId;
      const starttime = this.infoData.StartTime;
      const property = this.infoData.Property;
      const status = this.infoData.Status;
      const factory = this.infoData.Factory;
      const modelname = this.infoData.ModelName;
      const sortindex = this.infoData.SortIndex;
      const exfactorydate = this.infoData.ExFactoryDate;
      const switchingroomId = this.infoData.SwitchingRoomId;
      // const parentid = this.infoData.ParentId;
      const data = {
        serialcode,
        name,
        tenantId,
        starttime,
        property,
        status,
        factory,
        modelname,
        Id,
        sortindex,
        exfactorydate,
        switchingroomId
        // parentid
      };
      const title = "编辑";
      this.$router.push({
        name: "/equipmentAccount/maintain/communicationHost/components/update",
        params: { data, title }
      });
    },
    handleDelete() {
      this.$confirm("确定要删除通讯主机吗？")
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
