<template>
  <el-dialog width="80%" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center top="5vh">

    <!-- 添加或修改参数配置对话框 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-row>
        <el-col :span="12" :xs='24'>
          <el-form-item label="用电单位" prop="tenantId">
            <el-select v-model="form.tenantId" placeholder="请选择用电单位" style="width:100%">
              <el-option
                v-for="(item,index) in TenantIds"
                :key="index"
                :label="item.text"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs='24'>
          <el-form-item label="设备" prop="assetsIds">
            <el-select v-model="form.assetsIds" placeholder="请选择设备" style="width:100%">
              <el-option
                v-for="(item,index) in assetsIdss"
                :key="index"
                :label="item.text"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item label="缺陷等级" prop="rank">
            <el-select v-model="form.rank" placeholder="请选择设备" style="width:100%">
              <el-option
                v-for="(item,index) in ranks"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs='24'>
          <el-form-item label="发现人" prop="detecterId">
            <el-input v-model="form.detecterId" placeholder="请输入发现人" auto-complete="off"  />
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs='24'>
          <el-form-item label="发现时间" prop="detecttime">
            <el-date-picker v-model="form.detecttime" type="date" placeholder="请选择发现时间" style='width:100%' value-format="yyyy-MM-dd"  format="yyyy-MM-dd"> </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs='24'>
          <el-form-item label="安排消缺人" prop="processorId">
            <el-select v-model="form.processorId" placeholder="请选择消缺人" style="width:100%">
              <el-option
                v-for="(item,index) in processorIds"
                :key="index"
                :label="item.text"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs='24'>
          <el-form-item label="处理期限" prop="processdue">
            <el-date-picker v-model="form.processdue" type="date" placeholder="请选择处理期限" style='width:100%' value-format="yyyy-MM-dd"  format="yyyy-MM-dd"> </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="缺陷内容" prop="description">
            <el-input v-model="form.description" type="textarea"  :rows='5' placeholder="请输入缺陷内容" auto-complete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件" prop="attachmentkey">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        
        <el-col :span="12" :xs='24'>
          <el-form-item label="缺陷编号" prop="number">
            <el-input v-model="form.number" disabled   placeholder="编号自动生成"  />
          </el-form-item>
        </el-col>
        
        <el-col :span="12" :xs='24'>
          <el-form-item label="填报单位" prop="unit">
            <el-input v-model="form.unit"  disabled  />
          </el-form-item>
        </el-col>
        
        <el-col :span="12" :xs='24'>
          <el-form-item label="填报人" prop="reporterId">
            <el-input v-model="form.reporterId" disabled/>
          </el-form-item>
        </el-col>
        
        <el-col :span="12" :xs='24'>
          <el-form-item label="填报时间" prop="reporttime">
            <el-date-picker v-model="form.reporttime" type="datetime" style='width:100%' value-format="yyyy-MM-dd HH:mm:ss" disabled format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
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
import { getAssets,createAssetsBugs} from "@/api/biz";

export default {
  data() {
    const rules = {
      tenantId: [
        {
          required: true,
          message: "用电单位不能为空",
          trigger: "change"
        }
      ],
      tenantId: [
        {
          required: true,
          message: "用电单位不能为空",
          trigger: "change"
        }
      ],
      assetsIds: [
        {
          required: true,
          message: "设备不能为空",
          trigger: "change"
        }
      ],
      rank: [
        {
          required: true,
          message: "缺陷等级不能为空",
          trigger: "change"
        }
      ],
      tenantId: [
        {
          required: true,
          message: "用电单位不能为空",
          trigger: "change"
        }
      ],
      detecterId: [
        {
          required: true,
          message: "发现人不能为空",
          trigger: "blur"
        }
      ],
      detecttime: [
        {
          required: true,
          message: "发现时间不能为空",
          trigger: "change"
        }
      ],
      processorId: [
        {
          required: true,
          message: "消缺人不能为空",
          trigger: "change"
        }
      ],
      processdue: [
        {
          required: true,
          message: "处理期限不能为空",
          trigger: "change"
        }
      ],
      description: [
        {
          required: true,
          message: "缺陷内容不能为空",
          trigger: "blur"
        }
      ],
      
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      deptType: "",
      assetsIdss:[{
        id:'1E24AF6F-95E2-447C-B4DF-A8D0FC32587B',
        text:'设备1'
      }],
      processorIds:[{
        id:'33B25FEA-237B-417B-92B7-5525773CA0F2',
        text:'张珊珊'
      }],
      
      ranks:[],
      TenantIds:[],
      imageUrl:''
    };
  },
  created() {},
  methods: {
    // 获取设备列表
    // getAssets(){
    //   getAssets().then(response => {
    //      this.assetsIdss=response.data;
    //   }).catch(error => {
    //     console.log(error); 
    //   });
    // },
    
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          tenantId:'',
          assetsIds:'',
          rank:'',
          detecterId:'33B25FEA-237B-417B-92B7-5525773CA0F2',
          detecttime:'',
          processorId:'',
          processdue:'',
          description:'',
          attachmentkey:'',
          attachmenturl:'',
          number:'',
          unit:'福建迅腾电力能源管理有限公司',
          reporterId:'33B25FEA-237B-417B-92B7-5525773CA0F2',
          reporttime:'2020-04-27'
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
      }
      //表单重置
      this.reset(data);
      this.$nextTick(()=>{
          this.$refs.form.clearValidate();
      })
    },
    /** 提交按钮 */
    handleSubmit: function() {
    
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
          //添加
          createAssetsBugs(this.form)
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
    },
    // 附件上传成功
    handleAvatarSuccess(res, file) {
      this.form.attachmenturl = URL.createObjectURL(file.raw);
    },
    // 附件上传之前判断大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
    
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-select {
  width: 100%;
}
</style>