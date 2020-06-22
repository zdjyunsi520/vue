<template>
  <div class="app-container">
    <!-- <el-dialog top="20px" width="80%" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center> -->

    <!-- 添加或编辑参数配置对话框 -->
    <div class="search-box onlyform-box">
      <el-scrollbar class="marginright-fx">
        <el-form ref="form" label-position="right" :model="form" :rules="rules" label-width="110px">
          <el-row>
            <el-col :span="24">
              <p class="form-smtitle"> 基础信息 </p>
            </el-col>
            <el-form-item label="上级单位" prop="parentId">
              <el-select v-model="form.parentId">
                <el-option label="请选择上级单位" value=""></el-option>
                <el-option :key="item.id" :label="item.text" :value="item.id" v-for="item in treeData" />
              </el-select>
            </el-form-item>
            <el-form-item label="行业类别" prop="industry">
              <el-select v-model="form.industry" @change="handleChange">
                <el-option label="请选择行业类别" value=""></el-option>
                <el-option :key="index" :label="item.text" :value="item.id" v-for="(item,index) in professionList" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="行业分类" prop="principleactivity">
              <el-select v-model="form.principleactivity">
                <el-option label="请选择行业分类" value=""></el-option>
                <el-option :key="item.key" :label="item.text" :value="item.id" v-for="item in professionChildList" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="法人代表" prop="artificialperson">
              <el-input v-model="form.artificialperson" placeholder="请输入法人代表" />
            </el-form-item>
            <el-form-item label="省份" prop="province">
              <el-select v-model="form.province" @change="handleChange1">
                <el-option label="请选择省份" value=""></el-option>
                <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in areaList" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="统一信用代码" prop="creditcode">
              <el-input v-model="form.creditcode" placeholder="请输入统一信用代码" />
            </el-form-item>
            <el-form-item label="城市" prop="city">
              <el-select v-model="form.city" @change="handleChange2">
                <el-option label="请选择城市" value=""></el-option>
                <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in cityList" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="联系电话">
              <el-input v-model="form.phoneno" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="区域/县" prop="area">
              <el-select v-model="form.area">
                <el-option label="请选择区域/县" value=""></el-option>
                <el-option :key="item.key" :label="item.text" :value="item.key" v-for="item in distractList" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="联系人">
              <el-input v-model="form.contactperson" placeholder="请输入联系人" />
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入详细地址" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="联系人手机">
              <el-input v-model="form.mobilephone" placeholder="请输入联系人手机" />
            </el-form-item>
            <el-form-item label="是否启用" prop="isenable">
              <el-switch v-model="form.isenable" class="switchStyle" active-color="#56a7ff" inactive-color="#f3f6fc" active-text="启用" inactive-text="禁用">
              </el-switch>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="24" :xs='24'>
              <p class="form-smtitle"> 地图定位 </p>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="form.longitude" placeholder="输入或通过地图点击获取" />
            </el-form-item>

            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="form.latitude" placeholder="输入或通过地图点击获取" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="地图搜索" prop="remark" class="smitemwidth">
              <el-input v-model="remark" placeholder="请输入内容进行搜索">
                <el-button slot="append" type="primary" size="medium" icon="el-icon-search" @click="handleMap">搜索</el-button>
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item class="smitemwidth">
              <baidu-map :center="center" :zoom="zoom" @ready="handler" class="bm-view" ak="WdhysOvzhtGHHRWoo8sXqvRnKTABcc1Q">
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" @locationError="locationError" :showAddressBar="true" :autoLocation="true" @locationSuccess="locationSuccess"></bm-geolocation>
                <bm-marker v-for="(item,index) in points" :key="index" :click="dragging" :position="item" :dragging="true" animation="BMAP_ANIMATION_DROP" @dragging='dragging'></bm-marker>
                <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
                <bm-local-search :keyword="remark123" :auto-viewport="true" :location="location" @searchcomplete='markersset'></bm-local-search>
              </baidu-map>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="24" :xs='24'>
              <p class="form-smtitle">附加属性
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23" :xs='24'>
              <el-form-item>
                <el-checkbox v-model="form.attribute" :true-label="1" :false-label="0">用电</el-checkbox>
                <!-- <el-radio v-model="form.attribute" :disabled="form.id?true:false" label="电务" @change="handleElectron">电务公司</el-radio> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="立户日期" prop="starttime">
              <el-date-picker v-model="form.starttime" type="date" placeholder="选择日期" :disabled="disabled">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="电压等级" prop="voltlevel">
              <el-select v-model="form.voltlevel" :disabled="disabled">
                <!-- <el-option label="请选择" value=""></el-option> -->
                <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in voltageLevelType" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="用电分类" prop="maintype">
              <el-select v-model="form.maintype" :disabled="disabled" @change="handleChange3">
                <el-option label="请选择" value="" />
                <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in electronType" />
              </el-select>
            </el-form-item>
            <el-form-item label="用电小类" prop="subtype">
              <el-select v-model="form.subtype" :disabled="disabled">
                <el-option label="请选择" value="" />
                <el-option :key="item.key" :label="item.value" :value="item.key" v-if="item.show==form.maintype" v-for="item in electronType1" />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="合同容量(kVA)" prop="contractcapacity" label-width="150px">
              <el-input v-model="form.contractcapacity" placeholder="请输入合同容量" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="运行容量(kVA)" prop="operatingcapacity" label-width="150px">
              <el-input v-model="form.operatingcapacity" placeholder="请输入运行容量" :disabled="disabled" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="用户类型" prop="usertype">
              <el-select v-model="form.usertype" :disabled="disabled">
                <el-option label="请选择" value="" />
                <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in usertypes" />
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
      </el-scrollbar>
      <el-col :span="24" :xs='24' class="absolute-bottom">
        <div class="form-footer">
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            <svg-icon icon-class='ic_save' class='tablesvgicon'></svg-icon>保 存
          </el-button>
          <el-button icon="el-icon-arrow-left" @click="handleOpen(null)">返 回</el-button>
        </div>
      </el-col>
    </div>
    <!-- 添加或编辑参数配置对话框 end -->
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
  { key: 1, value: "高压" },
  { key: 2, value: "低压非居民" },
  { key: 3, value: "低压居民" }
];
const electronType1 = [
  { key: 1, value: "大型专变用户", show: 1 },
  { key: 2, value: "中小型专变用户", show: 1 },
  { key: 3, value: "三相一般工商业用户", show: 2 },
  { key: 4, value: "单相一般工商业用户", show: 2 },
  { key: 5, value: "居民用户", show: 3 }
];
const usertypes = [
  { key: 1, value: "工业" },
  { key: 2, value: "商业" },
  { key: 3, value: "居民" }
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
      // parentId: rule,
      name: [
        {
          pattern: /^[\u4e00-\u9fa5]{1,25}$/,
          required: true,
          message: "请输入25位以内的汉字",
          trigger: "blur"
        }
      ],
      artificialperson: [
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,12}$/,
          required: true,
          message: "请输入12位以内的汉字或数字或字母",
          trigger: "blur"
        }
      ],
      creditcode: [
        {
          pattern: /^(?=.*[A-Z])(?=.*\d)[A-Z\d]{18}$/,
          required: true,
          message: "请输入18位的数字及大写字母",
          trigger: "blur"
        }
      ],
      phoneno: [
        {
          pattern: /^[^\u4e00-\u9fa5]{1,12}$/,
          required: true,
          message: "请输入12位以内的数字或字母或特殊符号",
          trigger: "blur"
        }
      ],
      contactperson: [
        {
          pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,12}$/,
          required: true,
          message: "请输入12位以内的汉字或数字或字母",
          trigger: "blur"
        }
      ],
      address: [
        {
          pattern: /^.{1,300}$/,
          required: true,
          message: "请输入300位以内的内容"
        }
      ],
      industry: rule,
      principleactivity: rule,
      province: rule,
      city: rule,
      area: rule,

      longitude: [
        {
          required: true,
          message: "请输入正确的经度值"
        }
      ],
      latitude: [
        {
          required: true,
          message: "请输入正确的纬度值"
        }
      ],
      operatingcapacity: [
        {
          pattern: /^\d{1,8}$/,
          required: true,
          message: "请输入8位以内数字"
        }
      ],
      contractcapacity: [
        {
          pattern: /^\d{1,8}$/,
          required: true,
          message: "请输入8位以内数字"
        }
      ]
    };
    return {
      center: { lng: 116.404, lat: 39.915 },
      zoom: 15,
      form: {},
      rules,
      dialogVisible: false,
      loading: false,
      title: "",
      professionList: [],
      electronType,
      electronType1,
      usertypes,
      treeData: [],
      areaList: [],
      map: "",
      location: "北京",
      keyword: "百度",
      remark123: "",
      remark: "",
      points: []
    };
  },
  created() {
    this.getProfession();
    this.getTree();
    this.getAreaList();
    const data = this.$route.params.data;
    if (data && data.id) {
      this.getInfo(data);
    } else {
      this.reset(data);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMaps(); //调用初始化函数
      // this.locate();
    });
  },
  computed: {
    ...mapGetters({
      equipmentType: "status/equipmentType",
      voltageLevelType: "status/voltageLevelType"
    }),
    professionChildList() {
      const obj = this.professionList.filter(v => v.id == this.form.industry);
      if (obj.length) {
        return obj[0].childs;
      } else return [];
    },
    disabled() {
      return this.form.attribute == 1 ? false : true;
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
    handleChange3() {
      this.form.subtype = "";
    },
    getInfo(data) {
      const id = data.id;
      getInfo({ id }).then(r => {
        let row = r.data;
        let isenable = row.IsEnable;
        let province = row.Province;
        let city = row.City;
        let area = row.Area;
        let address = row.Address;
        let contactperson = row.ContactPerson;
        let mobilephone = row.MobilePhone;
        let parentId = row.ParentId;
        let phoneno = row.PhoneNo;
        let creditcode = row.CreditCode;
        let artificialperson = row.ArtificialPerson;

        let longitude = row.Longitude;
        let latitude = row.Latitude;
        let industry = row.IndustryCode;
        let principleactivity = row.PrincipleActivityCode;

        let attribute = row.Attribute == 1 ? 1 : 0;
        let starttime = row.StartTime;
        let voltlevel = row.VoltLevelText;
        let maintype = parseInt(
          this.electronType
            .filter(v => v.value == row.MainType)
            .map(v => v.key)
            .join("")
        );
        let subtype = parseInt(
          this.electronType1
            .filter(v => v.value == row.SubType)
            .map(v => v.key)
            .join("")
        );
        let usertype = parseInt(
          this.usertypes
            .filter(v => v.value == row.UserType)
            .map(v => v.key)
            .join("")
        );
        let contractcapacity = row.ContractCapacity;
        let operatingcapacity = row.OperatingCapacity;
        if (longitude && latitude) {
          this.center = { lng: longitude, lat: latitude };
          this.points = [this.center];
        }
        data = Object.assign(data, {
          isenable,
          province,
          city,
          area,
          address,
          contactperson,
          mobilephone,
          phoneno,
          longitude,
          latitude,
          creditcode,
          artificialperson,
          industry,
          principleactivity,
          parentId,
          attribute,
          voltlevel,
          contractcapacity,
          operatingcapacity,
          starttime,
          maintype,
          subtype,
          usertype
        });
        this.reset(data);
      });
    },
    initMaps() {
      // this.map = new BMapGL.Map("container");
      // let mPoint = new BMapGL.Point(116.404, 39.915); //天安门
      // this.map.centerAndZoom(mPoint, 15);
    },
    locationSuccess(e) {
      console.log(e);
      //百度地图定位完成后
      this.center.lng = e.point.lng;
      this.center.lat = e.point.lat;
      this.form.longitude = e.point.lng;
      this.form.latitude = e.point.lat;
      this.points = [this.center];
    },
    locationError() {
      this.center.lng = 116.404;
      this.center.lat = 39.915;
      this.zoom = 15;
      this.points = [this.center];
    },
    dragging(e) {
      this.form.longitude = e.point.lng;
      this.form.latitude = e.point.lat;
    },
    handleClickMarker(e) {},
    markersset(e) {
      if (e) {
        this.points = e.Ir.map(v => {
          return v.point;
        });
        this.remark123 = "";
      }
    },
    handler({ BMap, map }) {
      console.log("handler", BMap, map);
      // this.center.lng = 116.404;
      // this.center.lat = 39.915;
      // this.zoom = 15;
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
          attribute: 0,
          starttime: "",
          maintype: "",
          subtype: "",
          usertype: "",
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
    handleMap() {
      this.remark123 = this.remark;
    },
    /** 提交按钮 */
    handleSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.industryname = this.professionList.filter(
            v => v.id == this.form.industry
          )[0].text;
          this.form.principleactivityname = this.professionChildList.filter(
            v => v.id == this.form.principleactivity
          )[0].text;
          //按钮转圈圈
          this.loading = true;
          const fn = this.form.id ? update : add;
          //添加用户
          fn(this.form)
            .then(response => {
              //消息提示
              var txt = this.form.id ? "编辑成功！" : "新增成功！";
              this.$message.success(txt);
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

/deep/.onlyform-box .el-form .el-form-item {
  width: 350px;
  display: inline-block;
  vertical-align: text-top;
}
.smitemwidth {
  width: 724px !important;
}
@media screen and (max-width: 768px) {
  .smitemwidth {
    width: 100% !important;
  }
}
</style>

<style >
.anchorBL {
  display: none;
}
</style>