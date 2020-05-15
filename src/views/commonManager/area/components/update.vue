<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <p class="form-smtitle">{{title}} </p>
      <el-scrollbar>
        <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="110px" :inline-message="true" style="width:600px">
          <el-row>
            <el-col :span="24" v-if="form.type==2||form.type==3">
              <el-form-item label="省份" prop="p_parentKey">
                <el-select v-model="form.p_parentKey" clearable  @change="changeCitys">
                  <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in dataList" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="form.type==3">
              <el-form-item label="城市" prop="parentKey">
                <el-select v-model="form.parentKey" clearable  :disabled="isdisabled">
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
              <el-form-item label="邮编">
                <el-input v-model="form.zipCode" placeholder="请输入邮编" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="排序号" prop="sortindex">
                <el-input-number v-model="form.sortindex" controls-position="right" :min="0" style="width:100px" />
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">

        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
          <el-button @click="handleOpen(null)">取 消</el-button>
        </div>
      </el-col>

    </div>
  </div>
</template>

<script>
import { update } from "@/api/commonManager/area";
export default {
  data() {
    const rules = {
      key: [
        {
          required: true,
          message: "代码不能为空",
          trigger: "blur"
        }
      ],
      name: [
        {
          required: true,
          message: "名称不能为空",
          trigger: "blur"
        }
      ],
      zipCode: [
        {
          required: true,
          message: "邮编不能为空",
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
      isdisabled: false
    };
  },
  created() {
    let { data, title, dataList, citydataList } = this.$route.params;
    this.dataList = dataList;
    this.title = title;
    this.citydataList = citydataList;
    this.reset(data);
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
      console.log(key);
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
    handleOpen(data) {
      this.$router.push({ name: "/commonManager/area/index" });
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
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
</style>