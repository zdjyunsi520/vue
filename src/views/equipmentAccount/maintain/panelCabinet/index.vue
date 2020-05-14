<template>
  <div v-show="visible">

    <el-row class="equipInfobox" v-if="showBtn">
      <el-form :inline="true" size="mini">
        <el-form-item>
          <el-dropdown @command="handleCommand">
            <el-button type="primary" size="mini" icon=" el-icon-circle-plus-outline">
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
    </el-row>
    <el-row :gutter="20" class="equipInfobox">
      <h6>基本属性</h6>
      <el-col :xs="{span: 24}" :span="12">
        <label>名称</label><span>{{infoData.Name}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>所属单位</label><span>{{infoData.TenantName}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>电压等级</label><span>{{infoData.VoltageLevelName}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>运行状态</label><span>{{infoData.IsEnable?'在运':'停运'}}</span>
      </el-col>

      <el-col :xs="{span: 24}" :span="12">
        <label>投运日期</label><span>{{infoData.StartTime | parseTime('{y}-{m}-{d}')}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>资产属性</label><span>{{infoData.AttributeName}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>屏柜类型</label><span>{{infoData.TypeName}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>型号</label><span>{{infoData.ModelName}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>生产厂家</label><span>{{infoData.Manufactor}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12" v-if="!showBtn">
        <label>出厂日期</label><span>{{}}</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="equipInfobox">
      <h6>附属信息</h6>
      <el-row :gutter="20" class="equipInfobox">
        <el-col :xs="{span: 24}" :span="12">
          <label>创建人</label><span>{{infoData.CreateUserName}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>创建时间</label><span>{{infoData.CreateTime | parseTime('{y}-{m}-{d}')}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>最后维护人</label><span>{{infoData.UpdateUserName}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>最后维护时间</label><span>{{infoData.UpdateTime | parseTime('{y}-{m}-{d}')}}</span>
        </el-col>
      </el-row>
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