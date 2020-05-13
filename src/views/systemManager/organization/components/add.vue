<template>
  <div class="app-container">
    <!-- <el-dialog top="20px" width="80%" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center> -->

    <!-- 添加或修改参数配置对话框 -->
    <div class="search-box onlyform-box">
      <el-scrollbar>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="24">
              <p class="smtitle"> 基础信息 </p>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="上级单位" prop="parentId">
                <el-select v-model="form.parentId" size="small">
                  <el-option label="请选择" value=""></el-option>
                  <el-option :key="item.id" :label="item.text" :value="item.id" v-for="item in treeData" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="行业类别" prop="industry">
                <el-select v-model="form.industry" size="small" @change="handleChange">
                  <el-option label="请选择" value=""></el-option>
                  <el-option :key="item.key+''+index" :label="item.name" :value="item.key" v-for="(item,index) in professionList" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="行业分类" prop="principleactivity">
                <el-select v-model="form.principleactivity" size="small">
                  <el-option label="请选择" value=""></el-option>
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in professionChildList" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="法人代表" prop="artificialperson">
                <el-input v-model="form.artificialperson" placeholder="请输入法人代表" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="省份" prop="province">
                <el-select v-model="form.province" size="small" @change="handleChange1">
                  <el-option label="请选择" value=""></el-option>
                  <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in areaList" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="统一信用代码" prop="creditcode">
                <el-input v-model="form.creditcode" placeholder="请输入统一信用代码" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="城市" prop="city">
                <el-select v-model="form.city" size="small" @change="handleChange2">
                  <el-option label="请选择" value=""></el-option>
                  <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in cityList" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="联系电话">
                <el-input v-model="form.phoneno" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="区域/县" prop="area">
                <el-select v-model="form.area" size="small">
                  <el-option label="请选择" value=""></el-option>
                  <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in distractList" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="联系人">
                <el-input v-model="form.contactperson" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="form.address" placeholder="请输入详细地址" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="联系人手机">
                <el-input v-model="form.mobilephone" placeholder="请输入联系人手机" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="是否启用" prop="isenable">
                <el-switch v-model="form.isenable" class="switchStyle" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="启用" inactive-text="禁用">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs='24'>
              <p class="smtitle"> 地图定位 </p>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="经度" prop="longitude">
                <el-input v-model="form.longitude" placeholder="输入或通过地图点击获取" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="纬度" prop="latitude">
                <el-input v-model="form.latitude" placeholder="输入或通过地图点击获取" />
              </el-form-item>
            </el-col>
            <el-col :span="23" :push="1" :xs='24'>
              <el-form-item label="地图搜索" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入内容进行搜索" style="width:70%;margin-right:20px" />
                <el-button type="primary" size="medium" icon="el-icon-search" @click="handleMap">搜索</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="20" :push="1" :xs='24'>
              <el-form-item>
                <baidu-map :center="center" :zoom="zoom" @ready="handler" class="bm-view" ak="fIsGkZxy0E8LMufKVSyy1HX0oREDBrWu">
                  <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                  <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true" @locationSuccess="locationSuccess"></bm-geolocation>
                  <bm-marker :position="{lng: center.lng, lat: center.lat}" :dragging="true" animation="BMAP_ANIMATION_DROP" @dragging='dragging'></bm-marker>
                  <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
                  <bm-local-search :keyword="form.remark" :auto-viewport="true" :location="location" @markersset='markersset'></bm-local-search>
                </baidu-map>
              </el-form-item>
            </el-col>
            <el-col :span="24" :xs='24'>
              <p class="smtitle"> 附加属性 </p>
            </el-col>
            <el-col :span="23" :push="1" :xs='24'>
              <el-form-item>
                <el-checkbox v-model="form.attribute" true-label="用电" false-label="" @change="handleElectron">用电</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="立户日期" prop="starttime">
                <el-date-picker v-model="form.starttime" type="date" placeholder="选择日期" :disabled="disabled">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="电压等级" prop="voltlevel">
                <el-select v-model="form.voltlevel" size="small" :disabled="disabled">
                  <!-- <el-option label="请选择" value=""></el-option> -->
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in electronLvl" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="用电分类" prop="maintype">
                <el-select v-model="form.maintype" size="small" :disabled="disabled">
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in electronType" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="用电小类" prop="subtype">
                <el-select v-model="form.subtype" size="small" :disabled="disabled">
                  <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in electronType1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="合同容量(kVA)" prop="contractcapacity">
                <el-input v-model="form.contractcapacity" placeholder="请输入合同容量" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <el-col :span="10" :push="1" :xs='24'>
              <el-form-item label="运行容量(kVA)" prop="operatingcapacity">
                <el-input v-model="form.operatingcapacity" placeholder="请输入运行容量" :disabled="disabled" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" icon="el-icon-check" @click="handleSubmit" :loading="loading">确 定</el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>
    </div>
    <!-- 添加或修改参数配置对话框 end -->
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import {
  add,
  fetchTree,
  update,
  getInfo
} from "@/api/systemManager/organization";
import { fetchList } from "@/api/commonManager/area";
import { mapGetters } from "vuex";
import { fetchList as fetchProfession } from "@/api/commonManager/profession";
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import BmNavigation from "vue-baidu-map/components/controls/Navigation.vue";
import BmGeolocation from "vue-baidu-map/components/controls/Geolocation.vue";
import BmCityList from "vue-baidu-map/components/controls/CityList.vue";
import BmMarker from "vue-baidu-map/components/overlays/Marker.vue";
import BmLocalSearch from "vue-baidu-map/components/search/LocalSearch.vue";

