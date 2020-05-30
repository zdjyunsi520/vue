<template>
  <el-dialog width="500px" :title="title+'值班班组'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" center>

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="班组名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入班组名称" />
            <!-- <el-tag type="danger">先写死用电ID，不然无法添加</el-tag> -->
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="班组成员" prop="employeenames">
            <el-input v-model="form.employeenames" placeholder="请选择班组成员" @focus="getMembers"></el-input>
            <!-- <el-popover placement="bottom-start" width="600" trigger="click">
              <el-scrollbar class="xl-popover">
                <el-tree :default-expand-all="true" :props="props" :data="roleList" show-checkbox @check-change="handleCheckChange">
                </el-tree>
              </el-scrollbar>
              <el-input :value="form.employeenames" slot="reference"></el-input>
            </el-popover> -->

          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </div>

    <el-drawer title="人员选择" direction="rtl" :visible.sync="dialogMemberVisible" :show-close='false' center size="300px">
      <el-scrollbar style="height: 86vh;">
        <el-tree :default-expand-all="true" :props="props" :data="roleList" show-checkbox @check-change="handleCheckChange"></el-tree>
        <!-- <el-tree :data="roleList" :props="props" :check-strictly='true' node-key="id" ref="tree" show-checkbox :highlight-current="true" :default-expand-all="true" @check-change='checkchange' :expand-on-click-node="false"></el-tree> -->
      </el-scrollbar>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogMemberVisible = false">确 定</el-button>
        <el-button @click="dialogMemberVisible = false">取 消</el-button>
      </div>
    </el-drawer>

    <!-- 添加或修改参数配置对话框 end -->
  </el-dialog>
</template>

<script>
import { add, update } from "@/api/runningDuty/dutyConfiguration/group";
import { mapActions } from "vuex";
export default {
  data() {
    const rules = {
      name: [
        {
          required: true,
          message: "班组名称不能为空",
          trigger: "blur"
        }
      ],
      employeeIds: [
        {
          required: true,
          message: "请选择班组成员"
        }
      ],
      employeenames: [
        {
          required: true,
          message: "请选择班组成员"
        }
      ]
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      roleList: [],
      props: {
        label: "text",
        children: "childs"
      },
      employeeIds: [],
      dialogMemberVisible: false
    };
  },
  created() {
    this.getChildList();
  },
  computed: {},
  methods: {
    ...mapActions({ employee: "common/employee" }),

    handleCheckChange(row, select) {
      console.log(row);
      if (!row.lvl)
        if (select) {
          this.employeeIds.push(row);
        } else {
          this.employeeIds = this.employeeIds.filter(v => v.id != row.id);
        }
      this.form.employeeIds = this.employeeIds.map(v => v.id).join(",");
      this.form.employeenames = this.employeeIds.map(v => v.text).join(",");
    },
    getChildList() {
      this.employee().then(r => {
        this.roleList = r.data.map(v => {
          v.lvl = 1;
          return v;
        });
      });
    },
    // 选择人员
    getMembers() {
      this.dialogMemberVisible = true;
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          // tenantId: "cb1618fe-0c4c-4cc9-bfb4-08f3a243d7af",
          name: "",
          employeenames: "",
          employeeIds: ""
        },
        data
      );
    },
    handleOpen(data) {
      //改变窗口状态
      this.dialogVisible = !this.dialogVisible;
      if (!this.dialogVisible) {
        //关闭窗口时取消按钮转圈圈
        this.loading = false;
        this.$refs.form.clearValidate();
      }
      //表单重置
      this.reset(data);
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          const fn = this.form.id ? update : add;
          fn(this.form)
            .then(response => {
              this.msgSuccess(response.msg);
              this.handleOpen();
              this.$emit("getList");
            })
            .catch(r => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-select {
  width: 100%;
}
.xl-popover {
  height: 300px;
}
</style>