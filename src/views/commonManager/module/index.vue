<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['system:menu:query']">搜索</el-button> -->
        <el-dropdown @command="handleCommand">
          <el-button type="primary" size="mini">
            新增<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">新增类别</el-dropdown-item>
            <el-dropdown-item command="b">新增分类</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增分类</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddClass" :disabled="addId==''">新增应用</el-button> -->
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate" :disabled="operateId==''">修改</el-button>
        <el-button type="primary" icon="el-icon-delete" size="mini" @click="handleDelete" :disabled="operateId==''">删除</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10">
      <el-col :xs="{span: 24}" :span="6" class="treebox">
        <el-tree :data="dataList" :props="defaultProps" class="comheight" :highlight-current="true" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false"></el-tree>
      </el-col>
      <el-col :xs="{span: 24}" :span="18">
        <div class="bg-white comheight ">
          <div v-show="data&&data.Id" class="infobox">
            <p>类型：{{data.Type==1?'分类':data.Type==2?'应用':'权限'}}</p>
            <p>名称：{{data.Name}}</p>
            <p>权限标识：{{data.Key}}</p>
            <p>URL：{{data.Url}}</p>
            <p>排序号：{{data.SortIndex}}</p>
            <p v-if="data.IconUrl">图标：
              <svg-icon :icon-class="data.IconUrl?data.IconUrl:''" />
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <div class="xl-left">
      <el-tree :data="dataList" :props="defaultProps" :highlight-current="true" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false"></el-tree>
    </div>
    <div class="xl-right">
      <el-row v-show="data&&data.Id">
        <el-col :span="24">类型：{{data.Type==1?'分类':data.Type==2?'应用':'权限'}}</el-col>
        <el-col :span="24">名称：{{data.Name}}</el-col>
        <el-col :span="24">权限标识：{{data.Key}}</el-col>
        <el-col :span="24">URL：{{data.Url}}</el-col>
        <el-col :span="24">排序号：{{data.SortIndex}}</el-col>
        <el-col :span="24" v-if="data.IconUrl">图标：
          <svg-icon :icon-class="data.IconUrl?data.IconUrl:''" />
        </el-col>
      </el-row>
    </div> -->
    <update ref="update" @getList="getList123"></update>
    <add ref="add" @getList="getList123"></add>
  </div>
</template>

<script>
import { fetchList, getInfo, deleted } from "@/api/commonManager/module";
// import Treeselect from "@riophae/vue-treeselect";
// import "@riophae/vue-treeselect/dist/vue-treeselect.css";
// import IconSelect from "@/components/IconSelect";
import update from "./components/update";
import add from "./components/add";
export default {
  name: "components",
  components: { update, add },
  data() {
    return {
      // 遮罩层
      loading: true,
      dataList: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      defaultProps: {
        children: "childs",
        label: "text"
      },
      addClass: true,
      addId: "",
      operateId: "",
      data: {}
    };
  },
  created() {
    this.getList();
  },

  methods: {
    handleCommand(commond) {
      if (commond == "a") {
        this.handleAdd();
      } else if (commond == "b") {
        this.handleAddClass();
      }
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data.map(v => {
            // v.children = v.childs;
            v.lvl = true;
            return v;
          });
          this.dataList = response.data;
          this.loading = false;
        })
        .finally(v => (this.loading = false));
    },
    getInfo() {
      const id = this.operateId;
      id &&
        getInfo({ id }).then(r => {
          this.data = Object.assign({}, r.data);
        });
    },
    getList123() {
      this.getList();
      this.getInfo();
    },
    handleNodeClick({ id, lvl }) {
      if (lvl) {
        this.addId = id;
      } else {
        this.addId = "";
      }
      this.operateId = id;
      this.getInfo();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      const target = this.$refs.add;
      target.dataList = this.dataList;
      target.handleOpen();
      target.title = "添加";
    },
    handleAddClass() {
      const target = this.$refs.update;
      const parentId = this.addId;
      target.handleOpen({ parentId });
      target.dataList = this.dataList;
      target.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate() {
      let target;
      let data, id, url, name, key, type, iconurl, sortindex, parentId;
      name = this.data.Name;
      key = this.data.Key;
      type = this.data.Type;
      id = this.data.Id;
      url = this.data.Url;
      sortindex = this.data.SortIndex;
      if (this.addId) {
        target = this.$refs.add;
        iconurl = this.data.IconUrl;
        data = { id, url, name, key, type, iconurl, sortindex };
      } else {
        target = this.$refs.update;
        target.dataList = this.dataList;

        parentId = this.data.ParentId;
        data = { id, url, name, key, type, parentId, sortindex };
      }
      target.handleOpen(data);
      target.title = "修改";
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("是否确认删除选中的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(v => {
        const id = this.operateId;
        deleted({ id }).then(r => {
          this.$message.success(r.msg);
          this.getList();
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.xl-left {
  width: 300px;
  float: left;
}
.xl-right {
  width: 100%;
  margin-left: 300px;
}
.comheight {
  height: calc(100vh - 184px);
}
.infobox {
  line-height: 1.5;
  padding: 15px 20px;
  p {
    text-align: left;
    font-size: 14px;
    color: #333;
  }
}
</style>