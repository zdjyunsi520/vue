<template>
  <div class="app-container">
    <div class="search-box onlyform-box" style="padding-bottom: 150px;">
      <p class="form-smtitle">{{title}}</p>

      <el-scrollbar>
        <!-- 添加或修改参数配置对话框 -->
        <el-form
          :model="form"
          ref="form"
          label-position="left"
          :rules="rules"
          label-width="110px"
          
        >
          <el-row>
            <el-col :span="11" :xs="24">
              <el-form-item label="用电单位" prop="tenantId">
                <el-select v-model="form.tenantId" placeholder="请选择用电单位" >
                  <el-option
                    v-for="(item,index) in TenantIds"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :push='1' :xs="24">
              <el-form-item label="设备" prop="assetsIds">
                <input type="hidden"  v-model="form.assetsIds" />
                <el-input v-model="form.assetsIds" placeholder="请选择设备" auto-complete="off"   @focus="getAssets"/>
                <!-- <el-select v-model="form.assetsIds" placeholder="请选择设备"  @visible-change="getAssets">
                  <el-option
                    v-for="(item,index) in assetsIdss"
                    :key="index"
                    :label="item.text"
                    :value="item.id"
                  ></el-option>
                </el-select> -->
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-col :span="11"  :xs="24">
                <el-form-item label="缺陷等级" prop="rank">
                  <el-select v-model="form.rank" placeholder="请选择设备"  @change="changeTime">
                    <el-option
                      v-for="(item,index) in ranks"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="11" :xs="24">
              <el-form-item label="发现人" prop="detecterId">
                <el-input v-model="form.detecterId" placeholder="请输入发现人" auto-complete="off" /> 
              </el-form-item>
            </el-col>
            <el-col :span="11" :push='1' :xs="24">
              <el-form-item label="发现时间" prop="detecttime" >
                <el-date-picker
                  v-model="form.detecttime"
                  type="datetime"
                  placeholder="请选择发现时间"
                   @change="changeTime"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  format="yyyy-MM-dd hh:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11" :xs="24">
              <el-form-item label="安排消缺人" prop="processorId">
                <el-select v-model="form.processorId" placeholder="请选择消缺人"   @focus="getProcessor">
                  <el-option
                    v-for="(item,index) in processorIds"
                    :key="index"
                    :label="item.text"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :push='1' :xs="24">
              <el-form-item label="处理期限" prop="processdue">
                <el-date-picker
                  v-model="form.processdue"
                  type="datetime"
                  placeholder="请选择处理期限"
                  
                  value-format="yyyy-MM-dd hh:mm:ss"
                  format="yyyy-MM-dd hh:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="缺陷内容" prop="description">
                <el-input
                  v-model="form.description"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入缺陷内容"
                  auto-complete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="附件" prop="attachmentkey">
                <!-- <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                   :before-upload='beforeAvatarUpload'
                  :on-success="handleAvatarSuccess"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"

                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload> -->
                <el-upload
                  action="http://apicommont.xtioe.com/File/Url"
                  list-type="picture-card" 
                  ref="upload"
                  name="filekey"
                  :http-request="uploadSectionFile"
                 >
                  <i class="el-icon-plus"></i>
                   <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" size="tiny">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>

              </el-form-item>
            </el-col>

            <el-col :span="11" :xs="24">
              <el-form-item label="缺陷编号" prop="number">
                <el-input v-model="form.number" disabled placeholder="编号自动生成" />
              </el-form-item>
            </el-col>

            <el-col :span="11" :push='1' :xs="24">
              <el-form-item label="填报单位" prop="unit">
                <el-input v-model="form.unit" disabled />
              </el-form-item>
            </el-col>

            <el-col :span="11" :xs="24">
              <el-form-item label="填报人" prop="reporterId">
                <el-input v-model="form.reporterId" disabled />
              </el-form-item>
            </el-col>

            <el-col :span="11" :push='1' :xs="24">
              <el-form-item label="填报时间" prop="reporttime">
                <el-date-picker
                  v-model="form.reporttime"
                  type="datetime"
                  
                  value-format="yyyy-MM-dd HH:mm:ss"
                  disabled
                  format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs="24" class="absolute-bottom">
        <div class="form-footer">
          <el-button
            type="primary"
            icon="el-icon-check"
            @click="handleSubmit"
            :loading="loading"
          >确 定</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>
    <el-dialog  title="设备选择"  :visible.sync="dialogAssetsVisible" center width="500px" style="height:80vh">
        {{assetsTree}}
        <el-scrollbar style="height:80%" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
            <el-tree :data="assetsTree" :props="defaultProps" node-key="id" :highlight-current="true" :default-expand-all="true" :expand-on-click-node="false"></el-tree>
          </el-scrollbar>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogAssetsVisible = false">确 定</el-button>
            <el-button @click="dialogAssetsVisible = false">取 消</el-button>
        </span>
    </el-dialog>
    <el-dialog  title="人员选择"  :visible.sync="dialogProcessorVisible" center width="500px" style="height:80vh">
        {{processorTree}}
        <el-scrollbar style="height:80%" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
            <el-tree :data="processorTree" :props="defaultProps" node-key="id" :highlight-current="true" :default-expand-all="true" :expand-on-click-node="false"></el-tree>
          </el-scrollbar>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogProcessorVisible = false">确 定</el-button>
            <el-button @click="dialogProcessorVisible = false">取 消</el-button>
        </span>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAssets, add, getInfo, update,imageUpload } from "@/api/biz";
