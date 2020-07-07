<template>
  <el-dialog title='' :visible.sync="dialogVisible" width="310px" center :show-close='false'>
    <div class='qrcode-main'>
      <h6>{{qrCode.title}}</h6>
      <img v-if='qrCode.qrCodeUrl' :src="'http://apidevt.xtioe.com'+qrCode.qrCodeUrl" class="ewm" />
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    qrCode: {
      type: Object,
      default() {
        return {};
      }
    },
    qrCodeUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },

  created() {},

  methods: {}
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog__header {
  background: none;
  border: none;
  padding: 0 20px;
  height: 0;
}
/deep/.qrcode-main {
  text-align: center;
  h6 {
    margin: 5px 0 30px;
    font-size: 16px;
    font-weight: normal;
  }
  .ewm {
    width: 200px;
    height: 200px;
  }
}
</style>
