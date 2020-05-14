<template>
  <div style="margin-top:50px;">
    <!-- <el-dialog top="20px" width="80%" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center> -->

    <!-- 添加或修改参数配置对话框 -->
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
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in assetAttributeType" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="间隔类型" prop="type">
            <el-select v-model="form.type" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in powerRoomType" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联设备" prop="assetsid">
            <el-select v-model="form.assetsid" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in connectType" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属单位" prop="tenantid">
            <el-select v-model="form.tenantid" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
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
          <el-form-item label="运行状态" prop="isenable">
            <el-select v-model="form.isenable" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in runningStateType" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否总进线" prop="ismainline">
            <el-select v-model="form.ismainline" size="small">
              <el-option label="请选择" value=""></el-option>
              <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in rwType" />
            </el-select>
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
            <el-input-number v-model="form.sortindex" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
      <el-button @click="handleOpen(null)">取 消</el-button>
    </div>
    <!-- 添加或修改参数配置对话框 end -->
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import { add, update } from "@/api/equipmentAccount/maintain/interval";
import { mapGetters } from "vuex";

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
      tenantid: rule,
      isenable: rule,
      starttime: rule,
      property: rule,
      assetsid: rule
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
    console.log(data);
    this.reset(data);
  },
  computed: {
    ...mapGetters({
      powerRoomType: "status/intervalType",
      assetAttributeType: "status/assetAttributeType",
      voltageLevelType: "status/voltageLevelType",
      runningStateType: "status/runningStateType",
      companyType: "status/companyType",
      connectType: "status/connectType",
      rwType: "status/rwType"
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
          tenantid: "",
          isenable: "",
          starttime: "",
          property: "",
          voltlevel: "",
          assetsid: "",
          assetstype: "",
          sortindex: 1,
          ismainline: "",
          parentid: ""
        },
        data
      );
    },
    handleOpen(data) {
      this.$router.push({
        name: "/equipmentAccount/maintain/index"
      });
    },
    handleMap() {},
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          const fn = this.form.id ? update : add;
          //添加用户
          fn(this.form)
            .then(response => {
              //消息提示
              this.$message.success(response.msg);
              //刷新列表
              //this.$emit("getList");
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
/deep/.el-select {
  width: 100%;
}
.bm-view {
  width: 100%;
  height: 300px;
}
</style>