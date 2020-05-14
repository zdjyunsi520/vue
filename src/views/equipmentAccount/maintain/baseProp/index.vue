<template>
  <div v-show="visible">
    <el-row :gutter="20" class="equipInfobox">
      <el-form :inline="true" size="mini">
        <el-form-item>
          <el-dropdown @command="handleCommand">
            <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini">
              新增
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/equipmentAccount/maintain/powerRoom/components/update">配电室</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
          <label>上级单位</label><span>{{infoData.ParentId}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>运行状态</label><span>{{infoData.IsEnable?'在运':'停运'}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>单位地址</label><span>{{infoData.Province}}{{infoData.City}}{{infoData.Area}}{{infoData.Address}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>联系人</label><span>{{infoData.ContactPerson }}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>联系人手机</label><span>{{infoData.MobilePhone}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>联系电话</label><span>{{infoData.PhoneNo}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>电压等级</label><span>{{infoData.VoltLevelText}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>立户日期</label><span>{{infoData.CreateTime| parseTime('{y}-{m}-{d}')}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>运行容量</label><span>{{infoData.OperatingCapacity}}</span>
        </el-col>
        <el-col :xs="{span: 24}" :span="12">
          <label>合同容量</label><span>{{infoData.ContractCapacity}}</span>
        </el-col>
      </el-row>
    </el-row>

  </div>
</template>

<script>
import { getInfo } from "@/api/equipmentAccount/maintain";
export default {
  data() {
    return {
      infoData: {},
      visible: false,
      id: ""
    };
  },
  methods: {
    handleCommand(commond) {
      const data = { tenantId: this.id };
      const title = "新增";
      this.$router.push({
        name: commond,
        params: { data, title }
      });
    },
    getInfo(data) {
      const id = data.id;
      this.id = data.id;
      getInfo({ id }).then(r => {
        this.infoData = r.data;
      });
    }
  }
};
</script>

<style lang="scss">
</style>
