<template>
  <div class="app-container">
    <div class="search-box onlyform-box">
      <!-- <p class="form-smtitle">{{title}}附件类型</p> -->
      <el-scrollbar>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-row>
        <el-col>
              <el-col :span="8" :xs="24">
                        <el-form-item label="班次" prop="Name">
                      <el-input v-model="form.Name" placeholder="请输入班次" />
                    </el-form-item>
              </el-col>
      
       </el-col> 
         <el-col>
              <el-col :span="8" :xs="24">
            <el-form-item label="开始时间" prop="StartTime">
            <el-time-select v-model="form.StartTime" :picker-options="pickerOptions" placeholder="请选择时间" />
          </el-form-item>
             </el-col> 
                  </el-col> 
          <el-col>
              <el-col :span="8" :xs="24">
                <el-form-item label="间隔天数" prop="Period">
            <el-input-number v-model="form.Period" :min="0" :max="99" controls-position="right" />
          </el-form-item>
     </el-col> 

     <el-col>
              <el-col :span="8" :xs="24">
            <el-form-item label="结束时间" prop="EndTime">
            <el-time-select v-model="form.EndTime" :picker-options="pickerOptions" placeholder="请选择时间" />
          </el-form-item>
             </el-col> 
                  </el-col> 

        <el-col>
              </el-col>

 <el-col :span="8" :xs="24">
                           <el-form-item label="备注" prop="Remark">
            <el-input v-model="form.Remark" placeholder="" />
          </el-form-item>
             </el-col>  
         </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check" @click="handleSubmit" :loading="loading">保 存</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>
    </div>

  </div>
</template>

<script>
import {
  add,
  update,
} from "@/api/runningDuty/dutyConfiguration/classTime";
import {

  fetchCharactorType
} from "@/api/runningDuty/dutyConfiguration";
export default {
  data() {
    const rules = {
        Name: [
        {
          required: true,
          message: "请输入角色",
          trigger: "blur"
        }
      ],
      StartTime: [
        {
          required: true,
          message: "请选择开始时间"
        }
      ],
       EndTime: [
        {
          required: true,
          message: "请选择结束时间"
        }
      ],
      Period: [
        {
          required: true,
          message: "请输入间隔天数"
        }
      ]
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      charactorTypeList:[]
    };
  },
  created() {
    const {data } = this.$route.params
    this.reset(data);
    this.getCharactorType();
  },
  
  methods: {

    getCharactorType() {
      fetchCharactorType({}).then(r => {
        this.charactorTypeList = r.data;
      });
    },

    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          Id:'',
          Name: "",
          ShiftTypeId: "",
          EndTime:"",
          Remark:'',
          StartTime:'',
                    Period: 0,
        },
        data
      );

    },

    handleOpen() {
     const ShiftTypeId = this.form.ShiftTypeId
      this.$router.push({
        name: "/runningDuty/dutyConfiguration/classTime/components/index",
        params: {ShiftTypeId}
      });
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          const fn = this.form.Id ? update : add;
          //添加用户
          fn(this.form)
            .then(response => {
              //消息提示
              var txt = this.form.Id ? '编辑成功！' : '新增成功！';
              this.$message.success(txt);

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

/deep/.largelabel {
  .el-form-item__label {
    width: 180px !important;
  }
  .el-form-item__content {
    margin-left: 180px !important;
  }
}

/deep/.largelabel1 {
  .el-form-item__label {
    width: 140px !important;
  }
  .el-form-item__content {
    margin-left: 140px !important;
  }
}
/deep/.largelabel2 {
  .el-form-item__label {
    width: 140px !important;
  }
  .el-form-item__content {
    margin-left: 140px !important;
  }
}
.avatar {
  width: 100%;
  height: 100%;
}
.avatar-wrap {
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
}
</style>