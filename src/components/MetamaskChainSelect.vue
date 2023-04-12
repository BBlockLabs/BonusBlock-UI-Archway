<template>
  <chain-select
    :networks="networksList"
    :chain-wallet="chainWallet"
    @connect-click="connectWallet"
    @disconnect-click="removeWallet"
  />
</template>

<script setup lang="ts">
import Chain from "@/common/Chain";
import ChainSelect from "@/components/ChainSelect.vue";
import FormattedError from "@/common/errors/FormattedError";
import type Wallet from "@/store/entity/Wallet";
import type { ComputedRef } from "vue";
import { ElMessageBox } from "element-plus";
import { StoreType, useStore } from "@/store";
import { computed } from "vue";
import metamaskChainList from "@/assets/chainid.network-chains.json";
import { useRouter } from "vue-router";
import HttpUnauthorizedError from "@/common/errors/HttpUnauthorizedError";
import MetamaskClient from "@/common/MetamaskClient";

const store: StoreType = useStore();
const router = useRouter();
const emit = defineEmits(["connect", "disconnect"]);

const defaultChain: Chain = new Chain();

defaultChain.source = "Metamask";
defaultChain.denom = "any";
defaultChain.name = "Connect new";
defaultChain.id = "0x0";

const wallets: ComputedRef<Array<Wallet>> = computed(
  () => store.state.UserModule?.wallets || []
);

const usedMetamaskChains = computed(() =>
  metamaskChainList.filter(
    (chain) => chainWallet(`0x${Number(chain.chainId).toString(16)}`) !== null
  )
);

const networks = computed(() =>
  usedMetamaskChains.value.map((chainData) => {
    const chain = new Chain();

    chain.id = `0x${Number(chainData.chainId).toString(16)}`;
    chain.name = chainData.name;
    chain.denom = chainData.nativeCurrency?.symbol || "unknown";
    chain.source = "Metamask";

    return chain;
  })
);

const networksList = computed(() => [defaultChain, ...networks.value]);

function chainWallet(chainId: string): Wallet | null {
  return (
    wallets.value.find(
      (wallet: Wallet) => wallet.network === `eth-${chainId}`
    ) || null
  );
}

const connectWallet = async (chain: Chain): Promise<void> => {
  await MetamaskClient.metamaskLogin(store);

  emit("connect", chain);
};

const removeWallet = async (wallet: Wallet | null): Promise<void> => {
  if (wallet === null) {
    return;
  }

  store.commit("setLoading", true);

  try {
    await store.dispatch("UserModule/keplrUnlink", wallet);
    emit("disconnect", wallet);
  } catch (error: any) {
    if (error instanceof FormattedError) {
      await ElMessageBox.alert(error.message, error.name, {
        center: true,
      });
    } else if (error instanceof HttpUnauthorizedError) {
      await store.dispatch("UserModule/removeSession");
      await router.push("/");
    } else {
      console.error(error);
      await ElMessageBox.alert("Could not unlink wallet", "Unlink failed", {
        center: true,
      });
    }
  } finally {
    store.commit("setLoading", false);
  }
};
</script>
