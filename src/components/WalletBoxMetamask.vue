<template>
  <wallet-box
    name="Metamask"
    :chains="networks"
    :available="available"
    :svg="SvgMetamask"
    add-link="https://metamask.io/download/"
    :count="metamaskChainList.length"
    @connect-click="dialog = true"
  />

  <metamask-dialog v-model:open="dialog" />
</template>

<script setup lang="ts">
import MetamaskDialog from "@/components/MetamaskDialog.vue";
import SvgMetamask from "@/assets/icons/metamask-fox.svg?component";
import WalletBox from "@/components/WalletBox.vue";
import detectEthereumProvider from "@metamask/detect-provider";
import Chain from "@/common/Chain";
import type { Ref } from "vue";
import { computed, ref } from "vue";
import metamaskChainList from "@/assets/chainid.network-chains.json";

const available: Ref<boolean> = ref(false);
const dialog: Ref<boolean> = ref(false);

const networks = computed(() =>
  metamaskChainList
    .filter((chain) => chain.icon)
    .slice(0, 9)
    .map((chainData) => {
      const chain = new Chain();

      chain.id = `0x${Number(chainData.chainId).toString(16)}`;
      chain.name = chainData.name;
      chain.denom = chainData.nativeCurrency?.symbol || "unknown";
      chain.source = "Metamask";

      return chain;
    })
);

async function setMetamaskAvailable(): Promise<void> {
  const provider: any = await detectEthereumProvider();

  available.value = provider !== null;
}

setMetamaskAvailable();
</script>