import { getTrees} from "@/api/org";
import { mapGetters } from 'vuex';

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
      ]
    };
    return {
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      deptType: "",
      assetsIdss: [],
      processorIds: [
        {
          id: "33B25FEA-237B-417B-92B7-5525773CA0F2",
          text: "张珊珊"
        }
      ],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      ranks: [],
      TenantIds: [],
      imageUrl: "",
      dialogImageUrl: '',
      dialogVisible: false,
      dialogAssetsVisible: false,
      dialogProcessorVisible: false,
      assetsTree:[],
      processorTree:[],
    };
  },
  computed: {
    ...mapGetters(['name','userId']),
  },
  created() {
    let { data, title, TenantIds, ranks } = this.$route.params;
    this.title = title;
    this.TenantIds = TenantIds;
    this.ranks = ranks;
    if (data && data.Id) {
      this.getInfo(data);
    } else {
      this.reset(data);
    }
  },
  methods: {
    // 获取设备列表
    getAssets(){
        this.dialogAssetsVisible = true;
        getTrees().then(res => {
          this.assetsTree=res.data;
        this.dialogAssetsVisible = false;
        }).catch(error => {
          console.log(error);
        });
    },
    // 获取设备列表
    getProcessor(){
        this.dialogProcessorVisible = true;
        getTrees().then(res => {
          this.assetsTree=res.data;
          this.dialogAssetsVisible = false;
        }).catch(error => {
          console.log(error);
        });
    },
    // 缺陷关联发现时间
    changeTime(){
      var d = new Date(this.form.detecttime);
      var dtime;
      if (this.form.rank==1) {
        dtime= d.setMonth(d.getMonth() + 6);
      }else if (this.form.rank==2) {
        dtime= d.setMonth(d.getMonth() + 1);
      }else{
        dtime= d.setDate(d.getDate() + 1);
      }
      this.form.processdue = d;
    },

    // 表单重置
    reset(data) {
      var nowTime = new Date();
      var processdueTime = nowTime;
      processdueTime = new Date(processdueTime.setMonth(processdueTime.getMonth() + 6 ));
      this.form = Object.assign(
        {
          tenantId: "",
          assetsIds: "",
          rank: 1,
          detecterId: this.userId,
          detecttime: nowTime,
          processorId: "",
          processdue: processdueTime,
          description: "",
          attachmentkey: "",
          attachmenturl: "",
          number: "",
          unit: "",
          reporterId: "",
          reporttime: nowTime
        },
        data
      );
    },
    getInfo(data) {
      this.loading = true;
      if (data) {
        const id = { id: data.Id };
        if (id) {
          getInfo(id)
            .then(res => {
              this.reset(data);
              this.form = res.data;
              // this.form.StartTime = new Date(res.data.StartTime).getTime();
            })
            .finally(v => (this.loading = false));
        }
      } else {
        this.loading = false;
        this.reset(data);
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }
    },
    handleOpen(data) {
        this.$router.push({
        name: "/defect/orderList/index",
        params: {}
      });

      // //改变窗口状态
      // this.dialogVisible = !this.dialogVisible;
      // if (!this.dialogVisible) {
      //   //关闭窗口时取消按钮转圈圈
      //   this.loading = false;
      // }
      // //表单重置
      // this.reset(data);
      // this.$nextTick(() => {
      //   this.$refs.form.clearValidate();
      // });
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;

          // 上传图片
          // this.$refs.upload.submit();

          let fn;
          if (this.form.id) fn = update;
          else fn = add;
          fn(this.form)
            .then(res => {
              //消息提示
              this.$message.success(res.msg);
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
    // 删除附件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 预览附件
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 附件上传之前判断大小
    beforeAvatarUpload(file) {
      console.log(file);
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("上传图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    },
    uploadSectionFile(params) {
          const file = params.file,
            fileType = file.type,
            isImage = fileType.indexOf("image") != -1,
            isLt2M = file.size / 1024 / 1024 < 2;
          // 这里常规检验，看项目需求而定
          // if (!isImage) {
          //   this.$message.error("只能上传图片格式png、jpg、gif!");
          //   return;
          // }
          // if (!isLt2M) {
          //   this.$message.error("只能上传图片大小小于2M");
          //   return;
          // }
          // 根据后台需求数据格式
          const form = new FormData();
          // 文件对象
              console.log('params',params)
          form.append("filekey", params);
              console.log('form',form)
          // 本例子主要要在请求时添加特定属性，所以要用自己方法覆盖默认的action
          // form.append("clientType", 'xxx');
          // 项目封装的请求方法，下面做简单介绍
          imageUpload(form)
            .then(res => {
              console.log(res)
             //自行处理各种情况
              // const code = res && parseInt(res.code, 10);
              // if (code === 200) {
              //   // xxx
              // } else {
              //   // xxx
              // }
            })
            .catch(() => {
              // xxx
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