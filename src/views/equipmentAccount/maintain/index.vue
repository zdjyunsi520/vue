<template>

    <common-tree @getInfo="getInfo" ref="commonTree" :currentNode="currentNode" :needToScroll="needToScroll" :expandedKeys="expandedKeys">
        <div class="comheight">
            <base-prop ref="component1" />
            <power-room ref="component2" @refresh="refresh" />
            <panel-cabinet ref="component3" @refresh="refresh" />
            <camera ref="component8" @refresh="refresh" />
            <interval ref="component11" @refresh="refresh" />
            <communication-host ref="component4" @refresh="refresh" />
            <smoke ref="component7" @refresh="refresh" />
            <temperature ref="component6" @refresh="refresh" />
            <clock ref="component5" @refresh="refresh" />
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
            loading: true,
            currentNode: {},
            needToScroll: 1,
            expandedKeys: []
        };
    },

    created() {
        const { data } = this.$route.params;
        this.currentNode = data || {};
        let id = this.currentNode.id || this.currentNode.Id;
        this.currentNode.id = id;
        if (data) {
            this.expandedKeys.push(this.currentNode.tenantId);
        }
    },
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
            if (target) {
                target.visible = true;
                target.showBtn = true;
                target.infoData = {};
                target.getInfo(data);
            }
        },
        handleCommand(commond) {
            if (commond == "a") {
                this.$router.push({ path: "", params: {} });
            }
        },
        refresh() {
            this.currentNode = {};
            this.$refs.commonTree.getTreeData();
        },
        handleUpdate() {},
        handleDelete() {}
    }
};
</script>

<style lang="scss">
</style>