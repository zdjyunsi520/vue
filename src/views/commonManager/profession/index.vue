<template>
  <div class="app-container">
    <div class="search-box marginbottom15">
      <el-form :inline="true">
        <el-form-item>
          <!-- <el-button type="primary" icon="el-icon-search" @click="handleQuery" v-hasPermi="['system:menu:query']">搜索</el-button> -->
          <el-dropdown @command="handleCommand" placement="bottom-start">
            <el-button type="primary" icon=" el-icon-circle-plus-outline">
              新增
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">新增类别</el-dropdown-item>
              <el-dropdown-item command="b">新增分类</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" icon="el-icon-edit-outline" plain @click="handleUpdate" :disabled="operateId==''">修改</el-button>
          <el-button type="info" icon="el-icon-delete" plain @click="handleDelete" :disabled="operateId==''">删除</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row :gutter="20" class="containerbox dragbox"   ref="dragbox">
      <el-col :xs="{span: 24}"  class="treebox comheight dragleft" >
        <div style="background:#fff;height:100%">
        <el-scrollbar style="height:100%" v-loading="loading" element-loading-text="Loading" element-loading-spinner="el-icon-loading">
          <el-tree :data="dataList" :props="defaultProps" :highlight-current="true" @node-click="handleNodeClick" :default-expand-all="true" :expand-on-click-node="false"></el-tree>
        </el-scrollbar>
        </div>
      </el-col>
      <el-col class="dragresize">
        <span class="iconslider">
          <svg-icon icon-class="ic_drag" style="font-size:16px;margin-left:-5px;" />
          <i class="el-icon-arrow-left" style="font-size:12px;margin-left:-2px;"
          />
        </span>
      </el-col>
      <el-col :xs="{span: 24}"    class="comheight dragright">
        <div class="bg-white infobox">
          <el-scrollbar >
            <el-form label-position="top" :model="smform" v-if="data&&data.Key">
                <el-form-item label="代码">
                  <el-input v-model="smform.Key" disabled></el-input>
                </el-form-item>
                <el-form-item label="名称">
                  <el-input v-model="smform.Name" disabled></el-input>
                </el-form-item>
                <el-form-item label="排序">
                  <el-input v-model="smform.SortIndex" disabled></el-input>
                </el-form-item>
              <el-form-item label="父级" v-if="smform.ParentKey">
                <el-input v-model="smform.ParentKey" disabled></el-input>
              </el-form-item>
            </el-form>
            <div v-else class="tips">
              暂无数据
            </div>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchList, getInfo, deleted } from "@/api/commonManager/profession";

export default {
  name: "profession",
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
      data: {},

    };
  },
  created() {
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
          // this.dataList = response.data;
          this.loading = false;
          this.dataList.length &&
            this.handleNodeClick(this.dataList[0], { level: 1 });
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
      const parentKey = this.addId;
      const type = 2;
      const data = { parentKey, type };
      const title = "新增分类";
      const dataList = this.dataList;
      this.$router.push({
        name: "/commonManager/profession/components/add",
        params: { data, title, dataList }
      });
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
      const title = "修改信息";
      const dataList = this.dataList;
      data = { name, key, type, sortindex, parentKey };
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
@import '../../../styles/tree.scss';
</style>