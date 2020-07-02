<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>
      <el-scrollbar class="marginright-fx">
        <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="80px" :inline-message="true" >
          <el-row>
            <el-col :span="24" v-if="hasprovince">
              <el-form-item label="省份" prop="p_parentKey">
                <el-select v-model="form.p_parentKey" clearable @change="changeCitys">
                  <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in dataList" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="城市" prop="parentKey" v-if="hascity">
                <el-select v-model="form.parentKey" clearable :disabled="isdisabled">
                  <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in citydataList" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="代码" prop="key">
                <el-input v-model="form.key" placeholder="请输入代码" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="邮编" prop="zipCode">
                <el-input v-model="form.zipCode" placeholder="请输入邮编" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="排序号" prop="sortindex">
                <el-input-number v-model="form.sortindex" placeholder="请输入排序号" controls-position="right" :min="1" :max="9999" />
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">

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
import { add } from "@/api/commonManager/area";
import IconSelect from "@/components/IconSelect";
export default {
  components: { IconSelect },
  data() {
    const rules = {
      key: [
        {
          pattern: /^[^\u4e00-\u9fa5]{1,18}$/,
          required: true,
          message: "请输入18位以内的数字或字母或特殊符号",
          trigger: "blur"
        }
      ],
      name: [
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,12}$/,
          required: true,
          message: "请输入12位以内的汉字或数字或字母",
          trigger: "blur"
        }
      ],
      zipCode: [
        {
          pattern: /^\d{1,10}$/,
          required: true,
          message: "请输入10位以内的数字"
        }
      ],
      sortindex: [
        {
          pattern: /^\d{1,4}$/,
          required: true,
          message: "请输入4位以内的数字"
        }
      ],

      p_parentKey: [
        {
          required: true,
          message: "此处不能为空",
          trigger: "blur"
        }
      ],
      parentKey: [
        {
          required: true,
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
      title: "",
      // 角色选项
      roleOptions: [],
      deptType: "",
      dataList: [],
      citydataList: [],
      isdisabled: false,
      hasprovince: false,
      hascity: false
    };
  },
  created() {
    let {
      data,
      dataList,
      hascity,
      hasprovince,
      title,
      citydataList
    } = this.$route.params;
    this.dataList = dataList;
    this.title = title;
    this.hasprovince = hasprovince;
    this.citydataList = citydataList;
    this.reset(data);
    this.hascity = hascity;
  },
  computed: {},
  methods: {
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          key: "",
          name: "",
          zipCode: "",
          parentKey: "",
          p_parentKey: "",
          type: "",
          sortindex: 1
        },
        data
      );
    },
    //省市级联
    changeCitys(key) {
      for (let j = 0; j < this.dataList.length; j++) {
        const ele = this.dataList[j];
        if (ele.key == key) {
          if (ele.childs) {
            this.citydataList = ele.childs;
            this.form.parentKey = "";
            this.isdisabled = false;
          } else {
            this.isdisabled = true;
          }
          break;
        }
      }
    },
    handleOpen() {
      const data = this.form;
      this.$router.push({
        name: "/commonManager/area/index",
        params: { data }
      });
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          if (this.hascity) {
            this.form.type = 3;
          } else if (this.hasprovince) {
            this.form.type = 2;
            this.form.parentKey = this.form.p_parentKey;
          } else {
            this.form.type = 1;
          }
          delete this.form.p_parentKey;
          add(this.form)
            .then(response => {
              //消息提示
              this.$message.success("新增成功！");
              //刷新列表
              this.form.key = response.data.Key;
              // this.$emit("getInfo");
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
/deep/.el-form-item__error--inline {
  position: absolute;
  top: 50%;
  margin-top: -10px;
  width: 100%;
}
/deep/.onlyform-box .el-form .el-form-item {
  width: 350px;
}
</style>