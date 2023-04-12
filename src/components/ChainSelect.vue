<template>
  <el-input v-model="search" placeholder="Search" />

  <el-row justify="center" :gutter="20">
    <el-col
      v-for="network in networks"
      :key="network.id"
      :lg="12"
      class="my-extra-small"
    >
      <box-wrapper hoverable round type="clear" class="px-base py-small">
        <el-row justify="space-between" class="flex-row">
          <el-col :span="-1" class="of-hidden">
            <el-row class="flex-row">
              <el-col :span="-1">
                <el-avatar
                  :src="network.iconUrl || SvgWallet"
                  :title="network.name"
                />
              </el-col>

              <el-col
                :span="-1"
                class="ml-extra-small d-flex flex-column of-hidden"
              >
                <b class="of-hidden">
                  {{ network.name }}
                </b>
                <span class="fs-small of-hidden">
                  {{ props.chainWallet(network.id)?.address || "" }}
                </span>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="-1">
            <el-button
              v-if="props.chainWallet(network.id) !== null"
              :disabled="totalWallets <= 1"
              @click="onDisconnect(props.chainWallet(network.id))"
            >
              Disconnect
            </el-button>

            <el-button
              v-else
              type="primary"
              @click="emit('connectClick', network)"
            >
              Connect
            </el-button>
          </el-col>
        </el-row>
      </box-wrapper>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import BoxWrapper from "@/components/BoxWrapper.vue";
import SvgWallet from "@/assets/icons/wallet.svg?url";
import type Chain from "@/common/Chain";
import type Wallet from "@/store/entity/Wallet";
import type { ComputedRef, Ref } from "vue";
import { StoreType, useStore } from "@/store";
import { computed, ref } from "vue";
import { ElMessageBox } from "element-plus";

export interface Props {
  networks: Array<Chain>;
  chainWallet: (chainId: string) => Wallet | null;
}

const props = defineProps<Props>();
const store: StoreType = useStore();
const emit = defineEmits(["connectClick", "disconnectClick"]);
const search: Ref<string> = ref("");

async function onDisconnect(wallet: Wallet | null): Promise<void> {
  if (wallet === null) {
    return;
  }

  try {
    await ElMessageBox.confirm("Disconnect wallet?", "Disconnect", {
      confirmButtonText: "Disconnect",
      cancelButtonText: "Cancel",
    });

    emit("disconnectClick", wallet);
  } catch (e: any) {
    // ignore error on cancel
  }
}

const totalWallets: ComputedRef<number> = computed(
  () => store.state.UserModule?.wallets.length || 0
);

const networks: ComputedRef<Array<Chain>> = computed(() => {
  if (search.value === "") {
    return props.networks;
  }

  const lowercaseSearch: string = search.value.toLowerCase();

  return props.networks.filter((network) => {
    return network.name.toLowerCase().includes(lowercaseSearch);
  });
});
</script>
