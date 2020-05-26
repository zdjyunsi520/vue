<template>
  <div class="app-container">
    <div class="search-box onlyform-box" style="padding-bottom: 150px;">
      
      <el-tabs v-model="activeName">
        <el-tab-pane label="登记情况" name="0"></el-tab-pane>
        <el-tab-pane label="消缺情况" name="1"></el-tab-pane>
        <el-tab-pane label="验收情况" name="2"></el-tab-pane>
      </el-tabs>

      <!-- <p class="form-smtitle">{{title}}</p> -->
      <el-scrollbar>
        <el-form :model="form" ref="form" label-position="left" :rules="rules" label-width="110px" v-if='activeName==0'>
          <el-row>
            <el-col :span="11" :xs="24">
              <el-form-item label="用电单位" prop="tenantId">
                <el-select v-model="form.tenantId" placeholder="请选择用电单位" @change="changeTenant">
                  <el-option v-for="(item,index) in TenantIds" :key="index" :label="item.Name" :value="item.Id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :push='1' :xs="24">
              <el-form-item label="设备" prop="assetsIds">
                <!-- <input type="hidden" v-model="form.assetsIds" /> -->
                <el-input v-model="form.assetsIdtext" placeholder="请选择设备" auto-complete="off" @focus="getAssets" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-col :span="11" :xs="24">
                <el-form-item label="缺陷等级" prop="rank">
                  <el-select v-model="form.rank" placeholder="请选择设备" @change="changeTime">
                    <el-option v-for="(item,index) in ranks" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="11" :xs="24">
              <el-form-item label="发现人" prop="detecterId">
                <el-input v-model="form.detecterId" placeholder="请输入发现人" />
                <!-- <el-select v-model="form.detecterId" placeholder="请选择">
                  <el-option v-for="(item,index) in processorIds" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select> -->
              </el-form-item>
            </el-col>
            <el-col :span="11" :push='1' :xs="24">
              <el-form-item label="发现时间" prop="detecttime">
                <el-date-picker v-model="form.detecttime" type="date" placeholder="请选择发现时间" @change="changeTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11" :xs="24">
              <el-form-item label="安排消缺人" prop="processorId">
                <el-select v-model="form.processorId" placeholder="请选择消缺人">
                  <el-option v-for="(item,index) in processorIds" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :push='1' :xs="24">
              <el-form-item label="处理期限" prop="processdue">
                <el-date-picker v-model="form.processdue" type="date" placeholder="请选择处理期限" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="23">
              <el-form-item label="缺陷内容" prop="description">
                <el-input v-model="form.description" type="textarea" :rows="5" placeholder="请输入缺陷内容" />
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
                <el-upload action="#" list-type="picture-card" ref="upload" accept=".jpg,.jpeg,.png" :before-upload='beforeAvatarUpload' :on-success="handleAvatarSuccess" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" name="filekey">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                </el-upload>

                <!-- <el-dialog :visible.sync="dialogVisible" size="tiny">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog> -->

              </el-form-item>
            </el-col>

            <el-col :span="11" :xs="24">
              <el-form-item label="缺陷编号" prop="number">
                <el-input v-model="form.number" disabled placeholder="自动生成" />
              </el-form-item>
            </el-col>

            <el-col :span="11" :push='1' :xs="24">
              <el-form-item label="填报单位" prop="unit">
                <el-input v-model="form.unit" disabled />
              </el-form-item>
            </el-col>

            <el-col :span="11" :xs="24">
              <el-form-item label="填报人" prop="reporterName">
                <el-input v-model="form.reporterName" disabled />
              </el-form-item>
            </el-col>

            <el-col :span="11" :push='1' :xs="24">
              <el-form-item label="填报时间" prop="reporttime">
                <el-date-picker v-model="form.reporttime" type="date" value-format="yyyy-MM-dd" disabled format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        
      </el-scrollbar>
      <el-col :span="24" :xs="24" class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check"  v-if='activeName==0' @click="handleSubmit" :loading="loading">保 存</el-button>
          <el-button type="primary" icon="el-icon-s-release" v-else @click="handleBack" :loading="loading">回 退</el-button>
          <el-button type="primary" icon="el-icon-s-promotion" @click="handleSend" :loading="loading">发 送</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>
      <el-dialog title="设备选择" :visible.sync="dialogAssetsVisible" center width="500px">
        <el-tree :data="assetsTree" :props="defaultProps" :check-strictly='true' node-key="id" ref="tree" show-checkbox :highlight-current="true" :default-expand-all="true" @check-change='checkchange' :expand-on-click-node="false"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handlecheck">确 定</el-button>
          <el-button @click="dialogAssetsVisible = false">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog title="人员选择" :visible.sync="dialogEmployeesVisible" center width="500px">
        <el-tree :data="processorIds" :props="defaultProps" :check-strictly='true' node-key="id" ref="tree" show-checkbox :highlight-current="true" :default-expand-all="true" @check-change='checkchange' :expand-on-click-node="false"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleEmpcheck">确 定</el-button>
          <el-button @click="dialogAssetsVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { add, getInfo, update, imageUpload } from "@/api/biz";
