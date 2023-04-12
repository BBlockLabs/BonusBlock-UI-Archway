<template>
  <el-dialog v-model="open">
    <template #header>
      <div class="d-flex mb-medium">
        <svg-metamask class="icon-medium" />
        <h1 class="fs-medium ml-extra-small my-auto">Select your chain</h1>
      </div>
    </template>

    <div v-loading="store.state.loading">
      <metamask-chain-select
        @connect="(payload: any) => emit('connect', payload)"
        @disconnect="(payload: any) => emit('disconnect', payload)"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import MetamaskChainSelect from "@/components/MetamaskChainSelect.vue";
import SvgMetamask from "@/assets/icons/metamask-fox.svg?component";
import type { Ref } from "vue";
import { ElMessageBox } from "element-plus";
import { Plugins } from "@/common/Plugins";
import { StoreType, useStore } from "@/store";
import { ref, watch } from "vue";

export interface Props {
  open: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
});

const emit = defineEmits(["connect", "disconnect", "update:open"]);

const store: StoreType = useStore();

const open: Ref<boolean> = ref(false);

function setOpen(newOpenValue: boolean): void {
  emit("update:open", newOpenValue);
  open.value = newOpenValue;
}

function openDialog(): void {
  if (!store.getters.isPluginEnabled(Plugins.Metamask)) {
    ElMessageBox.alert(
      "Metamask plugin was not found, please enable it and reload the page to use Metamask functions.",
      "Metamask plugin not found",
      {
        center: true,
      }
    );

    setOpen(false);

    return;
  }

  setOpen(true);
}

watch(
  () => props.open,
  (): void => {
    if (props.open === true) {
      openDialog();
    } else {
      setOpen(false);
    }
  }
);

watch(open, (): void => {
  emit("update:open", open.value);
});
</script>
