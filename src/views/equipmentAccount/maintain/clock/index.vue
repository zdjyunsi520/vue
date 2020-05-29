<template>
  <div v-show="visible" class="app-container smInfoform-wrap">
    <div class="search-box" v-if="showBtn">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" plain @click="handleUpdate">
            <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>修改
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
                  <el-form-item label="是否启用">
                    <el-input :value="filterDisabled(infoData.Status)" disabled></el-input>
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
                  <el-form-item label="出厂日期">
                    <el-input :value="filterDate(infoData.StartTime)" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="通讯主机">
                    <el-input v-model="infoData.DataServerName" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="CT变化">
                    <el-input v-model="infoData.CTRatio" disabled></el-input>
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
                    <el-input :value="filterRun(infoData.IsEnable)" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="资产属性">
                    <el-input v-model="infoData.PropertyName" disabled></el-input>
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
                <el-col :span="24">
                  <el-form-item label="数据源地址">
                    <el-input v-model="infoData.DataAddress" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="PT变化">
                    <el-input v-model="infoData.RTRatio" disabled></el-input>
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
  </div>
</template>

<script>
import { getInfo, deleted } from "@/api/equipmentAccount/maintain/clock";

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
    filterDate(date) {
      return date ? this.parseTime(date, "{y}-{m}-{d}") : "";
    },
    filterRun(state) {
      return !!state ? "在运" : "停运";
    },
    filterDisabled(state) {
      return !!state ? "启用" : "停用";
    },
    handleAdd() {},
    handleUpdate() {
      // const id = this.infoData.Id;
      const tenantId = this.infoData.TenantId;
      const name = this.infoData.Name;
      const starttime = this.infoData.StartTime;
      const property = this.infoData.Property;
      const serialcode = this.infoData.SerialCode;
      const dataserverId = this.infoData.DataServerId;
      const isenable = this.infoData.IsEnable;
      const status = this.infoData.Status;
      const factory = this.infoData.Factory;
      const modelname = this.infoData.ModelName;
      const CTratio = this.infoData.CTRatio;
      const RTratio = this.infoData.RTRatio;
      const sortindex = this.infoData.SortIndex;
      const dataaddress = this.infoData.DataAddress;
      const parentId = this.infoData.ParentId;
      const data = {
        // id,
        tenantId,
        name,
        serialcode,
        starttime,
        property,
        dataserverId,
        isenable,
        status,
        factory,
        modelname,
        CTratio,
        RTratio,
        sortindex,
        dataaddress,
        parentId
      };
      const title = "修改";
      this.$router.push({
        name: "/equipmentAccount/maintain/clock/components/update",
        params: { data, title }
      });
    },
    handleDelete() {
      this.$confirm("确定要删除选中的电力表计吗")
        .then(r => {
          const Id = this.infoData.Id;
          deleted({ Id }).then(r => {
            this.$message.success("删除成功");
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

<style lang="scss">
</style>