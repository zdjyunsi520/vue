<template>
  <div v-show="visible" class="app-container smInfoform-wrap" >
    <div class="search-box" v-if="showBtn">
      <el-form :inline="true">
        <el-form-item>
         <el-dropdown @command="handleCommand">
            <el-button type="primary" icon=" el-icon-circle-plus-outline">
              新增
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/equipmentAccount/maintain/clock/components/update">电力表计</el-dropdown-item>
              <el-dropdown-item command="/equipmentAccount/maintain/temperature/components/update">温控</el-dropdown-item>
              <el-dropdown-item command="/equipmentAccount/maintain/smoke/components/update">烟感</el-dropdown-item>
              <el-dropdown-item command="/equipmentAccount/maintain/interval/components/update">间隔</el-dropdown-item>
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
        <el-row :gutter="30" >
          <el-col :xs="{span: 24}" :span="12" class="border-right">
            <el-col :span="24">
              <el-form-item label="名称">
                <el-input v-model="infoData.Name" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="电压等级">
                <el-input v-model="infoData.VoltageLevelName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="投运日期">
                <el-input v-model="infoData.StartTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="屏柜类型">
                <el-input v-model="infoData.TypeName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="生产厂家">
                <el-input v-model="infoData.Manufactor" disabled></el-input>
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
        </el-row>
      </el-scrollbar>
    </el-row>
  </div>

</template>

<script>
import { getInfo, deleted } from "@/api/equipmentAccount/maintain/panelCabinet";
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
    getInfo(data) {
      getInfo(data).then(r => {
        this.infoData = r.data;
        this.infoData.IsEnable = r.data.IsEnable ? "在运" : "停运";
        this.infoData.StartTime = this.parseTime( r.data.StartTime, "{y}-{m}-{d}" );
        this.infoData.CreateTime = this.parseTime( r.data.CreateTime, "{y}-{m}-{d}" );
        this.infoData.UpdateTime = this.parseTime( r.data.UpdateTime, "{y}-{m}-{d}" );
        this.infoData.ExFactoryDate = this.parseTime( r.data.ExFactoryDate, "{y}-{m}-{d}" );
      });
    },
    handleCommand(commond) {
      const tenantid = this.infoData.TenantId;
      const parentid = this.infoData.Id;
      const tenantId = this.infoData.TenantId;
      const parentId = this.infoData.Id;
      const data = { parentid, tenantid, tenantId, parentId };
      const title = "新增";
      this.$router.push({
        name: commond,
        params: { data, title }
      });
    },
    handleAdd() {},
    handleUpdate() {
      const id = this.infoData.Id;
      const tenantId = this.infoData.TenantId;
      const name = this.infoData.Name;
      const type = this.infoData.Type;
      const voltagelevel = this.infoData.VoltageLevel;
      const modelname = this.infoData.ModelName;
      const manufactor = this.infoData.Manufactor;
      const isenable = this.infoData.IsEnable;
      const starttime = this.infoData.StartTime;
      const sortindex = this.infoData.SortIndex;
      const parentId = this.infoData.ParentId;
      const attribute = this.infoData.Attribute;
      const data = {
        id,
        tenantId,
        name,
        type,
        voltagelevel,
        modelname,
        manufactor,
        isenable,
        starttime,
        sortindex,
        status,
        parentId,
        attribute
      };
      const title = "修改";
      this.$router.push({
        name: "/equipmentAccount/maintain/panelCabinet/components/update",
        params: { data, title }
      });
    },
    handleDelete() {
      this.$confirm("确认要进行删除操作吗？").then(r => {
        const id = this.infoData.Id;
        deleted({ id }).then(r => this.$message.success(r.msg));
      });
    }
  }
};
</script>

<style lang="scss">
</style>