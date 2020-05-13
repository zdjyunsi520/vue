<template>
  <div style="margin-top:50px;">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资产属性" prop="property">
            <el-select v-model="form.property" size="small">
              <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in assetAttributeType" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配电室类型" prop="type">
            <el-select v-model="form.type" size="small">
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in powerRoomType" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="电压等级" prop="voltlevel">
            <el-select v-model="form.voltlevel" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in voltageLevelType" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属单位" prop="tenantId">
            <el-select v-model="form.tenantId" size="small">
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="型号" prop="modelname">
            <el-input v-model="form.modelname" placeholder="请输入型号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运行状态" prop="status">
            <el-select v-model="form.status" size="small">
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in runningStateType" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="生产厂家" prop="factory">
            <el-input v-model="form.factory" placeholder="请输入生产厂家" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="投运日期" prop="starttime">
            <el-date-picker v-model="form.starttime" type="date" placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序号" prop="sortindex">
            <el-input-number v-model="form.sortindex" controls-position="right" :min="0"  />
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {
  add,
  fetchTree,
  update
} from "@/api/equipmentAccount/maintain/powerRoom";
import { mapGetters } from "vuex";
import { dateFortmat } from "@/utils";
export default {
  data() {
    const rule = [
      {
        required: true,
        message: "此处不能为空",
        trigger: "blur"
      }
    ];
    const rules = {
      name: rule,
      type: rule,
      tenantId: rule,
      status: rule,
      starttime: rule,
      property: rule,
      mobilephone: rule
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: ""
    };
  },
  created() {
    const { data, title } = this.$route.params;
    this.title = title;
    this.reset(data);
  },
  computed: {
    ...mapGetters({
      powerRoomType: "status/powerRoomType",
      assetAttributeType: "status/assetAttributeType",
      voltageLevelType: "status/voltageLevelType",
      runningStateType: "status/runningStateType",
      companyType: "status/companyType"
    })
  },
  methods: {
    handleElectron(v) {},
    /** 行业列表 */

    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          id: "",
          name: "",
          type: "",
          tenantId: "",
          tenantid: "",
          status: "",
          starttime: "",
          property: "",
          voltlevel: "",
          modelname: "",
          factory: "",
          sortindex: 1
        },
        data
      );
    },
    handleOpen(data) {
      this.$router.push({ name: "/equipmentAccount/maintain/index" });
    },
    handleMap() {},
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          const fn = this.form.id ? update : add;
          this.form.tenantid = this.form.tenantId;
          this.form.starttime = dateFortmat(this.form.starttime, "yyyy-MM-dd");
          //添加用户
          fn(this.form)
            .then(response => {
              //消息提示
              this.$message.success(response.msg);
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
</style>