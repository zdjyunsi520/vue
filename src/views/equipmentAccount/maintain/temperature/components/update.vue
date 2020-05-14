<template>
  <div style="margin-top:50px;">
    <!-- <el-dialog top="20px" width="80%" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center> -->

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备编号" prop="serialcode">
            <el-input v-model="form.serialcode" placeholder="请输入设备编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通讯主机" prop="dataserverId">
            <el-select v-model="form.dataserverId" size="small">
              <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in communicationHostType" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据源地址" prop="attribute">
            <el-select v-model="form.attribute" size="small">
              <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in assetAttributeType" />
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
          <el-form-item label="运行状态" prop="isenable">
            <el-select v-model="form.isenable" size="small">
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
          <el-form-item label="CT变化" prop="CTratio">
            <el-input v-model="form.CTratio" placeholder="请输入CT变化" />
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
          <el-form-item label="PT变化" prop="RTratio">
            <el-input v-model="form.RTratio" placeholder="请输入PT变化" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" prop="status">
            <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>{{form.status?'启用':'未启用'}}
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
import { add, update } from "@/api/equipmentAccount/maintain/temperature";
import { mapGetters } from "vuex";
import { getCommunicateList } from "@/api/equipmentAccount/maintain/communicationHost";
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
      serialcode: rule,
      name: rule,
      tenantId: rule,
      starttime: rule,
      property: rule,
      dataserverId: rule,
      isenable: rule,
      status: rule
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      communicationHostType: null
    };
  },
  created() {
    const { data, title } = this.$route.params;
    this.title = title;
    this.fetechList(data);

    console.log(data);
    this.reset(data);
  },
  computed: {
    ...mapGetters({
      powerRoomType: "status/panelCabinetType",
      assetAttributeType: "status/assetAttributeType",
      voltageLevelType: "status/voltageLevelType",
      runningStateType: "status/runningStateType",
      companyType: "status/companyType"
    })
  },
  methods: {
    fetechList(data) {
      const tenantId = data.tenantId;
      const switchingroomid = data.parentId;
      getCommunicateList({ tenantId, switchingroomid }).then(r => {
        this.communicationHostType = r.data.map(v => {
          const key = v.Id;
          const value = v.Name;
          return { key, value };
        });
      });
    },
    handleElectron(v) {},
    /** 行业列表 */

    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          serialcode: "",
          name: "",
          tenantId: "",
          starttime: "",
          property: "",
          dataserverId: "",
          isenable: "",
          status: true,
          factory: "",
          modelname: "",
          CTratio: "",
          RTratio: "",
          parentId: "",
          id: "",
          sortindex: 1
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