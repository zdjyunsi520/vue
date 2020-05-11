<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true">
        <el-form-item>
          <!-- <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['system:menu:query']">搜索</el-button> -->
          <el-dropdown @command="handleCommand" placement="bottom-start">
            <el-button type="primary" size="mini" icon=" el-icon-circle-plus-outline">
              新增
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">新增类别</el-dropdown-item>
              <el-dropdown-item command="b">新增分类</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleUpdate"
            :disabled="operateId==''"
          >修改</el-button>
          <el-button
            type="primary"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete"
            :disabled="operateId==''"
          >删除</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row :gutter="20" class="containerbox">
      <el-col :xs="{span: 24}" :span="6" class="treebox comheight">
        <el-scrollbar style="height:100%"   v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
          <el-tree
            :data="dataList"
            :props="defaultProps"
            :highlight-current="true"
            @node-click="handleNodeClick"
            :default-expand-all="true"
            :expand-on-click-node="false"
          ></el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :xs="{span: 24}" :span="10" class="comheight">
        <div class="bg-white infobox" >
          <el-form label-position="top" :model="smform" v-if="data&&data.Key">
            <el-form-item>
              <el-form-item label="代码">
                <el-input v-model="smform.Key" disabled></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item>
              <el-form-item label="名称">
                <el-input v-model="smform.Name" disabled></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item>
              <el-form-item label="排序">
                <el-input v-model="smform.SortIndex" disabled></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item label="父级" v-if="smform.ParentKey">
                <el-input v-model="smform.ParentKey" disabled></el-input>
            </el-form-item>
          </el-form>
          <div v-else class="tips">
            暂无数据
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
      smform: {},
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
          this.smform = Object.assign({}, r.data);
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
      target.hasParentKey = false;
      target.title = "类别";
    },
    handleAddClass() {
      const target = this.$refs.add;
      const parentKey = this.addId;
      target.hasParentKey = true;
      target.handleOpen({ parentKey });
      target.dataList = this.dataList;
      target.title = "分类";
    },
    /** 修改按钮操作 */
    handleUpdate() {
      let target;
      let data, name, key, type, sortindex, parentKey;
      name = this.data.Name;
      key = this.data.Key;
      type = this.data.Type;
      sortindex = this.data.SortIndex;
      parentKey = this.data.ParentKey;

      target = this.$refs.update;
      target.dataList = this.dataList;
      data = { name, key, type, sortindex, parentKey };

      target.handleOpen(data);
      target.title = "修改信息";
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

</style>