const electronType = [
  { key: "高压", value: "高压" },
  { key: "高压非居民", value: "高压非居民" },
  { key: "高压居民", value: "高压居民" }
];
const electronType1 = [
  { key: "大型专变用户", value: "大型专变用户" },
  { key: "中小型专变用户", value: "中小型专变用户" }
];
const electronLvl = [
  { key: "6KV", value: "6KV" },
  { key: "10KV", value: "10KV" },
  { key: "20KV", value: "20KV" },
  { key: "35KV", value: "35KV" },
  { key: "110KV", value: "110KV" },
  { key: "220KV", value: "220KV" },
  { key: "380KV", value: "380KV" },
  { key: "400KV", value: "400KV" }
];
export default {
  components: {
    BaiduMap,
    BmNavigation,
    BmGeolocation,
    BmMarker,
    BmCityList,
    BmLocalSearch
  },
  data() {
    const rule = [
      {
        required: true,
        message: "此处不能为空",
        trigger: "blur"
      }
    ];
    const rules = {
      parentId: rule,
      name: rule,
      artificialperson: rule,
      creditcode: rule,
      industry: rule,
      principleactivity: rule,
      province: rule,
      city: rule,
      area: rule,
      address: rule,

      longitude: rule,
      latitude: rule
    };
    return {
      center: { lng: 0, lat: 0 },
      zoom: 3,
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      professionList: [],
      electronType,
      electronType1,
      electronLvl,
      treeData: [],
      areaList: [],
      map: "",
      location: "北京",
      keyword: "百度"
    };
  },
  created() {
    this.getProfession();
    this.getTree();
    this.getAreaList();
    const data = this.$route.params.data;
    if (data.id) {
      this.getInfo(data);
    } else {
      this.reset(data);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMaps(); //调用初始化函数
      this.locate();
    });
  },
  computed: {
    ...mapGetters({ equipmentType: "status/equipmentType" }),
    professionChildList() {
      const obj = this.professionList.filter(v => v.key == this.form.industry);
      if (obj.length) {
        return obj[0].childs;
      } else return [];
    },
    disabled() {
      return this.form.attribute ? false : true;
    },
    cityList() {
      const list = this.areaList.filter(v => v.key == this.form.province);
      if (list.length) return list[0].childs;
      return [];
    },
    distractList() {
      const list = this.cityList.filter(v => v.key == this.form.city);
      if (list.length) return list[0].childs;
      return [];
    }
  },
  methods: {
    handleChange() {
      this.form.principleactivity = "";
    },
    handleChange1() {
      this.form.area = "";
      this.form.city = "";
    },
    handleChange2() {
      this.form.area = "";
    },
    getInfo(data) {
      const id = data.id;
      getInfo({ id }).then(r => {
        let row = r.data;
        let attribute = row.Attribute;
        let isenable = row.IsEnable;
        let province = row.Province;
        let city = row.City;
        let area = row.Area;
        let address = row.Address;
        let contactperson = row.ContactPerson;
        let mobilephone = row.MobilePhone;

        let phoneno = row.PhoneNo;

        let contractcapacity = row.ContractCapacity;
        let voltlevel = row.OperatingCapacity;
        data = Object.assign(data, {
          attribute,
          isenable,
          province,
          city,
          area,
          address,
          contactperson,
          mobilephone,
          phoneno,
          contractcapacity,
          voltlevel
        });
        this.reset(data);
      });
    },
    initMaps() {
      this.map = new BMap.Map("container");
      let mPoint = new BMap.Point(116.404, 39.915); //天安门
      this.map.centerAndZoom(mPoint, 15);
    },
    locationSuccess(e) {
      //百度地图定位完成后
      console.log("定位", e);
      this.center.lng = e.point.lng;
      this.center.lat = e.point.lat;
      this.form.longitude = e.point.lng;
      this.form.latitude = e.point.lat;
    },

    dragging(e) {
      this.form.longitude = e.point.lng;
      this.form.latitude = e.point.lat;
    },
    markersset(e) {
      console.log("搜索", e);
    },
    handler({ BMap, map }) {
      console.log(BMap, map);
      this.center.lng = 116.404;
      this.center.lat = 39.915;
      this.zoom = 15;
    },
    getAreaList() {
      fetchList({}).then(response => {
        this.areaList = response.data.map(v => {
          // v.children = v.childs;
          v.lvl = true;
          return v;
        });
        this.dataList = response.data;
        this.initMaps();

        // var map = new BMapGL.Map("container");
        // var point = new BMapGL.Point(116.404, 39.915);
        // map.centerAndZoom(point, 15);
      });
    },
    getTree() {
      fetchTree({}).then(r => {
        this.treeData = r.data;
      });
    },
    handleElectron(v) {},
    /** 行业列表 */
    getProfession() {
      fetchProfession({}).then(response => {
        this.professionList = response.data;
      });
    },
    // 表单重置
    reset(data) {
      this.form = Object.assign(
        {
          parentId: "",
          name: "",
          artificialperson: "",
          creditcode: "",
          phoneno: "",
          contactperson: "",
          mobilephone: "",
          industry: "",
          principleactivity: "",
          province: "",
          city: "",
          area: "",
          address: "",
          isenable: 1,
          longitude: "",
          latitude: "",
          attribute: "",
          starttime: "",
          maintype: "",
          subtype: "",
          contractcapacity: "",
          voltlevel: "",
          operatingcapacity: "",
          industryname: "",
          principleactivityname: ""
        },
        data
      );
    },
    handleOpen(data) {
      this.$router.go(-1);
      //改变窗口状态
      // this.dialogVisible = !this.dialogVisible;
      // if (!this.dialogVisible) {
      //   //关闭窗口时取消按钮转圈圈
      //   this.loading = false;
      // }
      //表单重置
    },
    handleMap() {},
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.industryname = this.professionList.filter(
            v => v.key == this.form.industry
          )[0].text;
          this.form.principleactivityname = this.professionChildList.filter(
            v => v.key == this.form.principleactivity
          )[0].text;
          //按钮转圈圈
          this.loading = true;
          const fn = this.form.id ? update : add;
          //添加用户
          fn(this.form)
            .then(response => {
              //消息提示
              this.$message.success(response.msg);
              //刷新列表
              //this.$emit("getList");
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
.search-box .el-form .el-form-item {
  margin-bottom: 22px;
}

/deep/.el-select,
/deep/.el-date-editor {
  width: 100%;
}
.bm-view {
  width: 100%;
  height: 350px;
  overflow: hidden;
}
</style>

<style >
.anchorBL {
  display: none;
}
</style>