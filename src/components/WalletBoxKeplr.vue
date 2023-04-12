<template>
  <wallet-box
    name="Keplr"
    :chains="networks"
    :available="available"
    :svg="SvgKeplr"
    add-link="https://www.keplr.app/download"
    @connect-click="dialog = true"
  />

  <dialog-keplr v-model:open="dialog" />
</template>

<script setup lang="ts">
import DialogKeplr from "@/components/KeplrDialog.vue";
import SvgKeplr from "@/assets/icons/keplr.svg?component";
import WalletBox from "@/components/WalletBox.vue";
import type Chain from "@/common/Chain";
import type { ComputedRef, Ref } from "vue";
import { StoreType, useStore } from "@/store";
import { computed, ref } from "vue";

const available: boolean = window.keplr !== undefined;
const store: StoreType = useStore();
const dialog: Ref<boolean> = ref(false);

const networks: ComputedRef<Array<Chain>> = computed(() => {
  return store.state.chains.filter(
    (chain): boolean => chain.source === "Keplr"
  );
});
</script>
