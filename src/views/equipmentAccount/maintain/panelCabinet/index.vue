<template>
  <div class="app-container wrapperbox">

    <el-row :gutter="10">
      <el-col :xs="{span: 24}" :span="6" class="treebox">
        <common-tree @emit="getInfo" />
      </el-col>
      <el-col :xs="{span: 24}" :span="18">
        <div class="bg-white comheight">
          <el-row class="equipInfobox">
            <el-form :inline="true" size="mini">
              <el-form-item>
                <el-dropdown @command="handleCommand">
                  <el-button type="primary" size="mini" icon=" el-icon-circle-plus-outline">
                    新增
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="a">新增电力表计</el-dropdown-item>
                    <el-dropdown-item command="b">温控</el-dropdown-item>
                    <el-dropdown-item command="c">烟感</el-dropdown-item>
                    <el-dropdown-item command="d">间隔</el-dropdown-item>
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
              <label>电压等级</label><span>{{infoData.TenantName}}</span>
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
              <label>屏柜类型</label><span>{{infoData.ModelName}}</span>
            </el-col>
            <el-col :xs="{span: 24}" :span="12">
              <label>型号</label><span>{{infoData.Factory}}</span>
            </el-col>
            <el-col :xs="{span: 24}" :span="12">
              <label>生产厂家</label><span>{{infoData.SerialCode}}</span>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getInfo } from "@/api/equipmentAccount/maintain/powerRoom";
import commonTree from "@/views/equipmentAccount/components";
export default {
  components: { commonTree },
  data() {
    return {
      operateId: "",
      infoData: {}
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
      const data = {};
      this.$router.push({ path: "", query: { data } });
    },
    handleDelete() {},
    getInfo(id) {
      getInfo({ id }).then(r => {
        this.infoData = r.data;
      });
    }
  }
};
</script>

<style lang="scss">
</style>