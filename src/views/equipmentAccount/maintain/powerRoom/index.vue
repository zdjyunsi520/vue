<template>
  <div v-show="visible" class="app-container smInfoform-wrap">
    <div class="search-box" v-if="showBtn">
      <el-form :inline="true">
        <el-form-item>
          <el-dropdown @command="handleCommand">
            <el-button type="primary" icon="el-icon-circle-plus-outline">
              新增
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/equipmentAccount/maintain/panelCabinet/components/update">屏柜</el-dropdown-item>
              <el-dropdown-item command="/equipmentAccount/maintain/camera/components/update">摄像头</el-dropdown-item>
              <el-dropdown-item command="/equipmentAccount/maintain/communicationHost/components/update">通讯主机</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" icon="el-icon-edit" @click="handleUpdate">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="containerbox">
      <el-scrollbar>
        <el-row class="smInfoform-box">
          <div class="form-smtitle marginBottom30">基本属性</div>
          <el-form label-position="top" :model="infoData">
            <el-row :gutter="30">
              <el-col :xs="{span: 24}" :span="12" class="border-right">
                <el-col :span="24">
                  <el-form-item label="名称">
                    <el-input v-model="infoData.Name" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="电压等级">
                    <el-input v-model="infoData.VoltLevelName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="投运日期">
                    <el-input v-model="infoData.StartTime" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="配电室类型">
                    <el-input v-model="infoData.TypeName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="生产厂家">
                    <el-input v-model="infoData.Factory" disabled></el-input>
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
                  <el-form-item label="运行状态">
                    <el-input v-model="infoData.IsEnable" disabled></el-input>
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
                    <el-input v-model="infoData.ExFactoryDate" disabled></el-input>
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
import { getInfo } from "@/api/equipmentAccount/maintain/interval";
export default {
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
      const id = this.infoData.Id;
      const name = this.infoData.Name;
      const type = this.infoData.Type;
      const tenantid = this.infoData.TenantId;
      const isenable = this.infoData.IsEnable;
      const starttime = this.infoData.StartTime;
      const property = this.infoData.Property;
      const voltlevel = this.infoData.VoltLevel;
      const assetsid = this.infoData.AssetsId;
      const assetstype = this.infoData.AssetsType;
      const sortindex = this.infoData.SortIndex;
      const ismainline = this.infoData.IsMainLine;
      const parentid = "";
      const data = {
        id,
        name,
        type,
        tenantid,
        isenable,
        starttime,
        property,
        voltlevel,
        assetsid,
        assetstype,
        sortindex,
        ismainline,
        parentid
      };
      const title = "修改";
      this.$router.push({
        name: "/equipmentAccount/maintain/interval/components/update",
        params: { data, title }
      });
    },
    handleDelete() {},
    getInfo(data) {
      getInfo(data).then(r => {
        this.infoData = r.data;
        this.infoData.IsEnable = r.data.IsEnable ? "在运" : "停运";
        this.infoData.IsMainLine = r.data.IsMainLine ? "是" : "否";
        this.infoData.StartTime = this.parseTime(
          r.data.StartTime,
          "{y}-{m}-{d}"
        );
        this.infoData.CreateTime = this.parseTime(
          r.data.CreateTime,
          "{y}-{m}-{d}"
        );
        this.infoData.UpdateTime = this.parseTime(
          r.data.UpdateTime,
          "{y}-{m}-{d}"
        );
      });
    }
  }
};
</script>

