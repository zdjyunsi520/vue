<template>
  <div v-if="visible">

    <el-row class="equipInfobox" v-if="showBtn">
      <el-form :inline="true" size="mini">
        <el-form-item>
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
        <label>所属单位</label><span>{{infoData.PropertyName}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>是否启用</label><span>{{infoData.Status==1?'启用':'停用'}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>运行状态</label><span>{{infoData.Status==1?'在运':'停运'}}</span>
      </el-col>

      <el-col :xs="{span: 24}" :span="12">
        <label>投运日期</label><span>{{infoData.StartTime | parseTime('{y}-{m}-{d}')}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>资产属性</label><span>{{infoData.PropertyName}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>型号</label><span>{{infoData.ModelName}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>生产厂家</label><span>{{infoData.Factory}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>设备编号</label><span>{{infoData.SerialCode}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>通讯主机</label><span>{{infoData.SerialCode}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>CT变化</label><span>{{infoData.SerialCode}}</span>
      </el-col>
      <el-col :xs="{span: 24}" :span="12">
        <label>PT变化</label><span>{{infoData.SerialCode}}</span>
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
import { getInfo } from "@/api/equipmentAccount/maintain/temperature";
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
        name: "/equipmentAccount/maintain/communicationHost/components/update",
        params: { data, title }
      });
    },
    handleDelete() {},
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