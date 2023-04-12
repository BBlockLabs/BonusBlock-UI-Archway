<template>
  <box-wrapper type="white" round shadow class="p-large">
    <el-row :gutter="10">
      <el-col :span="-1">
        <component :is="props.svg" class="list-icon" />
      </el-col>

      <el-col :span="-1">
        <div class="d-flex flex-column">
          <h2 class="m-0 fs-medium">{{ props.name }}</h2>
          <span
            >Supporting {{ props.count || props.chains.length }} chains</span
          >
        </div>
      </el-col>
    </el-row>

    <!--    <el-row class="my-medium" :gutter="10">-->
    <!--      <el-col-->
    <!--        v-for="network in props.chains.slice(0, 8)"-->
    <!--        :key="network.id"-->
    <!--        :span="-1"-->
    <!--      >-->
    <!--        <el-avatar-->
    <!--          :src="network.iconUrl || SvgWallet"-->
    <!--          :title="network.name"-->
    <!--          :size="20"-->
    <!--        />-->
    <!--      </el-col>-->

    <!--      <el-col v-if="props.chains.length > 8" :span="-1" class="d-flex">-->
    <!--        <span :title="`${(props.count || props.chains.length) - 8} more`" class="my-auto">-->
    <!--          ...-->
    <!--        </span>-->
    <!--      </el-col>-->
    <!--    </el-row>-->

    <el-row justify="end" class="mt-large">
      <el-col :span="-1">
        <el-button
          v-if="props.available"
          type="primary"
          @click="emit('connectClick')"
        >
          Connections
        </el-button>

        <a v-else :href="addLink" target="_blank">
          <el-button> Get wallet </el-button>
        </a>
      </el-col>
    </el-row>
  </box-wrapper>
</template>

<script setup lang="ts">
import BoxWrapper from "@/components/BoxWrapper.vue";
// import SvgPlus from "@/assets/icons/plus.svg?component";
// import SvgWallet from "@/assets/icons/wallet.svg?url";
import type Chain from "@/common/Chain";
import type { Component } from "vue";

export interface Props {
  name: string;
  chains: Array<Chain>;
  available: boolean;
  addLink: string;
  svg: Component;
  count?: number;
}

const props = defineProps<Props>();
const emit = defineEmits(["connectClick"]);
</script>

<style scoped lang="scss">
.list-icon {
  height: 40px;
}
</style>
