<template>
  <chain-select
    :chain-wallet="chainWallet"
    :networks="networks"
    @connect-click="connectWallet"
    @disconnect-click="removeWallet"
  />
</template>

<script lang="ts" setup>
import ChainSelect from "@/components/ChainSelect.vue";
import FormattedError from "@/common/errors/FormattedError";
import LinkActionPayload from "@/common/LinkActionPayload";
import type Chain from "@/common/Chain";
import type Wallet from "@/store/entity/Wallet";
import type { ComputedRef } from "vue";
import { computed } from "vue";
import { ElMessageBox } from "element-plus";
import { StoreType, useStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import HttpUnauthorizedError from "@/common/errors/HttpUnauthorizedError";

const store: StoreType = useStore();
const emit = defineEmits(["connect", "disconnect"]);
const route = useRoute();
const router = useRouter();

const networks = computed(() =>
  store.state.chains.filter((chain) => chain.source === "Keplr")
);

const wallets: ComputedRef<Array<Wallet>> = computed(
  () => store.state.UserModule?.wallets || []
);

const chainWallet = (chainId: string): Wallet | null => {
  return (
    wallets.value.find((wallet: Wallet) => wallet.network === chainId) || null
  );
};

const connectWallet = async (chain: Chain): Promise<void> => {
  store.commit("setLoading", true);

  try {
    await store.dispatch(
      "UserModule/keplrLogin",
      new LinkActionPayload(
        chain,
        route.query.ref
          ? String(route.query.ref)
          : route.query.r
          ? String(route.query.r)
          : null
      )
    );

    emit("connect", chain);
  } catch (error: any) {
    if (error instanceof FormattedError) {
      await ElMessageBox.alert(error.message, error.name, {});
    } else if (error instanceof HttpUnauthorizedError) {
      await store.dispatch("UserModule/removeSession");
      await router.push("/");
    } else {
      console.error(error);
      await ElMessageBox.alert(
        "There was an error connecting your wallet, please try again.",
        "Error",
        {
          center: true,
        }
      );
    }
  } finally {
    store.commit("setLoading", false);
  }
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
