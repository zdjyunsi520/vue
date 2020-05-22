<template>
  <div class="app-container">
    <div class="search-box onlyform-box" style="padding-bottom: 123px;">
      <p class="form-smtitle">{{title}} </p>
      <div class="roletable-box">
        <el-scrollbar>
          <!-- <div class="search-box onlyform-box" ref="containerbox" style="padding-bottom: 150px;"> -->
          <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="30px" style="padding:0">

            <ul style="padding-left: 0px;" v-if="moduleList&&moduleList.length>0">
              <li class="first-box">
                <div>
                  <el-checkbox @change="handleChangeFarther">角色</el-checkbox>
                </div>
              </li>
              <li style="background-color: #fff;">
                <div v-for="(item,index) in moduleList" :key="index">
                  <ul>
                    <li style="width:180px">
                      <div>
                        <el-checkbox @change="handleChange(item)" v-model="item.IsSelect">{{item.RoleName}}</el-checkbox>
                      </div>
                    </li>
                    <li>
                      <div v-for="childItem in item.ModuleData" :key="childItem.ModuleId">
                        <ul>
                          <li style="min-width:180px">
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
          <el-table :data="moduleList" border :height="moduleList.length>0?tableHeight:'0'">
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
  </div>
</template>

<script>
import {
  setRole as update,
  getRole as getInfo
} from "@/api/systemManager/organization";
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
      tableHeight: "0",
      form: {
        id: "",
        name: "",
        key: "",
        powers: [],
        sortindex: 1
      },
      farther: false,
      rules,
      dialogVisible: false,
      loading: false,
      title: "权限编辑",
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
    const data = this.$route.params.data;
    this.getInfo(data);
  },
  mounted() {
    let _this = this;
    window.onresize = () => {
      _this.setTableHeight();
    };
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    setCheck(item) {
      item.IsSelect = !item.IsSelect;
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
      getInfo(data)
        .then(({ data }) => {
          this.moduleList = data;
          this.setTableHeight();
        })
        .finally(v => (this.loading = false));

      this.reset(data);
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          powers: []
        },
        data
      );
    },
    handleOpen(data) {
      let name = "/systemManager/organization/index";
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
          this.form.powers = [
            {
              RoleId: "49305f31-088b-4cfe-8860-2ffe99fa7cb7",
              ModuleId: "817ef1a8-f56b-49a5-b1d2-5803af77b886"
            }
          ];
          // this.moduleList.forEach(v => {
          //   if (v.IsSelect) {
          //     const RoleId = v.RoleId;
          //     this.form.powers.push({ RoleId });
          //   }
          // });

          // this.moduleList.forEach((v, i) => {
          //   if (v.IsSelect) this.form.powers.push(v.RoleId);
          //   if (v.ModuleData)
          //     v.ModuleData.forEach(v => {
          //       if (v.IsSelect) this.form.powers.push(v.ModuleId);
          //       if (v.IsSelect) this.form.powers.push(v.ModuleId);
          //       if (v.Childs)
          //         v.Childs.forEach(v => {
          //           if (v.IsSelect) this.form.powers.push(v.ModuleId);
          //         });
          //     });
          // });

          // this.form.powers = [...new Set(this.form.powers)];
          //this.form.moduleids = this.form.powers.join(",");
          //  this.form.powers = "";
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
</style>