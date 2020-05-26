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
import commonTree from "@/views/equipmentAccount/components";

import baseProp from "./baseProp";
import powerRoom from "./powerRoom";
import panelCabinet from "./panelCabinet";
import camera from "./camera";
import interval from "./interval";
import communicationHost from "./communicationHost";
import smoke from "./smoke";
import temperature from "./temperature";
import clock from "./clock";
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
        const target = this.$refs["component" + v];
        if (target) target.visible = false;
      });
    },
    getInfo(data) {
      this.data = data;
      this.closeComponent();
      const target = this.$refs["component" + data.type];
      target.visible = true;
      target.showBtn = true;
      target.infoData = {};
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