import { getTrees, getTenantEmployees } from "@/api/org";
import { mapGetters } from "vuex";

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
      processorIds: [],
      defaultProps: {
        children: "childs",
        label: "text"
      },
      ranks: [],
      TenantIds: [],
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      dialogAssetsVisible: false,
      dialogEmployeesVisible: false,
      assetsTree: [],
      allassetsTree: [],
      processorTree: [],
      allpatrolusers: [],
      employeesTree: [],
      ischange: false,
      count: 0,
      selectAssets: [],
      activeName:'0',
    };
  },
  computed: {
    ...mapGetters(["name", "userId"])
  },
  created() {
    this.getTenantEmployees();
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
    getAssets() {
      this.dialogAssetsVisible = true;
      getTrees()
        .then(res => {
          this.allassetsTree = res.data;
          this.allassetsTree.forEach(v => {
            if (v.id == this.form.tenantId) {
              this.assetsTree = v.childs;
              if (this.form.assetsIds) {
                this.$refs.tree.setCheckedKeys([this.form.assetsIds]);
              }
              return;
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 巡视人员
    getTenantEmployees() {
      getTenantEmployees({})
        .then(res => {
          this.allpatrolusers = res.data;
          if (this.form.tenantId) this.getProcessor();
        })
        .catch(error => {
          console.log(error);
        });
    },

    changeTenant() {
      this.ischange = true;
      this.getProcessor();
    },
    // 消缺人下拉
    getProcessor() {
      if (this.ischange) {
        this.form.processorId = "";
      }
      this.allpatrolusers.forEach(v => {
        if (v.id == this.form.tenantId) {
          this.processorIds = v.childs;
        }
      });
    },
    checkchange(data, checked) {
      if (checked) {
        const target = this.$refs.tree;
        target.setCheckedKeys([data.id]);
      }
    },
    checkchange1(data, checked, node) {
      this.count++;
      if (this.count % 2 === 0) {
        if (checked) {
          this.$refs.tree.setCheckedKeys([]);
          this.$refs.tree.setCheckedKeys([data.id]);
          this.form.assetsIds = data.id;
          this.form.assetsIdtext = data.text;
          this.count = 1;
          //交叉点击节点
        } else {
          this.$refs.tree.setCheckedKeys([]);
          this.form.assetsIds = "";
          this.form.assetsIdtext = "";
          this.count = 0;
          //点击已经选中的节点，置空
        }
      } else {
        this.form.assetsIds = data.id;
        this.form.assetsIdtext = data.text;
        this.count = 1;
      }
    },

    //设备选择确定
    handlecheck() {
      var arr = this.$refs.tree.getCheckedNodes();
      if (arr.length) {
        this.form.assetsIdtext = arr[0].text;
        this.form.assetsIds = arr[0].id;
        this.dialogAssetsVisible = false;
      } else {
        this.$message.error("请选择一个设备");
      }
    },
    //人员选择确定
    handleEmpcheck() {
      this.dialogEmployeesVisible = false;
    },

    // 缺陷关联发现时间
    changeTime() {
      var d = new Date(this.form.detecttime);
      var dtime;
      if (this.form.rank == 1) {
        dtime = d.setMonth(d.getMonth() + 6);
      } else if (this.form.rank == 2) {
        dtime = d.setMonth(d.getMonth() + 1);
      } else {
        dtime = d.setDate(d.getDate() + 1);
      }
      this.form.processdue = d;
    },

    // 表单重置
    reset(data) {
      const now = Date.now();
      var nowTime = new Date(now);
      var processdueTime = new Date(now);
      processdueTime.setMonth(processdueTime.getMonth() + 6);
      this.form = Object.assign(
        {
          tenantId: "",
          assetsIds: "",
          rank: 1,
          detecterId: '',
          detecttime: nowTime,
          processorId: "",
          processdue: processdueTime,
          description: "",
          attachmentkey: "",
          attachmenturl: "",
          reporterId: this.userId,
          reporterName:this.name,
          reporttime:nowTime,
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

    },
    // 回退
    handleBack(){

    },
    // 发送
    handleSend(){

    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //按钮转圈圈
          this.loading = true;
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
      let fd = new FormData();
      fd.append("filekey", file);
      imageUpload(fd).then(r => {
        this.form.attachmentkey = r.data.AttachmentKey;
        const fileReader = new FileReader();
        fileReader.onload = e => {
          this.imageUrl = e.target.result;
        };
        fileReader.readAsDataURL(file);
      });
      return false;
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("上传图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body {
  height: 60vh;
  overflow: auto;
}
/deep/.el-checkbox:last-of-type {
  margin-right: 10px !important;
}
.avatar {
  width: 100%;
}
</style>