<template>
  <div class="app-container wrapperbox">
    <el-form :inline="true"  size="mini">
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleUpdate" >修改</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDelete" >删除</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :xs="{span: 24}" :span="6" class="treebox">
        <el-tree :data="treeData" :props="defaultProps" class="comheight"  @node-click="handleNodeClick" :default-expand-all='true'></el-tree>
      </el-col>
      <el-col :xs="{span: 24}" :span="18">
          <div class="bg-white comheight">
            <el-row  :gutter="20" class="equipInfobox">
              <h6>基本属性</h6>
              <el-col :xs="{span: 24}" :span="12">
                  <label>名称</label><span>{{infoData.Name}}</span>
              </el-col>
              <el-col :xs="{span: 24}" :span="12">
                  <label>所属单位</label><span>{{infoData.TenantName}}</span>
              </el-col>
              <el-col :xs="{span: 24}" :span="12">
                  <label>运行状态</label><span>{{infoData.Status==1?'在运':'停运'}}</span>
              </el-col>
              <el-col :xs="{span: 24}" :span="12">
                  <label>资产属性</label><span>{{infoData.PropertyName}}</span>
              </el-col>
              <el-col :xs="{span: 24}" :span="12">
                  <label>投运日期</label><span>{{infoData.StartTime | parseTime('{y}-{m}-{d}')}}</span>
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
            </el-row>
            <el-row  :gutter="20" class="equipInfobox">
              <h6>附属信息</h6>
              <el-row  :gutter="20" class="equipInfobox">
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
import { getTrees } from "@/api/org";
import { getServer,getServers } from "@/api/dev";
export default {
  data() {
    return {
      treeData:[],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      operateId:'',
      operateType:'',
      infoData:{},
    }
  },

  created() {
     this.getTreeData().then(()=>{
      this.operateId = this.treeData[0].id;
      this.operateType = this.treeData[0].type;
      this.getServer();
    });
  },
  methods: { 
    handleAdd(){
        const target = this.$refs.addEndEdit;
        target.handleOpen();
        target.title = "新增巡视信息";
    },
    handleUpdate(){},
    handleDelete(){},
    // 获取设备关系树状图
    getTreeData(){
      　return new Promise((resolve, reject) => {
          getTrees().then(response => {
            this.treeData=response.data;
          }).catch(error => {
            console.log(error); 
          });
　　　　});
    },
    handleNodeClick(obj, event) {
        console.log(obj,event); 
        this.operateId = obj.id;
        if(obj.type==4){//主机
          this.getServer();
        }
    },
    getServer(){
      const id = this.operateId;
      　return new Promise((resolve, reject) => {
          getServer({ id }).then(r => {
            this.infoData = Object.assign({}, r.data);
          });
　　　　});
    },
 
  }
}
</script>

<style lang="scss">
.comheight{height:calc(100vh - 164px);padding: 15px 10px;box-sizing: border-box}

</style>