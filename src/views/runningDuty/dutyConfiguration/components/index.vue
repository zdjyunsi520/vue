<template>

  <div class="app-container">

    <el-row :gutter="20" class="comheight">

      <el-col :span="6" :xs="{span: 24}" class="comheight">
        <div class="search-box onlyform-box">
          <p class="form-smtitle">新增值班</p>
          <el-row class="table-btns">
            <el-button :disabled="disabledSelect" type="primary" icon="el-icon-circle-check" @click="handleConfirm" :loading="loading">确 定</el-button>
            <el-button :disabled="!disabledSelect" icon="el-icon-edit-outline" @click="handleUpdate(null)">修 改</el-button>
          </el-row>
          <el-form ref="form" :model="form" label-position="left" :rules="rules" label-width="110px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="值班班组" prop="teamId">
                  <el-select v-model="form.teamId" :disabled="disabledSelect">
                    <el-option label="请选择" value></el-option>
                    <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in assetAttributeType" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="班次类型" prop="shifttypeId">
                  <el-select v-model="form.shifttypeId" :disabled="disabledSelect">
                    <el-option label="请选择" value></el-option>
                    <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in assetAttributeType" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="角色类型" prop="charatype">
                  <el-select v-model="form.charatype" :disabled="disabledSelect">
                    <el-option label="请选择" value></el-option>
                    <el-option :key="item.key+''+index" :label="item.value" :value="item.key" v-for="(item,index) in assetAttributeType" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

        </div>

      </el-col>
      <el-col :xs="{span: 18}" :span="18" class="comheight">
        <div class="comheight">
          <div class="search-box onlyform-box">
            <p class="form-smtitle">岗位设置</p>

            <div class="bg-white containerbox">

              <el-row class="table-btns">
                <el-button :disabled="!disabledSelect" type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
                <el-button :disabled="!disabledSelect" icon="el-icon-remove-outline" @click="handleAdd">删除</el-button>
              </el-row>
              <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border height="calc(100% - 130px)">
                <!-- <el-table-column type="selection" fixed="left" width="55" align="center" /> -->
                <el-table-column label="岗位名称" align="center" prop="TeamName" />

                <el-table-column label="班次" align="center" prop="ShiftNames" />

                <el-table-column label="角色" align="center" prop="Characters" />

              </el-table>
              <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
export default {
  components: {},
  data() {
    const rules = {
      teamId: [{ required: true, message: "请选择值班班组" }],
      shifttypeId: [{ required: true, message: "请选择班次类型" }],
      charatype: [{ required: true, message: "请选择角色类型" }]
    };
    return {
      operateId: "",
      loading: false,
      form: {
        teamId: "",
        shifttypeId: "",
        charatype: ""
      },
      rules,
      assetAttributeType: [{ key: 1, value: "asdas" }],
      listLoading: false,
      dataList: [{}],
      tableHeight: "0",
      queryParams: {
        pageno: 1,
        pagesize: 30
      },
      total: 1,
      disabledSelect: false
    };
  },

  created() {},
  computed: {
    addDisabled() {
      return (
        !this.form.teamId || !this.form.shifttypeId || !this.form.charatype
      );
    }
  },
  methods: {
    handleSelectionChange() {},

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

    handleAdd() {},
    handleUpdate() {},
    handleDelete() {},
    handleSubmit() {}
  }
};
</script>

<style lang="scss">
.comheight .containerbox {
  height: 100%;
}
</style>