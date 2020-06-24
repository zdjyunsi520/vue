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
              <el-dropdown-item command="/equipmentAccount/maintain/powerRoom/components/update">配电室</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
                <!-- <el-col :span="24">
                  <el-form-item label="运行状态">
                    <el-input v-model="infoData.IsEnable" disabled></el-input>
                  </el-form-item>
                </el-col> -->
                <el-col :span="24">
                  <el-form-item label="联系人">
                    <el-input v-model="infoData.ContactPerson" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="联系电话">
                    <el-input v-model="infoData.PhoneNo" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="立户日期">
                    <el-input v-model="infoData.CreateTime" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="合同容量">
                    <el-input v-model="infoData.ContractCapacity" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :xs="{span: 24}" :span="12">
                <el-col :span="24">
                  <el-form-item label="上级单位">
                    <el-input v-model="infoData.ParentName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="单位地址">
                    <el-input v-model="infoData.Address" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="联系人手机">
                    <el-input v-model="infoData.MobilePhone" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="电压等级">
                    <el-input v-model="infoData.VoltLevelText" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="运行容量">
                    <el-input v-model="infoData.OperatingCapacity" disabled></el-input>
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
import { getInfo } from "@/api/equipmentAccount/maintain";
export default {
  data() {
    return {
      infoData: {},
      visible: false,
      id: "",
      showBtn: false
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
        this.infoData.IsEnable = r.data.IsEnable ? "在运" : "停运";
        this.infoData.CreateTime = this.parseTime(
          r.data.CreateTime,
          "{y}-{m}-{d}"
        );
      });
    }
  }
};
</script>

<style lang="scss">
</style>
