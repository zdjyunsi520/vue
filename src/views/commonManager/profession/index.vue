<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['system:menu:query']">搜索</el-button> -->
        <el-dropdown @command="handleCommand" placement='bottom-start'>
          <el-button type="primary" size="mini">
            新增<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">新增类别</el-dropdown-item>
            <el-dropdown-item command="b">新增分类</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增分类</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddClass" :disabled="addId==''">新增子类</el-button> -->
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate" :disabled="operateId==''">修改</el-button>
        <el-button type="primary" icon="el-icon-delete" size="mini" @click="handleDelete" :disabled="operateId==''">删除</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10">
      <el-col :xs="{span: 24}" :span="6" class="treebox">
        <el-tree :data="dataList" :props="defaultProps" class="comheight" :highlight-current="true" @node-click="handleNodeClick" :default-expand-all='true' :expand-on-click-node="false"></el-tree>
      </el-col>
      <el-col :xs="{span: 24}" :span="18">
        <div class="bg-white comheight ">
          <div v-show="data&&data.Key" class="infobox">
            <p>代码：{{data.Key}}</p>
            <p>名称：{{data.Name}}</p>
            <p>排序：{{data.SortIndex}}</p>
            <p v-if="data.ParentKey">父级：{{data.ParentKey}}</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <update ref="update" @getList="getList123"></update>
    <add ref="add" @getList="getList123"></add>
  </div>
</template>

<script>
import { fetchList, getInfo, deleted } from "@/api/commonManager/profession";
// import Treeselect from "@riophae/vue-treeselect";
// import "@riophae/vue-treeselect/dist/vue-treeselect.css";
// import IconSelect from "@/components/IconSelect";
import update from "./components/update";
import add from "./components/add";
export default {
  name: "profession",
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
      const key = this.operateId;
      key &&
        getInfo({ key }).then(r => {
          this.data = Object.assign({}, r.data);
        });
    },
    getList123() {
      this.getList();
      this.getInfo();
    },
    handleNodeClick({ key, lvl }) {
      if (lvl) {
        this.addId = key;
      } else {
        this.addId = "";
      }
      this.operateId = key;
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
      target.hasParentKey=false;
      target.title = "添加";
    },
    handleAddClass() {
      const target = this.$refs.add;
      const parentKey = this.addId;
      target.hasParentKey=true;
      target.handleOpen({ parentKey });
      target.dataList = this.dataList;
      target.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate() {
      let target;
      let data,
        name,
        key,
        type,
        sortindex,
        parentKey;
      name = this.data.Name;
      key = this.data.Key;
      type = this.data.Type;
      sortindex = this.data.SortIndex;
      parentKey = this.data.ParentKey;

      target = this.$refs.update;
      target.dataList = this.dataList;
      data = {  name, key, type, sortindex ,parentKey};

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
        const key = this.operateId;
        deleted({ key }).then(r => {
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