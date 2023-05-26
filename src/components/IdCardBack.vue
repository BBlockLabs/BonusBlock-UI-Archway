<template>
  <id-card>
    <el-row justify="center">
      <el-col :span="-1">
        <h2 class="fs-large">
          {{ blocktopianId }}
        </h2>
      </el-col>
    </el-row>

    <box class="py-0 pl-0 my-small" type="warning">
      <el-row>
        <el-col :span="21">
          <qr :text="store.getters['UserModule/refLink']" />
        </el-col>

        <el-col :span="3" class="referral">
          <h2 class="fs-large sideways m-0 my-auto">Referral</h2>
        </el-col>
      </el-row>
    </box>

    <copy-box :text="store.getters['UserModule/refLink']" class="my-small" />

    <box class="my-small px-base py-small">
      <el-row justify="space-between">
        <el-col :span="-1"> Successful Invitations: </el-col>

        <el-col :span="-1">
          {{ store.state.UserModule?.user?.invitedCount || "0" }}
        </el-col>
      </el-row>
    </box>

    <el-row justify="center">
      <el-col :span="-1">
        <el-button type="primary" @click="copyToClipboard(store.getters['UserModule/refLink'])">
          <svg-share class="icon-small mr-extra-small" />
          Share
        </el-button>
      </el-col>
    </el-row>
  </id-card>
</template>

<script setup lang="ts">
import Box from "@/components/BoxWrapper.vue";
import CopyBox from "@/components/CopyBox.vue";
import IdCard from "@/components/IdCard.vue";
import Qr from "@/components/QrView.vue";
import SvgShare from "@/assets/icons/share.svg?component";
import type { ComputedRef } from "vue";
import { computed } from "vue";
import { useStore, StoreType } from "@/store";

const store: StoreType = useStore();

const blocktopianId: ComputedRef<string> = computed(
  () => store.state.UserModule?.user?.userId || "Blocktopian ID"
);
</script>

<style>
.sideways {
  writing-mode: tb; /*Fix for chromium*/
  writing-mode: sideways-lr;
  text-align: center;
}
</style>
