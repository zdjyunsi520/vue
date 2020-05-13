<template>
  <div class="app-container">
    <div class="search-box">
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-button type="primary" icon="el-icon-search"  @click="handleQuery" v-hasPermi="['system:menu:query']">搜索</el-button> -->
         <el-dropdown @command="handleCommand" >
          <el-button type="primary"   icon=" el-icon-circle-plus-outline">
            新增<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">省份</el-dropdown-item>
            <el-dropdown-item command="b">城市</el-dropdown-item>
            <el-dropdown-item command="c">区域/县</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" icon="el-icon-edit"  @click="handleUpdate" :disabled="operateId==''">修改</el-button>
        <el-button type="primary" icon="el-icon-delete"  @click="handleDelete" :disabled="operateId==''">删除</el-button>
      </el-form-item>
    </el-form>
    </div>

    <el-row :gutter="20" class="containerbox">
      <el-col :xs="{span: 24}" :span="6" class="treebox comheight">
        <el-scrollbar style="height:100%"   v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
          <el-tree :data="dataList" :props="defaultProps"  :highlight-current="true" @node-click="handleNodeClick" :expand-on-click-node="false"></el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :xs="{span: 24}" :span="10" class="comheight">
        <div class="bg-white  infobox">
          <el-scrollbar >
          <el-form label-position="top" :model="smform" v-if="data&&data.Key">
            <el-form-item>
              <el-form-item label="代码">
                <el-input v-model="smform.Key" disabled></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item label="父级地区代码" v-if="smform.ParentKey">
              <el-input v-model="smform.ParentKey" disabled></el-input>
            </el-form-item>
            <el-form-item>
              <el-form-item label="名称">
                <el-input v-model="smform.Name" disabled></el-input>
              </el-form-item>
            </el-form-item>
            <!-- <el-form-item>
              <el-form-item label="类型">
                <el-input v-model="smform.Type" disabled></el-input>
              </el-form-item>
            </el-form-item> -->
            <el-form-item >
              <el-form-item label="邮编">
                <el-input v-model="smform.ParentKey" disabled></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item >
              <el-form-item label="路径">
                <el-input v-model="smform.ParentKey" disabled></el-input>
              </el-form-item>
            </el-form-item>
          </el-form>
          <div v-else class="tips">
            暂无数据
          </div>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
    <update ref="update" @getList="getList123"></update>
    <add ref="add" @getList="getList123"></add>
  </div>
</template>

<script>
import { fetchList, getInfo,deleted } from "@/api/commonManager/area";
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
      data: {},
      level:'',
      smform: {}
    };
  },
  created() {
    this.getList();
  },

  methods: {
     handleCommand(commond) {
      if (commond == "a") {
        this.handleAdd();
      } else{
        this.handleAddClass(commond);
     
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
        })
        .finally(v => (this.loading = false));
    },
    getInfo() {
      const id = this.operateId;
      getInfo({ key:id }).then(r => {
        this.data = Object.assign({}, r.data);
          this.smform = Object.assign({}, r.data);
          this.smform.Type =
            this.smform.Type == 1
              ? "省级"
              : this.smform.Type == 2
              ? "市级"
              : "区/县";
      });
    },
    getList123() {
      this.getList();
      this.getInfo();
    },
    handleNodeClick(obj,node,obj2) {
      console.log(333,obj,node,obj2)
      this.operateId = obj.key;
      this.level = node.level;
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
      target.hascity=false;
      target.hasprovince=false;
      target.handleOpen();
      target.title = "省份";
    },
    handleAddClass(num) {
      const target = this.$refs.add;
      if (num =='b') {
        target.hasprovince=true;
        target.hascity=false;
        if(this.level==1){
          const p_parentKey = this.operateId;
          target.handleOpen({ p_parentKey });
        }else{
          target.handleOpen();
        }
        target.title = "城市";
      }else{
        const parentKey = this.operateId;
        let p_parentKey='';
        target.hascity=true;
        target.hasprovince=true;
        for (let j = 0; j < this.dataList.length; j++) {
          const ele = this.dataList[j];
          if (ele.childs) {
            for (let i = 0; i < ele.childs.length; i++) {
              const ele_i = ele.childs[i];
              if (ele_i.key == this.operateId) {
                p_parentKey = ele.key;
                target.citydataList = ele.childs;
              }
            }
          }
        }
        if(this.level==2){
          target.handleOpen({ parentKey , p_parentKey });
        }else{
          target.handleOpen();
        }
        target.title = "区域/县";
      }
      target.dataList = this.dataList;
    },
    /** 修改按钮操作 */
    handleUpdate() {
      let target;
      let data, url, name, key, type, sortindex, parentKey,p_parentKey,zipCode;
      name = this.data.Name;
      type = this.data.Type;
      url = this.data.Location;
      key = this.data.Key;
      zipCode = this.data.ZipCode;
      sortindex = '';

      target = this.$refs.update;
      if (type==2) {
        p_parentKey = this.data.ParentKey;
      }else if (type==3) {
          for (let j = 0; j < this.dataList.length; j++) {
            const ele = this.dataList[j];
            if (ele.childs) {
              for (let i = 0; i < ele.childs.length; i++) {
                const ele_i = ele.childs[i];
                if (ele_i.key == this.data.ParentKey) {
                  p_parentKey = ele.key;
                  parentKey = this.data.ParentKey;
                  target.citydataList = ele.childs;
                }
              }
            }
          }
      }

      data = {url, key,name,type, parentKey, p_parentKey,zipCode,sortindex };
      target.dataList = this.dataList;
      console.log(data)
      target.handleOpen(data);
      target.title = "修改地区信息";
    },

    /** 删除按钮操作 */
    handleDelete() {
      this.$confirm('是否确认删除名称为"' + this.operateId + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(v => {
        const key = this.operateId;
        deleted({ key }).then(r => {
          this.$message.success(r.msg);
          this.getList();
        })
      })
    }
  }
};
</script>
<style lang="scss" scoped>
</style>