<template>
  <div class="app-container">
    <div class="search-box marginbottom15">
      <el-form :inline="true">
        <el-form-item>
          <!-- <el-button type="primary" icon="el-icon-search" @click="handleQuery" v-hasPermi="['system:menu:query']">搜索</el-button> -->
          <el-dropdown @command="handleCommand" placement="bottom-start">
            <el-button type="primary">
              <svg-icon icon-class='ic_add' class="tablesvgicon"></svg-icon>新增
              <i class="el-icon-arrow-down"></i>
            </el-button>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">新增类别</el-dropdown-item>
              <el-dropdown-item command="b">新增分类</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" plain @click="handleUpdate" :disabled="!currentNode.key">
            <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
          </el-button>
          <el-button type="info" icon="el-icon-delete" plain @click="handleDelete" :disabled="!currentNode.key">删除</el-button>
        </el-form-item>
      </el-form>
    </div>

    <commonTree :dataList="dataList" nodeKey="key" :loading="loading" @getInfo="getInfo" :currentNode="currentNode" :needToScroll="needToScroll" :expandedKeys='expandedKeys'>
      <div class="form-smtitle marginBottom30">基础信息 </div>
      <el-form label-position="top" :model="smform" v-if="data&&data.Key" style="padding-right: 20px;">
        <el-form-item label="代码">
          <el-input v-model="smform.Key" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="smform.Name" disabled></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="smform.SortIndex" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="父级" v-if="smform.ParentKey">
                    <el-input v-model="smform.ParentKey" disabled></el-input>
                </el-form-item> -->
      </el-form>
      <div v-else class="tips">
        请稍后...
      </div>

    </commonTree>
    <!-- </el-scrollbar>
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import { fetchList, getInfo, deleted } from "@/api/commonManager/profession";
import commonTree from "@/views/commonManager/commonTree";
export default {
  components: { commonTree },
  name: "profession",
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
      smform: {},
      data: {},
      currentNode: {},
      needToScroll: 1,
      expandedKeys: []
    };
  },
  created() {
    const { data } = this.$route.params;
    this.currentNode = data || {};
    this.getList();
  },

  mounted() {
    this.dragControllerDiv();
  },
  methods: {
    handleCommand(commond) {
      if (commond == "a") {
        this.handleAdd();
      } else if (commond == "b") {
        this.handleAddClass();
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
            return v;
          });
          // this.dataList = response.data;
          this.loading = false;
          // this.dataList.length &&
          //   this.handleNodeClick(this.dataList[0], { level: 1 });
        })
        .finally(v => (this.loading = false));
    },
    getInfo(node) {
      this.currentNode = node;
      const { key } = this.currentNode;
      this.expandedKeys = [];
      this.expandedKeys.push(this.currentNode.key);
      // const key = this.operateId;
      key &&
        getInfo({ key }).then(r => {
          this.data = Object.assign({}, r.data);
          this.smform = Object.assign({}, r.data);
        });
    },

    handleNodeClick({ key, lvl, ParentKey }) {
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
      const hasParentKey = false;
      const type = 1;
      const data = { type };
      const title = "新增类别";
      this.$router.push({
        name: "/commonManager/profession/components/add",
        params: { data, title }
      });
    },
    handleAddClass() {
      //  const parentKey = this.currentNode.id;
      const parentKey = "";
      const type = 2;
      const data = { parentKey, type };
      const title = "新增分类";
      const dataList = this.dataList;
      this.$router.push({
        name: "/commonManager/profession/components/add",
        params: { data, title, dataList }
      });
    },
    /** 编辑按钮操作 */
    handleUpdate() {
      let target;
      let data, name, key, type, sortindex, parentKey;
      name = this.data.Name;
      key = this.data.Key;
      type = this.data.Type;
      sortindex = this.data.SortIndex;
      parentKey = this.data.ParentKey;
      const id = "123";
      const title = "编辑信息";
      const dataList = this.dataList;
      data = { id, name, key, type, sortindex, parentKey };
      this.$router.push({
        name: "/commonManager/profession/components/add",
        params: { data, dataList, title }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm("是否确认删除选中的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(v => {
        const key = this.currentNode.key;
        deleted({ key }).then(r => {
          this.$message.success("删除成功！");
          this.currentNode = {};
          this.needToScroll++;
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