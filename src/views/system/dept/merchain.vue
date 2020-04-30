<template>
  <div class="app-container">
    <el-table border v-loading="loading" :data="deptList">
      <el-table-column prop="deptId" align="center" label="分站ID" />
      <!-- <el-table-column prop="orderNum" align="center" label="排序" /> -->
      <el-table-column prop="deptName" align="center" label="分站名称" />
      <el-table-column prop="merServerQQ" align="center" label="QQ1" />
      <el-table-column prop="rechargeServerQQ" align="center" label="QQ2" />
        <el-table-column label="微信客服" align="center">
        <template slot-scope="{ row }">
          <img :src="path + row.wxPicUrl + process" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="LOGO图片" align="center">
        <template slot-scope="{ row }">
          <img :src="path + row.indexLogo + process" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="warning" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:edit']">修改</el-button> -->
          <el-button
            size="mini"
            type="warning"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <updateMerchant ref="updateMerchant" @getList="getList"></updateMerchant>
  </div>
</template>

<script>
import { fetchMerchantList as fetchList } from "@/api/system/dept";
import updateMerchant from "./components/updateMerchant";
import { mapGetters } from "vuex";
export default {
  components: { updateMerchant },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      deptList: [],
      // 分站树选项
      deptOptions: undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {},
      // 表单参数
      form: {},
      process: "?x-oss-process=image/resize,h_50"
    };
  },
  computed: {
    ...mapGetters({ path: "imgOSS/path" })
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询分站列表 */
    getList() {
      this.loading = true;
      fetchList(this.queryParams).then(response => {
        this.deptList = response.data.list;
        this.loading = false;
      });
    },

    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      var target = this.$refs.updateMerchant;
      target.reset();
      console.log(row)
      Object.assign(target.form, row);
      target.form.merServerQq = row.merServerQQ
      target.form.rechargeServerQq = row.rechargeServerQQ
      if (row.indexLogo) {
        target.show = true;
      } else {
        target.show = false;
      }
       if (row.wxPicUrl) {
        target.show1 = true;
      } else {
        target.show1 = false;
      }
      target.open = true;
      target.title = "修改分站--商家端";
    }
  }
};
</script>
