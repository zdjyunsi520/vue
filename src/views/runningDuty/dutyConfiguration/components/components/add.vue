<template>

  <el-dialog :title="title+'岗位'" :visible.sync="dialogVisible" center width="550px" append-to-body :close-on-click-modal="false">
    <el-form :model="form" ref="form" class="xl-query" :rules="rules" label-width="130px">
      <el-form-item label="岗位名称" prop="name">
        <el-input type="text" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="班次" prop="shiftId">
        <el-select v-model="form.shiftId" style="width:100%;">
          <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in classTimeList" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="characterId">
        <el-select v-model="form.characterId" style="width:100%;">
          <el-option :key="index" :label="item.Name" :value="item.Id" v-for="(item,index) in roleList" />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">保 存</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </span>
  </el-dialog>

</template>

<script>
import { add } from "@/api/runningDuty/dutyConfiguration/job";
import { fetchList } from "@/api/runningDuty/dutyConfiguration/classTime";
import { fetchList as fetchList1 } from "@/api/runningDuty/dutyConfiguration/role";
export default {
  props: {
    shiftTypeId: {
      type: String,
      required: true,
      default: ""
    },
    charaType: {
      type: String,
      required: true,
      default: ""
    },
    dutyId: {
      type: String,
      required: true,
      default: ""
    }
  },
  watch: {
    shiftTypeId(shiftTypeId) {
      shiftTypeId &&
        fetchList({ shiftTypeId, pageno: 1, pagesize: 999999 }).then(r => {
          this.classTimeList = r.data;
        });
    },
    charaType(charatypeId) {
      charatypeId &&
        fetchList1({ charatypeId, pageno: 1, pagesize: 999999 }).then(r => {
          this.roleList = r.data;
        });
    },
    dutyId(dutyId) {
      this.form.dutyId = dutyId;
      console.log(this.form.dutyId, dutyId, 333);
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
      shiftId: [
        {
          required: true,
          message: "请选择班次",
          trigger: "blur"
        }
      ],
      characterId: [
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
          dutyId: this.dutyId
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
               var txt = this.form.id ? '编辑成功！' : '新增成功！';
              this.$message.success(txt);
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