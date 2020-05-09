<template>
  <div class="app-container wrapperbox">
    <el-row :gutter="10">
      <el-col :xs="{span: 24}" :span="4" class="treebox">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :xs="{span: 24}" :span="20">
        <el-row :gutter="10">
          <el-col :span="8" :xs="24">
            <div class="bg-white">
              <h6>
                <i class="el-icon-money"></i> 概况
              </h6>
              <el-row>
                <el-col :span="6">
                  <p>
                    <span>
                      <b>2</b>户
                    </span>
                    <br />总用户数
                  </p>
                </el-col>
                <el-col :span="6">
                  <p>
                    <span>
                      <b>20000</b>
                    </span>
                    <br />总容量(kVA)
                  </p>
                </el-col>
                <el-col :span="6">
                  <p>
                    <span>
                      <b>20</b>
                    </span>
                    <br />配电房
                  </p>
                </el-col>
                <el-col :span="6">
                  <p>
                    <span>
                      <b>1545</b>
                    </span>
                    <br />安全运行(天)
                  </p>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="8" :xs="24">
            <div class="bg-white">
              <h6>
                <i class="el-icon-money"></i> 运维规模
              </h6>
              <el-row>
                <el-col :span="8">
                  <p>
                    <span>
                      <b>2</b>个
                    </span>
                    <br />运维城市
                  </p>
                </el-col>
                <el-col :span="8">
                  <p>
                    <span>
                      <b>1</b>
                    </span>
                    <br />运维中心
                  </p>
                </el-col>
                <el-col :span="8">
                  <p>
                    <span>
                      <b>6</b>
                    </span>
                    <br />运维人员
                  </p>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="8" :xs="24">
            <div class="bg-white">
              <h6>
                <i class="el-icon-money"></i> 运维成果
              </h6>
              <el-row>
                <el-col :span="8">
                  <p>
                    <span>
                      <b>2</b>次
                    </span>
                    <br />总巡检（年）
                  </p>
                </el-col>
                <el-col :span="8">
                  <p>
                    <span>
                      <b>15</b>次
                    </span>
                    <br />总预警
                  </p>
                </el-col>
                <el-col :span="8">
                  <p>
                    <span>
                      <b>69</b>次
                    </span>
                    <br />总抢修
                  </p>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8" :xs="24" >
            <div class="bg-white">
                <h6>
                <i class="el-icon-money"></i> 用电类型统计
                </h6>
                <div class="chart-wrapper">
                    <el-row  :gutter="10" class="legendbox">
                        <el-col :span="8"><p>商业<span>50户</span></p>
                        </el-col>
                        <el-col :span="8"><p>工业<span>10户</span></p>
                        </el-col>
                        <el-col :span="8"><p>居民<span>340户</span></p>
                        </el-col>
                    </el-row>
                    <pie-chart />
                </div>
            </div>
          </el-col>
          <el-col :span="16" :xs="24">
            <div class="bg-white">
                <h6>
                <i class="el-icon-money"></i> 用电负荷
                </h6>
                <div class="chart-wrapper">
                    <el-row  :gutter="10" class="legendbox">
                        <el-col :span="8"><p>今日最高<span>800KW</span></p>
                        </el-col>
                        <el-col :span="8"><p>昨日最高<span>700KW</span></p>
                        </el-col>
                        <el-col :span="8"><p>日平均<span>760KW</span></p>
                        </el-col>
                    </el-row>
                    <el-row  :gutter="10" class="legendbox">
                        <el-col :span="8"><p>本月最高<span>800KW</span></p>
                        </el-col>
                        <el-col :span="8"><p>上月最高<span>700KW</span></p>
                        </el-col>
                        <el-col :span="8"><p>月平均<span>760KW</span></p>
                        </el-col>
                    </el-row>
                    <div style="text-align:right;padding:10px 0">
                        <el-radio-group v-model="radioType" @change=handleSetLineChartData size="mini">
                            <el-radio-button :label="0">日</el-radio-button>
                            <el-radio-button :label="1">月</el-radio-button>
                        </el-radio-group>
                    </div>
                    <line-chart :chart-data="lineChartData" />
                </div>
            </div>
           </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12" :xs="24">
            <div class="bg-white">
                <h6>
                    <i class="el-icon-money"></i> 用电情况
                </h6>
                <h5 class="smtitle">用电分析</h5>
                <el-row  :gutter="10" class="legendbox">
                    <el-col :span="8"><p>本月<span>80012kWh</span></p>
                    </el-col>
                    <el-col :span="8"><p>上月<span>83012kWh</span></p>
                    </el-col>
                    <el-col :span="8"><p>累计(年)<span>280012kWh</span></p>
                    </el-col>
                </el-row>
                <h5 class="smtitle">用电结构</h5>
                <el-row  :gutter="10" class="legendbox">
                    <el-col :span="8" :xs="24" class="v-center">
                        <p>尖峰<span>677kWh</span></p>
                        <p>高峰<span>566kWh</span></p>
                        <p>平均<span>342kWh</span></p>
                        <p>低谷<span>412kWh</span></p>
                    </el-col>
                    <el-col :span="16" :xs="24">
                        <Structure-PieChart />
                    </el-col>
                </el-row>
            </div>
            </el-col>
          <el-col :span="12" :xs="24" >
            <el-row :gutter="10">
              <el-col :span="24">
                  <div class="bg-white">
                    <h6>
                        <i class="el-icon-money"></i> 巡视情况
                    </h6>
                    <el-row  :gutter="10" class="legendbox">
                        <el-col :span="8" :xs="12" class="v-center">
                            <p>本月计划巡检<span>100次</span></p>
                        </el-col>
                        <el-col :span="8" :xs="12" class="v-center">
                            <p>本月实际巡检<span>89次</span></p>
                        </el-col>
                        <el-col :span="8" :xs="24">
                            <Patrol-PieChart  />
                        </el-col>
                    </el-row>
                  </div>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24" >
                  <div class="bg-white">
                    <h6>
                        <i class="el-icon-money"></i> 抢修情况
                    </h6>
                    <el-row  :gutter="10" class="legendbox">
                        <el-col :span="16" :xs="24" class="v-center">
                            <el-row  :gutter="10">
                                <el-col :span="8" >
                                    <p>本月(总)<span>50次</span></p>
                                </el-col>
                                <el-col :span="8" >
                                    <p>报修<span>45次</span></p>
                                </el-col>
                                <el-col :span="8" >
                                    <p>抢修<span>23次</span></p>
                                </el-col>
                            </el-row>
                            <el-row  :gutter="10">
                                <el-col :span="8" >
                                    <p>已完成<span>50次</span></p>
                                </el-col>
                                <el-col :span="8" >
                                    <p>未完成<span>45次</span></p>
                                </el-col>
                                <el-col :span="8" >
                                    <p>完成率<span>100%</span></p>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="8" :xs="24">
                            <RepairPieChart  />
                        </el-col>
                    </el-row>
                  </div></el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12" :xs="24">
            <div class="bg-white">
                <h6>
                <i class="el-icon-money"></i> 采集情况
                </h6>
                <div class="chart-wrapper">
                    <el-row  :gutter="10" class="legendbox">
                        <el-col :span="8"><p>采集器<span>100个</span></p>
                        </el-col>
                        <el-col :span="8"><p>表计<span>500个</span></p>
                        </el-col>
                        <el-col :span="8"><p>在线率<span>78%</span></p>
                        </el-col>
                    </el-row>
                    <CollectionPieChart />
                </div>
            </div>
            </el-col>
          <el-col :span="12" :xs="24" >
            <div class="bg-white">
                <h6>
                <i class="el-icon-money"></i> 告警情况
                </h6>
                <div class="chart-wrapper">
                    <el-row  :gutter="10" class="legendbox">
                        <el-col :span="6"><p>本月累计<span>31次</span></p>
                        </el-col>
                        <el-col :span="6"><p>本月新增<span>23次</span></p>
                        </el-col>
                        <el-col :span="6"><p>上月累计<span>34次</span></p>
                        </el-col>
                        <el-col :span="6"><p>未处理<span>0个</span></p>
                        </el-col>
                    </el-row>
                    <AlarmPieChart />
                </div>
            </div>
            </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieChart from "./components/PieChart";
