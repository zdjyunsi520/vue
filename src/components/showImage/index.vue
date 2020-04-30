<template>
  <el-dialog :append-to-body="true" :visible.sync="dialogVisible" :close-on-click-modal="true" :show-close="false">
    <img v-show="!zoomable"  :src="path + url + process" @click="handleClick"/> 
    <img v-show="zoomable" class="enable-zoom-out" :src="path1" @click="handleClick"/>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      url: "",
      dialogVisible: false,
      process: "?x-oss-process=image/resize,h_600",
      zoomable:0
    };
  },
  computed: {
    ...mapGetters({ path: "imgOSS/path" }),
    path1(){
      let url = ''
      this.zoomable&&(url=this.path+this.url)
      return url
    }
  },
  methods: {
    handleClick() {
      this.zoomable = !this.zoomable;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog {
  background: none;
  box-shadow: none;
  width:100%;
  margin-top:0;
  .el-dialog__body{
    img{
      position: absolute;
      right:10%;
      top:-10vh;
      cursor:-moz-zoom-in;
      cursor:-webkit-zoom-in;
      cursor:zoom-in;
      &.enable-zoom-out{
        cursor:-moz-zoom-out;
        cursor:-webkit-zoom-out;
        cursor:zoom-out;
      }
    }
    
  }
}
</style>
