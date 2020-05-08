
<template>
  <div class="app-container ">
    <el-row :gutter="10">
        <div>头部</div>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :span="8" class="treebox">
          <div>电费情况</div>
      </el-col>
      <el-col :xs="24" :span="16">
        <el-row :gutter="10">
            <el-col  :span="14" :xs="24">
                <el-row :gutter="10">
                    <el-col  :span="8" >
                        <div>运行容量</div>
                    </el-col>
                    <el-col  :span="8" >
                        <div>配电房</div>
                    </el-col>
                    <el-col  :span="8" >
                        <div>变压器</div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col  :span="10" :xs="24">
                <div>功率因素</div>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col  :span="24" >
                <div>公告：</div>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="14" :xs="24">
                <div>用电负荷</div>
            </el-col>
            <el-col :span="10" :xs="24">
                <div>电量构成</div>
            </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