import StructurePieChart from "./components/StructurePieChart";
import LineChart from './components/LineChart';
import PatrolPieChart from "./components/PatrolPieChart";
import CollectionPieChart from "./components/CollectionPieChart";
import RepairPieChart from "./components/RepairPieChart";
import AlarmPieChart from "./components/AlarmPieChart";

// import { listUser as fetchList } from "@/api/system/user";

const lineChartData = [
  {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
 {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
]
export default {
  name: "baseData",
  components: {
    PieChart,
    LineChart,
    StructurePieChart,
    PatrolPieChart,
    CollectionPieChart,
    RepairPieChart,
    AlarmPieChart
  },
  
  data() {
    return {
      treeData: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      lineChartData: lineChartData[0],
      radioType:0,
    //   piechartData:66,
    };
  },
  watch: {
    // 根据名称筛选分站树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
   
  },
  methods: {
    handleNodeClick() {},
    
    // 用电负荷 日/月切换
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },

    /** 查询用户列表 */
    getList() {
      this.listLoading = true;
      fetchList(this.queryParams)
        .then(response => {
          this.dataList = response.data.list;
          this.total = response.data.total;
        })
        .finally(r => {
          this.listLoading = false;
        });
    },
    /** 查询角色列表 */
    getRoles() {
      listRole().then(response => {
        this.roleOptions = response.data.filter(v => v.status == 0);
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      const target = this.$refs.update;
      target.handleOpen();
      target.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const target = this.$refs.update;
      target.handleOpen(row);
      target.title = "修改信息";
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      const target = this.$refs.password;
      target.handleOpen(row);
      target.title = "修改密码";
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {
          this.msgSuccess("操作失败");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportUser(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>
<style lang="scss">
.app-container {
  font-size: 14px;
}
.el-tree {
  border-radius: 3px;
  margin-bottom: 10px;
}
h6 {
  margin: 0;
  padding:15px 10px 10px;
  font-size: 14px;
  font-weight: normal;
  color: #333;
  > i {
    margin-right: 5px;
    font-size: 18px;
    vertical-align: text-top !important;
  }
}
.el-col p {
  text-align: center;
  font-size: 12px;
  color: #999;
  line-height: 2;
  margin: 0;
  padding-bottom: 10px;
  span {
    font-size: 14px;
    color: #333;
    b {
      font-size: 18px;
      margin-right: 5px;
      font-weight: normal;
    }
  }
}
.v-center{padding-top: 5%;
}
.legendbox p{
    color: #333;font-size: 12px;padding-bottom: 0;
    span{display: inline-block;margin-left: 5px;font-size: 12px;}
}
.chart-wrapper {
  background: #fff;
  padding: 0 16px;
}
.smtitle{text-align: center;padding: 10px 0;margin:0;font-size: 14px;font-weight: normal}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding:0 8px;
  }
}
</style>
