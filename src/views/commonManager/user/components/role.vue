<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>
      <div class="roletable-box">
        <el-scrollbar>
          <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="30px" style="padding:0">
            <ul style="padding-left: 0px;">
              <li class="first-box">
                <div>
                  <el-checkbox @change="handleChangeFarther">角色</el-checkbox>
                </div>
              </li>
              <li style="background-color: #fff;">
                <div v-for="(item,index) in moduleList" :key="index">
                  <ul>
                    <li style="width:200px">
                      <div>
                        <el-checkbox @change="handleChange(item)" v-model="item.IsSelect">{{item.RoleName}}</el-checkbox>
                      </div>
                    </li>
                    <li>
                      <div v-for="childItem in item.ModuleData" :key="childItem.ModuleId">
                        <ul>
                          <li>
                            <el-checkbox @change="handleChange(childItem)" v-model="childItem.IsSelect">{{childItem.ModuleName}}</el-checkbox>
                          </li>
                          <li class="last-box">
                            <div v-for="checkbox in childItem.Childs" :key="checkbox.ModuleId" class="smbox">
                              <!-- <el-checkbox v-model="checkbox.IsSelect">{{checkbox.ModuleName}}</el-checkbox> -->
                              <span @click="setCheck(checkbox)" :class="checkbox.IsSelect?'on':''">{{checkbox.ModuleName}}
                                <svg-icon v-if="checkbox.IsSelect" icon-class="ic_seletecd" class="svgicon" />
                              </span>
                            </div>
                          </li>
                        </ul>

                      </div>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            <!-- <el-form-item>
        <el-table :data="moduleList">
          <el-table-column prop="date" label="角色" width="180">
            <template slot="header">
              <el-checkbox @change="handleChangeFarther">角色</el-checkbox>
            </template>
            <template slot-scope="{row}">
              <el-checkbox @change="handleChange(row)" v-model="row.IsSelect">{{row.RoleName}}</el-checkbox>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="模块配置">
            <template slot-scope="{row}">

              <el-row v-for="item in row.ModuleData" :key="item.ModuleId" class="el-row-box">
                <el-col :span="24">
                  <el-checkbox @change="handleChange(item)" v-model="item.IsSelect">{{item.ModuleName}}</el-checkbox>
                </el-col>
                <el-row>
                  <el-col :span="23" :push="1">
                    <el-row class="el-row-box">
                      <el-col :span="6" v-for="checkbox in item.Childs" :key="checkbox.ModuleId">
                        <el-checkbox v-model="checkbox.IsSelect">{{checkbox.ModuleName}}</el-checkbox>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item> -->
          </el-form>
        </el-scrollbar>
      </div>
      <el-col :span="24" :xs='24' class="absolute-bottom">

        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check" @click="handleSubmit" :loading="loading">确 定</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>

    </div>
  </div>
</template>

<script>
import {
  updateRole as update,
  getRole as getInfo
} from "@/api/commonManager/user";
export default {
  data() {
    const rules = {
      roleName: [
        {
          required: true,
          message: "角色名称不能为空",
          trigger: "blur"
        }
      ],
      roleKey: [
        {
          required: true,
          message: "权限字符不能为空",
          trigger: "blur"
        }
      ],
      roleSort: [
        {
          required: true,
          message: "角色顺序不能为空",
          trigger: "blur"
        }
      ]
    };
    return {
      tableHeight: "",
      form: {
        id: "",
        name: "",
        key: "",
        moduleids: [],
        sortindex: 1
      },
      farther: false,
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      // 角色选项
      roleOptions: [],
      deptType: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      moduleList: [],
      list: []
    };
  },
  created() {
    let { data, title } = this.$route.params;
    this.title = title;
    this.getInfo(data);
  },
  methods: {
    setCheck(item) {
      item.IsSelect = !item.IsSelect;
    },
    setTableHeight() {
      this.tableHeight = this.$refs.containerbox.offsetHeight;
    },
    handleChangeFarther(isSelect) {
      this.moduleList.map(v => {
        v.IsSelect = isSelect;
        this.handleChange(v);
        return v;
      });
    },
    handleChange(data) {
      const isSelect = data.IsSelect;
      const childs = data.Childs || data.ModuleData;
      if (childs)
        childs.forEach(v => {
          v.IsSelect = isSelect;
          this.handleChange(v);
        });
    },
    getInfo(data) {
      this.loading = true;
      if (data && data.id) {
        const id = data.id;
        getInfo({ id })
          .then(({ data }) => {
            this.moduleList = data;
            this.setTableHeight();
          })
          .finally(v => (this.loading = false));
      } else {
        this.loading = false;
      }
      this.reset(data);
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          id: "",
          name: "",
          key: "",
          moduleids: [],
          sortindex: 1
        },
        data
      );
    },
    handleOpen(data) {
      let name = this.form.fromUrl
        ? this.form.fromUrl
        : "/commonManager/user/index";
      this.$router.push({
        name: name,
        params: {}
      });
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          this.form.moduleids = [];
          this.moduleList.forEach((v, i) => {
            if (v.IsSelect) this.form.moduleids.push(v.RoleId);
            if (v.ModuleData)
              v.ModuleData.forEach(v => {
                if (v.IsSelect) this.form.moduleids.push(v.ModuleId);
                if (v.Childs)
                  v.Childs.forEach(v => {
                    if (v.IsSelect) this.form.moduleids.push(v.ModuleId);
                  });
              });
          });
          //this.form.moduleids = [...new Set(this.form.moduleids)];
          this.form.moduleids = this.form.moduleids.join(",");
          if (this.form.id) {
            //保存修改
            update(this.form)
              .then(response => {
                //消息提示
                this.$message.success(response.msg);
                //刷新列表
                this.$emit("getList");
                //关闭窗口
                this.handleOpen();
              })
              .catch(r => {
                //取消按钮转圈圈
                this.loading = false;
              });
          } else {
            //添加用户
            add(this.form)
              .then(response => {
                //消息提示
                this.$message.success(response.msg);
                //刷新列表
                this.$emit("getList");
                //关闭窗口
                this.handleOpen();
              })
              .catch(r => {
                //取消按钮转圈圈
                this.loading = false;
              });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.xl-checkbox {
  .el-checkbox__label {
    font-weight: bold;
    color: #f00;
  }
  .el-checkbox__inner {
    border-color: #f00;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #f00;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #f00;
    border-color: #f00;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #f00;
  }
}
.onlyform-box {
  padding-bottom: 150px;
}
</style>