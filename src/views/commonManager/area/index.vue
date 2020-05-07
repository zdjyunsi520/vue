<template>
  <div class="app-container">
    <el-row class="three-header">
      <el-col>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <el-row class="three-left app-container" :xs="24">
      <el-col :span="6">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="17" :offset="1">
        <el-row :gutter="20" class="xl-query">

          <!--用户数据-->
          <el-col :span="24" :xs="24">
            代码：
          </el-col>
          <el-col :span="24" :xs="24">
            名称：
          </el-col>
          <el-col :span="24" :xs="24">
            邮编：
          </el-col>
          <el-col :span="24" :xs="24">
            路径：
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <update ref="update" @getList="getList"></update>
  </div>
</template>

<script>
import { listUser as fetchList } from "@/api/system/user";

import update from "./components/update";

export default {
  name: "运营用户管理",
  components: { update },
  data() {
    return {
      deptType: null,
      // 遮罩层
      listLoading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,

      // 表单参数
      form: {
        userId: undefined,
        deptId: "",
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: "2",
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phone: undefined,
        status: undefined,
        deptId: undefined
      },
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  watch: {
    // 根据名称筛选分站树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data.list;
          this.total = response.data.total;
        })
        .finally(r => {
          this.listLoading = false;
        });
    },
    /** 查询角色列表 */
    getRoles() {
      listRole().then(response => {
        this.roleOptions = response.data.filter(v => v.status == 0);
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      const target = this.$refs.update;
      target.handleOpen();
      target.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const target = this.$refs.update;
      target.handleOpen(row);
      target.title = "修改信息";
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      const target = this.$refs.password;
      target.handleOpen(row);
      target.title = "修改密码";
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {
          this.msgSuccess("操作失败");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportUser(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/styles/three-part-structure.scss";
.xl-query {
  /deep/.el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-input__inner {
    width: 130px;
  }
  /deep/.el-date-editor.el-input {
    width: 200px;

    .el-input__inner {
      width: 200px;
    }
  }
}
.header {
  background: #f00;
}
</style>
