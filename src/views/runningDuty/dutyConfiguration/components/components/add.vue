<template>
  <el-dialog width="800px" :title="title+'岗位'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" center>

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="岗位名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入岗位名称" />
          </el-form-item>
          <el-form-item label="班次" prop="starttime">
            <el-select v-model="form.CharaType">
              <el-option label="请选择" value></el-option>
              <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in classTimeList" />
            </el-select>
          </el-form-item>
          <el-form-item label="角色" prop="period">
            <el-select v-model="form.CharaType">
              <el-option label="请选择" value></el-option>
              <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in classTimeList" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </div>
    <!-- 添加或修改参数配置对话框 end -->
  </el-dialog>
</template>

<script>
import { add } from "@/api/runningDuty/dutyConfiguration/job";
import { fetchList } from "@/api/runningDuty/dutyConfiguration/classTime";
export default {
  props: {
    shiftTypeId: {
      type: String,
      required: true,
      default: ""
    }
  },
  watch: {
    shiftTypeId(shiftTypeId) {
      shiftTypeId &&
        fetchList({ shiftTypeId }).then(r => {
          this.classTimeList = r.data;
        });
    }
  },
  data() {
    const rules = {
      name: [
        {
          required: true,
          message: "请输入岗位名称",
          trigger: "blur"
        }
      ],
      starttime: [
        {
          required: true,
          message: "请选择班次",
          trigger: "blur"
        }
      ],
      endtime: [
        {
          required: true,
          message: "请选择角色",
          trigger: "blur"
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
      classTimeList: []
    };
  },
  created() {},

  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          name: "",
          characterId: "",
          shiftId: "",
          dutyId: ""
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
              this.$emit("getList");
              this.handleOpen();
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
</style>