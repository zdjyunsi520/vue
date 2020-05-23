<template>
  <div class="app-container">
    <div class="search-box onlyform-box" style="padding-bottom: 150px;">
      <p class="form-smtitle">{{title}} </p>
      <el-scrollbar>
        <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="100px" :inline-message="true" style="width:800px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" style="width:90%" />
          </el-form-item>
          <el-form-item label="角色标识" prop="key">
            <el-input v-model="form.key" placeholder="请输入角色标识" style="width:90%" />
          </el-form-item>
          <el-form-item label="排序号" prop="sortindex">
            <el-input-number v-model="form.sortindex" controls-position="right" :min="0" style="width:90%" />
          </el-form-item>
          <el-form-item label="模块权限">
            <el-row v-for="item in moduleList" :key="item.ModuleId">
              <el-col :span="24" class="medium-box">
                <el-checkbox @change="handleChange(item)" v-model="item.IsSelect">{{item.ModuleName}}</el-checkbox>
              </el-col>
              <el-row>
                <el-col :span="23" :push="1">
                  <el-row class="sm-box">
                    <el-col :span="6" v-for="checkbox in item.Childs" :key="checkbox.ModuleId">
                      <el-checkbox @change="handleChange(checkbox,item)" v-model="checkbox.IsSelect">{{checkbox.ModuleName}}</el-checkbox>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-row>
          </el-form-item>

        </el-form>
      </el-scrollbar>
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
import { update, getInfo, add, getInfo1 } from "@/api/commonManager/role";

export default {
  data() {
    const rules = {
      name: [
        {
          required: true,
          message: "名称不能为空",
          trigger: "blur"
        }
      ],
      key: [
        {
          required: true,
          message: "角色标识不能为空",
          trigger: "blur"
        }
      ],
      sortindex: [
        {
          required: true,
          message: "排序号不能为空",
          trigger: "blur"
        }
      ]
    };
    return {
      form: {
        id: "",
        name: "",
        key: "",
        moduleids: [],
        sortindex: 1
      },
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
      moduleList: []
    };
  },
  created() {
    let { data, title } = this.$route.params;
    this.title = title;
    this.getInfo(data);
  },
  methods: {
    handleChange(data, parent) {
      const isSelect = data.IsSelect;
      const childs = data.Childs || data.ModuleData;
      if (childs)
        childs.forEach(v => {
          v.IsSelect = isSelect;
          this.handleChange(v);
        });
      if (parent) {
        if (isSelect) {
          parent.IsSelect = true;
        } else {
          parent.IsSelect = !(
            parent.Childs.filter(v => v.IsSelect == false).length ==
            parent.Childs.length
          );
        }
      }
    },
    getInfo(data) {
      this.moduleList = [];
      this.loading = true;
      let id = "";
      if (data && data.id) {
        id = data.id;
      }
      if (id)
        getInfo({ id })
          .then(({ data }) => {
            this.moduleList = data.ModuleData;
          })
          .finally(v => (this.loading = false));
      else {
        getInfo1({})
          .then(r => {
            this.moduleList = r.data.map(v => {
              let ModuleId = v.id;
              let ModuleName = v.text;
              let IsSelect = false;
              let Childs = v.childs.map(v => {
                let ModuleId = v.id;
                let ModuleName = v.text;
                let IsSelect = false;
                return { ModuleId, ModuleName, IsSelect };
              });
              if (Childs.length == 0) Childs = null;
              return {
                ModuleId,
                ModuleName,
                IsSelect,
                Childs
              };
            });
          })
          .finally(v => (this.loading = false));
      }
      this.reset(data);
    },
    // getInfo(data) {
    //   this.loading = true;
    //   if (data && data.id) {
    //     const id = data.id;
    //     getInfo({ id })
    //       .then(({ data }) => {
    //         this.moduleList = data.ModuleData;
    //       })
    //       .finally(v => (this.loading = false));
    //   } else {
    //     this.loading = false;
    //   }
    //   this.reset(data);
    // },
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
      this.$router.push({
        name: "/commonManager/role/index",
        params: {}
      });
      return;
      //改变窗口状态
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        //关闭窗口时取消按钮转圈圈
        this.loading = false;
      }
      //表单重置
      this.getInfo(data);
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          this.form.moduleids = [];
          this.moduleList.forEach(v => {
            if (v.IsSelect) this.form.moduleids.push(v.ModuleId);
            if (v.Childs)
              v.Childs.forEach(v => {
                if (v.IsSelect) this.form.moduleids.push(v.ModuleId);
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
/deep/.el-select {
  width: 100%;
}

/deep/.el-form-item__error--inline {
  position: absolute;
  top: 50%;
  margin-top: -10px;
  width: 100%;
}

.medium-box {
  .el-checkbox {
    color: #333333;
    .el-checkbox__label {
      font-size: 16px !important;
    }
  }
}

.sm-box {
  border-radius: 2px;
  position: relative;
  border: dotted 1px #d5dbeb;
  padding: 10px 20px;
  margin: 20px 0;
  .el-checkbox {
    color: #666;
  }
  &::before {
    content: "";
    width: 22px;
    height: 60px;
    border-bottom: dotted 1px #d5dbeb;
    border-left: dotted 1px #d5dbeb;
    position: absolute;
    left: -22px;
    top: -32px;
  }
}
</style>