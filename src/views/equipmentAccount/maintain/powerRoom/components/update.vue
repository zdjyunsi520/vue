<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}}配电室</p>
      <el-scrollbar class="marginright-fx">
        <el-form ref="form" :model="form" label-position="right" :rules="rules" label-width="110px">
          <el-row>
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="资产属性" prop="property">
              <el-select v-model="form.property">
                <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in assetAttributeType" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="配电室类型" prop="type">
              <el-select v-model="form.type">
                <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in powerRoomType" />
              </el-select>
            </el-form-item>
            <el-form-item label="电压等级" prop="voltlevel">
              <el-select v-model="form.voltlevel">
                <el-option label="请选择" value></el-option>
                <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in voltageLevelType" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="所属单位" prop="tenantId">
              <el-select v-model="form.tenantId">
                <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
              </el-select>
            </el-form-item>
            <el-form-item label="型号" prop="modelname">
              <el-input v-model="form.modelname" placeholder="请输入型号" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="运行状态" prop="status">
              <el-select v-model="form.status">
                <el-option label="在运" :value="1" />
                <el-option label="停运" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="生产厂家" prop="factory">
              <el-input v-model="form.factory" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="投运日期" prop="starttime">
              <el-date-picker v-model="form.starttime" type="date" placeholder="请选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="出厂日期" prop="exfactorydate">
              <el-date-picker v-model="form.exfactorydate" type="date" placeholder="请选择日期"></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="排序号" prop="sortindex">
              <el-input-number v-model="form.sortindex" controls-position="right" :min="0" :max="9999" />
            </el-form-item>
          </el-row>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs="24" class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            <svg-icon icon-class='ic_save' class='tablesvgicon savesvgicon'></svg-icon>保 存
          </el-button>
          <el-button @click="handleOpen(null)">
            <svg-icon icon-class='ic_goback' class='tablesvgicon'></svg-icon>返 回
          </el-button>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
import { add, update } from "@/api/equipmentAccount/maintain/powerRoom";
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
      name: [
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,12}$/,
          required: true,
          message: "请输入12位以内的汉字或数字或字母",
          trigger: "blur"
        }
      ],
      modelname: [
        {
          pattern: /^[^\u4e00-\u9fa5]{1,18}$/,
          required: false,
          message: "请输入18位以内的数字或字母或特殊符号",
          trigger: "blur"
        }
      ],
      factory: [
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,24}$/,
          required: false,
          message: "请输入24位以内的汉字或数字或字母",
          trigger: "blur"
        }
      ],
      sortindex: [
        {
          pattern: /^\d{1,4}$/,
          required: false,
          message: "请输入4位以内的整数"
        }
      ],
      type: rule,
      tenantId: rule,
      status: rule,
      starttime: rule,
      property: rule,

      exfactorydate: [
        {
          required: false,
          message: "此处不能为空",
          trigger: "blur"
        }
      ]
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
          // id: "",
          name: "",
          type: "",
          tenantId: "",
          parentid: "",
          status: 1,
          starttime: dateFortmat(new Date(), "yyyy-MM-dd"),
          property: "",
          voltlevel: "",
          modelname: "",
          factory: "",
          sortindex: 1,
          exfactorydate: ""
        },
        data
      );
    },
    handleOpen() {
      const data = this.form;
      this.$router.push({
        name: "/equipmentAccount/maintain/index",
        params: { data }
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
          this.form.starttime = dateFortmat(this.form.starttime, "yyyy-MM-dd");
          if (this.form.exfactorydate)
            this.form.exfactorydate = dateFortmat(
              this.form.exfactorydate,
              "yyyy-MM-dd"
            );
          fn(this.form)
            .then(response => {
              //消息提示
              var txt = this.form.id ? "编辑成功！" : "新增成功！";
              this.$message.success(txt);
              this.form.id = response.data ? response.data.Id : this.form.id;
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
/deep/.onlyform-box .el-form .el-form-item {
  width: 370px;
  display: inline-block;
  vertical-align: text-top;
}
</style>