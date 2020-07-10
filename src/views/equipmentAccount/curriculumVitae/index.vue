<template>

  <common-tree @getInfo="getInfo">
    <div class="comheight">

      <base-prop ref="component1" />
      <power-room ref="component2" />
      <panel-cabinet ref="component3" />
      <camera ref="component8" />
      <interval ref="component11" />
      <communication-host ref="component4" />
      <smoke ref="component7" />
      <temperature ref="component6" />
      <clock ref="component5" />
    </div>

  </common-tree>

</template>

<script>
import commonTree from "@/views/equipmentAccount/components/treeWithoutMark";

import baseProp from "../maintain/baseProp";
import powerRoom from "../maintain/powerRoom";
import panelCabinet from "../maintain/panelCabinet";
import camera from "../maintain/camera";
import interval from "../maintain/interval";
import communicationHost from "../maintain/communicationHost";
import smoke from "../maintain/smoke";
import temperature from "../maintain/temperature";
import clock from "../maintain/clock";
export default {
  components: {
    commonTree,
    baseProp,
    powerRoom,
    panelCabinet,
    camera,
    interval,
    communicationHost,
    smoke,
    temperature,
    clock
  },
  data() {
    return {
      operateId: "",
      loading: true
    };
  },

  created() {},
  methods: {
    closeComponent() {
      [1, 2, 3, 8, 11, 4, 7, 6, 5].forEach(v => {
        this.$refs["component" + v].visible = false;
      });
    },
    getInfo(data) {
      this.data = data;
      this.closeComponent();
      const target = this.$refs["component" + data.type];
      target.visible = true;
      target.getInfo(data);
    },
    handleCommand(commond) {
      if (commond == "a") {
        this.$router.push({ path: "", params: {} });
      }
    },
    handleAdd() {},
    handleUpdate() {},
    handleDelete() {}
  }
};
</script>

<style lang="scss">
</style>