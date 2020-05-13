<template>
  <div>
    <h6>基本属性</h6>
    <el-col :xs="{span: 24}" :span="12">
      <label>名称</label><span>{{infoData.Name}}</span>
    </el-col>
    <el-col :xs="{span: 24}" :span="12">
      <label>上级单位</label><span>{{infoData.TenantName}}</span>
    </el-col>
    <el-col :xs="{span: 24}" :span="12">
      <label>运行状态</label><span>{{infoData.Status==1?'在运':'停运'}}</span>
    </el-col>
    <el-col :xs="{span: 24}" :span="12">
      <label>单位地址</label><span>{{infoData.PropertyName}}</span>
    </el-col>
    <el-col :xs="{span: 24}" :span="12">
      <label>联系人</label><span>{{infoData.StartTime | parseTime('{y}-{m}-{d}')}}</span>
    </el-col>
    <el-col :xs="{span: 24}" :span="12">
      <label>联系人手机</label><span>{{infoData.ModelName}}</span>
    </el-col>
    <el-col :xs="{span: 24}" :span="12">
      <label>联系电话</label><span>{{infoData.Factory}}</span>
    </el-col>
    <el-col :xs="{span: 24}" :span="12">
      <label>电压等级</label><span>{{infoData.SerialCode}}</span>
    </el-col>
    <el-col :xs="{span: 24}" :span="12">
      <label>立户日期</label><span>{{infoData.SerialCode}}</span>
    </el-col>
    <el-col :xs="{span: 24}" :span="12">
      <label>运行容量</label><span>{{infoData.SerialCode}}</span>
    </el-col>
    <el-col :xs="{span: 24}" :span="12">
      <label>合同容量</label><span>{{infoData.SerialCode}}</span>
    </el-col>
  </div>
</template>

<script>
import { getInfo } from "@/api/equipmentAccount/maintain/powerRoom";
export default {
  props: {
    id: Number
  },
  data() {
    return {
      infoData: {}
    };
  },

  mounted() {
    this.getInfo();
  },
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
    getInfo() {
      console.log(this.id123);
      getInfo({}).then(r => {
        this.infoData = r.data;
      });
    }
  }
};
</script>

<style lang="scss">
</style>