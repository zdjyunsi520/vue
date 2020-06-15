<template>
  <div class="app-container">
    <div class="search-box marginbottom15">
      <el-form :inline="true">
        <el-form-item>
          <!-- <el-button type="primary" icon="el-icon-search"  @click="handleQuery" v-hasPermi="['system:menu:query']">搜索</el-button> -->
          <el-dropdown @command="handleCommand">
            <el-button type="primary" icon=" el-icon-circle-plus-outline">
              新增
              <i class="el-icon-arrow-down el-icon--right"></i>

            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">新增分类</el-dropdown-item>
              <el-dropdown-item command="b">新增应用</el-dropdown-item>
              <el-dropdown-item command="c">新增权限</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" plain @click="handleUpdate" :disabled="!currentNode.id">
            <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
          </el-button>
          <el-button type="info" icon="el-icon-delete" plain @click="handleDelete" :disabled="!currentNode.id">删除</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row :gutter="20" class="containerbox dragbox" ref="dragbox">
      <el-col :xs="{span: 24}" class="treebox comheight dragleft">
        <div style="background:#fff;height:100%;padding:0 10px;">
          <el-scrollbar ref="elScrollbar" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
            <el-tree :current-node-key="currentNode.id" :data="dataList" :accordion='true' :props="defaultProps" ref="tree" :highlight-current="true" @node-click="handleNodeClick" :default-expand-all='false' node-key="id" :expand-on-click-node="false"></el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col class="dragresize">
        <span class="iconslider">
          <svg-icon icon-class="ic_drag" style="font-size:26px;margin-left:-8px;" />
          <i class="el-icon-arrow-left" style="font-size:12px;margin-left:-2px;" />
        </span>
      </el-col>
      <el-col :xs="{span: 24}" style="width:554px" class="comheight dragright">
        <div class="bg-white  infobox">
          <el-scrollbar>
            <div class="form-smtitle marginBottom30">基础信息 </div>
            <el-form label-position="top" :model="smform" v-if="data&&data.Id">
              <el-form-item label="类型">
                <el-input v-model="smform.Type" disabled></el-input>
              </el-form-item>
              <el-form-item label="名称">
                <el-input v-model="smform.Name" disabled></el-input>
              </el-form-item>
              <el-form-item label="权限标识">
                <el-input v-model="smform.Key" disabled></el-input>
              </el-form-item>
              <el-form-item label="URL">
                <el-input v-model="smform.Url" disabled></el-input>
              </el-form-item>
              <el-form-item label="Component">
                <el-input v-model="smform.Component" disabled></el-input>
              </el-form-item>
              <el-form-item label="排序号">
                <el-input v-model="smform.SortIndex" disabled></el-input>
              </el-form-item>

              <el-form-item label="图标" v-if="smform.IconUrl">
                <svg-icon :icon-class="smform.IconUrl?smform.IconUrl:''" />
              </el-form-item>
            </el-form>
            <div v-else class="tips">
              请稍后...
            </div>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>

    <!-- <update ref="update" @getList="getList123"></update>
    <add ref="add" @getList="getList123"></add> -->
  </div>
</template>

<script>
import { fetchList, getInfo, deleted } from "@/api/commonManager/module";
// import update from "./components/update";
// import add from "./components/add";
export default {
  // components: { update, add },
  data() {
    return {
      // 遮罩层
      loading: true,
      dataList: [],
      // 搜索参数
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
      data: {},
      smform: {},
      currentNode: {}
    };
  },
  created() {
    this.currentNode = this.$route.params.data || {};

    this.getList();
  },

  mounted() {
    this.dragControllerDiv();
  },
  watch: {
    currentNode(node) {
      if (node.id) {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(node.id);
          console.log(this.$refs.tree.getCurrentNode());
        });
        this.getInfo();
      }
    }
  },
  computed: {},
  methods: {
    handleCommand(commond) {
      if (commond == "a") {
        this.handleAdd();
      } else if (commond == "b") {
        this.handleAddClass();
      } else if (commond == "c") {
        this.handleAddRole();
      }
    },
    /** 搜索菜单列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data.map(v => {
            // v.children = v.childs;
            v.lvl = true;
            v.Type = 1;
            return v;
          });
          this.dataList = response.data;
          if (!this.currentNode.id && this.dataList.length)
            this.currentNode = this.dataList[0];
          this.$nextTick(
            () => (this.$refs.elScrollbar.$refs.wrap.scrollTop = 200)
          );
        })
        .finally(v => (this.loading = false));
    },
    getInfo() {
      const { id } = this.currentNode;
      id &&
        getInfo({ id }).then(r => {
          this.data = Object.assign({}, r.data);
          this.smform = Object.assign({}, r.data);
          this.smform.Type =
            this.smform.Type == 1
              ? "分类"
              : this.smform.Type == 2
              ? "应用"
              : "权限";
        });
    },
    getList123() {
      this.getList();
      this.getInfo();
    },
    handleNodeClick(node) {
      // if (Type == 1) {
      //   this.addId = id;
      // } else {
      //   this.addId = "";
      // }
      // this.operateId = id;
      this.currentNode = node;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      const title = "新增类别";
      this.$router.push({
        name: "/commonManager/module/components/add",
        params: { data: {}, title }
      });
    },
    handleAddClass() {
      const dataList = this.dataList;
      const title = "新增应用";
      const parentId = this.addId;
      const data = { parentId };
      this.$router.push({
        name: "/commonManager/module/components/update",
        params: { dataList, title }
      });
      // const target = this.$refs.add;

      // target.handleOpen({ parentId });
      // target.dataList = this.dataList;
      // target.title = "应用";
    },
    handleAddRole() {
      const dataList = this.dataList;
      const title = "新增权限";
      const parentId = this.addId;
      const data = { parentId };
      this.$router.push({
        name: "/commonManager/module/components/role",
        params: { dataList, title }
      });
    },
    /** 编辑按钮操作 */
    handleUpdate() {
      console.log(this.$refs.elScrollbar.$refs.wrap.scrollTop);
      return;
      let target;
      let data,
        id,
        url,
        name,
        key,
        type,
        iconurl,
        sortindex,
        parentId,
        component,
        dataList,
        title;
      name = this.data.Name;
      key = this.data.Key;
      type = this.data.Type;
      id = this.data.Id;
      url = this.data.Url;
      component = this.data.Component;
      sortindex = this.data.SortIndex;
      title = "编辑信息";

      if (type == 1) {
        iconurl = this.data.IconUrl;
        data = { id, url, name, key, type, iconurl, sortindex };
        this.$router.push({
          name: "/commonManager/module/components/add",
          params: { data, title }
        });
      } else {
        const dataList = this.dataList;
        parentId = this.data.ParentId;
        data = { id, url, name, key, type, parentId, sortindex, component };
        const pathurl = type == 2 ? "update" : "role";
        this.$router.push({
          name: "/commonManager/module/components/" + pathurl,
          params: { data, dataList, title }
        });
      }
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
          this.$message.success('删除成功！');
          this.getList();
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/tree.scss";
</style>