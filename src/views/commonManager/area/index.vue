<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" v-hasPermi="['system:menu:query']">搜索</el-button> -->
         <el-dropdown @command="handleCommand" >
          <el-button type="primary" size="mini"  icon=" el-icon-circle-plus-outline">
            新增<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">省份</el-dropdown-item>
            <el-dropdown-item command="b">城市</el-dropdown-item>
            <el-dropdown-item command="c">区域/县</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate" :disabled="operateId==''">修改</el-button>
        <el-button type="primary" icon="el-icon-delete" size="mini" @click="handleDelete" :disabled="operateId==''">删除</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10">
      <el-col :xs="{span: 24}" :span="6" class="treebox">
        <el-tree :data="dataList" :props="defaultProps" class="comheight" :highlight-current="true" @node-click="handleNodeClick" :expand-on-click-node="false"></el-tree>
      </el-col>
      <el-col :xs="{span: 24}" :span="18">
        <div class="bg-white comheight ">
          <div v-show="data&&data.Key" class="infobox">
            <p>代码：{{data.Key}}</p>
            <p v-if="data.ParentKey">父级地区代码：{{data.ParentKey}}</p>
            <p>名称：{{data.Name}}</p>
            <p>类型：{{data.Type==1?'省级':data.Type==2?'市级':'区/县'}}</p>
            <p>邮编：{{data.ZipCode}}</p>
            <p>路径：{{data.Location}}</p>
          </div>
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
          this.loading = false;
        })
        .finally(v => (this.loading = false));
    },
    getInfo() {
      const id = this.operateId;
      getInfo({ key:id }).then(r => {
        this.data = Object.assign({}, r.data);
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
      target.title = "添加";
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
      }
      target.dataList = this.dataList;
      target.title = "添加";
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
      target.title = "修改";
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