<template>
  <div v-show="visible">
    <el-row class="equipInfobox" v-if="showBtn">
      <el-form :inline="true" size="mini">
        <el-form-item>
          <el-dropdown @command="handleCommand">
            <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline">
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
    </el-row>

    <el-row :gutter="20" class="equipInfobox">
      <h6>基本属性</h6>
      <el-row :gutter="20" class="equipInfobox">
        <el-col :xs="{span: 24}" :span="12">
          <label>名称</label><span>{{infoData.Name}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>所属单位</label><span>{{infoData.TenantName}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>电压等级</label><span>{{infoData.VoltLevelName}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>运行状态</label><span>{{infoData.IsEnable?'在运':'停运'}}</span>
        </el-col>

        <el-col :xs="{span: 24}" :span="12">
          <label>投运日期</label><span>{{infoData.StartTime | parseTime('{y}-{m}-{d}')}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>资产属性</label><span>{{infoData.PropertyName}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>配电室类型</label><span>{{infoData.TypeName}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>型号</label><span>{{infoData.ModelName}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>生产厂家</label><span>{{infoData.Factory}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12" v-if="!showBtn">
          <label>出厂日期</label><span>{{infoData.ExFactoryDate}}</span>
        </el-col>
      </el-row>
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
import { getInfo, deleted } from "@/api/equipmentAccount/maintain/powerRoom";
export default {
  data() {
    return {
      infoData: {},
      visible: false,
      showBtn: false
    };
  },

  created() {},
  methods: {
    handleCommand(commond) {
      const tenantId = this.infoData.TenantId;
      const parentId = this.infoData.Id;
      const data = { parentId, tenantId };

      const title = "新增";
      this.$router.push({
        name: commond,
        params: { data, title }
      });
    },
    handleAdd() {},
    handleUpdate() {
      const id = this.infoData.Id;
      const name = this.infoData.Name;
      const tenantId = this.infoData.TenantId;
      const starttime = this.infoData.StartTime;
      const property = this.infoData.Property;
      const voltlevel = this.infoData.VoltLevelName;
      const modelname = this.infoData.ModelName;
      const factory = this.infoData.Factory;
      const sortindex = this.infoData.SortIndex;
      const type = this.infoData.Type;
      const isenable = this.infoData.IsEnable;
      const data = {
        id,
        name,
        tenantId,
        starttime,
        property,
        voltlevel,
        modelname,
        factory,
        sortindex,
        type,
        isenable
      };
      const title = "修改";
      this.$router.push({
        name: "/equipmentAccount/maintain/powerRoom/components/update",
        params: { data, title }
      });
    },
    handleDelete() {
      this.$confirm("确认要进行删除操作吗？").then(r => {
        const Ids = [this.infoData.Id];
        deleted({ Ids }).then(r => this.$message.success(r.msg));
      });
    },
    getInfo(data) {
      getInfo(data).then(r => {
        this.infoData = r.data;
      });
    }
  }
};
</script>

<style lang="scss">
</style>
