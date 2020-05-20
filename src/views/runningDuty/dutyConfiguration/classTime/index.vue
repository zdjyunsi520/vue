<template>

  <div class="app-container">

    <el-row :gutter="20" class="comheight">

      <el-col :span="6" :xs="{span: 24}" class="comheight">
        <div class="search-box onlyform-box">
          <p class="form-smtitle">班次类型</p>
          <el-row class="table-btns">
            <el-button type="primary" icon="el-icon-circle-check" @click="handleAdd" :loading="loading">添加</el-button>
            <el-button :disabled="multiple" icon="el-icon-edit-outline" @click="handleDelete(null)">删除</el-button>
          </el-row>
          <el-table v-loading="target.listLoading" :data="target.dataList" @selection-change="handleSelectionChange" border height="calc(100% - 190px)">
            <el-table-column type="selection" fixed="left" width="55" align="center" />
            <el-table-column label="班次类型" align="center" prop="Name" />
          </el-table>

          <pagination v-show="target.total > 0" :total="target.total" :page.sync="target.queryParams.pageno" :limit.sync="target.queryParams.pagesize" @pagination="getList" />

        </div>

      </el-col>
      <el-col :xs="{span: 18}" :span="18" class="comheight">
        <div class="comheight">
          <div class="search-box onlyform-box">
            <p class="form-smtitle">班次</p>
            <div class="bg-white containerbox">
              <el-row class="table-btns">
                <el-button :disabled="single" type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd1">新增</el-button>
                <el-button :disabled="multiple1" icon="el-icon-remove-outline" @click="handleDelete1">删除</el-button>
              </el-row>
              <el-table v-loading="target1.listLoading" :data="target1.dataList" @selection-change="handleSelectionChange1" border height="calc(100% - 190px)">
                <el-table-column type="selection" fixed="left" width="55" align="center" />
                <el-table-column label="班次" align="center" prop="Name" />
                <el-table-column label="开始时间" align="center" prop="StartTime" />
                <el-table-column label="间隔天数" align="center" prop="Period" />
                <el-table-column label="结束时间" align="center" prop="EndTime" />
                <el-table-column label="备注" align="center" prop="Remark" />
              </el-table>
              <pagination v-show="target1.total > 0" :total="target1.total" :page.sync="target1.queryParams.pageno" :limit.sync="target1.queryParams.pagesize" @pagination="getList1" />
            </div>
          </div>
        </div>
      </el-col>

    </el-row>
    <el-col :span="24" :xs="24" class="absolute-bottom">
      <div class="form-footer">
        <el-button type="primary" icon="el-icon-check" @click="handleBack" :loading="loading">保 存</el-button>
        <el-button icon="el-icon-arrow-left" @click="handleBack">返 回</el-button>
      </div>
    </el-col>
    <add-class-time-type @getList="getList" ref="addClassTimeType" />
    <add-class-time @getList="getList1" ref="addClassTime" />
  </div>

</template>

<script>
import {
  fetchList,
  deleted
} from "@/api/runningDuty/dutyConfiguration/classTimeType";
import {
  fetchList as fetchList1,
  deleted as deleted1
} from "@/api/runningDuty/dutyConfiguration/classTime";
import addClassTimeType from "./components/addClassTimeType";
import addClassTime from "./components/addClassTime";

export default {
  components: { addClassTime, addClassTimeType },
  data() {
    const rules = {
      teamId: [{ required: true, message: "请选择值班班组" }],
      shifttypeId: [{ required: true, message: "请选择班次类型" }],
      charatype: [{ required: true, message: "请选择角色类型" }]
    };
    return {
      loading: false,
      form: {
        teamId: "",
        shifttypeId: "",
        charatype: ""
      },
      rules,
      target1: {
        ids: [],
        listLoading: false,
        dataList: null,
        queryParams: {
          pageno: 1,
          pagesize: 30
        },
        total: 0
      },
      target: {
        ids: [],
        listLoading: false,
        dataList: null,
        queryParams: {
          pageno: 1,
          pagesize: 30,
          shifttypeId: ""
        },
        total: 0
      }
    };
  },

  created() {
    this.getList();
  },
  computed: {
    single() {
      return this.target.ids.length != 1;
    },
    multiple() {
      return !(this.target.ids.length > 0);
    },
    multiple1() {
      return !(this.target1.ids.length > 0);
    }
  },
  methods: {
    handleSelectionChange(selection) {
      this.target.ids = selection;
      this.target1.dataList = [];
      if (this.target.ids.length == 1) {
        this.target1.queryParams.shifttypeId = this.target.ids[0].Id;
        this.getList1();
      }
    },
    handleSelectionChange1(selection) {
      this.target1.ids = selection;
    },
    getList() {
      this.target.listLoading = true;
      fetchList(this.target.queryParams)
        .then(response => {
          this.target.dataList = response.data;
          this.target.total = response.total;
        })
        .finally(r => {
          this.target.listLoading = false;
        });
    },
    getList1() {
      this.target1.listLoading1 = true;
      fetchList1(this.target1.queryParams)
        .then(response => {
          this.target1.dataList = response.data;
          this.target1.total = response.total;
        })
        .finally(r => {
          this.target1.listLoading = false;
        });
    },
    getInfo(data) {
      this.data = data;
      this.closeComponent();
      const target = this.$refs["component" + data.type];
      target.visible = true;
      target.showBtn = true;
      target.getInfo(data);
    },
    handleConfirm() {
      this.$refs.form.validate(v => {
        if (v) {
          this.disabledSelect = true;
        }
      });
    },

    handleAdd() {
      const target = this.$refs.addClassTimeType;
      target.handleOpen();
    },
    handleAdd1() {
      const target = this.$refs.addClassTime;
      target.title = "新增";
      const shifttypeid = this.target.ids[0].Id;
      target.handleOpen({ shifttypeid });
    },
    handleUpdate() {},
    handleDelete() {
      this.$confirm("确定要删除选中的班次类型吗")
        .then(r => {
          const Ids = this.target.ids.map(v => v.Id);
          deleted({ Ids }).then(r => {
            this.getList();
            this.$message.success("删除成功");
          });
        })
        .catch(e => {});
    },
    handleDelete1() {
      this.$confirm("确定要删除选中的班次吗")
        .then(r => {
          const Ids = this.target1.ids.map(v => v.Id);
          deleted1({ Ids }).then(r => {
            this.getList1();
            this.$message.success("删除成功");
          });
        })
        .catch(e => {});
    },
    handleBack() {
      this.$router.push({ name: "/runningDuty/dutyConfiguration/index" });
    }
  }
};
</script>

<style lang="scss">
.comheight .containerbox {
  height: 100%;
}
</style>